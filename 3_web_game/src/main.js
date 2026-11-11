import { BinaryMapLoader, OCC } from './loaders/BinaryMapLoader.js';
import { AssetManager } from './loaders/AssetManager.js';
import { Camera } from './core/Camera.js';
import { IsometricMath } from './core/IsometricMath.js';
import { TilemapRenderer } from './renderer/TilemapRenderer.js';
import { SpriteRenderer } from './renderer/SpriteRenderer.js';
import { BuildingRenderer } from './renderer/BuildingRenderer.js';
import { WildlifeRenderer } from './renderer/WildlifeRenderer.js';
import { MinimapRenderer } from './renderer/MinimapRenderer.js';
import { ParticleSystem } from './renderer/ParticleSystem.js';
import { DayNightCycle } from './core/DayNightCycle.js';
import { SoundEngine } from './audio/SoundEngine.js';
import { Villager } from './simulation/Villager.js';
import { Building, Trap, BUILDING_DEFS } from './simulation/Building.js';
import { Animal } from './simulation/Animal.js';
import { ResourceNode } from './simulation/ResourceNode.js';
import { AISystems } from './simulation/AISystems.js';
import { SaveManager } from './simulation/SaveManager.js';
import { pickUniqueTribeName } from './simulation/NameDatabase.js';
import { CAMPAIGN_LEVELS, WEAPON_DEFS, TRAP_DEFS, SPELL_DEFS } from './data/GameData.js';
import { OverlayManager } from './ui/OverlayManager.js';

class PrehistoricTribesApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.camera = new Camera(window.innerWidth, window.innerHeight);

    this.assets = new AssetManager();
    this.sound = new SoundEngine();
    this.overlay = new OverlayManager(this);
    this.minimap = new MinimapRenderer(document.getElementById('minimap-canvas'));
    this.particles = new ParticleSystem();
    this.dayNight = new DayNightCycle(180);

    const settings = SaveManager.loadSettings();
    this.difficulty = settings.difficulty || 'easy';
    this.fogEnabled = settings.fogEnabled !== false;
    this.sound.setMusicEnabled(settings.musicEnabled !== false);

    this.map = null;
    this.currentLevelConfig = CAMPAIGN_LEVELS[0];
    this.tileRenderer = null;
    this.spriteRenderer = null;
    this.buildingRenderer = null;
    this.wildlifeRenderer = null;

    this.villagers = [];
    this.buildings = [];
    this.animals = [];
    this.resourceNodes = [];
    this.projectiles = [];
    this.traps = [];
    this.diseaseClouds = [];
    this.fogGrid = null;
    this.terrainYield = new Map();

    this.selectedVillagerId = null;
    this.selectedUnitIds = new Set();
    this.selectedBuildingId = null;
    this.groups = { 7: [], 9: [] };

    this.activePlacementType = null;
    this.activeTrapType = null;
    this.activeSpellCast = null;
    this.armingWeaponId = null;

    this.callToArms = false;
    this.formUp = false;
    this.isPaused = true;
    this.gameEnded = false;

    this.resources = { food: 40, meals: 5, wood: 40, stone: 25, bone: 0, bones: 0, population: 0, maxLivingSpace: 1 };
    this.armouryStock = { club: 2, stone: 5, spear: 2, stone_axe: 0, bone_mace: 0, tomahawk: 0 };
    this.matchStats = { born: 0, built: 0, razed: 0, killed: 0, gathered: 0 };

    this.dialogues = [];
    this.currentDialogueIndex = 0;
    this.lastAlertPos = null;
    this.alertTimer = 0;

    this.hoveredTile = null;
    this.isDragging = false;
    this.isBoxSelecting = false;
    this.isMinimapDragging = false;
    this.boxStart = null;
    this.boxCurrent = null;
    this.dragStart = { x: 0, y: 0 };

    this.cheatBuffer = '';
    this.lastTime = 0;
    this.matchElapsed = 0;
    this.enemyRaidTimer = 50;
    this.herdRespawnTimer = 0;
    this.breedCheckTimer = 0;
    this.uiRefreshTimer = 0;
    this.fogRefreshTimer = 0;
    this.nextUnitId = 500;
    this.keysHeld = new Set();

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
    this.setupInputs();
    this.setupUI();
    this.boot();
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.viewportWidth = window.innerWidth;
    this.camera.viewportHeight = window.innerHeight;
  }

  async boot() {
    await this.assets.loadAll();
    this.spriteRenderer = new SpriteRenderer(this.assets);
    this.buildingRenderer = new BuildingRenderer(this.assets);
    this.wildlifeRenderer = new WildlifeRenderer(this.assets);

    try {
      const resp = await fetch('./assets/data/campaign_en.json');
      this.dialogues = await resp.json();
    } catch {
      this.dialogues = [];
    }

    await this.startLevel(0, null, true);
    this.syncHudButtons();
    this.overlay.renderMainMenu();
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.loop(t));
  }

  async startLevel(levelIdx, restoredSnapshot = null, silentPreview = false) {
    const cfg = CAMPAIGN_LEVELS[levelIdx] || CAMPAIGN_LEVELS[0];
    this.currentLevelConfig = cfg;
    this.gameEnded = false;
    this.callToArms = false;
    this.formUp = false;
    this.activePlacementType = null;
    this.activeTrapType = null;
    this.activeSpellCast = null;
    this.armingWeaponId = null;
    this.selectedVillagerId = null;
    this.selectedUnitIds.clear();
    this.selectedBuildingId = null;
    this.groups = { 7: [], 9: [] };
    this.projectiles = [];
    this.traps = [];
    this.diseaseClouds = [];
    this.terrainYield.clear();
    this.matchElapsed = 0;
    this.enemyRaidTimer = Math.max(25, cfg.aiConfig?.raidInterval || 60);
    this.herdRespawnTimer = 0;
    this.breedCheckTimer = 0;
    this.matchStats = { born: 0, built: 0, razed: 0, killed: 0, gathered: 0 };

    const settings = SaveManager.loadSettings();
    this.difficulty = settings.difficulty || 'easy';
    this.fogEnabled = settings.fogEnabled !== false;

    this.map = await BinaryMapLoader.loadMap(`./assets/maps/${cfg.mapFile}`, cfg.id);
    this.tileRenderer = new TilemapRenderer(this.map, this.assets, cfg.biome);
    this.minimap.invalidateTerrain();

    // Populate berry & herb resource nodes cleanly from RLE map
    this.resourceNodes = [];
    let nodeId = 1;
    for (const bush of this.map.berryBushes) {
      this.resourceNodes.push(new ResourceNode(nodeId++, 'berry_bush', bush.x + 0.5, bush.y + 0.5, 35));
      this.map.collision[bush.y][bush.x] = OCC.EMPTY;
    }
    for (const herb of this.map.herbNodes) {
      this.resourceNodes.push(new ResourceNode(nodeId++, 'berry_bush', herb.x + 0.5, herb.y + 0.5, 25));
      this.map.collision[herb.y][herb.x] = OCC.EMPTY;
    }

    if (restoredSnapshot) {
      this.applySnapshot(restoredSnapshot);
    } else {
      const sr = cfg.startingResources;
      this.resources = {
        food: sr.food, meals: sr.meals || 0, wood: sr.wood, stone: sr.stone,
        bone: sr.bone, bones: sr.bone, population: 0, maxLivingSpace: 1
      };
      this.armouryStock = {
        club: sr.clubs || 0, stone: sr.stones || 5, spear: sr.spears || 0,
        stone_axe: sr.stone_axes || 0, bone_mace: sr.bone_maces || 0, tomahawk: sr.tomahawks || 0
      };

      // Spawn buildings
      this.buildings = [];
      let bId = 1;
      for (const bd of cfg.initialBuildings) {
        const b = new Building(bId++, bd.type, bd.x, bd.y, true, bd.owner, bd.level || 1);
        if (bd.isPrisonHut) b.isPrisonHut = true;
        this.buildings.push(b);
        for (let gy = 0; gy < b.height; gy++) {
          for (let gx = 0; gx < b.width; gx++) {
            this.tileRenderer.clearTile(b.x + gx, b.y + gy);
          }
        }
      }

      // Spawn units
      this.villagers = [];
      let uId = 1;
      for (const ud of cfg.initialVillagers) {
        const isChild = (ud.age || 18) < 12;
        const v = new Villager(uId++, ud.name || pickUniqueTribeName(ud.gender || 'male', this.villagers), ud.gender || 'male', ud.x + 0.5, ud.y + 0.5, !!ud.isChief, ud.owner === 'enemy', isChild);
        v.age = ud.age || 18;
        if (ud.role) v.role = ud.role;
        if (ud.weapon) v.equipWeapon(ud.weapon);
        if (ud.bldSkill) v.skills.building = ud.bldSkill;
        if (ud.meleeSkill) {
          v.skills.melee = ud.meleeSkill;
          v.isWarrior = true;
          v.warriorStars = Math.max(1, Math.min(3, Math.floor(ud.meleeSkill / 2)));
          v.maxHealth = 135 + v.warriorStars * 25;
          v.health = v.maxHealth;
        }
        if (ud.scoutingSkill) {
          v.skills.scouting = ud.scoutingSkill;
          v.viewRadius = ud.viewRadius || 8;
        }
        if (ud.isWarrior) {
          v.isWarrior = true;
          v.warriorStars = ud.warriorStars || 1;
        }
        // Clear tile under spawn just in case
        this.tileRenderer.clearTile(Math.floor(ud.x), Math.floor(ud.y));
        this.villagers.push(v);
      }
      this.nextUnitId = uId + 10;

      // Spawn Wildlife herds & explicit animals
      this.animals = [];
      let aId = 1;
      for (const aDef of (cfg.initialAnimals || [])) {
        this.animals.push(new Animal(aId++, aDef.type, aDef.x + 0.5, aDef.y + 0.5));
      }
      for (const h of (cfg.herds || [])) {
        for (let i = 0; i < h.max; i++) {
          const kind = h.pool[i % h.pool.length];
          const ax = Math.max(2, Math.min(this.map.width - 3, h.x + (-2 + Math.random() * 4)));
          const ay = Math.max(2, Math.min(this.map.height - 3, h.y + (-2 + Math.random() * 4)));
          this.animals.push(new Animal(aId++, kind, ax, ay));
        }
      }

      // Compute starting living space from player buildings
      this.recomputeLivingSpace();
      const chief = this.villagers.find((v) => v.isChief && !v.isEnemy) || this.villagers.find((v) => !v.isEnemy);
      if (chief) {
        this.selectedVillagerId = chief.id;
        this.selectedUnitIds.add(chief.id);
      }
    }

    // Init Fog of War Matrix
    this.fogGrid = Array.from({ length: this.map.height }, () => new Uint8Array(this.map.width));
    this.recomputeFog();

    // Focus Camera
    const sx = cfg.startPos?.[0] ?? 10;
    const sy = cfg.startPos?.[1] ?? 10;
    const wp = IsometricMath.tileToWorld(sx, sy);
    this.camera.setPosition(wp.x, wp.y);

    this.updateHUD();
    this.updateDialogue();
    this.updateInspector();
    this.syncHudButtons();
    this.sound.setTheme('calm');

    if (!silentPreview) {
      this.isPaused = false;
      this.sound.setTheme('calm');
      if (!restoredSnapshot && cfg.introCutscene !== null && cfg.introCutscene !== undefined) {
        this.overlay.renderCutscene(cfg.introCutscene);
      } else {
        this.overlay.hide();
      }
    }
  }

  async loadSnapshot(snap) {
    if (!snap) return;
    await this.startLevel(snap.levelId ?? 0, snap, false);
  }

  saveCurrentGame() {
    const snap = {
      levelId: this.currentLevelConfig.id,
      isCustom: !!this.currentLevelConfig.isCustom,
      resources: { ...this.resources },
      armouryStock: { ...this.armouryStock },
      matchStats: { ...this.matchStats },
      matchElapsed: this.matchElapsed,
      buildings: this.buildings.map((b) => ({
        id: b.id, type: b.type, x: b.x, y: b.y, owner: b.owner, level: b.level,
        health: b.health, maxHealth: b.maxHealth, progress: b.progress, isCompleted: b.isCompleted,
        state: b.state, keeperId: b.keeperId, isPrisonHut: !!b.isPrisonHut
      })),
      villagers: this.villagers.map((v) => ({
        id: v.id, name: v.name, gender: v.gender, x: v.x, y: v.y, isChief: v.isChief,
        isEnemy: v.isEnemy, isChild: v.isChild, age: v.age, health: v.health, maxHealth: v.maxHealth,
        hunger: v.hunger, tiredness: v.tiredness, happiness: v.happiness, weapon: v.weapon,
        role: v.role, isWarrior: v.isWarrior, warriorStars: v.warriorStars, trainingTime: v.trainingTime,
        warriorMode: v.warriorMode, skills: { ...v.skills }, viewRadius: v.viewRadius
      })),
      traps: this.traps.filter((t) => !t.isSprung).map((t) => ({
        id: t.id, type: t.type, x: t.x, y: t.y, owner: t.owner, isArmed: t.isArmed, isRevealed: t.isRevealed
      }))
    };
    const ok = SaveManager.saveMatch(snap);
    this.pushAlert(ok ? 'Đã lưu tiến trình trò chơi!' : 'Lỗi: Không thể lưu dữ liệu!', this.camera.x, this.camera.y);
  }

  applySnapshot(snap) {
    this.resources = { ...snap.resources };
    this.armouryStock = { ...snap.armouryStock };
    this.matchStats = { ...snap.matchStats };
    this.matchElapsed = snap.matchElapsed || 0;
    this.buildings = snap.buildings.map((bd) => {
      const b = new Building(bd.id, bd.type, bd.x, bd.y, bd.isCompleted, bd.owner, bd.level);
      b.health = bd.health;
      b.maxHealth = bd.maxHealth;
      b.progress = bd.progress;
      b.state = bd.state;
      b.keeperId = bd.keeperId;
      b.isPrisonHut = !!bd.isPrisonHut;
      return b;
    });
    this.villagers = snap.villagers.map((vd) => {
      const v = new Villager(vd.id, vd.name, vd.gender, vd.x, vd.y, vd.isChief, vd.isEnemy, vd.isChild);
      Object.assign(v, vd);
      v.skills = { ...v.skills, ...vd.skills };
      return v;
    });
    this.traps = (snap.traps || []).map((td) => {
      const tr = new Trap(td.id, td.type, td.x, td.y, td.owner, td.isArmed);
      tr.isRevealed = td.isRevealed;
      return tr;
    });
    this.animals = [];
    this.nextUnitId = Math.max(500, ...this.villagers.map((v) => v.id + 5));
    this.recomputeLivingSpace();
  }

  recomputeLivingSpace() {
    let cap = 1;
    for (const b of this.buildings) {
      if (b.owner === 'player' && b.isCompleted) {
        if (b.type === 'hut') cap += 4;
        else if (b.type === 'chiefs_hut') cap += 1;
      }
    }
    this.resources.maxLivingSpace = Math.max(cap, 4);
  }

  recomputeFog() {
    if (!this.fogGrid || !this.map) return;
    const h = this.map.height;
    const w = this.map.width;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (this.fogGrid[y][x] === 2) this.fogGrid[y][x] = 1;
      }
    }

    const revealCircle = (cx, cy, radius) => {
      const r2 = radius * radius;
      const minY = Math.max(0, Math.floor(cy - radius));
      const maxY = Math.min(h - 1, Math.ceil(cy + radius));
      const minX = Math.max(0, Math.floor(cx - radius));
      const maxX = Math.min(w - 1, Math.ceil(cx + radius));
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          if ((x - cx) * (x - cx) + (y - cy) * (y - cy) <= r2) {
            this.fogGrid[y][x] = 2;
          }
        }
      }
    };

    for (const b of this.buildings) {
      if (b.owner !== 'player') continue;
      const rad = b.type === 'tower' && b.isCompleted ? 8 + b.level * 2 : 5 + Math.max(b.width, b.height) * 0.5;
      revealCircle(b.x + b.width * 0.5, b.y + b.height * 0.5, rad);
    }
    for (const v of this.villagers) {
      if (v.isEnemy || v.health <= 0) continue;
      revealCircle(v.x, v.y, v.viewRadius || 5.5);
    }
  }

  pushAlert(text, tileX = null, tileY = null) {
    const banner = document.getElementById('alert-banner');
    if (banner) {
      banner.innerText = text;
      banner.style.display = 'block';
    }
    if (tileX !== null && tileY !== null) {
      this.lastAlertPos = { x: tileX, y: tileY };
    }
    this.alertTimer = 8.0;
  }

  jumpToLastAlert() {
    if (!this.lastAlertPos) return;
    const wp = IsometricMath.tileToWorld(this.lastAlertPos.x, this.lastAlertPos.y);
    this.camera.setPosition(wp.x, wp.y);
    this.sound.playBeep(540, 'sine', 0.08);
  }

  focusVillagerById(vid) {
    const v = this.villagers.find((u) => u.id === vid && u.health > 0);
    if (!v) return;
    this.selectSingleVillager(v);
    const wp = IsometricMath.tileToWorld(v.x, v.y);
    this.camera.setPosition(wp.x, wp.y);
    this.updateInspector();
  }

  selectSingleVillager(v) {
    this.selectedVillagerId = v ? v.id : null;
    this.selectedUnitIds.clear();
    if (v) this.selectedUnitIds.add(v.id);
    this.selectedBuildingId = null;
    for (const b of this.buildings) b.selected = false;
  }

  appointNewChief(heirId) {
    for (const u of this.villagers) {
      if (u.isChief) {
        u.isChief = false;
        if (u.role === 'chief') u.role = null;
      }
    }
    const heir = this.villagers.find((u) => u.id === heirId && !u.isEnemy && u.health > 0);
    if (heir) {
      heir.isChief = true;
      heir.role = 'chief';
      heir.viewRadius = Math.max(heir.viewRadius, 7);
      heir.maxHealth = Math.max(heir.maxHealth, 140);
      heir.health = Math.min(heir.maxHealth, heir.health + 40);
      this.focusVillagerById(heir.id);
      this.pushAlert(`👑 ${heir.name} đã lên ngôi Tù Trưởng mới!`, heir.x, heir.y);
      this.sound.playBeep(880, 'triangle', 0.25);
    }
  }

  handleUnitDeath(unit) {
    const uWorld = IsometricMath.tileToWorld(unit.x, unit.y);
    const uScreen = this.camera.worldToScreen(uWorld.x, uWorld.y);

    if (unit.isEnemy) {
      this.matchStats.killed++;
      this.resources.bones += 15;
      this.particles.spawnFloatingText(uScreen.x, uScreen.y - 34 * this.camera.zoom, `+15 Bones!`, '#fde047', this.camera.zoom);
      unit.state = 'defeated';
      unit.isMoving = false;
      unit.defeatTimer = 2.6;
      this.sound.playBeep(740, 'triangle', 0.2);
      return;
    }

    // Friendly unit death
    const wasChief = unit.isChief;
    unit.isChief = false;
    this.villagers = this.villagers.filter((v) => v !== unit);
    this.selectedUnitIds.delete(unit.id);
    if (this.selectedVillagerId === unit.id) {
      this.selectedVillagerId = [...this.selectedUnitIds][0] || null;
    }

    for (const b of this.buildings) {
      if (b.keeperId === unit.id) b.keeperId = null;
      b.occupants = b.occupants.filter((id) => id !== unit.id);
    }

    if (wasChief) {
      if (this.currentLevelConfig?.chiefMustSurvive) {
        this.endGame(false, 'Lời tiên tri đã ứng nghiệm: Tù trưởng đã tử trận tại Vùng Đất Hoang!');
        return;
      }
      for (const ally of this.villagers) {
        if (!ally.isEnemy) ally.happiness = Math.max(5, ally.happiness - 25);
      }
      const candidates = this.villagers.filter((u) => !u.isEnemy && !u.isChild && u.health > 0);
      if (candidates.length > 0) {
        this.overlay.renderChiefSelection(candidates);
      }
    }
  }

  endGame(isVictory, reasonText) {
    if (this.gameEnded) return;
    this.gameEnded = true;
    this.overlay.renderResults(isVictory, reasonText);
  }

  setupUI() {
    document.querySelectorAll('.btn-build').forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-building');
        this.activeTrapType = null;
        this.activeSpellCast = null;
        this.armingWeaponId = null;
        if (this.activePlacementType === type) {
          this.activePlacementType = null;
          btn.classList.remove('active');
        } else {
          document.querySelectorAll('.btn-build').forEach((b) => b.classList.remove('active'));
          this.activePlacementType = type;
          btn.classList.add('active');
          this.sound.playBeep(520, 'triangle', 0.08);
        }
      });
    });

    document.getElementById('btn-call-to-arms')?.addEventListener('click', () => this.toggleCallToArms());
    document.getElementById('btn-form-up')?.addEventListener('click', () => this.toggleFormUp());
    document.getElementById('btn-pause')?.addEventListener('click', () => this.overlay.renderPauseMenu());
    document.getElementById('btn-roster')?.addEventListener('click', () => this.overlay.renderRoster());
    document.getElementById('btn-jump-alert')?.addEventListener('click', () => this.jumpToLastAlert());
    document.getElementById('alert-banner')?.addEventListener('click', () => this.jumpToLastAlert());

    document.getElementById('btn-toggle-fog')?.addEventListener('click', () => {
      this.fogEnabled = !this.fogEnabled;
      const s = SaveManager.loadSettings();
      s.fogEnabled = this.fogEnabled;
      SaveManager.saveSettings(s);
      this.syncHudButtons();
    });

    document.getElementById('btn-toggle-music')?.addEventListener('click', () => {
      const next = !this.sound.musicEnabled;
      this.sound.ensureContext();
      this.sound.setMusicEnabled(next);
      const s = SaveManager.loadSettings();
      s.musicEnabled = next;
      SaveManager.saveSettings(s);
      this.syncHudButtons();
    });

    document.getElementById('btn-next-dialogue')?.addEventListener('click', () => {
      this.currentDialogueIndex++;
      if (this.currentDialogueIndex >= this.dialogues.length) this.currentDialogueIndex = 0;
      this.updateDialogue();
      this.sound.playBeep(680, 'sine', 0.06);
    });

    document.getElementById('btn-replay-cutscene')?.addEventListener('click', () => {
      const cid = this.currentLevelConfig?.introCutscene;
      if (cid !== null && cid !== undefined) {
        this.overlay.renderCutscene(cid);
      }
    });

    // Squad Group Hotkeys [7] / [9]
    for (const grpKey of [7, 9]) {
      const btn = document.getElementById(`btn-group-${grpKey}`);
      btn?.addEventListener('click', (e) => {
        if (e.shiftKey) {
          this.saveSquadGroup(grpKey);
        } else {
          this.recallSquadGroup(grpKey);
        }
      });
      btn?.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.saveSquadGroup(grpKey);
      });
    }

    // Minimap Interactive Click & Drag
    const mmCanvas = document.getElementById('minimap-canvas');
    if (mmCanvas) {
      const panFromMinimap = (e) => {
        const rect = mmCanvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (mmCanvas.width / rect.width);
        const my = (e.clientY - rect.top) * (mmCanvas.height / rect.height);
        const { tx, ty } = this.minimap.minimapToTile(mx, my);
        const wp = IsometricMath.tileToWorld(tx, ty);
        this.camera.setPosition(wp.x, wp.y);
      };
      mmCanvas.addEventListener('mousedown', (e) => {
        this.isMinimapDragging = true;
        panFromMinimap(e);
      });
      window.addEventListener('mousemove', (e) => {
        if (this.isMinimapDragging) panFromMinimap(e);
      });
      window.addEventListener('mouseup', () => {
        this.isMinimapDragging = false;
      });
    }

    // Delegated Inspector Panel Buttons (Units & Buildings)
    const inspectorEl = document.getElementById('inspector-panel');
    inspectorEl?.addEventListener('click', (e) => {
      const btn = e.target.closest('.insp-btn');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const param = btn.getAttribute('data-param');

      // Building Actions
      const selBld = this.buildings.find((b) => b.id === this.selectedBuildingId);
      if (selBld) {
        if (action === 'upgrade_bld') {
          this.tryUpgradeBuilding(selBld);
        } else if (action === 'repair_bld') {
          this.tryRepairBuilding(selBld);
        } else if (action === 'demolish_bld') {
          this.demolishBuilding(selBld);
        } else if (action === 'craft_weapon' && param) {
          this.queueWeaponCraft(selBld, param);
        } else if (action === 'place_trap' && param) {
          this.startTrapPlacement(param);
        } else if (action === 'arm_weapon' && param) {
          this.armingWeaponId = param;
          this.pushAlert(`Click trái lên một Dân làng trên bản đồ để trang bị ${WEAPON_DEFS[param]?.name}!`);
        } else if (action === 'cast_spell' && param) {
          this.activeSpellCast = { spellId: param, sanctuary: selBld };
          this.pushAlert(`Chọn ${SPELL_DEFS[param]?.targetMode === 'ground' ? 'vị trí trên bản đồ' : 'đồng minh'} để niệm ${SPELL_DEFS[param]?.name}!`);
        }
        return;
      }

      // Villager Actions
      const selectedUnits = this.getSelectedUnits();
      if (selectedUnits.length === 0) return;
      const v = selectedUnits[0];

      if (action === 'eat') selectedUnits.forEach((u) => this.sendVillagerToEat(u));
      else if (action === 'sleep') selectedUnits.forEach((u) => this.sendVillagerToSleep(u));
      else if (action === 'relax') selectedUnits.forEach((u) => this.sendVillagerToRelax(u));
      else if (action === 'breed') this.tryStartBreeding(true);
      else if (action === 'fish') selectedUnits.forEach((u) => this.sendVillagerToFish(u));
      else if (action === 'pray') selectedUnits.forEach((u) => this.sendVillagerToPray(u));
      else if (action === 'craft') selectedUnits.forEach((u) => this.sendVillagerToCraft(u));
      else if (action === 'train') selectedUnits.forEach((u) => this.sendVillagerToTrain(u));
      else if (action === 'mode_javelin') {
        selectedUnits.forEach((u) => { if (u.isWarrior) u.warriorMode = 'javelin'; });
        this.sound.playBeep(480, 'triangle', 0.08);
        this.updateInspector();
      } else if (action === 'mode_bow') {
        selectedUnits.forEach((u) => { if (u.isWarrior) u.warriorMode = 'bow'; });
        this.sound.playBeep(620, 'triangle', 0.08);
        this.updateInspector();
      } else if (action === 'stealth') {
        selectedUnits.forEach((u) => { if (u.isWarrior || u.role === 'pia_scout') this.toggleWarriorStealth(u); });
        this.updateInspector();
      } else if (action === 'save_group' && param) {
        this.saveSquadGroup(Number(param));
      } else if (action === 'face_cycle') {
        v.isMoving = false;
        const dirs = [
          { fc: 'south', fb: false, fx: false },
          { fc: 'diag_front', fb: false, fx: false },
          { fc: 'diag_front', fb: false, fx: true },
          { fc: 'diag_back', fb: true, fx: false },
          { fc: 'diag_back', fb: true, fx: true },
          { fc: 'north', fb: false, fx: false }
        ];
        const curIdx = dirs.findIndex((d) => d.fc === v.facingCardinal && d.fx === v.flipX);
        const next = dirs[(curIdx + 1) % dirs.length];
        v.facingCardinal = next.fc;
        v.facingBack = next.fb;
        v.flipX = next.fx;
        this.updateInspector();
      } else if (action === 'command' && v.isChief) {
        v.isMoving = false;
        v.commandTimer = 1.2;
        const cw = IsometricMath.tileToWorld(v.x, v.y);
        const cs = this.camera.worldToScreen(cw.x, cw.y);
        this.particles.spawnFloatingText(cs.x, cs.y - 34 * this.camera.zoom, 'For the Tribe!', '#fde047', this.camera.zoom);
        this.sound.playBeep(620, 'triangle', 0.14);
      }
    });
  }

  syncHudButtons() {
    const fogBtn = document.getElementById('btn-toggle-fog');
    if (fogBtn) fogBtn.classList.toggle('active', this.fogEnabled);
    const musBtn = document.getElementById('btn-toggle-music');
    if (musBtn) musBtn.classList.toggle('active', this.sound.musicEnabled);
    const diffEl = document.getElementById('diff-label');
    if (diffEl) diffEl.innerText = `Chế độ: ${this.difficulty === 'hard' ? 'Hard' : 'Easy'}`;
    const g7 = document.getElementById('grp7-count');
    if (g7) g7.innerText = `[7] ${this.groups[7].length}`;
    const g9 = document.getElementById('grp9-count');
    if (g9) g9.innerText = `[9] ${this.groups[9].length}`;
  }

  saveSquadGroup(slot) {
    const ids = [...this.selectedUnitIds].filter((id) => this.villagers.some((v) => v.id === id && !v.isEnemy && v.health > 0));
    this.groups[slot] = ids;
    this.syncHudButtons();
    this.pushAlert(`Đã lưu ${ids.length} thành viên vào Đội [${slot}]!`);
    this.sound.playBeep(700, 'triangle', 0.1);
  }

  recallSquadGroup(slot) {
    const aliveIds = (this.groups[slot] || []).filter((id) => this.villagers.some((v) => v.id === id && !v.isEnemy && v.health > 0));
    this.groups[slot] = aliveIds;
    if (aliveIds.length === 0) return;
    this.selectedBuildingId = null;
    for (const b of this.buildings) b.selected = false;
    this.selectedUnitIds = new Set(aliveIds);
    this.selectedVillagerId = aliveIds[0];
    const lead = this.villagers.find((v) => v.id === aliveIds[0]);
    if (lead) {
      const wp = IsometricMath.tileToWorld(lead.x, lead.y);
      this.camera.setPosition(wp.x, wp.y);
    }
    this.syncHudButtons();
    this.updateInspector();
    this.sound.playBeep(600, 'sine', 0.08);
  }

  getSelectedUnits() {
    const units = this.villagers.filter((v) => !v.isEnemy && v.health > 0 && this.selectedUnitIds.has(v.id));
    if (units.length === 0 && this.selectedVillagerId !== null) {
      const one = this.villagers.find((v) => v.id === this.selectedVillagerId && !v.isEnemy && v.health > 0);
      if (one) return [one];
    }
    return units;
  }

  updateDialogue() {
    const textEl = document.getElementById('dialogue-text');
    const speakerEl = document.getElementById('dialogue-speaker');
    const avatarImg = document.getElementById('avatar-img');
    if (!textEl || !speakerEl || this.dialogues.length === 0) return;

    let text = this.dialogues[this.currentDialogueIndex] || '';
    if (!text) {
      this.currentDialogueIndex = (this.currentDialogueIndex + 1) % this.dialogues.length;
      text = this.dialogues[this.currentDialogueIndex] || '';
    }
    const isChief = (this.currentDialogueIndex % 2 !== 0);
    speakerEl.innerText = isChief ? 'Chief' : 'Mumbo';
    if (avatarImg) {
      avatarImg.src = isChief ? './assets/images/portrait_chief.jpg' : './assets/images/portrait_mumbo.jpg';
    }
    textEl.innerText = `"${text}"`;
  }

  setupInputs() {
    this.canvas.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.clientX - this.dragStart.x;
        const dy = e.clientY - this.dragStart.y;
        this.camera.pan(-dx, -dy);
        this.dragStart = { x: e.clientX, y: e.clientY };
      } else {
        if (this.isBoxSelecting && this.boxStart) {
          this.boxCurrent = { x: e.clientX, y: e.clientY };
        }
        const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
        this.hoveredTile = IsometricMath.worldToTile(worldPos.x, worldPos.y);
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.sound.ensureContext();
      if (this.isPaused) return;

      if (e.button === 0) {
        const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
        const tile = IsometricMath.worldToTile(worldPos.x, worldPos.y);

        // 1. Building Placement Mode
        if (this.activePlacementType) {
          this.tryPlaceBuilding(this.activePlacementType, tile.x, tile.y);
          return;
        }

        // 2. Trap Placement Mode
        if (this.activeTrapType) {
          this.tryPlaceTrap(this.activeTrapType, tile.x + 0.5, tile.y + 0.5);
          return;
        }

        // 3. Spell Targeting Mode
        if (this.activeSpellCast) {
          this.executeSpellTarget(tile.x + 0.5, tile.y + 0.5);
          return;
        }

        // 4. Arming Villager from Store/Armoury
        if (this.armingWeaponId) {
          const targetV = this.villagers.find((v) => !v.isEnemy && !v.isChild && Math.hypot(v.x - (tile.x + 0.5), v.y - (tile.y + 0.5)) < 1.35);
          if (targetV && (this.armouryStock[this.armingWeaponId] || 0) > 0) {
            this.armouryStock[this.armingWeaponId]--;
            targetV.equipWeapon(this.armingWeaponId);
            const w = IsometricMath.tileToWorld(targetV.x, targetV.y);
            const s = this.camera.worldToScreen(w.x, w.y);
            this.particles.spawnFloatingText(s.x, s.y - 28 * this.camera.zoom, `Trang bị ${WEAPON_DEFS[this.armingWeaponId].name}!`, '#fde047', this.camera.zoom);
            this.sound.playBeep(680, 'triangle', 0.12);
            if (this.armouryStock[this.armingWeaponId] <= 0) this.armingWeaponId = null;
            this.updateInspector();
          } else {
            this.armingWeaponId = null;
          }
          return;
        }

        // Start Drag Box Selection tracking
        this.isBoxSelecting = true;
        this.boxStart = { x: e.clientX, y: e.clientY };
        this.boxCurrent = { x: e.clientX, y: e.clientY };
      } else if (e.button === 1) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', (e) => {
      this.isDragging = false;
      if (e.button !== 0 || !this.isBoxSelecting || this.isPaused) {
        this.isBoxSelecting = false;
        return;
      }

      const start = this.boxStart;
      const end = { x: e.clientX, y: e.clientY };
      this.isBoxSelecting = false;
      this.boxStart = null;
      this.boxCurrent = null;

      const dragDist = start ? Math.hypot(end.x - start.x, end.y - start.y) : 0;
      if (dragDist > 12 && start) {
        // Multi-Unit Box Selection
        const minX = Math.min(start.x, end.x);
        const maxX = Math.max(start.x, end.x);
        const minY = Math.min(start.y, end.y);
        const maxY = Math.max(start.y, end.y);

        if (!e.shiftKey) this.selectedUnitIds.clear();
        for (const v of this.villagers) {
          if (v.isEnemy || v.health <= 0) continue;
          const wp = IsometricMath.tileToWorld(v.x, v.y);
          const sp = this.camera.worldToScreen(wp.x, wp.y);
          if (sp.x >= minX && sp.x <= maxX && sp.y >= minY && sp.y <= maxY) {
            this.selectedUnitIds.add(v.id);
          }
        }
        this.selectedVillagerId = [...this.selectedUnitIds][0] || null;
        if (this.selectedUnitIds.size > 0) {
          this.selectedBuildingId = null;
          for (const b of this.buildings) b.selected = false;
          this.sound.playBeep(560, 'sine', 0.08);
        }
        this.updateInspector();
        return;
      }

      // Single Left Click -> Villager or Building
      const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
      const tile = IsometricMath.worldToTile(worldPos.x, worldPos.y);

      const clickedVillager = this.villagers.find(
        (v) => !v.isEnemy && v.health > 0 && Math.hypot(v.x - (tile.x + 0.5), v.y - (tile.y + 0.5)) < 1.3
      );

      if (clickedVillager) {
        if (e.shiftKey) {
          if (this.selectedUnitIds.has(clickedVillager.id)) this.selectedUnitIds.delete(clickedVillager.id);
          else this.selectedUnitIds.add(clickedVillager.id);
          this.selectedVillagerId = [...this.selectedUnitIds][0] || null;
          this.selectedBuildingId = null;
          for (const b of this.buildings) b.selected = false;
        } else {
          this.selectSingleVillager(clickedVillager);
        }
        this.sound.playBeep(480, 'sine', 0.08);
        this.updateInspector();
        return;
      }

      const clickedBuilding = this.buildings.find(
        (b) => tile.x >= b.x && tile.x < b.x + b.width && tile.y >= b.y && tile.y < b.y + b.height
      );
      if (clickedBuilding) {
        this.selectedUnitIds.clear();
        this.selectedVillagerId = null;
        for (const b of this.buildings) b.selected = (b === clickedBuilding);
        this.selectedBuildingId = clickedBuilding.id;
        this.sound.playBeep(420, 'triangle', 0.08);
        this.updateInspector();
        return;
      }

      // Click empty ground clears building highlight if clicked directly without shift
      if (!e.shiftKey && this.selectedBuildingId) {
        this.selectedBuildingId = null;
        for (const b of this.buildings) b.selected = false;
        this.updateInspector();
      }
    });

    // Right Click: Smart RTS Orders for Single or Squad Selection
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      if (this.isPaused) return;
      const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
      const targetTile = IsometricMath.worldToTile(worldPos.x, worldPos.y);

      if (this.activePlacementType || this.activeTrapType || this.activeSpellCast || this.armingWeaponId) {
        this.activePlacementType = null;
        this.activeTrapType = null;
        this.activeSpellCast = null;
        this.armingWeaponId = null;
        document.querySelectorAll('.btn-build').forEach((b) => b.classList.remove('active'));
        return;
      }

      const units = this.getSelectedUnits();
      if (units.length === 0) return;

      const clearTargets = (u) => {
        u.targetEnemy = null;
        u.targetAnimal = null;
        u.targetResource = null;
        u.targetBuilding = null;
        u.targetPartner = null;
      };

      const rejectChild = (u) => {
        const cw = IsometricMath.tileToWorld(u.x, u.y);
        const cs = this.camera.worldToScreen(cw.x, cw.y);
        this.particles.spawnFloatingText(cs.x, cs.y - 24 * this.camera.zoom, 'Trẻ em không thể làm việc nặng!', '#7dd3fc', this.camera.zoom);
      };

      // 0. Enemy Unit -> Attack
      const targetEnemy = this.villagers.find((u) => u.isEnemy && u.health > 0 && Math.hypot(u.x - (targetTile.x + 0.5), u.y - (targetTile.y + 0.5)) < 1.6);
      if (targetEnemy) {
        units.forEach((u) => {
          if (u.isChild) { rejectChild(u); return; }
          clearTargets(u);
          u.targetEnemy = targetEnemy;
          u.state = 'fighting';
          u.moveTo(targetEnemy.x, targetEnemy.y);
        });
        this.sound.playBeep(280, 'sawtooth', 0.1);
        return;
      }

      // 1. Enemy Building -> Siege Attack / Break Prison Hut
      const targetBld = this.buildings.find((b) => targetTile.x >= b.x && targetTile.x < b.x + b.width && targetTile.y >= b.y && targetTile.y < b.y + b.height);
      if (targetBld && targetBld.owner === 'enemy') {
        units.forEach((u) => {
          if (u.isChild) { rejectChild(u); return; }
          clearTargets(u);
          u.targetBuilding = targetBld;
          u.state = 'fighting';
          u.moveTo(targetBld.x + targetBld.width / 2, targetBld.y + targetBld.height / 2);
        });
        this.sound.playBeep(260, 'sawtooth', 0.12);
        return;
      }

      // 2. Wildlife -> Hunt
      const targetAnimal = this.animals.find((a) => Math.hypot(a.x - (targetTile.x + 0.5), a.y - (targetTile.y + 0.5)) < 1.6);
      if (targetAnimal) {
        units.forEach((u) => {
          if (u.isChild) { rejectChild(u); return; }
          clearTargets(u);
          u.targetAnimal = targetAnimal;
          u.lastWorkTarget = targetAnimal;
          u.state = 'hunting';
          u.moveTo(targetAnimal.x, targetAnimal.y);
        });
        this.sound.playBeep(300, 'sawtooth', 0.1);
        return;
      }

      // 3. Berry Bushes -> Forage
      const targetBush = this.resourceNodes.find((n) => Math.hypot(n.x - (targetTile.x + 0.5), n.y - (targetTile.y + 0.5)) < 1.4 && !n.isDepleted);
      if (targetBush) {
        units.forEach((u) => {
          clearTargets(u);
          u.targetResource = targetBush;
          u.lastWorkTarget = targetBush;
          u.lastWorkState = 'foraging';
          u.state = 'foraging';
          u.moveTo(targetBush.x, targetBush.y);
        });
        this.sound.playBeep(520, 'sine', 0.08);
        return;
      }

      // 4. Player Building -> Build/Upgrade/Repair OR Work/Life Action
      if (targetBld && targetBld.owner === 'player') {
        units.forEach((u, idx) => {
          if (targetBld.state === 'building' || targetBld.state === 'upgrading' || targetBld.state === 'repairing') {
            if (u.isChild) { rejectChild(u); return; }
            clearTargets(u);
            u.targetBuilding = targetBld;
            u.lastWorkTarget = targetBld;
            u.state = 'building';
            u.moveTo(targetBld.x + targetBld.width / 2, targetBld.y + targetBld.height / 2);
            return;
          }
          if (targetBld.type === 'kitchen') {
            if (idx === 0 && !u.isChild && !targetBld.keeperId) {
              this.assignKeeper(u, targetBld, 'cook', 'crafting');
            } else {
              this.sendVillagerToEat(u, targetBld);
            }
          } else if (targetBld.type === 'hut' || targetBld.type === 'chiefs_hut') {
            this.sendVillagerToSleep(u, targetBld);
          } else if (targetBld.type === 'nursery') {
            if (u.gender === 'female' && !u.isChild) this.assignKeeper(u, targetBld, null, 'tending');
            else this.sendVillagerToSleep(u, targetBld);
          } else if (targetBld.type === 'disco') {
            if (idx === 0 && !u.isChild && !targetBld.keeperId) {
              this.assignKeeper(u, targetBld, 'dj', 'relaxing');
            } else {
              this.sendVillagerToRelax(u, targetBld);
            }
          } else if (targetBld.type === 'sanctuary') {
            if (idx === 0 && !u.isChild && !targetBld.keeperId) {
              this.assignKeeper(u, targetBld, 'shaman', 'praying');
            } else {
              this.sendVillagerToPray(u, targetBld);
            }
          } else if (targetBld.type === 'armoury') {
            if (u.isChild) { rejectChild(u); return; }
            if (idx === 0 && !targetBld.keeperId) this.assignKeeper(u, targetBld, 'armourer', 'crafting');
            else this.sendVillagerToCraft(u, targetBld);
          } else if (targetBld.type === 'gym' || targetBld.type === 'range' || targetBld.type === 'pia_center') {
            if (u.isChild || u.isChief) return;
            this.sendVillagerToTrain(u, targetBld);
          } else if (targetBld.type === 'tower') {
            if (u.isChild) { rejectChild(u); return; }
            this.assignGuardToTower(u, targetBld);
          }
        });
        this.sound.playBeep(460, 'sine', 0.08);
        return;
      }

      // 5. Fishing Shoal / Shore / Pond
      if (this.tileRenderer && this.tileRenderer.isNearFishingLandmark(targetTile.x + 0.5, targetTile.y + 0.5)) {
        units.forEach((u) => {
          if (u.isChild) { rejectChild(u); return; }
          clearTargets(u);
          this.sendVillagerToFish(u);
        });
        return;
      }

      // 6. Forest (Chop Wood) / Stone Quarry Boulder (Mine Stone)
      if (this.map && targetTile.y >= 0 && targetTile.y < this.map.height && targetTile.x >= 0 && targetTile.x < this.map.width) {
        const occ = this.map.collision[targetTile.y][targetTile.x];
        if (occ === OCC.FOREST || occ === OCC.STONE) {
          const resType = occ === OCC.FOREST ? 'wood' : 'stone';
          const workState = occ === OCC.FOREST ? 'chopping' : 'mining';
          const rx = targetTile.x + 0.5;
          const ry = targetTile.y + 0.5;
          units.forEach((u) => {
            if (u.isChild) { rejectChild(u); return; }
            clearTargets(u);
            u.targetResource = { x: rx, y: ry, type: resType };
            u.lastWorkTarget = u.targetResource;
            u.lastWorkState = workState;
            u.state = workState;
            u.moveTo(rx, ry);
          });
          this.sound.playBeep(340, 'square', 0.08);
          return;
        }
      }

      // 7. Default Move in Squad Formation
      const cols = Math.max(1, Math.ceil(Math.sqrt(units.length)));
      units.forEach((u, idx) => {
        clearTargets(u);
        u.lastWorkTarget = null;
        u.state = 'walking';
        const ox = ((idx % cols) - (cols - 1) * 0.5) * 1.1;
        const oy = (Math.floor(idx / cols) - (Math.ceil(units.length / cols) - 1) * 0.5) * 1.1;
        const gx = Math.max(1.5, Math.min(this.map.width - 1.5, targetTile.x + 0.5 + ox));
        const gy = Math.max(1.5, Math.min(this.map.height - 1.5, targetTile.y + 0.5 + oy));
        u.moveTo(gx, gy);
      });
      this.sound.playBeep(360, 'sine', 0.05);
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      this.camera.zoomAt(delta, { x: e.clientX, y: e.clientY });
    });

    window.addEventListener('keydown', (e) => {
      this.keysHeld.add(e.key);

      // Authentic Cheat Code Listener ("87391" + 1/3/7/9)
      if (/^[0-9]$/.test(e.key)) {
        this.cheatBuffer = (this.cheatBuffer + e.key).slice(-6);
        if (this.cheatBuffer.startsWith('87391') && this.cheatBuffer.length === 6) {
          const code = this.cheatBuffer[5];
          if (code === '1') {
            this.fogEnabled = false;
            this.syncHudButtons();
            this.pushAlert('CHEAT 873911: Đã mở toàn bộ bản đồ!');
          } else if (code === '3') {
            this.villagers.forEach((v) => { if (!v.isEnemy) { v.health = v.maxHealth; v.isInfected = false; } });
            this.pushAlert('CHEAT 873913: Hồi 100% máu toàn bộ lạc!');
          } else if (code === '7') {
            this.endGame(true, 'Cheat 873917: Hoàn thành màn tức thì!');
          } else if (code === '9') {
            this.resources.food += 1000;
            this.resources.wood += 1000;
            this.resources.stone += 1000;
            this.resources.bones += 1000;
            this.updateHUD();
            this.pushAlert('CHEAT 873919: +1000 Food, Wood, Stone & Bones!');
          }
        }
      }

      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (this.activePlacementType || this.activeTrapType || this.activeSpellCast || this.armingWeaponId) {
          this.activePlacementType = null;
          this.activeTrapType = null;
          this.activeSpellCast = null;
          this.armingWeaponId = null;
          document.querySelectorAll('.btn-build').forEach((b) => b.classList.remove('active'));
        } else if (this.overlay.isOpen()) {
          if (!this.gameEnded) {
            this.isPaused = false;
            this.overlay.hide();
          }
        } else {
          this.overlay.renderPauseMenu();
        }
        return;
      }

      if (this.overlay.isOpen()) return;

      if (e.code === 'Space') {
        const chief = this.villagers.find((v) => v.isChief && !v.isEnemy);
        if (chief) {
          const wp = IsometricMath.tileToWorld(chief.x, chief.y);
          this.camera.setPosition(wp.x, wp.y);
          this.selectSingleVillager(chief);
          this.updateInspector();
        }
      } else if (e.key === 'c' || e.key === 'C') {
        this.toggleCallToArms();
      } else if (e.key === 'g' || e.key === 'G') {
        this.toggleFormUp();
      } else if (e.key === 'v' || e.key === 'V') {
        this.overlay.renderRoster();
      } else if (e.key === 'm' || e.key === 'M') {
        document.getElementById('btn-toggle-music')?.click();
      } else if (e.key === '1') {
        this.jumpToLastAlert();
      } else if (e.key === 'f' || e.key === 'F') {
        this.getSelectedUnits().forEach((v) => {
          if (v.isWarrior || v.role === 'pia_scout') this.toggleWarriorStealth(v);
        });
        this.updateInspector();
      } else if (e.key === '7' || e.key === '&') {
        if (e.shiftKey) this.saveSquadGroup(7);
        else this.recallSquadGroup(7);
      } else if (e.key === '9' || e.key === '(') {
        if (e.shiftKey) this.saveSquadGroup(9);
        else this.recallSquadGroup(9);
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysHeld.delete(e.key);
    });
  }

  assignKeeper(unit, building, roleName, idleActionState) {
    if (building.keeperId && building.keeperId !== unit.id) {
      const old = this.villagers.find((v) => v.id === building.keeperId);
      if (old) old.role = null;
    }
    building.keeperId = unit.id;
    unit.role = roleName;
    unit.assignedBuildingId = building.id;
    unit.targetBuilding = building;
    unit.state = idleActionState;
    unit.moveTo(building.x + building.width / 2, building.y + building.height + 0.2);
    const w = IsometricMath.tileToWorld(building.x + building.width / 2, building.y + building.height / 2);
    const s = this.camera.worldToScreen(w.x, w.y);
    if (roleName) {
      this.particles.spawnFloatingText(s.x, s.y - 26 * this.camera.zoom, `${unit.name} -> ${roleName.toUpperCase()}!`, '#fde047', this.camera.zoom);
    }
    this.updateInspector();
  }

  assignGuardToTower(unit, tower) {
    if (!tower.occupants.includes(unit.id) && tower.occupants.length < tower.getCapacity()) {
      tower.occupants.push(unit.id);
    }
    unit.role = 'guard';
    unit.targetBuilding = tower;
    unit.state = 'fighting';
    unit.moveTo(tower.x + 0.5, tower.y + 0.5);
  }

  tryUpgradeBuilding(b) {
    const def = b.def;
    const maxAllowed = this.currentLevelConfig?.maxBuildingLevels?.[b.type] || def.maxLevelDefault || 1;
    if (!b.canUpgrade(maxAllowed)) return;
    if (this.resources.wood < def.upgradeWood || this.resources.stone < def.upgradeStone || this.resources.bones < (def.upgradeBone || 0)) {
      this.pushAlert('Không đủ tài nguyên để nâng cấp!');
      this.sound.playBeep(200, 'sawtooth', 0.15);
      return;
    }
    this.resources.wood -= def.upgradeWood;
    this.resources.stone -= def.upgradeStone;
    this.resources.bones -= (def.upgradeBone || 0);
    b.startUpgrade();
    const builder = this.villagers.find((v) => !v.isEnemy && !v.isChild && (v.state === 'idle' || v.id === this.selectedVillagerId));
    if (builder) {
      builder.targetBuilding = b;
      builder.state = 'building';
      builder.moveTo(b.x + b.width / 2, b.y + b.height / 2);
    }
    this.updateHUD();
    this.updateInspector();
    this.sound.playBeep(620, 'triangle', 0.12);
  }

  tryRepairBuilding(b) {
    if (b.health >= b.maxHealth) return;
    if (this.resources.wood < 5) {
      this.pushAlert('Cần ít nhất 5 Wood để sửa chữa công trình!');
      return;
    }
    this.resources.wood -= 5;
    b.startRepair();
    const builder = this.villagers.find((v) => !v.isEnemy && !v.isChild && v.state === 'idle');
    if (builder) {
      builder.targetBuilding = b;
      builder.state = 'building';
      builder.moveTo(b.x + b.width / 2, b.y + b.height / 2);
    }
    this.updateHUD();
    this.updateInspector();
  }

  demolishBuilding(b) {
    if (b.type === 'chiefs_hut') return;
    this.buildings = this.buildings.filter((x) => x !== b);
    this.selectedBuildingId = null;
    this.recomputeLivingSpace();
    this.recomputeFog();
    this.updateHUD();
    this.updateInspector();
    this.sound.playBeep(220, 'sawtooth', 0.18);
  }

  queueWeaponCraft(armoury, weaponId) {
    const wDef = WEAPON_DEFS[weaponId];
    if (!wDef || armoury.level < wDef.minArmouryLv) return;
    if (!armoury.keeperId) {
      this.pushAlert('Cần cử 1 Thợ rèn (Armourer) vào Armoury để chế tạo!');
      return;
    }
    if (this.resources.wood < wDef.cost.wood || this.resources.stone < wDef.cost.stone || this.resources.bones < wDef.cost.bone) {
      this.pushAlert('Không đủ tài nguyên chế tạo vũ khí!');
      this.sound.playBeep(200, 'sawtooth', 0.15);
      return;
    }
    this.resources.wood -= wDef.cost.wood;
    this.resources.stone -= wDef.cost.stone;
    this.resources.bones -= wDef.cost.bone;
    armoury.productionQueue.push({ kind: 'weapon', id: weaponId, name: wDef.name });
    this.updateHUD();
    this.updateInspector();
    this.sound.playBeep(520, 'square', 0.09);
  }

  startTrapPlacement(trapId) {
    const tDef = TRAP_DEFS[trapId];
    if (!tDef) return;
    if (this.resources.wood < tDef.cost.wood || this.resources.stone < tDef.cost.stone) {
      this.pushAlert('Không đủ gỗ/đá để đặt bẫy!');
      this.sound.playBeep(200, 'sawtooth', 0.15);
      return;
    }
    this.activeTrapType = trapId;
    this.pushAlert(`Click trái trên bản đồ để đặt ${tDef.name}!`);
  }

  tryPlaceTrap(trapId, tx, ty) {
    const tDef = TRAP_DEFS[trapId];
    if (!tDef) return;
    this.resources.wood -= tDef.cost.wood;
    this.resources.stone -= tDef.cost.stone;
    const trap = new Trap(Date.now() + Math.random(), trapId, tx, ty, 'player', true);
    this.traps.push(trap);
    this.activeTrapType = null;
    const w = IsometricMath.tileToWorld(tx, ty);
    const s = this.camera.worldToScreen(w.x, w.y);
    this.particles.spawnFloatingText(s.x, s.y - 22 * this.camera.zoom, `Đặt ${tDef.name}!`, '#facc15', this.camera.zoom);
    this.sound.playBeep(480, 'triangle', 0.1);
    this.updateHUD();
  }

  executeSpellTarget(tx, ty) {
    const spellInfo = this.activeSpellCast;
    this.activeSpellCast = null;
    if (!spellInfo) return;
    const { spellId, sanctuary } = spellInfo;
    const shaman = sanctuary.keeperId ? this.villagers.find((v) => v.id === sanctuary.keeperId && v.health > 0) : null;
    if (!shaman) {
      this.pushAlert('Đền thờ cần có 1 Shaman đang trực để niệm phép!');
      return;
    }

    if (spellId === 'disease') {
      this.diseaseClouds.push({ x: Math.floor(tx), y: Math.floor(ty), timer: SPELL_DEFS.disease.duration });
      const w = IsometricMath.tileToWorld(tx, ty);
      const s = this.camera.worldToScreen(w.x, w.y);
      this.particles.spawnFloatingText(s.x, s.y - 26 * this.camera.zoom, 'Dịch Bệnh 3×3!', '#84cc16', this.camera.zoom);
      this.sound.playBeep(290, 'sawtooth', 0.22);
      return;
    }

    const ally = this.villagers.find((v) => !v.isEnemy && v.health > 0 && Math.hypot(v.x - tx, v.y - ty) < 1.8);
    if (!ally) {
      this.pushAlert('Hãy chọn đúng 1 đồng minh để ban phép!');
      return;
    }

    const w = IsometricMath.tileToWorld(ally.x, ally.y);
    const s = this.camera.worldToScreen(w.x, w.y);

    if (spellId === 'healing') {
      ally.health = ally.maxHealth;
      ally.isInfected = false;
      this.particles.spawnFloatingText(s.x, s.y - 28 * this.camera.zoom, 'Healing +Full HP!', '#4ade80', this.camera.zoom);
    } else if (spellId === 'defence') {
      ally.isProtected = true;
      ally.protectionTimer = SPELL_DEFS.defence.duration;
      this.particles.spawnFloatingText(s.x, s.y - 28 * this.camera.zoom, 'Khiên Bảo Vệ (-50% dmg)!', '#38bdf8', this.camera.zoom);
    } else if (spellId === 'love_potion') {
      ally.happiness = 99;
      ally.breedCooldown = 0;
      this.particles.spawnFloatingText(s.x, s.y - 28 * this.camera.zoom, 'Niagra Love +99!', '#f472b6', this.camera.zoom);
      this.tryStartBreeding(true);
    }
    shaman.gainSkillXp('healing', 20);
    this.sound.playBeep(760, 'sine', 0.18);
    this.updateInspector();
  }

  toggleCallToArms() {
    this.callToArms = !this.callToArms;
    this.formUp = false;
    document.getElementById('btn-call-to-arms')?.classList.toggle('active', this.callToArms);
    document.getElementById('btn-form-up')?.classList.remove('active');

    const chief = this.villagers.find((v) => v.isChief && !v.isEnemy);
    if (this.callToArms) {
      this.sound.setTheme('combat');
      if (chief) {
        chief.isMoving = false;
        chief.state = 'rallying';
        chief.rallyTimer = 1.8;
        const cw = IsometricMath.tileToWorld(chief.x, chief.y);
        const cs = this.camera.worldToScreen(cw.x, cw.y);
        this.particles.spawnFloatingText(cs.x, cs.y - 36 * this.camera.zoom, 'Call to Arms!', '#ef4444', this.camera.zoom);
      }
      this.sound.playBeep(392, 'sawtooth', 0.14);

      const enemies = this.villagers.filter((u) => u.isEnemy && u.health > 0);
      for (const v of this.villagers) {
        if (v.isEnemy || v.isChild || v.isChief) continue;
        v.state = 'fighting';
        if (enemies.length > 0) {
          let closest = enemies[0];
          let minD = Infinity;
          for (const e of enemies) {
            const d = Math.hypot(e.x - v.x, e.y - v.y);
            if (d < minD) { minD = d; closest = e; }
          }
          v.targetEnemy = closest;
          v.moveTo(closest.x, closest.y);
        } else if (chief) {
          v.moveTo(chief.x + (-1.5 + Math.random() * 3), chief.y + (-1.5 + Math.random() * 3));
        }
      }
    } else {
      this.sound.setTheme('calm');
      for (const v of this.villagers) {
        if (!v.isEnemy && !v.isChild && (v.state === 'fighting' || v.state === 'rallying')) {
          v.state = 'idle';
          v.targetEnemy = null;
        }
      }
    }
  }

  toggleFormUp() {
    this.formUp = !this.formUp;
    document.getElementById('btn-form-up')?.classList.toggle('active', this.formUp);
    const chief = this.villagers.find((v) => v.isChief && !v.isEnemy);
    if (this.formUp && chief) {
      const warriors = this.villagers.filter((v) => !v.isEnemy && (v.isWarrior || v.role === 'pia_scout' || v.weapon !== 'none'));
      warriors.forEach((w, idx) => {
        w.state = 'walking';
        w.moveTo(chief.x + ((idx % 4) - 1.5), chief.y + 2 + Math.floor(idx / 4));
      });
      this.pushAlert(`Đã tập hợp ${warriors.length} chiến binh theo Chief!`, chief.x, chief.y);
      this.sound.playBeep(620, 'triangle', 0.14);
    }
  }

  sendVillagerToEat(v, specificBuilding = null) {
    if (this.resources.meals <= 0 && this.resources.food < 3) return;
    const spot = specificBuilding || this.findCompletedBuilding('kitchen') || this.findCompletedBuilding('chiefs_hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'eating';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.3);
  }

  sendVillagerToSleep(v, specificBuilding = null) {
    const spot = specificBuilding || (v.isChild ? this.findCompletedBuilding('nursery') : null) || this.findCompletedBuilding('hut') || this.findCompletedBuilding('chiefs_hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'sleeping';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.35);
  }

  sendVillagerToRelax(v, specificBuilding = null) {
    const spot = specificBuilding || this.findCompletedBuilding('disco') || this.findCompletedBuilding('chiefs_hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'relaxing';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.35);
  }

  sendVillagerToFish(v) {
    const spot = this.tileRenderer ? this.tileRenderer.getFishingSpot() : null;
    if (!spot) return;
    v.state = 'fishing';
    v.workTimer = 0;
    v.lastWorkTarget = { x: spot.x, y: spot.y, type: 'food', isFishing: true };
    v.lastWorkState = 'fishing';
    v.moveTo(spot.x, spot.y);
  }

  sendVillagerToPray(v, specificBuilding = null) {
    const spot = specificBuilding || this.findCompletedBuilding('sanctuary') || this.findCompletedBuilding('chiefs_hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'praying';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.3);
  }

  sendVillagerToCraft(v, specificBuilding = null) {
    if (v.isChild) return;
    const spot = specificBuilding || this.findCompletedBuilding('armoury') || this.findCompletedBuilding('store');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'crafting';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.3);
  }

  sendVillagerToTend(v, specificBuilding = null) {
    const spot = specificBuilding || this.findCompletedBuilding('nursery') || this.findCompletedBuilding('hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'tending';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.3);
  }

  sendVillagerToTrain(v, specificBuilding = null) {
    if (v.isChild || v.isChief || v.isEnemy) return;
    const spot = specificBuilding || this.findCompletedBuilding('gym') || this.findCompletedBuilding('range') || this.findCompletedBuilding('pia_center');
    if (!spot) {
      this.pushAlert('Hãy xây Gym, Trường Bắn hoặc Trung tâm PIA trước!');
      return;
    }
    v.isStealthed = false;
    v.targetEnemy = null;
    v.targetAnimal = null;
    v.targetResource = null;
    v.targetBuilding = spot;
    v.state = 'training';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.25);
  }

  toggleWarriorStealth(v) {
    if (!v || (!v.isWarrior && v.role !== 'pia_scout')) return;
    const vw = IsometricMath.tileToWorld(v.x, v.y);
    const vs = this.camera.worldToScreen(vw.x, vw.y);
    if (!v.isStealthed && v.stealthCooldown > 0) {
      this.particles.spawnFloatingText(vs.x, vs.y - 26 * this.camera.zoom, `Stealth CD ${v.stealthCooldown.toFixed(1)}s`, '#f59e0b', this.camera.zoom);
      return;
    }
    v.isStealthed = !v.isStealthed;
    this.particles.spawnFoliageBurst(vs.x, vs.y - 10 * this.camera.zoom, this.camera.zoom);
    this.particles.spawnFloatingText(vs.x, vs.y - 28 * this.camera.zoom, v.isStealthed ? 'Ẩn Thân Bụi Cỏ!' : 'Hiện Thân', v.isStealthed ? '#4ade80' : '#cbd5e1', this.camera.zoom);
    this.sound.playBeep(v.isStealthed ? 380 : 500, 'sine', 0.1);
  }

  spawnProjectile(attacker, targetEntity, targetType, damage, isAmbush) {
    let projType = attacker.warriorMode === 'bow' ? 'bow' : 'javelin';
    if (attacker.weapon === 'stone') projType = 'stone';
    else if (attacker.weapon === 'tomahawk') projType = 'tomahawk';

    this.projectiles.push({
      startX: attacker.x, startY: attacker.y,
      endX: targetEntity.x, endY: targetEntity.y,
      targetEntity, targetType, attacker,
      type: projType, damage, isAmbush,
      progress: 0,
      speed: projType === 'bow' || projType === 'tomahawk' ? 4.2 : 3.2,
      arcHeight: projType === 'bow' ? 14 : 20
    });
  }

  applyCombatHit(attacker, targetEntity, targetType, dmg, isAmbush) {
    if (!targetEntity) return;
    if (targetType === 'building') {
      const b = targetEntity;
      if (b.health <= 0) return;
      const destroyed = b.takeDamage(dmg);
      const bw = IsometricMath.tileToWorld(b.x + b.width * 0.5, b.y + b.height * 0.5);
      const bs = this.camera.worldToScreen(bw.x, bw.y);
      this.particles.spawnWoodChips(bs.x, bs.y - 16 * this.camera.zoom, this.camera.zoom);
      this.particles.spawnFloatingText(bs.x, bs.y - 26 * this.camera.zoom, `-${dmg} HP`, '#f97316', this.camera.zoom);
      if (destroyed) {
        this.buildings = this.buildings.filter((x) => x !== b);
        if (b.owner === 'enemy') {
          this.matchStats.razed++;
          if (b.isPrisonHut) {
            this.endGame(true, 'Tất cả phụ nữ & trẻ em Avnotaklu đã được giải cứu an toàn khỏi lều giam!');
          }
        } else {
          this.recomputeLivingSpace();
          this.pushAlert(`MẤT CÔNG TRÌNH: ${b.name} đã bị địch phá hủy!`, b.x, b.y);
        }
      }
      return;
    }

    if (targetType === 'enemy' || targetType === 'enemy_or_unit') {
      const target = targetEntity;
      if (!target || target.health <= 0) return;
      const died = target.applyDamage(dmg);
      target.faceTowards(attacker.x, attacker.y);
      if (attacker instanceof Villager) {
        attacker.gainSkillXp('combat', 12);
      }

      const ew = IsometricMath.tileToWorld(target.x, target.y);
      const es = this.camera.worldToScreen(ew.x, ew.y);
      if (isAmbush) {
        this.particles.spawnFoliageBurst(es.x, es.y - 12 * this.camera.zoom, this.camera.zoom);
        this.particles.spawnFloatingText(es.x, es.y - 28 * this.camera.zoom, `AMBUSH -${dmg} HP!`, '#4ade80', this.camera.zoom);
      } else {
        this.particles.spawnStoneSparks(es.x, es.y - 12 * this.camera.zoom, this.camera.zoom);
        this.particles.spawnFloatingText(es.x, es.y - 24 * this.camera.zoom, `-${dmg} HP`, '#ef4444', this.camera.zoom);
      }
      if (died) {
        if (attacker instanceof Villager) attacker.targetEnemy = null;
        this.handleUnitDeath(target);
      }
      return;
    }

    if (targetType === 'animal') {
      const animal = targetEntity;
      if (!animal || animal.isDead) return;
      animal.takeDamage(dmg, attacker.x, attacker.y);
      if (attacker instanceof Villager) {
        if (animal.isDead) attacker.cheerTimer = 1.6;
        attacker.gainSkillXp('hunting', 10);
      }
      const aw = IsometricMath.tileToWorld(animal.x, animal.y);
      const as = this.camera.worldToScreen(aw.x, aw.y);
      this.particles.spawnStoneSparks(as.x, as.y - 10 * this.camera.zoom, this.camera.zoom);
      this.particles.spawnFloatingText(as.x, as.y - 20 * this.camera.zoom, `-${dmg} HP`, '#ef4444', this.camera.zoom);
    }
  }

  tryStartBreeding(manual = false) {
    const friendly = this.villagers.filter((u) => !u.isEnemy);
    if (friendly.length >= this.resources.maxLivingSpace) {
      if (manual) this.pushAlert('Không đủ chỗ ở! Hãy xây thêm Hut!');
      return false;
    }
    const hut = this.findCompletedBuilding('hut');
    if (!hut) return false;
    if (friendly.some((u) => u.state === 'breeding')) return false;

    const eligible = (u, g) =>
      !u.isChild && !u.isChief && u.gender === g &&
      (manual || (u.state === 'idle' && u.breedCooldown <= 0 && u.hunger < 70 && u.tiredness < 70 && u.happiness >= 65));

    const male = friendly.find((u) => eligible(u, 'male'));
    const female = friendly.find((u) => eligible(u, 'female'));
    if (!male || !female) return false;

    male.state = 'breeding';
    female.state = 'breeding';
    male.workTimer = 0;
    female.workTimer = 0;
    male.targetBuilding = hut;
    female.targetBuilding = hut;
    male.targetPartner = female;
    female.targetPartner = male;
    const hx = hut.x + hut.width / 2;
    const hy = hut.y + hut.height + 0.25;
    male.moveTo(hx - 0.3, hy);
    female.moveTo(hx + 0.3, hy);
    return true;
  }

  spawnNewbornChild(x, y) {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const name = pickUniqueTribeName(gender, this.villagers);
    const child = new Villager(this.nextUnitId++, name, gender, x, y + 0.4, false, false, true);
    this.villagers.push(child);
    this.matchStats.born++;
    this.updateHUD();
    const w = IsometricMath.tileToWorld(child.x, child.y);
    const s = this.camera.worldToScreen(w.x, w.y);
    this.particles.spawnFloatingText(s.x, s.y - 30 * this.camera.zoom, `Bé chào đời: ${name}!`, '#f472b6', this.camera.zoom);
    this.sound.playBeep(880, 'triangle', 0.22);
  }

  canPlaceBuildingAt(def, tx, ty) {
    if (!this.map || tx < 1 || ty < 1 || tx + def.width >= this.map.width - 1 || ty + def.height >= this.map.height - 1) {
      return false;
    }
    for (let gy = 0; gy < def.height; gy++) {
      for (let gx = 0; gx < def.width; gx++) {
        const occ = this.map.collision[ty + gy][tx + gx];
        if (occ === OCC.WATER || occ === OCC.BLOCKED) return false;
      }
    }
    for (const b of this.buildings) {
      if (tx < b.x + b.width && tx + def.width > b.x && ty < b.y + b.height && ty + def.height > b.y) {
        return false;
      }
    }
    return this.resources.wood >= def.costWood && this.resources.stone >= def.costStone && this.resources.bones >= (def.costBone || 0);
  }

  tryPlaceBuilding(type, tx, ty) {
    const def = BUILDING_DEFS[type];
    if (!def) return;
    if (!this.canPlaceBuildingAt(def, tx, ty)) {
      this.sound.playBeep(200, 'sawtooth', 0.16);
      this.pushAlert('Không thể đặt công trình tại đây hoặc thiếu tài nguyên!');
      return;
    }

    this.resources.wood -= def.costWood;
    this.resources.stone -= def.costStone;
    this.resources.bones -= (def.costBone || 0);
    this.updateHUD();

    const newBuilding = new Building(Date.now(), type, tx, ty, false, 'player', 1);
    this.buildings.push(newBuilding);
    for (let gy = 0; gy < def.height; gy++) {
      for (let gx = 0; gx < def.width; gx++) {
        this.tileRenderer?.clearTile(tx + gx, ty + gy);
      }
    }

    const builder = this.getSelectedUnits()[0] || this.villagers.find((v) => !v.isEnemy && !v.isChild && v.state === 'idle');
    if (builder) {
      builder.moveTo(tx + def.width / 2, ty + def.height / 2);
      builder.state = 'building';
      builder.targetBuilding = newBuilding;
      builder.lastWorkTarget = newBuilding;
    }
    this.activePlacementType = null;
    document.querySelectorAll('.btn-build').forEach((b) => b.classList.remove('active'));
    this.sound.playBeep(600, 'sine', 0.14);
  }

  findDropoffBuilding(vx, vy) {
    let closest = this.buildings.find((b) => b.owner === 'player' && b.isCompleted);
    let minDist = Infinity;
    for (const b of this.buildings) {
      if (b.owner === 'player' && b.isCompleted && (b.type === 'store' || b.type === 'chiefs_hut')) {
        const d = Math.hypot(b.x - vx, b.y - vy);
        if (d < minDist) { minDist = d; closest = b; }
      }
    }
    return closest || this.buildings[0];
  }

  findCompletedBuilding(type, owner = 'player') {
    return this.buildings.find((b) => b.owner === owner && b.isCompleted && b.type === type);
  }

  awardSkill(v, skillName, xp) {
    if (v.gainSkillXp(skillName, xp)) {
      const w = IsometricMath.tileToWorld(v.x, v.y);
      const s = this.camera.worldToScreen(w.x, w.y);
      this.particles.spawnFloatingText(s.x, s.y - 34 * this.camera.zoom, `${skillName.toUpperCase()} Lv.${v.skills[skillName]}!`, '#facc15', this.camera.zoom);
      this.sound.playBeep(880, 'triangle', 0.14);
    }
  }

  checkWinLoseConditions() {
    if (this.gameEnded || !this.map) return;

    const playerAlive = this.villagers.filter((v) => !v.isEnemy && v.health > 0).length;
    if (playerAlive === 0) {
      this.endGame(false, 'Toàn bộ thành viên bộ lạc Avnotaklu đã ngã xuống!');
      return;
    }

    const endCond = this.currentLevelConfig?.endCondition;
    if (endCond === 'conquest' || endCond === 'revenge') {
      const enemyBlds = this.buildings.filter((b) => b.owner === 'enemy' && b.health > 0);
      if (enemyBlds.length === 0) {
        this.endGame(true, `Bạn đã san phẳng toàn bộ doanh trại địch trong ${this.currentLevelConfig.name}!`);
      }
    } else if (endCond === 'cutscene') {
      // Tutorial / New Home Part 1: Win when clearing all enemies OR completing all major milestones & wiping raiders
      const enemyBlds = this.buildings.filter((b) => b.owner === 'enemy' && b.health > 0);
      const enemyUnits = this.villagers.filter((v) => v.isEnemy && v.health > 0);
      if (this.currentLevelConfig.id === 0) {
        const hasStore = !!this.findCompletedBuilding('store');
        const hasKitchen = !!this.findCompletedBuilding('kitchen');
        const hasGym = !!this.findCompletedBuilding('gym') || !!this.findCompletedBuilding('armoury');
        if (hasStore && hasKitchen && hasGym && enemyUnits.length === 0) {
          this.endGame(true, 'Hoàn tất Huấn Luyện Sinh Tồn! Tộc Avnotaklu sẵn sàng tiến ra thế giới!');
        }
      } else if (enemyBlds.length === 0) {
        this.endGame(true, 'Pháo đài phía Bắc đã sụp đổ! Đường sang Thung Lũng Mới rộng mở!');
      }
    }
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    // Smooth WASD / Arrow panning even during planning
    const panSpd = 320 * dt;
    if (!this.overlay.isOpen()) {
      if (this.keysHeld.has('w') || this.keysHeld.has('W') || this.keysHeld.has('ArrowUp')) this.camera.pan(0, -panSpd);
      if (this.keysHeld.has('s') || this.keysHeld.has('S') || this.keysHeld.has('ArrowDown')) this.camera.pan(0, panSpd);
      if (this.keysHeld.has('a') || this.keysHeld.has('A') || this.keysHeld.has('ArrowLeft')) this.camera.pan(-panSpd, 0);
      if (this.keysHeld.has('d') || this.keysHeld.has('D') || this.keysHeld.has('ArrowRight')) this.camera.pan(panSpd, 0);
    }

    if (!this.isPaused && !this.gameEnded) {
      this.matchElapsed += dt;
      this.dayNight.update(dt);
      const clockEl = document.getElementById('clock-hud');
      if (clockEl) clockEl.innerText = this.dayNight.getFormattedTime();

      this.tileRenderer?.update(dt);
      this.buildingRenderer?.update(dt);
      this.wildlifeRenderer?.update(dt);
      this.spriteRenderer?.update(dt);

      if (this.alertTimer > 0) {
        this.alertTimer -= dt;
        if (this.alertTimer <= 0) {
          const banner = document.getElementById('alert-banner');
          if (banner) banner.style.display = 'none';
        }
      }

      for (const node of this.resourceNodes) node.update(dt);
      for (const a of this.animals) a.update(dt, this.map ? this.map.width : 40, this.map ? this.map.height : 32);

      AISystems.updateWorkshopsAndDefenses(this, dt);
      AISystems.updateTrapsAndDisease(this, dt);
      AISystems.updateEnemyAI(this, dt);

      const chief = this.villagers.find((u) => u.isChief && !u.isEnemy);
      for (const v of this.villagers) {
        v.hasChiefAura = !v.isEnemy && chief ? Math.hypot(v.x - chief.x, v.y - chief.y) <= 6.0 : false;
      }

      this.breedCheckTimer += dt;
      if (this.breedCheckTimer >= 5.0) {
        this.breedCheckTimer = 0;
        this.tryStartBreeding(false);
      }

      for (const v of [...this.villagers]) {
        v.update(dt);

        if (v.health <= 0 && !v.isEnemy) {
          this.handleUnitDeath(v);
          continue;
        }

        if (v.justGrewUp) {
          v.justGrewUp = false;
          const w = IsometricMath.tileToWorld(v.x, v.y);
          const s = this.camera.worldToScreen(w.x, w.y);
          this.particles.spawnFloatingText(s.x, s.y - 30 * this.camera.zoom, `${v.name} Trưởng Thành!`, '#4ade80', this.camera.zoom);
        }

        if (v.isEnemy) {
          if (v.health <= 0) {
            v.isMoving = false;
            v.defeatTimer = (v.defeatTimer ?? 2.6) - dt;
            if (v.defeatTimer <= 0) this.villagers = this.villagers.filter((u) => u !== v);
            continue;
          }

          if (v.state !== 'fighting') {
            for (const u of this.villagers) {
              if (u.isEnemy || u.health <= 0) continue;
              const d = Math.hypot(u.x - v.x, u.y - v.y);
              const patrolDetect = u.isStealthed ? u.getDetectRadius() : 5.0;
              if (d <= patrolDetect) {
                v.state = 'fighting';
                break;
              }
            }
          }

          if (v.state === 'fighting') {
            let nearest = null;
            let minDist = 14;
            for (const u of this.villagers) {
              if (u.isEnemy || u.health <= 0) continue;
              const d = Math.hypot(u.x - v.x, u.y - v.y);
              const detectLimit = u.isStealthed ? u.getDetectRadius() : 14;
              if (d <= detectLimit && d < minDist) { minDist = d; nearest = u; }
            }
            if (nearest) {
              const range = v.getAttackRange();
              if (minDist > range) {
                v.moveTo(nearest.x, nearest.y);
              } else {
                v.isMoving = false;
                v.faceTowards(nearest.x, nearest.y);
                if (v.attackCooldown <= 0 && v.stunTimer <= 0) {
                  v.attackCooldown = 1.15;
                  const dmg = Math.max(4, Math.floor(v.getCombatDamage(false) * (this.difficulty === 'hard' ? 1.25 : 0.8)));
                  this.applyCombatHit(v, nearest, 'enemy_or_unit', dmg, false);
                }
              }
              continue;
            }
            const enemyTargetBld = this.buildings.find((b) => b.owner === 'player' && Math.hypot(b.x + 1 - v.x, b.y + 1 - v.y) < 10);
            if (enemyTargetBld) {
              const distB = Math.hypot(enemyTargetBld.x + enemyTargetBld.width / 2 - v.x, enemyTargetBld.y + enemyTargetBld.height / 2 - v.y);
              if (distB > 2.1) {
                v.moveTo(enemyTargetBld.x + enemyTargetBld.width / 2, enemyTargetBld.y + enemyTargetBld.height / 2);
              } else {
                v.isMoving = false;
                if (v.attackCooldown <= 0 && v.stunTimer <= 0) {
                  v.attackCooldown = 1.3;
                  this.applyCombatHit(v, enemyTargetBld, 'building', 7, false);
                }
              }
              continue;
            }
            v.state = 'idle';
          }

          if (!v.isMoving) {
            v.wanderTimer -= dt;
            if (v.wanderTimer <= 0) {
              v.wanderTimer = 3.0 + Math.random() * 4.0;
              v.state = 'walking';
              const nx = Math.max(2, Math.min(this.map.width - 3, v.x + (-2.5 + Math.random() * 5)));
              const ny = Math.max(2, Math.min(this.map.height - 3, v.y + (-2.5 + Math.random() * 5)));
              v.moveTo(nx, ny);
            }
          }
          continue;
        }

        // Needs & Autonomous AI for Player Villagers
        if (v.isChild) {
          if (v.hunger > 75 && v.state !== 'eating') this.sendVillagerToEat(v);
          else if (v.tiredness > 80 && v.state !== 'sleeping') this.sendVillagerToSleep(v);
          else if ((v.state === 'idle' || v.state === 'playing') && !v.isMoving) {
            v.wanderTimer -= dt;
            if (v.wanderTimer <= 0) {
              v.wanderTimer = 4.0 + Math.random() * 4.0;
              v.state = 'playing';
              const nursery = this.findCompletedBuilding('nursery') || this.findCompletedBuilding('hut') || this.buildings[0];
              if (nursery) v.moveTo(nursery.x + Math.random() * 2, nursery.y + nursery.height + 0.5);
            }
          }
        } else {
          const busy = ['eating', 'sleeping', 'relaxing', 'carrying', 'breeding', 'fighting', 'training'].includes(v.state);
          if (!busy) {
            if (v.hunger > 78 && (this.resources.meals > 0 || this.resources.food >= 5)) this.sendVillagerToEat(v);
            else if (v.tiredness > 84) this.sendVillagerToSleep(v);
            else if (v.happiness < 58 && v.state === 'idle' && this.findCompletedBuilding('disco')) this.sendVillagerToRelax(v);
          }
        }

        if (v.state === 'eating' && !v.isMoving) {
          v.workTimer += dt;
          if (v.workTimer >= 2.5) {
            v.workTimer = 0;
            if (this.resources.meals > 0) {
              this.resources.meals--;
              v.health = Math.min(v.maxHealth, v.health + 15);
            } else {
              this.resources.food = Math.max(0, this.resources.food - 5);
            }
            v.hunger = 0;
            v.happiness = Math.min(100, v.happiness + 18);
            this.updateHUD();
            v.state = v.isChild ? 'playing' : 'idle';
          }
        }

        if (v.state === 'sleeping' && !v.isMoving) {
          v.workTimer += dt;
          if (v.workTimer >= 3.0) {
            v.workTimer = 0;
            v.tiredness = 0;
            v.health = Math.min(v.maxHealth, v.health + 20);
            v.happiness = Math.min(100, v.happiness + 15);
            v.state = v.isChild ? 'playing' : 'idle';
          }
        }

        if (v.state === 'relaxing' && !v.isMoving) {
          v.workTimer += dt;
          if (v.workTimer >= 2.8) {
            v.workTimer = 0;
            v.happiness = 100;
            if (v.role !== 'dj') v.state = v.isChild ? 'playing' : 'idle';
          }
        }

        if (v.state === 'fishing' && !v.isMoving) {
          v.workTimer += dt * v.getEfficiencyMultiplier();
          if (v.workTimer >= 2.0) {
            v.workTimer = 0;
            v.cargo.type = 'food';
            v.cargo.amount = Math.min(v.cargo.max, v.cargo.amount + 4);
            this.awardSkill(v, 'foraging', 9);
            if (v.cargo.amount >= v.cargo.max) {
              const drop = this.findDropoffBuilding(v.x, v.y);
              v.state = 'carrying';
              if (drop) v.moveTo(drop.x + drop.width / 2, drop.y + drop.height / 2);
            }
          }
        }

        if (v.state === 'praying' && !v.isMoving) {
          v.workTimer += dt;
          if (v.workTimer >= 3.0) {
            v.workTimer = 0;
            v.health = Math.min(v.maxHealth, v.health + 12);
            v.happiness = Math.min(100, v.happiness + 15);
            if (v.role !== 'shaman') v.state = 'idle';
          }
        }

        if (v.state === 'crafting' && !v.isMoving) {
          v.workTimer += dt;
          if (v.workTimer >= 3.0) {
            v.workTimer = 0;
            if (v.role !== 'cook' && v.role !== 'armourer') v.state = 'idle';
          }
        }

        if (v.state === 'tending' && !v.isMoving) {
          v.workTimer += dt;
          if (v.workTimer >= 3.0) {
            v.workTimer = 0;
            this.villagers.forEach((c) => {
              if (c.isChild && !c.isEnemy) { c.happiness = 100; c.growthProgress = Math.min(99, c.growthProgress + 4); }
            });
            v.state = 'idle';
          }
        }

        if (v.state === 'training' && !v.isMoving) {
          if (!v.targetBuilding || !['gym', 'range', 'pia_center'].includes(v.targetBuilding.type)) {
            v.state = 'idle';
          } else {
            const res = v.addTrainingTime(dt * v.getEfficiencyMultiplier(), v.targetBuilding.type);
            if (res.promoted) {
              const vw = IsometricMath.tileToWorld(v.x, v.y);
              const vs = this.camera.worldToScreen(vw.x, vw.y);
              this.particles.spawnFloatingText(vs.x, vs.y - 34 * this.camera.zoom, `Thăng cấp ${'★'.repeat(res.newStar)}!`, '#fbbf24', this.camera.zoom);
              this.sound.playBeep(880, 'triangle', 0.22);
              this.updateInspector();
            }
            if (v.warriorStars >= 3) {
              v.state = 'idle';
              v.targetBuilding = null;
            }
          }
        }

        if (v.state === 'breeding' && !v.isMoving) {
          v.workTimer += dt;
          if (v.workTimer >= 3.2) {
            v.workTimer = 0;
            v.breedCooldown = 45;
            if (v.gender === 'male') this.spawnNewbornChild(v.x + 0.3, v.y + 0.3);
            if (v.targetPartner) {
              v.targetPartner.breedCooldown = 45;
              v.targetPartner.state = 'idle';
              v.targetPartner.targetPartner = null;
            }
            v.targetPartner = null;
            v.state = 'idle';
          }
        }

        if (v.state === 'fighting') {
          if (v.targetBuilding && v.targetBuilding.owner === 'enemy' && v.targetBuilding.health > 0) {
            const bx = v.targetBuilding.x + v.targetBuilding.width * 0.5;
            const by = v.targetBuilding.y + v.targetBuilding.height * 0.5;
            const distB = Math.hypot(bx - v.x, by - v.y);
            const reach = Math.max(1.8, v.getAttackRange());
            if (distB > reach) {
              v.moveTo(bx, by);
            } else {
              v.isMoving = false;
              v.faceTowards(bx, by);
              if (v.attackCooldown <= 0 && v.stunTimer <= 0) {
                v.attackCooldown = v.getAttackCooldown();
                this.applyCombatHit(v, v.targetBuilding, 'building', v.getCombatDamage(false), false);
              }
            }
          } else {
            const enemy = (v.targetEnemy && v.targetEnemy.health > 0)
              ? v.targetEnemy
              : this.villagers.find((u) => u.isEnemy && u.health > 0 && Math.hypot(u.x - v.x, u.y - v.y) < 12);
            if (enemy) {
              v.targetEnemy = enemy;
              const dist = Math.hypot(enemy.x - v.x, enemy.y - v.y);
              if (dist > v.getAttackRange()) {
                v.moveTo(enemy.x, enemy.y);
              } else {
                v.isMoving = false;
                v.faceTowards(enemy.x, enemy.y);
                if (v.attackCooldown <= 0 && v.stunTimer <= 0) {
                  v.attackCooldown = v.getAttackCooldown();
                  const isAmbush = (v.isWarrior || v.role === 'pia_scout') && v.isStealthed;
                  const dmg = v.getCombatDamage(isAmbush);
                  if (isAmbush) { v.isStealthed = false; v.stealthCooldown = 3.0; }
                  if (v.isWarrior || WEAPON_DEFS[v.weapon]?.type === 'ranged') {
                    this.spawnProjectile(v, enemy, 'enemy', dmg, isAmbush);
                  } else {
                    this.applyCombatHit(v, enemy, 'enemy', dmg, isAmbush);
                  }
                }
              }
            } else {
              v.state = 'idle';
            }
          }
        }

        if (v.state === 'building' && v.targetBuilding && !v.isMoving) {
          const eff = v.getEfficiencyMultiplier();
          const res = v.targetBuilding.build(dt * 16 * eff);
          if (res === 'completed' || res === 'upgraded' || res === 'repaired') {
            if (res === 'completed') {
              this.matchStats.built++;
              this.recomputeLivingSpace();
              this.awardSkill(v, 'building', 25);
            }
            const bw = IsometricMath.tileToWorld(v.targetBuilding.x + 1, v.targetBuilding.y + 1);
            const bs = this.camera.worldToScreen(bw.x, bw.y);
            this.particles.spawnFloatingText(bs.x, bs.y - 28 * this.camera.zoom, `${v.targetBuilding.name} Xong!`, '#fde047', this.camera.zoom);
            v.cheerTimer = 1.5;
            v.state = 'idle';
            v.targetBuilding = null;
            this.recomputeFog();
            this.updateHUD();
            this.updateInspector();
            this.sound.playBeep(820, 'triangle', 0.2);
          }
        }

        if (v.state === 'hunting' && v.targetAnimal) {
          const distA = Math.hypot(v.targetAnimal.x - v.x, v.targetAnimal.y - v.y);
          if (!v.targetAnimal.isDead) {
            if (distA > v.getAttackRange()) v.moveTo(v.targetAnimal.x, v.targetAnimal.y);
            else {
              v.isMoving = false;
              v.faceTowards(v.targetAnimal.x, v.targetAnimal.y);
              if (v.attackCooldown <= 0) {
                v.attackCooldown = v.isWarrior ? v.getAttackCooldown() : 0.8;
                const dmg = v.getCombatDamage(v.isWarrior && v.isStealthed);
                v.isStealthed = false;
                if (v.isWarrior || WEAPON_DEFS[v.weapon]?.type === 'ranged') {
                  this.spawnProjectile(v, v.targetAnimal, 'animal', dmg, false);
                } else {
                  this.applyCombatHit(v, v.targetAnimal, 'animal', dmg, false);
                }
              }
            }
          } else if (distA > 1.3) {
            v.moveTo(v.targetAnimal.x, v.targetAnimal.y);
          } else {
            v.workTimer += dt;
            if (v.workTimer >= 1.3) {
              v.workTimer = 0;
              v.cargo.type = 'food';
              v.cargo.amount = Math.min(v.cargo.max, v.targetAnimal.foodYield);
              this.resources.bones += Math.floor(v.targetAnimal.boneYield / 2);
              this.animals = this.animals.filter((a) => a !== v.targetAnimal);
              v.targetAnimal = null;
              const drop = this.findDropoffBuilding(v.x, v.y);
              v.state = 'carrying';
              if (drop) v.moveTo(drop.x + drop.width / 2, drop.y + drop.height / 2);
            }
          }
        }

        const isGather = v.state === 'chopping' || v.state === 'mining' || v.state === 'foraging';
        if (isGather && v.targetResource && !v.isMoving) {
          v.workTimer += dt * v.getEfficiencyMultiplier();
          if (v.workTimer >= 1.3) {
            v.workTimer = 0;
            const resType = v.targetResource.type;
            let gathered = 5;
            if (v.targetResource instanceof ResourceNode) {
              gathered = v.targetResource.harvest(5);
              this.awardSkill(v, 'foraging', 8);
              if (v.targetResource.isDepleted) v.targetResource = null;
            } else {
              const tx = Math.floor(v.targetResource.x);
              const ty = Math.floor(v.targetResource.y);
              const key = `${tx},${ty}`;
              let rem = this.terrainYield.has(key) ? this.terrainYield.get(key) : 35;
              gathered = Math.min(rem, 5);
              rem -= gathered;
              this.awardSkill(v, resType === 'wood' ? 'woodcutting' : 'mining', 8);
              if (rem <= 0) {
                this.terrainYield.set(key, 0);
                this.tileRenderer?.depleteTile(tx, ty, resType);
                v.targetResource = null;
                v.lastWorkTarget = null;
              } else {
                this.terrainYield.set(key, rem);
              }
            }
            if (v.cargo.type && v.cargo.type !== resType) v.cargo.amount = 0;
            v.cargo.type = resType;
            v.cargo.amount = Math.min(v.cargo.max, v.cargo.amount + gathered);

            if (v.cargo.amount >= v.cargo.max || (!v.targetResource && v.cargo.amount > 0)) {
              const drop = this.findDropoffBuilding(v.x, v.y);
              v.state = 'carrying';
              if (drop) v.moveTo(drop.x + drop.width / 2, drop.y + drop.height / 2);
            } else if (!v.targetResource) {
              v.state = 'idle';
            }
          }
        }

        if (v.state === 'carrying' && !v.isMoving) {
          const amt = v.cargo.amount;
          const ct = v.cargo.type;
          if (ct === 'wood') this.resources.wood += amt;
          else if (ct === 'stone') this.resources.stone += amt;
          else if (ct === 'food') this.resources.food += amt;
          this.matchStats.gathered += amt;

          const vw = IsometricMath.tileToWorld(v.x, v.y);
          const vs = this.camera.worldToScreen(vw.x, vw.y);
          this.particles.spawnFloatingText(vs.x, vs.y - 24 * this.camera.zoom, `+${amt} ${ct}`, '#fde047', this.camera.zoom);
          v.cargo.amount = 0;
          v.cargo.type = null;
          this.updateHUD();

          if (v.lastWorkTarget instanceof ResourceNode && !v.lastWorkTarget.isDepleted) {
            v.state = v.lastWorkState || 'foraging';
            v.targetResource = v.lastWorkTarget;
            v.moveTo(v.lastWorkTarget.x, v.lastWorkTarget.y);
          } else if (v.lastWorkTarget && v.lastWorkTarget.isFishing) {
            v.state = 'fishing';
            v.moveTo(v.lastWorkTarget.x, v.lastWorkTarget.y);
          } else if (v.lastWorkTarget && (v.lastWorkTarget.type === 'wood' || v.lastWorkTarget.type === 'stone')) {
            const rem = this.terrainYield.get(`${Math.floor(v.lastWorkTarget.x)},${Math.floor(v.lastWorkTarget.y)}`);
            if (rem === undefined || rem > 0) {
              v.state = v.lastWorkState || 'chopping';
              v.targetResource = v.lastWorkTarget;
              v.moveTo(v.lastWorkTarget.x, v.lastWorkTarget.y);
            } else v.state = 'idle';
          } else {
            v.state = 'idle';
          }
        }
      }

      // Projectiles update
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        const p = this.projectiles[i];
        if (p.targetEntity) {
          p.endX = p.targetEntity.x;
          p.endY = p.targetEntity.y;
        }
        const dist = Math.max(0.8, Math.hypot(p.endX - p.startX, p.endY - p.startY));
        p.progress += (p.speed / dist) * dt * 3.0;
        if (p.progress >= 1) {
          this.applyCombatHit(p.attacker, p.targetEntity, p.targetType, p.damage, p.isAmbush);
          this.projectiles.splice(i, 1);
        }
      }

      this.particles.update(dt);
      const friendlyCount = this.villagers.filter((u) => !u.isEnemy && u.health > 0).length;
      this.resources.food = Math.max(0, this.resources.food - dt * 0.04 * friendlyCount);

      this.fogRefreshTimer += dt;
      if (this.fogRefreshTimer >= 0.45) {
        this.fogRefreshTimer = 0;
        this.recomputeFog();
      }

      this.uiRefreshTimer += dt;
      if (this.uiRefreshTimer >= 0.4) {
        this.uiRefreshTimer = 0;
        this.updateHUD();
        this.updateInspector();
        this.checkWinLoseConditions();
      }
    }

    // Render Scene
    this.ctx.fillStyle = '#090b0f';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.map && this.tileRenderer) {
      this.tileRenderer.renderBase(this.ctx, this.camera, this.hoveredTile, this.fogGrid, this.fogEnabled, this.diseaseClouds);
    }

    if (this.activePlacementType && this.hoveredTile) {
      const def = BUILDING_DEFS[this.activePlacementType];
      if (def) {
        const canPlace = this.canPlaceBuildingAt(def, this.hoveredTile.x, this.hoveredTile.y);
        BuildingRenderer.drawGhost(this.ctx, def, this.hoveredTile.x, this.hoveredTile.y, this.camera, canPlace, this.assets);
      }
    }

    const renderList = [];
    this.tileRenderer?.appendRenderables(renderList, this.camera, this.fogGrid, this.fogEnabled);
    this.wildlifeRenderer?.appendRenderables(renderList, this.resourceNodes, this.animals, this.camera);
    this.buildingRenderer?.appendRenderables(renderList, this.buildings, this.camera, this.traps);
    const visibleUnits = this.villagers.filter((v) => {
      if (!v.isEnemy || !this.fogEnabled || !this.fogGrid) return true;
      const fx = Math.floor(v.x);
      const fy = Math.floor(v.y);
      return (this.fogGrid[fy]?.[fx] ?? 0) === 2 && !v.isStealthed;
    });
    this.spriteRenderer?.appendRenderables(renderList, visibleUnits, this.selectedVillagerId, this.camera);

    renderList.sort((a, b) => a.sortKey - b.sortKey);
    for (const item of renderList) item.draw(this.ctx);

    if (this.spriteRenderer && this.projectiles.length > 0) {
      this.spriteRenderer.drawProjectiles(this.ctx, this.projectiles, this.camera);
    }
    this.particles.render(this.ctx);

    // Multi-Select Box Rectangle Overlay
    if (this.isBoxSelecting && this.boxStart && this.boxCurrent) {
      const bx = Math.min(this.boxStart.x, this.boxCurrent.x);
      const by = Math.min(this.boxStart.y, this.boxCurrent.y);
      const bw = Math.abs(this.boxCurrent.x - this.boxStart.x);
      const bh = Math.abs(this.boxCurrent.y - this.boxStart.y);
      if (bw > 6 || bh > 6) {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(74, 222, 128, 0.16)';
        this.ctx.fillRect(bx, by, bw, bh);
        this.ctx.strokeStyle = '#4ade80';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(bx, by, bw, bh);
        this.ctx.restore();
      }
    }

    // Highlight multi-selected rings cleanly
    for (const v of visibleUnits) {
      if (!v.isEnemy && this.selectedUnitIds.has(v.id) && v.id !== this.selectedVillagerId) {
        const wp = IsometricMath.tileToWorld(v.x, v.y);
        const sp = this.camera.worldToScreen(wp.x, wp.y);
        this.ctx.beginPath();
        this.ctx.ellipse(sp.x, sp.y + 1 * this.camera.zoom, 15 * this.camera.zoom, 7.5 * this.camera.zoom, 0, 0, Math.PI * 2);
        this.ctx.strokeStyle = '#4ade80';
        this.ctx.lineWidth = 2 * this.camera.zoom;
        this.ctx.stroke();
      }
    }

    // Dynamic Torchlight & Day/Night Shading
    const lightSources = [];
    for (const b of this.buildings) {
      if (b.owner !== 'player') continue;
      const bw = IsometricMath.tileToWorld(b.x + b.width / 2, b.y + b.height / 2);
      const bs = this.camera.worldToScreen(bw.x, bw.y);
      const rad = b.type === 'chiefs_hut' || b.type === 'disco' ? 115 : 85;
      lightSources.push({ x: bs.x, y: bs.y - 10 * this.camera.zoom, radius: rad * this.camera.zoom });
    }
    this.dayNight.renderLighting(this.ctx, this.canvas.width, this.canvas.height, lightSources);

    // Update Minimap
    this.minimap.render({
      mapData: this.map,
      buildings: this.buildings,
      villagers: this.villagers,
      animals: this.animals,
      traps: this.traps,
      camera: this.camera,
      fogGrid: this.fogGrid,
      fogEnabled: this.fogEnabled,
      diseaseClouds: this.diseaseClouds
    });

    requestAnimationFrame((t) => this.loop(t));
  }

  updateHUD() {
    const friendly = this.villagers.filter((u) => !u.isEnemy && u.health > 0).length;
    this.resources.population = friendly;
    const lvl = this.currentLevelConfig;

    const badge = document.getElementById('level-badge');
    if (badge) badge.innerText = lvl ? lvl.vnName : 'Prehistoric Tribes';
    const obj = document.getElementById('objective-pill');
    if (obj && lvl) obj.innerText = `Mục tiêu: ${lvl.objectiveText}`;

    const setEl = (id, val) => { const e = document.getElementById(id); if (e) e.innerText = val; };
    setEl('res-food', `${Math.floor(this.resources.food)}`);
    setEl('res-meals', `(+${this.resources.meals} bữa)`);
    setEl('res-wood', `${this.resources.wood}`);
    setEl('res-stone', `${this.resources.stone}`);
    setEl('res-bones', `${this.resources.bones}`);
    setEl('res-pop', `${friendly} / ${this.resources.maxLivingSpace}`);
  }

  updateInspector() {
    const panelEl = document.getElementById('inspector-panel');
    const el = document.getElementById('inspector-inner') || panelEl;
    if (!panelEl || !el) return;

    // 1. Building Inspector
    const selBld = this.buildings.find((b) => b.id === this.selectedBuildingId);
    if (selBld) {
      panelEl.style.display = 'block';
      const maxCap = this.currentLevelConfig?.maxBuildingLevels?.[selBld.type] || selBld.def.maxLevelDefault || 1;
      const canUp = selBld.owner === 'player' && selBld.canUpgrade(maxCap);
      const keeper = selBld.keeperId ? this.villagers.find((v) => v.id === selBld.keeperId && v.health > 0) : null;

      let extraHtml = '';
      if (selBld.owner === 'player' && selBld.type === 'armoury' && selBld.isCompleted) {
        const qList = selBld.productionQueue.map((q) => q.name).join(', ') || 'Trống';
        extraHtml = `
          <div class="warrior-stat-box">
            <div><b>Hàng đợi rèn:</b> ${qList}</div>
            <div style="margin-top:4px;"><b>Kho vũ khí:</b> Club:${this.armouryStock.club} | Spear:${this.armouryStock.spear} | Axe:${this.armouryStock.stone_axe} | Mace:${this.armouryStock.bone_mace} | Toma:${this.armouryStock.tomahawk}</div>
          </div>
          <div class="insp-actions">
            ${Object.values(WEAPON_DEFS).filter((w) => w.id !== 'none' && selBld.level >= w.minArmouryLv).map((w) => `
              <button class="insp-btn" data-action="craft_weapon" data-param="${w.id}">Rèn ${w.name.split(' ')[0]}<br><small>${w.cost.wood}W ${w.cost.stone}S ${w.cost.bone}B</small></button>
            `).join('')}
            ${Object.values(TRAP_DEFS).filter((t) => selBld.level >= t.minArmouryLv).map((t) => `
              <button class="insp-btn" data-action="place_trap" data-param="${t.id}">Đặt ${t.name.split(' ')[0]}<br><small>${t.cost.wood}W ${t.cost.stone}S</small></button>
            `).join('')}
          </div>
        `;
      } else if (selBld.owner === 'player' && selBld.type === 'sanctuary' && selBld.isCompleted) {
        extraHtml = `
          <div class="warrior-stat-box">Chọn phép bên dưới rồi click vào đồng minh hoặc mặt đất để Shaman thi triển!</div>
          <div class="insp-actions">
            ${Object.values(SPELL_DEFS).filter((sp) => selBld.level >= sp.minSanctuaryLv).map((sp) => `
              <button class="insp-btn" data-action="cast_spell" data-param="${sp.id}">${sp.name}</button>
            `).join('')}
          </div>
        `;
      } else if (selBld.owner === 'player' && selBld.type === 'store' && selBld.isCompleted) {
        extraHtml = `
          <div class="warrior-stat-box"><b>Trang bị cho Chiến binh / Dân:</b> Click nút vũ khí rồi click lên dân trên bản đồ!</div>
          <div class="insp-actions">
            ${Object.entries(this.armouryStock).filter(([, cnt]) => cnt > 0).map(([wid, cnt]) => `
              <button class="insp-btn" data-action="arm_weapon" data-param="${wid}">Lấy ${wid} (${cnt})</button>
            `).join('') || '<span style="color:#94a3b8;">Kho vũ khí đang trống</span>'}
          </div>
        `;
      }

      el.innerHTML = `
        <div style="font-family:'Cinzel',serif;font-weight:800;color:#fde047;font-size:15px;">
          ${selBld.name} <span style="color:#38bdf8;">Lv.${selBld.level}</span>
        </div>
        <div style="font-size:11px;color:#cbd5e1;margin-bottom:6px;">${selBld.def.description || ''}</div>
        <div>HP: <b style="color:#4ade80;">${Math.floor(selBld.health)} / ${selBld.maxHealth}</b> | Sức chứa: ${selBld.getCapacity()}</div>
        ${selBld.def.keeperRole ? `<div>Người phụ trách: <b style="color:${keeper ? '#4ade80' : '#f87171'};">${keeper ? keeper.name : `Chưa có (${selBld.def.keeperRole})`}</b></div>` : ''}
        ${selBld.owner === 'player' ? `
          <div class="insp-actions">
            <button class="insp-btn" data-action="upgrade_bld" ${canUp ? '' : 'disabled'}>Nâng cấp Lv.${selBld.level + 1}<br><small>${selBld.def.upgradeWood}W ${selBld.def.upgradeStone}S</small></button>
            <button class="insp-btn" data-action="repair_bld" ${selBld.health < selBld.maxHealth ? '' : 'disabled'}>Sửa chữa</button>
            ${selBld.type !== 'chiefs_hut' ? '<button class="insp-btn danger" data-action="demolish_bld">Phá bỏ</button>' : ''}
          </div>
        ` : '<div style="color:#f87171;font-weight:700;margin-top:6px;">Công trình phe Địch</div>'}
        ${extraHtml}
      `;
      return;
    }

    // 2. Squad or Single Villager Inspector
    const units = this.getSelectedUnits();
    if (units.length > 1) {
      panelEl.style.display = 'block';
      el.innerHTML = `
        <div style="font-family:'Cinzel',serif;font-weight:800;color:#4ade80;font-size:15px;">ĐỘI HÌNH ĐÃ CHỌN (${units.length})</div>
        <div style="font-size:11px;color:#cbd5e1;margin:4px 0;">Click phải trên bản đồ để ra lệnh cho cả nhóm hoặc lưu nhanh bằng [Shift+7] / [Shift+9].</div>
        <div class="insp-actions">
          <button class="insp-btn" data-action="save_group" data-param="7">Lưu Đội [7]</button>
          <button class="insp-btn" data-action="save_group" data-param="9">Lưu Đội [9]</button>
          <button class="insp-btn" data-action="mode_javelin">Phi lao</button>
          <button class="insp-btn" data-action="mode_bow">Bắn cung</button>
          <button class="insp-btn" data-action="stealth">Ẩn thân [F]</button>
          <button class="insp-btn" data-action="train">Tập Gym/PIA</button>
        </div>
      `;
      return;
    }

    const selected = units[0];
    if (!selected) {
      panelEl.style.display = 'none';
      return;
    }

    const portraitSrc = selected.isChild
      ? './assets/images/sprites_hd/icon_portrait_child.png'
      : selected.isChief
        ? './assets/images/portrait_chief.jpg'
        : selected.isWarrior
          ? './assets/images/sprites_hd/icon_portrait_warrior.png'
          : selected.gender === 'female'
            ? './assets/images/sprites_hd/icon_portrait_female.png'
            : './assets/images/portrait_mumbo.jpg';

    const wStats = selected.getWarriorStats();
    const starsBadge = selected.isWarrior && wStats
      ? `<div class="warrior-badge">${'★'.repeat(selected.warriorStars)}${'☆'.repeat(3 - selected.warriorStars)} ${wStats.label}</div>`
      : '';

    const trainProg = Math.floor(selected.getTrainingProgress());
    const statusBadges = [
      selected.isProtected ? '<span style="color:#38bdf8;">[KHIÊN -50%]</span>' : '',
      selected.isInfected ? '<span style="color:#84cc16;">[DỊCH BỆNH]</span>' : '',
      selected.hasChiefAura && !selected.isChief ? '<span style="color:#fde047;">(+Chief Aura)</span>' : ''
    ].filter(Boolean).join(' ');

    panelEl.style.display = 'block';
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
        <img src="${portraitSrc}" style="width:48px;height:48px;object-fit:cover;border-radius:50%;border:2px solid #f59e0b;background:#3f2818;" alt="${selected.name}" />
        <div>
          <div style="font-weight:bold;color:#fde047;font-size:14px;">${selected.name} (${selected.age}t)</div>
          <div style="font-size:11px;color:#cbd5e1;">${selected.isChief ? 'Tù Trưởng Avnotaklu' : (selected.role || (selected.isChild ? 'Trẻ em' : 'Thành viên bộ lạc'))}</div>
          ${starsBadge}
        </div>
      </div>
      <div>${statusBadges}</div>
      <div>HP: <span style="color:#22c55e;">${Math.floor(selected.health)} / ${selected.maxHealth}</span> | Vũ khí: <b style="color:#fde047;">${WEAPON_DEFS[selected.weapon]?.name || 'Tay không'}</b></div>
      <div>Đói: <span style="color:${selected.hunger > 60 ? '#ef4444' : '#facc15'};">${Math.floor(selected.hunger)}%</span> | Mệt: <span style="color:${selected.tiredness > 60 ? '#ef4444' : '#38bdf8'};">${Math.floor(selected.tiredness)}%</span> | Vui: <span style="color:#4ade80;">${Math.floor(selected.happiness)}%</span></div>
      <div class="skill-row">Wood ${selected.skills.woodcutting} | Mine ${selected.skills.mining} | Craft ${selected.skills.crafting} | Cook ${selected.skills.cooking} | Scout ${selected.skills.scouting}</div>
      ${selected.isWarrior && wStats ? `
        <div class="warrior-stat-box">
          <div><b>Sát thương:</b> ${selected.getCombatDamage(false)} dmg (Crit ×${wStats.ambushMult}) • Tầm: ${selected.getAttackRange().toFixed(1)} ô</div>
          <div><b>Đào tạo (${selected.warriorStars}/3★):</b> ${selected.warriorStars >= 3 ? 'Tối đa 3 sao' : `${trainProg}% tới ${selected.warriorStars + 1}★`}</div>
        </div>
      ` : ''}
      <div style="margin-top:4px;">Hành động: <b style="color:#22c55e;">${selected.state.toUpperCase()}</b> | Túi: ${selected.cargo.amount}/${selected.cargo.max}</div>
      <div class="insp-actions">
        ${(selected.isWarrior || selected.role === 'pia_scout') ? `
          <button class="insp-btn ${selected.warriorMode === 'javelin' ? 'active' : ''}" data-action="mode_javelin">Phi lao</button>
          <button class="insp-btn ${selected.warriorMode === 'bow' ? 'active' : ''}" data-action="mode_bow">Bắn cung</button>
          <button class="insp-btn ${selected.isStealthed ? 'active' : ''}" data-action="stealth">Ẩn thân [F]</button>
        ` : ''}
        ${!selected.isChild && !selected.isChief && selected.warriorStars < 3 ? '<button class="insp-btn" data-action="train">Tập Luyện ★</button>' : ''}
        <button class="insp-btn" data-action="save_group" data-param="7">+Đội [7]</button>
        <button class="insp-btn" data-action="save_group" data-param="9">+Đội [9]</button>
        <button class="insp-btn" data-action="face_cycle">Xoay góc</button>
        <button class="insp-btn" data-action="eat">Ăn</button>
        <button class="insp-btn" data-action="sleep">Ngủ</button>
        <button class="insp-btn" data-action="relax">Nhảy</button>
        <button class="insp-btn" data-action="pray">Cầu nguyện</button>
        ${!selected.isChild ? '<button class="insp-btn" data-action="fish">Câu cá</button>' : ''}
        ${!selected.isChild ? '<button class="insp-btn" data-action="breed">Sinh con</button>' : ''}
        ${selected.isChief ? '<button class="insp-btn" data-action="command">Hiệu triệu</button>' : ''}
      </div>
    `;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new PrehistoricTribesApp();
});
