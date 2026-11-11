import { BinaryMapLoader } from './loaders/BinaryMapLoader.js';
import { AssetManager } from './loaders/AssetManager.js';
import { Camera } from './core/Camera.js';
import { IsometricMath } from './core/IsometricMath.js';
import { TilemapRenderer } from './renderer/TilemapRenderer.js';
import { SpriteRenderer } from './renderer/SpriteRenderer.js';
import { BuildingRenderer } from './renderer/BuildingRenderer.js';
import { WildlifeRenderer } from './renderer/WildlifeRenderer.js';
import { ParticleSystem } from './renderer/ParticleSystem.js';
import { DayNightCycle } from './core/DayNightCycle.js';
import { Villager } from './simulation/Villager.js';
import { Building, BUILDING_DEFS } from './simulation/Building.js';
import { Animal } from './simulation/Animal.js';
import { ResourceNode } from './simulation/ResourceNode.js';
import { pickUniqueTribeName } from './simulation/NameDatabase.js';

class PrehistoricTribesApp {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.camera = new Camera(window.innerWidth, window.innerHeight);

    this.assets = new AssetManager();
    this.map = null;
    this.tileRenderer = null;
    this.spriteRenderer = null;
    this.buildingRenderer = null;
    this.wildlifeRenderer = null;
    this.particles = new ParticleSystem();
    this.dayNight = new DayNightCycle(180);
    this.uiRefreshTimer = 0;
    this.breedCheckTimer = 0;

    this.villagers = [];
    this.buildings = [];
    this.animals = [];
    this.resourceNodes = [];
    this.projectiles = [];
    this.terrainYield = new Map();
    this.selectedVillagerId = null;

    this.activePlacementType = null;
    this.callToArms = false;

    this.dialogues = [];
    this.currentDialogueIndex = 0;

    this.hoveredTile = null;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };

    this.lastTime = 0;
    this.nextUnitId = 200;

    this.resources = {
      food: 120,
      wood: 80,
      stone: 50,
      bones: 20,
      population: 5,
      maxLivingSpace: 10
    };

    this.audioCtx = null;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    this.setupInputs();
    this.setupUI();
    this.initGame();
  }

  playBeep(freq = 440, type = 'sine', duration = 0.1) {
    try {
      if (!this.audioCtx) {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.camera.viewportWidth = window.innerWidth;
    this.camera.viewportHeight = window.innerHeight;
  }

  async initGame() {
    try {
      const [mapData] = await Promise.all([
        BinaryMapLoader.loadMap('./assets/maps/00_outside.bin', 0),
        this.assets.loadAll()
      ]);
      this.map = mapData;

      // Clear terrain trees inside starting meadow, Training Ground & lagoon
      for (let cy = 4; cy <= 18; cy++) {
        for (let cx = 3; cx <= 19; cx++) {
          const inCamp = cx >= 8 && cy >= 8;
          const inLagoon = cx <= 9 && cy <= 10;
          if ((inCamp || inLagoon) && this.map.tiles[cy] && this.map.tiles[cy][cx] >= 170) {
            this.map.tiles[cy][cx] = 0;
            this.map.collision[cy][cx] = 0;
          }
        }
      }

      try {
        const resp = await fetch('./assets/data/campaign_en.json');
        this.dialogues = await resp.json();
      } catch (e) {
        this.dialogues = [];
      }

      this.tileRenderer = new TilemapRenderer(this.map, this.assets);
      this.spriteRenderer = new SpriteRenderer(this.assets);
      this.buildingRenderer = new BuildingRenderer(this.assets);
      this.wildlifeRenderer = new WildlifeRenderer(this.assets);

      // Starter Buildings: Chief's Hut, Store, Starter Hut & Warrior Training Ground
      const chiefsHut = new Building(1, 'chiefs_hut', 10, 10, true);
      const startStore = new Building(2, 'store', 14, 9, true);
      const startHut = new Building(3, 'hut', 9, 14, true);
      const startTraining = new Building(4, 'gym', 15, 14, true);
      this.buildings.push(chiefsHut, startStore, startHut, startTraining);

      // Starter Avnotaklu Tribe + Toddler Child + Frontier Cannibal Scouts
      const chief = new Villager(1, 'Chief', 'male', 14, 12, true);
      const mumbo = new Villager(2, 'Mumbo', 'male', 15, 13, false);
      const kazza = new Villager(3, 'Kazza', 'female', 13, 14, false);
      const ooga = new Villager(4, 'Ooga', 'female', 16, 11, false);
      const bunki = new Villager(5, 'Bunki', 'female', 11.5, 14.5, false, false, true);
      bunki.growthProgress = 35;

      const raider1 = new Villager(101, 'Cannibal Scout', 'male', 30, 22, false, true);
      const raider2 = new Villager(102, 'Cannibal Warrior', 'male', 33, 25, false, true);

      this.villagers = [chief, mumbo, kazza, ooga, bunki, raider1, raider2];
      this.selectedVillagerId = chief.id;

      // Prehistoric Wildlife & Dinosaurs
      this.animals = [
        new Animal(1, 'mammoth', 24, 18),
        new Animal(2, 'mammoth', 29, 23),
        new Animal(3, 'boar', 17, 7),
        new Animal(4, 'boar', 21, 11),
        new Animal(5, 'boar', 19, 14),
        new Animal(6, 'boar', 25, 9),
        new Animal(7, 'tiger', 27, 21),
        new Animal(8, 'tiger', 32, 14),
        new Animal(9, 'triceratops', 10, 22),
        new Animal(10, 'brontosaurus', 30, 8)
      ];

      // Fruit & Berry Bushes
      this.resourceNodes = [
        new ResourceNode(1, 'berry_bush', 12, 16, 40),
        new ResourceNode(2, 'berry_bush', 13, 19, 40),
        new ResourceNode(3, 'berry_bush', 18, 16, 45),
        new ResourceNode(4, 'berry_bush', 20, 10, 40),
        new ResourceNode(5, 'berry_bush', 22, 15, 45),
        new ResourceNode(6, 'berry_bush', 15, 20, 40)
      ];
      for (const n of this.resourceNodes) {
        this.tileRenderer.clearTile(Math.floor(n.x), Math.floor(n.y));
      }

      const chiefWorld = IsometricMath.tileToWorld(chief.x, chief.y);
      this.camera.setPosition(chiefWorld.x, chiefWorld.y);

      this.lastTime = performance.now();
      requestAnimationFrame((t) => this.loop(t));

      this.updateHUD();
      this.updateDialogue();
      this.updateInspector();
    } catch (e) {
      console.error('Failed to initialize game:', e);
    }
  }

  setupUI() {
    const buildBtns = document.querySelectorAll('.btn-build');
    buildBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-building');
        if (this.activePlacementType === type) {
          this.activePlacementType = null;
          btn.classList.remove('active');
        } else {
          buildBtns.forEach((b) => b.classList.remove('active'));
          this.activePlacementType = type;
          btn.classList.add('active');
          this.playBeep(520, 'triangle', 0.08);
        }
      });
    });

    const nextBtn = document.getElementById('btn-next-dialogue');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentDialogueIndex++;
        if (this.currentDialogueIndex >= this.dialogues.length) {
          this.currentDialogueIndex = 0;
        }
        this.updateDialogue();
        this.playBeep(680, 'sine', 0.06);
      });
    }

    const armsBtn = document.getElementById('btn-call-to-arms');
    if (armsBtn) {
      armsBtn.addEventListener('click', () => this.toggleCallToArms());
    }

    // Delegated Inspector Action Buttons (Survives innerHTML refreshes)
    const inspectorEl = document.getElementById('inspector-panel');
    if (inspectorEl) {
      inspectorEl.addEventListener('click', (e) => {
        const btn = e.target.closest('.insp-btn');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        const v = this.villagers.find((u) => u.id === this.selectedVillagerId);
        if (!v || v.isEnemy) return;

        if (action === 'eat') this.sendVillagerToEat(v);
        else if (action === 'sleep') this.sendVillagerToSleep(v);
        else if (action === 'relax') this.sendVillagerToRelax(v);
        else if (action === 'breed') this.tryStartBreeding(true);
        else if (action === 'fish') this.sendVillagerToFish(v);
        else if (action === 'pray') this.sendVillagerToPray(v);
        else if (action === 'craft') this.sendVillagerToCraft(v);
        else if (action === 'train') this.sendVillagerToTrain(v);
        else if (action === 'mode_javelin' && v.isWarrior) {
          v.warriorMode = 'javelin';
          this.playBeep(480, 'triangle', 0.08);
          this.updateInspector();
        } else if (action === 'mode_bow' && v.isWarrior) {
          v.warriorMode = 'bow';
          this.playBeep(620, 'triangle', 0.08);
          this.updateInspector();
        } else if (action === 'stealth' && v.isWarrior) {
          this.toggleWarriorStealth(v);
          this.updateInspector();
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
          this.playBeep(520, 'sine', 0.05);
          this.updateInspector();
        } else if (action === 'command' && v.isChief) {
          v.isMoving = false;
          v.commandTimer = 1.2;
          const cw = IsometricMath.tileToWorld(v.x, v.y);
          const cs = this.camera.worldToScreen(cw.x, cw.y);
          this.particles.spawnFloatingText(cs.x, cs.y - 34 * this.camera.zoom, 'For the Tribe!', '#fde047', this.camera.zoom);
          this.playBeep(620, 'triangle', 0.14);
        }
      });
    }
  }

  updateDialogue() {
    const textEl = document.getElementById('dialogue-text');
    const speakerEl = document.getElementById('dialogue-speaker');
    const avatarImg = document.getElementById('avatar-img');
    if (!textEl || !speakerEl || this.dialogues.length === 0) return;

    let text = this.dialogues[this.currentDialogueIndex] || '';
    if (!text) {
      this.currentDialogueIndex++;
      text = this.dialogues[this.currentDialogueIndex] || '';
    }

    const isChief = (this.currentDialogueIndex % 2 !== 0);
    if (isChief) {
      speakerEl.innerText = 'Chief';
      if (avatarImg) avatarImg.src = './assets/images/sprites_hd/icon_pop_chief.png';
    } else {
      speakerEl.innerText = 'Mumbo';
      if (avatarImg) avatarImg.src = './assets/images/sprites_hd/icon_portrait_mumbo.png';
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
        const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
        this.hoveredTile = IsometricMath.worldToTile(worldPos.x, worldPos.y);
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
        const tile = IsometricMath.worldToTile(worldPos.x, worldPos.y);

        if (this.activePlacementType) {
          this.tryPlaceBuilding(this.activePlacementType, tile.x, tile.y);
          return;
        }

        let clickedVillager = null;
        for (const v of this.villagers) {
          if (v.isEnemy) continue;
          const dist = Math.hypot(v.x - (tile.x + 0.5), v.y - (tile.y + 0.5));
          if (dist < 1.3) {
            clickedVillager = v;
            break;
          }
        }

        if (clickedVillager) {
          this.selectedVillagerId = clickedVillager.id;
          this.playBeep(480, 'sine', 0.08);
        }
        this.updateInspector();
      } else if (e.button === 1) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX, y: e.clientY };
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Right Click: Smart RTS Context Actions
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const worldPos = this.camera.screenToWorld(e.clientX, e.clientY);
      const targetTile = IsometricMath.worldToTile(worldPos.x, worldPos.y);

      if (this.activePlacementType) {
        this.activePlacementType = null;
        document.querySelectorAll('.btn-build').forEach((b) => b.classList.remove('active'));
        return;
      }

      if (this.selectedVillagerId === null) return;
      const selected = this.villagers.find((v) => v.id === this.selectedVillagerId && !v.isEnemy);
      if (!selected) return;

      // Clear previous non-carried targets cleanly
      const clearTaskTargets = () => {
        selected.targetEnemy = null;
        selected.targetAnimal = null;
        selected.targetResource = null;
        selected.targetBuilding = null;
        selected.targetPartner = null;
      };

      const rejectChildWork = () => {
        const cWorld = IsometricMath.tileToWorld(selected.x, selected.y);
        const cScreen = this.camera.worldToScreen(cWorld.x, cWorld.y);
        this.particles.spawnFloatingText(cScreen.x, cScreen.y - 24 * this.camera.zoom, "I'm still a kid!", '#7dd3fc', this.camera.zoom);
        this.playBeep(580, 'sine', 0.08);
      };

      const triggerChiefCommand = () => {
        const chiefUnit = this.villagers.find((u) => u.isChief && !u.isEnemy);
        if (chiefUnit && !chiefUnit.isMoving) {
          chiefUnit.faceTowards(targetTile.x + 0.5, targetTile.y + 0.5);
          chiefUnit.commandTimer = 0.9;
        }
      };

      // 0. Enemy Cannibal -> Fight
      const targetEnemy = this.villagers.find((u) => u.isEnemy && u.health > 0 && Math.hypot(u.x - (targetTile.x + 0.5), u.y - (targetTile.y + 0.5)) < 1.5);
      if (targetEnemy) {
        if (selected.isChild) { rejectChildWork(); return; }
        clearTaskTargets();
        triggerChiefCommand();
        selected.targetEnemy = targetEnemy;
        selected.state = 'fighting';
        selected.moveTo(targetEnemy.x, targetEnemy.y);
        this.playBeep(280, 'sawtooth', 0.1);
        return;
      }

      // 1. Animal -> Hunt / Butcher
      const targetAnimal = this.animals.find((a) => Math.hypot(a.x - (targetTile.x + 0.5), a.y - (targetTile.y + 0.5)) < 1.6);
      if (targetAnimal) {
        if (selected.isChild) { rejectChildWork(); return; }
        clearTaskTargets();
        triggerChiefCommand();
        selected.targetAnimal = targetAnimal;
        selected.lastWorkTarget = targetAnimal;
        selected.state = 'hunting';
        selected.moveTo(targetAnimal.x, targetAnimal.y);
        this.playBeep(300, 'sawtooth', 0.1);
        return;
      }

      // 2. Berry Bush -> Forage
      const targetBush = this.resourceNodes.find((n) => Math.hypot(n.x - (targetTile.x + 0.5), n.y - (targetTile.y + 0.5)) < 1.3 && !n.isDepleted);
      if (targetBush) {
        clearTaskTargets();
        triggerChiefCommand();
        selected.targetResource = targetBush;
        selected.lastWorkTarget = targetBush;
        selected.lastWorkState = 'foraging';
        selected.state = 'foraging';
        selected.moveTo(targetBush.x, targetBush.y);
        this.playBeep(520, 'sine', 0.08);
        return;
      }

      // 3. Building -> Build (incomplete) OR Life Action (Kitchen -> Eat, Hut/Nursery -> Sleep, Disco -> Dance)
      const targetBuilding = this.buildings.find(
        (b) => targetTile.x >= b.x && targetTile.x < b.x + b.width && targetTile.y >= b.y && targetTile.y < b.y + b.height
      );
      if (targetBuilding) {
        if (!targetBuilding.isCompleted) {
          if (selected.isChild) { rejectChildWork(); return; }
          clearTaskTargets();
          triggerChiefCommand();
          selected.targetBuilding = targetBuilding;
          selected.lastWorkTarget = targetBuilding;
          selected.state = 'building';
          selected.moveTo(targetBuilding.x + targetBuilding.width / 2, targetBuilding.y + targetBuilding.height / 2);
          this.playBeep(400, 'square', 0.08);
          return;
        } else {
          if (targetBuilding.type === 'kitchen') {
            this.sendVillagerToEat(selected, targetBuilding);
            return;
          } else if (targetBuilding.type === 'hut' || targetBuilding.type === 'chiefs_hut') {
            this.sendVillagerToSleep(selected, targetBuilding);
            return;
          } else if (targetBuilding.type === 'nursery') {
            if (selected.gender === 'female' && !selected.isChild) {
              triggerChiefCommand();
              this.sendVillagerToTend(selected, targetBuilding);
            } else {
              this.sendVillagerToSleep(selected, targetBuilding);
            }
            return;
          } else if (targetBuilding.type === 'disco') {
            this.sendVillagerToRelax(selected, targetBuilding);
            return;
          } else if (targetBuilding.type === 'sanctuary' || targetBuilding.type === 'pia_center') {
            triggerChiefCommand();
            this.sendVillagerToPray(selected, targetBuilding);
            return;
          } else if (targetBuilding.type === 'armoury') {
            if (selected.isChild) { rejectChildWork(); return; }
            triggerChiefCommand();
            this.sendVillagerToCraft(selected, targetBuilding);
            return;
          } else if (targetBuilding.type === 'gym' || targetBuilding.type === 'range') {
            if (selected.isChild || selected.isChief) {
              const cw = IsometricMath.tileToWorld(selected.x, selected.y);
              const cs = this.camera.worldToScreen(cw.x, cw.y);
              this.particles.spawnFloatingText(cs.x, cs.y - 24 * this.camera.zoom, selected.isChild ? "I'm still a kid!" : 'Chief already commands!', '#fde047', this.camera.zoom);
              return;
            }
            triggerChiefCommand();
            this.sendVillagerToTrain(selected, targetBuilding);
            return;
          }
        }
      }

      // 3.5 Right-clicked Pond / Fishing Pier -> Fish!
      if (this.tileRenderer && this.tileRenderer.isNearFishingLandmark(targetTile.x + 0.5, targetTile.y + 0.5)) {
        if (selected.isChild) { rejectChildWork(); return; }
        clearTaskTargets();
        triggerChiefCommand();
        this.sendVillagerToFish(selected);
        return;
      }

      // 4. Terrain Tree (chop) / Boulder (mine)
      if (this.map && targetTile.y >= 0 && targetTile.y < this.map.height && targetTile.x >= 0 && targetTile.x < this.map.width) {
        const tileVal = this.map.tiles[targetTile.y][targetTile.x];
        if (tileVal >= 170) {
          if (selected.isChild) { rejectChildWork(); return; }
          clearTaskTargets();
          triggerChiefCommand();
          const isWood = tileVal >= 175;
          const resType = isWood ? 'wood' : 'stone';
          const rx = targetTile.x + 0.5;
          const ry = targetTile.y + 0.5;
          const workState = isWood ? 'chopping' : 'mining';
          selected.targetResource = { x: rx, y: ry, type: resType };
          selected.lastWorkTarget = selected.targetResource;
          selected.lastWorkState = workState;
          selected.state = workState;
          selected.moveTo(rx, ry);
          this.playBeep(320, 'square', 0.08);
          return;
        }
      }

      // 5. Default: Walk
      clearTaskTargets();
      selected.lastWorkTarget = null;
      selected.state = 'walking';
      selected.moveTo(targetTile.x + 0.5, targetTile.y + 0.5);
      this.playBeep(360, 'sine', 0.05);
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.25 : -0.25;
      this.camera.zoomAt(delta, { x: e.clientX, y: e.clientY });
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        const chief = this.villagers.find((v) => v.isChief);
        if (chief) {
          const worldPos = IsometricMath.tileToWorld(chief.x, chief.y);
          this.camera.setPosition(worldPos.x, worldPos.y);
        }
      } else if (e.key === 'c' || e.key === 'C') {
        this.toggleCallToArms();
      } else if (e.key === 'f' || e.key === 'F') {
        const selected = this.villagers.find((v) => v.id === this.selectedVillagerId);
        if (selected && selected.isWarrior) {
          this.toggleWarriorStealth(selected);
          this.updateInspector();
        }
      } else if (e.key === 'w' || e.key === 'ArrowUp') {
        this.camera.pan(0, -30);
      } else if (e.key === 's' || e.key === 'ArrowDown') {
        this.camera.pan(0, 30);
      } else if (e.key === 'a' || e.key === 'ArrowLeft') {
        this.camera.pan(-30, 0);
      } else if (e.key === 'd' || e.key === 'ArrowRight') {
        this.camera.pan(30, 0);
      } else if (e.key === 'Escape') {
        this.activePlacementType = null;
        document.querySelectorAll('.btn-build').forEach((b) => b.classList.remove('active'));
      }
    });
  }

  toggleCallToArms() {
    this.callToArms = !this.callToArms;
    const btn = document.getElementById('btn-call-to-arms');
    if (btn) btn.classList.toggle('active', this.callToArms);

    const chief = this.villagers.find((v) => v.isChief);
    if (this.callToArms) {
      if (chief) {
        chief.isMoving = false;
        chief.state = 'rallying';
        chief.rallyTimer = 1.8;
        const cw = IsometricMath.tileToWorld(chief.x, chief.y);
        const cs = this.camera.worldToScreen(cw.x, cw.y);
        this.particles.spawnFloatingText(cs.x, cs.y - 36 * this.camera.zoom, 'Call to Arms!', '#ef4444', this.camera.zoom);
      }
      this.playBeep(392, 'sawtooth', 0.14);
      setTimeout(() => this.playBeep(523, 'sawtooth', 0.22), 120);

      const enemies = this.villagers.filter((u) => u.isEnemy && u.health > 0);
      for (const v of this.villagers) {
        if (v.isEnemy || v.isChild || v.isChief) continue;
        v.state = 'fighting';
        if (enemies.length > 0) {
          v.targetEnemy = enemies[0];
          v.moveTo(enemies[0].x, enemies[0].y);
        } else if (chief) {
          v.targetEnemy = null;
          v.moveTo(chief.x + (-1.5 + Math.random() * 3), chief.y + (-1.5 + Math.random() * 3));
        }
      }
    } else {
      for (const v of this.villagers) {
        if (!v.isEnemy && !v.isChild && (v.state === 'fighting' || v.state === 'rallying')) {
          v.state = 'idle';
          v.targetEnemy = null;
        }
      }
      this.playBeep(330, 'sine', 0.12);
    }
  }

  sendVillagerToEat(v, specificBuilding = null) {
    if (this.resources.food < 3) return;
    const spot = specificBuilding || this.findCompletedBuilding('kitchen') || this.findCompletedBuilding('chiefs_hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'eating';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.3);
    this.playBeep(540, 'sine', 0.08);
  }

  sendVillagerToSleep(v, specificBuilding = null) {
    const spot =
      specificBuilding ||
      (v.isChild ? this.findCompletedBuilding('nursery') : null) ||
      this.findCompletedBuilding('hut') ||
      this.findCompletedBuilding('chiefs_hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'sleeping';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.35);
    this.playBeep(440, 'sine', 0.08);
  }

  sendVillagerToRelax(v, specificBuilding = null) {
    const spot = specificBuilding || this.findCompletedBuilding('disco') || this.findCompletedBuilding('chiefs_hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'relaxing';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.35);
    this.playBeep(660, 'triangle', 0.1);
  }

  sendVillagerToFish(v) {
    const spot = this.tileRenderer ? this.tileRenderer.getFishingSpot() : null;
    if (!spot) return;
    v.state = 'fishing';
    v.workTimer = 0;
    v.lastWorkTarget = { x: spot.x, y: spot.y, type: 'food', isFishing: true };
    v.lastWorkState = 'fishing';
    v.moveTo(spot.x, spot.y);
    this.playBeep(490, 'sine', 0.08);
  }

  sendVillagerToPray(v, specificBuilding = null) {
    const spot = specificBuilding || this.findCompletedBuilding('sanctuary') || this.findCompletedBuilding('pia_center') || this.findCompletedBuilding('chiefs_hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'praying';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.3);
    this.playBeep(587, 'sine', 0.12);
  }

  sendVillagerToCraft(v, specificBuilding = null) {
    if (v.isChild) return;
    const spot = specificBuilding || this.findCompletedBuilding('armoury') || this.findCompletedBuilding('store') || this.findCompletedBuilding('chiefs_hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'crafting';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.3);
    this.playBeep(390, 'square', 0.09);
  }

  sendVillagerToTend(v, specificBuilding = null) {
    const spot = specificBuilding || this.findCompletedBuilding('nursery') || this.findCompletedBuilding('hut');
    if (!spot) return;
    v.targetBuilding = spot;
    v.state = 'tending';
    v.workTimer = 0;
    v.moveTo(spot.x + spot.width / 2, spot.y + spot.height + 0.3);
    this.playBeep(660, 'sine', 0.09);
  }

  sendVillagerToTrain(v, specificBuilding = null) {
    if (v.isChild || v.isChief || v.isEnemy) return;
    const spot = specificBuilding || this.findCompletedBuilding('gym') || this.findCompletedBuilding('range');
    if (!spot) {
      const vw = IsometricMath.tileToWorld(v.x, v.y);
      const vs = this.camera.worldToScreen(vw.x, vw.y);
      this.particles.spawnFloatingText(vs.x, vs.y - 26 * this.camera.zoom, 'Build Training Ground!', '#ef4444', this.camera.zoom);
      this.playBeep(220, 'sawtooth', 0.14);
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
    this.playBeep(460, 'triangle', 0.1);
  }

  toggleWarriorStealth(v) {
    if (!v || !v.isWarrior) return;
    const vw = IsometricMath.tileToWorld(v.x, v.y);
    const vs = this.camera.worldToScreen(vw.x, vw.y);
    if (!v.isStealthed && v.stealthCooldown > 0) {
      this.particles.spawnFloatingText(vs.x, vs.y - 26 * this.camera.zoom, `Stealth CD ${v.stealthCooldown.toFixed(1)}s`, '#f59e0b', this.camera.zoom);
      this.playBeep(240, 'sine', 0.08);
      return;
    }
    v.isStealthed = !v.isStealthed;
    this.particles.spawnFoliageBurst(vs.x, vs.y - 10 * this.camera.zoom, this.camera.zoom);
    this.particles.spawnFloatingText(
      vs.x,
      vs.y - 28 * this.camera.zoom,
      v.isStealthed ? 'Bush Stealth ON!' : 'Stealth OFF',
      v.isStealthed ? '#4ade80' : '#cbd5e1',
      this.camera.zoom
    );
    this.playBeep(v.isStealthed ? 380 : 500, 'sine', 0.1);
  }

  spawnProjectile(attacker, targetEntity, targetType, damage, isAmbush) {
    this.projectiles.push({
      startX: attacker.x,
      startY: attacker.y,
      endX: targetEntity.x,
      endY: targetEntity.y,
      targetEntity,
      targetType,
      attacker,
      type: attacker.warriorMode === 'bow' ? 'bow' : 'javelin',
      damage,
      isAmbush,
      progress: 0,
      speed: attacker.warriorMode === 'bow' ? 4.0 : 3.0,
      arcHeight: attacker.warriorMode === 'bow' ? 14 : 20
    });
  }

  applyCombatHit(attacker, targetEntity, targetType, dmg, isAmbush) {
    if (targetType === 'enemy') {
      const enemy = targetEntity;
      if (!enemy || enemy.health <= 0) return;
      enemy.health = Math.max(0, enemy.health - dmg);
      enemy.hurtTimer = 0.45;
      enemy.faceTowards(attacker.x, attacker.y);
      enemy.state = 'fighting';
      this.awardSkill(attacker, 'combat', 12);
      this.playBeep(isAmbush ? 340 : 240, 'sawtooth', 0.1);

      const eWorld = IsometricMath.tileToWorld(enemy.x, enemy.y);
      const eScreen = this.camera.worldToScreen(eWorld.x, eWorld.y);
      if (isAmbush) {
        this.particles.spawnFoliageBurst(eScreen.x, eScreen.y - 12 * this.camera.zoom, this.camera.zoom);
        this.particles.spawnFloatingText(eScreen.x, eScreen.y - 28 * this.camera.zoom, `AMBUSH -${dmg} HP!`, '#4ade80', this.camera.zoom);
      } else {
        this.particles.spawnStoneSparks(eScreen.x, eScreen.y - 12 * this.camera.zoom, this.camera.zoom);
        this.particles.spawnFloatingText(eScreen.x, eScreen.y - 24 * this.camera.zoom, `-${dmg} HP`, '#ef4444', this.camera.zoom);
      }

      if (enemy.health <= 0) {
        this.resources.bones += 15;
        this.particles.spawnFloatingText(eScreen.x, eScreen.y - 38 * this.camera.zoom, `+15 Bones Victory!`, '#fde047', this.camera.zoom);
        enemy.hurtTimer = 0;
        enemy.isMoving = false;
        enemy.state = 'defeated';
        enemy.defeatTimer = 2.8;
        attacker.targetEnemy = null;
        attacker.cheerTimer = 1.6;
        if (!this.callToArms) attacker.state = 'idle';
        this.updateHUD();
        this.playBeep(760, 'triangle', 0.25);
      }
    } else if (targetType === 'animal') {
      const animal = targetEntity;
      if (!animal || animal.isDead) return;
      animal.takeDamage(dmg, attacker.x, attacker.y);
      if (animal.isDead) {
        attacker.cheerTimer = 1.6;
      }
      this.awardSkill(attacker, 'hunting', 10);
      this.playBeep(isAmbush ? 340 : 260, 'square', 0.1);

      const aWorld = IsometricMath.tileToWorld(animal.x, animal.y);
      const aScreen = this.camera.worldToScreen(aWorld.x, aWorld.y);
      if (isAmbush) {
        this.particles.spawnFoliageBurst(aScreen.x, aScreen.y - 10 * this.camera.zoom, this.camera.zoom);
        this.particles.spawnFloatingText(aScreen.x, aScreen.y - 24 * this.camera.zoom, `AMBUSH -${dmg} HP!`, '#4ade80', this.camera.zoom);
      } else {
        this.particles.spawnStoneSparks(aScreen.x, aScreen.y - 10 * this.camera.zoom, this.camera.zoom);
        this.particles.spawnFloatingText(aScreen.x, aScreen.y - 20 * this.camera.zoom, `-${dmg} HP`, '#ef4444', this.camera.zoom);
      }
    }
  }

  tryStartBreeding(manual = false) {
    const friendly = this.villagers.filter((u) => !u.isEnemy);
    if (friendly.length >= this.resources.maxLivingSpace) {
      if (manual) {
        const v = friendly.find((u) => u.id === this.selectedVillagerId);
        if (v) {
          const w = IsometricMath.tileToWorld(v.x, v.y);
          const s = this.camera.worldToScreen(w.x, w.y);
          this.particles.spawnFloatingText(s.x, s.y - 26 * this.camera.zoom, 'Need more Huts!', '#ef4444', this.camera.zoom);
        }
      }
      return false;
    }

    const hut = this.findCompletedBuilding('hut');
    if (!hut) return false;

    const alreadyBreeding = friendly.some((u) => u.state === 'breeding');
    if (alreadyBreeding) return false;

    const eligible = (u, g) =>
      !u.isChild &&
      !u.isChief &&
      u.gender === g &&
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

    const hw = IsometricMath.tileToWorld(hx, hy);
    const hs = this.camera.worldToScreen(hw.x, hw.y);
    this.particles.spawnFloatingText(hs.x, hs.y - 32 * this.camera.zoom, 'Tent-time!', '#f472b6', this.camera.zoom);
    this.playBeep(700, 'sine', 0.14);
    return true;
  }

  spawnNewbornChild(x, y) {
    const gender = Math.random() < 0.5 ? 'male' : 'female';
    const name = pickUniqueTribeName(gender, this.villagers);
    const child = new Villager(this.nextUnitId++, name, gender, x, y + 0.4, false, false, true);
    this.villagers.push(child);
    this.updateHUD();

    const w = IsometricMath.tileToWorld(child.x, child.y);
    const s = this.camera.worldToScreen(w.x, w.y);
    this.particles.spawnFloatingText(s.x, s.y - 30 * this.camera.zoom, `Baby Born: ${name}!`, '#f472b6', this.camera.zoom);
    this.playBeep(880, 'triangle', 0.22);
  }

  tryPlaceBuilding(type, tx, ty) {
    const def = BUILDING_DEFS[type];
    if (!def) return;

    if (this.resources.wood < def.costWood || this.resources.stone < def.costStone) {
      this.playBeep(200, 'sawtooth', 0.2);
      const bWorld = IsometricMath.tileToWorld(tx + def.width / 2, ty + def.height / 2);
      const bScreen = this.camera.worldToScreen(bWorld.x, bWorld.y);
      this.particles.spawnFloatingText(bScreen.x, bScreen.y - 20, 'Not enough resources!', '#ef4444', this.camera.zoom);
      return;
    }

    if (!this.map || tx < 1 || ty < 1 || tx + def.width >= this.map.width - 1 || ty + def.height >= this.map.height - 1) {
      this.playBeep(200, 'sawtooth', 0.2);
      return;
    }

    for (const b of this.buildings) {
      if (tx < b.x + b.width && tx + def.width > b.x && ty < b.y + b.height && ty + def.height > b.y) {
        this.playBeep(200, 'sawtooth', 0.2);
        return;
      }
    }

    this.resources.wood -= def.costWood;
    this.resources.stone -= def.costStone;
    this.updateHUD();

    const newBuilding = new Building(Date.now(), type, tx, ty, false);
    this.buildings.push(newBuilding);
    if (this.tileRenderer) {
      for (let gy = 0; gy < def.height; gy++) {
        for (let gx = 0; gx < def.width; gx++) {
          this.tileRenderer.clearTile(tx + gx, ty + gy);
        }
      }
    }
    this.playBeep(600, 'sine', 0.15);

    const bWorld = IsometricMath.tileToWorld(tx + def.width / 2, ty + def.height / 2);
    const bScreen = this.camera.worldToScreen(bWorld.x, bWorld.y);
    this.particles.spawnFloatingText(bScreen.x, bScreen.y - 20, `Placed ${def.name}!`, '#22c55e', this.camera.zoom);

    const selected = this.villagers.find((v) => v.id === this.selectedVillagerId && !v.isEnemy && !v.isChild);
    const builder = selected || this.villagers.find((v) => !v.isEnemy && !v.isChild && v.state === 'idle');
    if (builder) {
      builder.moveTo(tx + def.width / 2, ty + def.height / 2);
      builder.state = 'building';
      builder.targetBuilding = newBuilding;
      builder.lastWorkTarget = newBuilding;
    }

    this.activePlacementType = null;
    document.querySelectorAll('.btn-build').forEach((b) => b.classList.remove('active'));
  }

  findDropoffBuilding(vx, vy) {
    let closest = this.buildings[0];
    let minDist = Infinity;
    for (const b of this.buildings) {
      if (b.isCompleted && (b.type === 'store' || b.type === 'chiefs_hut')) {
        const d = Math.hypot(b.x - vx, b.y - vy);
        if (d < minDist) {
          minDist = d;
          closest = b;
        }
      }
    }
    return closest || this.buildings[0];
  }

  findCompletedBuilding(type) {
    return this.buildings.find((b) => b.isCompleted && b.type === type);
  }

  awardSkill(v, skillName, xp) {
    if (v.gainSkillXp(skillName, xp)) {
      const w = IsometricMath.tileToWorld(v.x, v.y);
      const s = this.camera.worldToScreen(w.x, w.y);
      this.particles.spawnFloatingText(s.x, s.y - 34 * this.camera.zoom, `${skillName.toUpperCase()} Lv.${v.skills[skillName]}!`, '#facc15', this.camera.zoom);
      this.playBeep(880, 'triangle', 0.16);
    }
  }

  loop(timestamp) {
    const dt = Math.min((timestamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timestamp;

    this.dayNight.update(dt);
    const clockEl = document.getElementById('clock-hud');
    if (clockEl) clockEl.innerText = this.dayNight.getFormattedTime();

    if (this.tileRenderer) this.tileRenderer.update(dt);
    if (this.buildingRenderer) this.buildingRenderer.update(dt);
    if (this.wildlifeRenderer) this.wildlifeRenderer.update(dt);
    if (this.spriteRenderer) this.spriteRenderer.update(dt);

    for (const node of this.resourceNodes) node.update(dt);
    for (const a of this.animals) a.update(dt, this.map ? this.map.width : 40, this.map ? this.map.height : 32);

    // Compute Chief Morale Aura across friendly units
    const chief = this.villagers.find((u) => u.isChief);
    for (const v of this.villagers) {
      v.hasChiefAura = !v.isEnemy && chief ? Math.hypot(v.x - chief.x, v.y - chief.y) <= 6.0 : false;
    }

    // Periodic Reproduction ("Tent-time") check
    this.breedCheckTimer += dt;
    if (this.breedCheckTimer >= 5.0) {
      this.breedCheckTimer = 0;
      this.tryStartBreeding(false);
    }

    // 4. Update Characters & Life Cycles
    for (const v of this.villagers) {
      v.update(dt);

      if (v.justGrewUp) {
        v.justGrewUp = false;
        const w = IsometricMath.tileToWorld(v.x, v.y);
        const s = this.camera.worldToScreen(w.x, w.y);
        this.particles.spawnFloatingText(s.x, s.y - 30 * this.camera.zoom, `${v.name} Grew Up!`, '#4ade80', this.camera.zoom);
        this.playBeep(780, 'triangle', 0.2);
      }

      if (v.isMoving && Math.random() < 0.22) {
        const vw = IsometricMath.tileToWorld(v.x, v.y);
        const vs = this.camera.worldToScreen(vw.x, vw.y);
        this.particles.spawnFootstepDust(vs.x, vs.y, this.camera.zoom);
      }

      // Enemy Patrol & Retaliation AI
      if (v.isEnemy) {
        if (v.health <= 0) {
          v.isMoving = false;
          v.defeatTimer = (v.defeatTimer ?? 2.8) - dt;
          if (v.defeatTimer <= 0) {
            this.villagers = this.villagers.filter((u) => u !== v);
          }
          continue;
        }

        if (v.state !== 'fighting') {
          for (const u of this.villagers) {
            if (u.isEnemy || u.health <= 0) continue;
            const d = Math.hypot(u.x - v.x, u.y - v.y);
            const patrolDetect = u.isStealthed ? u.getDetectRadius() : 4.2;
            if (d <= patrolDetect) {
              v.state = 'fighting';
              break;
            }
          }
        }

        if (v.state === 'fighting') {
          let nearestTarget = null;
          let minDist = 12;
          for (const u of this.villagers) {
            if (u.isEnemy || u.health <= 0) continue;
            const d = Math.hypot(u.x - v.x, u.y - v.y);
            const detectLimit = u.isStealthed ? u.getDetectRadius() : 12;
            if (d <= detectLimit && d < minDist) {
              minDist = d;
              nearestTarget = u;
            }
          }

          if (nearestTarget) {
            if (minDist > 1.3) {
              v.moveTo(nearestTarget.x, nearestTarget.y);
            } else {
              v.isMoving = false;
              v.faceTowards(nearestTarget.x, nearestTarget.y);
              if (v.attackCooldown <= 0) {
                v.attackCooldown = 1.1;
                const dmg = 5;
                nearestTarget.health = Math.max(0, nearestTarget.health - dmg);
                nearestTarget.hurtTimer = 0.45;
                this.playBeep(210, 'sawtooth', 0.08);
                const tWorld = IsometricMath.tileToWorld(nearestTarget.x, nearestTarget.y);
                const tScreen = this.camera.worldToScreen(tWorld.x, tWorld.y);
                this.particles.spawnFloatingText(tScreen.x, tScreen.y - 24 * this.camera.zoom, `-${dmg} HP`, '#ef4444', this.camera.zoom);
                if (nearestTarget.health <= 0) {
                  nearestTarget.health = 25;
                  this.sendVillagerToSleep(nearestTarget);
                }
              }
            }
            continue;
          } else {
            v.state = 'idle';
          }
        }

        if (!v.isMoving) {
          v.wanderTimer -= dt;
          if (v.wanderTimer <= 0) {
            v.wanderTimer = 2.5 + Math.random() * 4.0;
            if (Math.random() < 0.25) {
              v.state = 'relaxing';
            } else {
              v.state = 'walking';
              const nx = Math.max(26, Math.min((this.map ? this.map.width : 40) - 3, v.x + (-2 + Math.random() * 4)));
              const ny = Math.max(18, Math.min((this.map ? this.map.height : 32) - 3, v.y + (-2 + Math.random() * 4)));
              v.moveTo(nx, ny);
            }
          }
        }
        continue;
      }

      // Child Play & Autonomy AI
      if (v.isChild) {
        if (v.hunger > 75 && v.state !== 'eating' && this.resources.food >= 3) {
          this.sendVillagerToEat(v);
        } else if (v.tiredness > 80 && v.state !== 'sleeping' && v.state !== 'eating') {
          this.sendVillagerToSleep(v);
        } else if ((v.state === 'idle' || v.state === 'playing') && !v.isMoving) {
          v.wanderTimer -= dt;
          if (v.wanderTimer <= 0) {
            v.wanderTimer = 4.0 + Math.random() * 4.0;
            v.state = 'playing';
            const nursery = this.findCompletedBuilding('nursery') || this.findCompletedBuilding('hut') || this.buildings[0];
            if (nursery && Math.random() < 0.65) {
              v.moveTo(nursery.x + Math.random() * 2.5, nursery.y + nursery.height + Math.random() * 1.5);
            }
          }
        }
      } else {
        // Adult Autonomous Needs (Eat -> Kitchen, Sleep -> Hut, Relax -> Disco)
        const busyCritical =
          v.state === 'eating' ||
          v.state === 'sleeping' ||
          v.state === 'relaxing' ||
          v.state === 'carrying' ||
          v.state === 'breeding' ||
          (v.state === 'training' && v.hunger < 92);
        if (!busyCritical) {
          if (v.hunger > 78 && this.resources.food >= 5) {
            this.sendVillagerToEat(v);
          } else if (v.tiredness > 84) {
            this.sendVillagerToSleep(v);
          } else if (v.happiness < 62 && v.state === 'idle' && this.findCompletedBuilding('disco')) {
            this.sendVillagerToRelax(v);
          }
        }
      }

      // Executing Eating
      if (v.state === 'eating' && !v.isMoving) {
        v.workTimer += dt;
        if (v.workTimer >= 2.8) {
          v.workTimer = 0;
          this.resources.food = Math.max(0, this.resources.food - 5);
          v.hunger = 0;
          v.happiness = Math.min(100, v.happiness + 18);
          this.updateHUD();
          const vw = IsometricMath.tileToWorld(v.x, v.y);
          const vs = this.camera.worldToScreen(vw.x, vw.y);
          this.particles.spawnFloatingText(vs.x, vs.y - 25 * this.camera.zoom, 'Full & Happy!', '#4ade80', this.camera.zoom);
          this.playBeep(640, 'triangle', 0.12);
          v.state = v.isChild ? 'playing' : 'idle';
        }
      }

      // Executing Sleeping
      if (v.state === 'sleeping' && !v.isMoving) {
        v.workTimer += dt;
        if (v.workTimer >= 3.2) {
          v.workTimer = 0;
          v.tiredness = 0;
          v.health = Math.min(v.maxHealth, v.health + 20);
          v.happiness = Math.min(100, v.happiness + 15);
          const vw = IsometricMath.tileToWorld(v.x, v.y);
          const vs = this.camera.worldToScreen(vw.x, vw.y);
          this.particles.spawnFloatingText(vs.x, vs.y - 25 * this.camera.zoom, 'Energized!', '#38bdf8', this.camera.zoom);
          this.playBeep(520, 'sine', 0.15);
          v.state = v.isChild ? 'playing' : 'idle';
        }
      }

      // Executing Relaxing / Dancing
      if (v.state === 'relaxing' && !v.isMoving) {
        v.workTimer += dt;
        if (v.workTimer >= 3.0) {
          v.workTimer = 0;
          v.happiness = 100;
          const vw = IsometricMath.tileToWorld(v.x, v.y);
          const vs = this.camera.worldToScreen(vw.x, vw.y);
          this.particles.spawnFloatingText(vs.x, vs.y - 25 * this.camera.zoom, 'Happy 100%!', '#f472b6', this.camera.zoom);
          this.playBeep(760, 'sine', 0.12);
          v.state = v.isChild ? 'playing' : 'idle';
        }
      }

      // Executing Fishing at Pond / Fishing Pier
      if (v.state === 'fishing' && !v.isMoving) {
        const eff = v.getEfficiencyMultiplier();
        v.workTimer += dt * eff;
        if (v.workTimer >= 2.0) {
          v.workTimer = 0;
          if (v.cargo.type && v.cargo.type !== 'food') {
            v.cargo.amount = 0;
          }
          v.cargo.type = 'food';
          const caught = Math.min(4, v.cargo.max - v.cargo.amount);
          v.cargo.amount += caught;
          this.awardSkill(v, 'foraging', 9);
          const vw = IsometricMath.tileToWorld(v.x, v.y);
          const vs = this.camera.worldToScreen(vw.x, vw.y);
          this.particles.spawnFloatingText(vs.x, vs.y - 24 * this.camera.zoom, `+${caught} Fish`, '#38bdf8', this.camera.zoom);
          this.playBeep(520, 'sine', 0.06);
          if (v.cargo.amount >= v.cargo.max) {
            const dropoff = this.findDropoffBuilding(v.x, v.y);
            v.state = 'carrying';
            v.moveTo(dropoff.x + dropoff.width / 2, dropoff.y + dropoff.height / 2);
          }
        }
      }

      // Executing Praying at Sanctuary / Shrine
      if (v.state === 'praying' && !v.isMoving) {
        v.workTimer += dt;
        if (v.workTimer >= 3.2) {
          v.workTimer = 0;
          v.health = Math.min(v.maxHealth, v.health + 12);
          v.happiness = Math.min(100, v.happiness + 15);
          const vw = IsometricMath.tileToWorld(v.x, v.y);
          const vs = this.camera.worldToScreen(vw.x, vw.y);
          this.particles.spawnFloatingText(vs.x, vs.y - 26 * this.camera.zoom, 'Blessed!', '#38bdf8', this.camera.zoom);
          this.playBeep(740, 'sine', 0.14);
          v.state = v.isChild ? 'playing' : 'idle';
        }
      }

      // Executing Crafting at Armoury
      if (v.state === 'crafting' && !v.isMoving) {
        v.workTimer += dt;
        if (v.workTimer >= 3.0) {
          v.workTimer = 0;
          this.awardSkill(v, 'combat', 20);
          v.cheerTimer = 1.0;
          const vw = IsometricMath.tileToWorld(v.x, v.y);
          const vs = this.camera.worldToScreen(vw.x, vw.y);
          this.particles.spawnStoneSparks(vs.x, vs.y - 12 * this.camera.zoom, this.camera.zoom);
          this.particles.spawnFloatingText(vs.x, vs.y - 26 * this.camera.zoom, 'Weapon Honed!', '#facc15', this.camera.zoom);
          this.playBeep(540, 'triangle', 0.14);
          v.state = 'idle';
        }
      }

      // Executing Tending Children at Nursery
      if (v.state === 'tending' && !v.isMoving) {
        v.workTimer += dt;
        if (v.workTimer >= 3.2) {
          v.workTimer = 0;
          for (const child of this.villagers) {
            if (child.isChild && !child.isEnemy) {
              child.happiness = 100;
              child.growthProgress = Math.min(99, child.growthProgress + 4);
            }
          }
          const vw = IsometricMath.tileToWorld(v.x, v.y);
          const vs = this.camera.worldToScreen(vw.x, vw.y);
          this.particles.spawnFloatingText(vs.x, vs.y - 26 * this.camera.zoom, 'Nursery Care!', '#f472b6', this.camera.zoom);
          this.playBeep(680, 'sine', 0.14);
          v.state = 'idle';
        }
      }

      // Executing Warrior Training at Training Ground
      if (v.state === 'training' && !v.isMoving) {
        if (!v.targetBuilding || (v.targetBuilding.type !== 'gym' && v.targetBuilding.type !== 'range')) {
          v.state = 'idle';
        } else {
          const eff = v.getEfficiencyMultiplier();
          const res = v.addTrainingTime(dt * eff);
          v.workTimer += dt;
          if (v.workTimer >= 1.5) {
            v.workTimer = 0;
            this.awardSkill(v, 'combat', 6);
            this.playBeep(340, 'triangle', 0.05);
            const vw = IsometricMath.tileToWorld(v.x, v.y);
            const vs = this.camera.worldToScreen(vw.x, vw.y);
            this.particles.spawnWoodChips(vs.x, vs.y - 12 * this.camera.zoom, this.camera.zoom);
          }
          if (res.promoted) {
            const vw = IsometricMath.tileToWorld(v.x, v.y);
            const vs = this.camera.worldToScreen(vw.x, vw.y);
            const msg = res.newStar === 1 ? 'Promoted: 1★ Warrior!' : `Rank Up: ${'★'.repeat(res.newStar)} Warrior!`;
            this.particles.spawnFloatingText(vs.x, vs.y - 34 * this.camera.zoom, msg, '#fbbf24', this.camera.zoom);
            this.particles.spawnStoneSparks(vs.x, vs.y - 16 * this.camera.zoom, this.camera.zoom);
            this.playBeep(880, 'triangle', 0.24);
            this.updateInspector();
          }
          if (v.warriorStars >= 3) {
            const vw = IsometricMath.tileToWorld(v.x, v.y);
            const vs = this.camera.worldToScreen(vw.x, vw.y);
            this.particles.spawnFloatingText(vs.x, vs.y - 28 * this.camera.zoom, '3★ Master Complete!', '#fde047', this.camera.zoom);
            v.state = 'idle';
            v.targetBuilding = null;
          }
        }
      }

      // Executing Breeding ("Tent-time!")
      if (v.state === 'breeding' && !v.isMoving) {
        v.workTimer += dt;
        if (v.workTimer >= 3.5) {
          v.workTimer = 0;
          v.breedCooldown = 45;
          // Only male triggers spawn so 1 couple spawns 1 baby
          if (v.gender === 'male') {
            this.spawnNewbornChild(v.x + 0.3, v.y + 0.3);
          }
          if (v.targetPartner) {
            v.targetPartner.breedCooldown = 45;
            v.targetPartner.state = 'idle';
            v.targetPartner.workTimer = 0;
            v.targetPartner.targetPartner = null;
          }
          v.targetPartner = null;
          v.state = 'idle';
        }
      }

      // Fighting Enemy Cannibal (Melee & Warrior Javelin / Bow / Stealth Ambush)
      if (v.state === 'fighting') {
        const enemy = v.targetEnemy && v.targetEnemy.health > 0
          ? v.targetEnemy
          : this.villagers.find((u) => u.isEnemy && u.health > 0 && Math.hypot(u.x - v.x, u.y - v.y) < 12);

        if (enemy) {
          v.targetEnemy = enemy;
          const dist = Math.hypot(enemy.x - v.x, enemy.y - v.y);
          const attackRange = v.getAttackRange();
          if (dist > attackRange) {
            v.moveTo(enemy.x, enemy.y);
          } else {
            v.isMoving = false;
            v.faceTowards(enemy.x, enemy.y);
            if (v.attackCooldown <= 0) {
              v.attackCooldown = v.getAttackCooldown();
              const isAmbush = v.isWarrior && v.isStealthed;
              const dmg = v.getCombatDamage(isAmbush);
              if (isAmbush) {
                v.isStealthed = false;
                v.stealthCooldown = 3.0;
              }
              if (v.isWarrior) {
                this.spawnProjectile(v, enemy, 'enemy', dmg, isAmbush);
                this.playBeep(v.warriorMode === 'bow' ? 680 : 420, 'triangle', 0.08);
              } else {
                this.applyCombatHit(v, enemy, 'enemy', dmg, isAmbush);
              }
            }
          }
        }
      }

      // Construction System
      if (v.state === 'building' && v.targetBuilding && !v.isMoving) {
        const eff = v.getEfficiencyMultiplier();
        v.targetBuilding.build(dt * 15 * eff);
        if (Math.random() < 0.28) {
          const bWorld = IsometricMath.tileToWorld(v.targetBuilding.x + 1, v.targetBuilding.y + 1);
          const bScreen = this.camera.worldToScreen(bWorld.x, bWorld.y);
          this.particles.spawnWoodChips(bScreen.x, bScreen.y - 15 * this.camera.zoom, this.camera.zoom);
          this.playBeep(420, 'square', 0.04);
        }
        if (v.targetBuilding.isCompleted) {
          const bWorld = IsometricMath.tileToWorld(v.targetBuilding.x + 1, v.targetBuilding.y + 1);
          const bScreen = this.camera.worldToScreen(bWorld.x, bWorld.y);
          this.particles.spawnFloatingText(bScreen.x, bScreen.y - 30 * this.camera.zoom, `${v.targetBuilding.name} Built!`, '#fde047', this.camera.zoom);

          this.awardSkill(v, 'building', 25);
          if (v.targetBuilding.type === 'hut') {
            this.resources.maxLivingSpace += 4;
            this.updateHUD();
          }
          v.cheerTimer = 1.6;
          v.state = 'idle';
          v.targetBuilding = null;
          this.playBeep(880, 'triangle', 0.25);
        }
      }

      // Hunting Wildlife (Melee & Warrior Ranged Bow/Javelin + Walk-In Butcher)
      if (v.state === 'hunting' && v.targetAnimal) {
        const dist = Math.hypot(v.targetAnimal.x - v.x, v.targetAnimal.y - v.y);
        if (!v.targetAnimal.isDead) {
          const huntRange = v.getAttackRange();
          if (dist > huntRange) {
            v.moveTo(v.targetAnimal.x, v.targetAnimal.y);
          } else {
            v.isMoving = false;
            v.faceTowards(v.targetAnimal.x, v.targetAnimal.y);
            if (v.attackCooldown <= 0) {
              v.attackCooldown = v.isWarrior ? v.getAttackCooldown() : 0.8;
              const isAmbush = v.isWarrior && v.isStealthed;
              const dmg = v.getCombatDamage(isAmbush);
              if (isAmbush) {
                v.isStealthed = false;
                v.stealthCooldown = 3.0;
              }
              if (v.isWarrior) {
                this.spawnProjectile(v, v.targetAnimal, 'animal', dmg, isAmbush);
                this.playBeep(v.warriorMode === 'bow' ? 680 : 420, 'triangle', 0.08);
              } else {
                this.applyCombatHit(v, v.targetAnimal, 'animal', dmg, isAmbush);
              }
            }
          }
        } else if (dist > 1.3) {
          v.moveTo(v.targetAnimal.x, v.targetAnimal.y);
        } else {
          v.workTimer += dt;
          if (v.workTimer >= 1.4) {
            v.workTimer = 0;
            const meatGathered = Math.min(v.cargo.max, v.targetAnimal.foodYield);
            v.cargo.type = 'food';
            v.cargo.amount = meatGathered;
            const boneGained = Math.floor(v.targetAnimal.boneYield / 2);
            this.resources.bones += boneGained;

            const aWorld = IsometricMath.tileToWorld(v.targetAnimal.x, v.targetAnimal.y);
            const aScreen = this.camera.worldToScreen(aWorld.x, aWorld.y);
            this.particles.spawnFloatingText(aScreen.x, aScreen.y - 20 * this.camera.zoom, `+${meatGathered} Meat, +${boneGained} Bones`, '#fde047', this.camera.zoom);

            v.targetAnimal.carcassHarvested = true;
            this.animals = this.animals.filter((a) => a !== v.targetAnimal);
            v.targetAnimal = null;

            const dropoff = this.findDropoffBuilding(v.x, v.y);
            v.state = 'carrying';
            v.moveTo(dropoff.x + dropoff.width / 2, dropoff.y + dropoff.height / 2);
            this.playBeep(640, 'sine', 0.1);
          }
        }
      }

      // Gathering Loop (Chopping Wood, Mining Stone, Foraging Berries)
      const isGatheringState = v.state === 'chopping' || v.state === 'mining' || v.state === 'foraging';
      if (isGatheringState && v.targetResource && !v.isMoving) {
        const eff = v.getEfficiencyMultiplier();
        v.workTimer += dt * eff;
        if (v.workTimer >= 1.35) {
          v.workTimer = 0;
          const resType = v.targetResource.type;
          let gathered = 5;

          if (v.targetResource instanceof ResourceNode) {
            gathered = v.targetResource.harvest(5);
            this.awardSkill(v, 'foraging', 8);
            if (v.targetResource.isDepleted) {
              v.targetResource = null;
            }
          } else {
            const tx = Math.floor(v.targetResource.x);
            const ty = Math.floor(v.targetResource.y);
            const key = `${tx},${ty}`;
            let rem = this.terrainYield.has(key) ? this.terrainYield.get(key) : 30;
            gathered = Math.min(rem, 5);
            rem -= gathered;
            this.awardSkill(v, resType === 'wood' ? 'woodcutting' : 'mining', 8);
            if (rem <= 0) {
              this.terrainYield.set(key, 0);
              if (this.tileRenderer) {
                this.tileRenderer.depleteTile(tx, ty, resType);
              }
              v.targetResource = null;
              v.lastWorkTarget = null;
            } else {
              this.terrainYield.set(key, rem);
            }
          }

          if (v.cargo.type && v.cargo.type !== resType) {
            v.cargo.amount = 0;
          }
          v.cargo.type = resType;
          v.cargo.amount = Math.min(v.cargo.max, v.cargo.amount + gathered);

          const rWorld = IsometricMath.tileToWorld(v.x, v.y);
          const rScreen = this.camera.worldToScreen(rWorld.x, rWorld.y);

          if (resType === 'wood') {
            this.particles.spawnWoodChips(rScreen.x, rScreen.y - 12 * this.camera.zoom, this.camera.zoom);
            this.particles.spawnFloatingText(rScreen.x, rScreen.y - 22 * this.camera.zoom, `+${gathered} Wood`, '#facc15', this.camera.zoom);
            this.playBeep(450, 'square', 0.05);
          } else if (resType === 'stone') {
            this.particles.spawnStoneSparks(rScreen.x, rScreen.y - 8 * this.camera.zoom, this.camera.zoom);
            this.particles.spawnFloatingText(rScreen.x, rScreen.y - 22 * this.camera.zoom, `+${gathered} Stone`, '#94a3b8', this.camera.zoom);
            this.playBeep(320, 'square', 0.05);
          } else {
            this.particles.spawnFloatingText(rScreen.x, rScreen.y - 22 * this.camera.zoom, `+${gathered} Berries`, '#4ade80', this.camera.zoom);
            this.playBeep(560, 'sine', 0.05);
          }

          if (v.cargo.amount >= v.cargo.max || (!v.targetResource && v.cargo.amount > 0)) {
            const dropoff = this.findDropoffBuilding(v.x, v.y);
            v.state = 'carrying';
            v.moveTo(dropoff.x + dropoff.width / 2, dropoff.y + dropoff.height / 2);
          } else if (!v.targetResource) {
            v.state = 'idle';
          }
        }
      }

      // Depositing Full Cargo at Store / Chief's Hut
      if (v.state === 'carrying' && !v.isMoving) {
        const depositedAmount = v.cargo.amount;
        const cargoType = v.cargo.type;

        if (cargoType === 'wood') this.resources.wood += depositedAmount;
        else if (cargoType === 'stone') this.resources.stone += depositedAmount;
        else if (cargoType === 'food') this.resources.food += depositedAmount;

        const vw = IsometricMath.tileToWorld(v.x, v.y);
        const vs = this.camera.worldToScreen(vw.x, vw.y);
        this.particles.spawnFloatingText(vs.x, vs.y - 25 * this.camera.zoom, `+${depositedAmount} Deposited!`, '#fde047', this.camera.zoom);

        v.cargo.amount = 0;
        v.cargo.type = null;
        this.updateHUD();
        this.playBeep(720, 'triangle', 0.15);

        // Return to resume previous resource if still available
        if (v.lastWorkTarget && v.lastWorkTarget instanceof ResourceNode && !v.lastWorkTarget.isDepleted) {
          v.state = v.lastWorkState || 'foraging';
          v.targetResource = v.lastWorkTarget;
          v.moveTo(v.lastWorkTarget.x, v.lastWorkTarget.y);
        } else if (v.lastWorkTarget && v.lastWorkTarget.isFishing) {
          v.state = 'fishing';
          v.workTimer = 0;
          v.moveTo(v.lastWorkTarget.x, v.lastWorkTarget.y);
        } else if (v.lastWorkTarget && (v.lastWorkTarget.type === 'wood' || v.lastWorkTarget.type === 'stone')) {
          const tx = Math.floor(v.lastWorkTarget.x);
          const ty = Math.floor(v.lastWorkTarget.y);
          const rem = this.terrainYield.get(`${tx},${ty}`);
          if (rem === undefined || rem > 0) {
            v.state = v.lastWorkState || (v.lastWorkTarget.type === 'wood' ? 'chopping' : 'mining');
            v.targetResource = v.lastWorkTarget;
            v.moveTo(v.lastWorkTarget.x, v.lastWorkTarget.y);
          } else {
            v.state = 'idle';
          }
        } else {
          v.state = 'idle';
        }
      }
    }

    // Update Active Flying Projectiles (Javelins & Arrows)
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

    const friendlyCount = this.villagers.filter((u) => !u.isEnemy).length;
    this.resources.food = Math.max(0, this.resources.food - dt * 0.08 * friendlyCount);

    this.uiRefreshTimer += dt;
    if (this.uiRefreshTimer >= 0.35) {
      this.uiRefreshTimer = 0;
      this.updateHUD();
      this.updateInspector();
    }

    // Render Pass
    this.ctx.fillStyle = '#1c2813';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.map && this.tileRenderer) {
      this.tileRenderer.renderBase(this.ctx, this.camera, this.hoveredTile);
    }

    if (this.activePlacementType && this.hoveredTile) {
      const def = BUILDING_DEFS[this.activePlacementType];
      if (def) {
        const canPlace = this.resources.wood >= def.costWood && this.resources.stone >= def.costStone;
        BuildingRenderer.drawGhost(this.ctx, def, this.hoveredTile.x, this.hoveredTile.y, this.camera, canPlace, this.assets);
      }
    }

    const renderList = [];
    if (this.tileRenderer) this.tileRenderer.appendRenderables(renderList, this.camera);
    if (this.wildlifeRenderer) this.wildlifeRenderer.appendRenderables(renderList, this.resourceNodes, this.animals, this.camera);
    if (this.buildingRenderer) this.buildingRenderer.appendRenderables(renderList, this.buildings, this.camera);
    if (this.spriteRenderer) this.spriteRenderer.appendRenderables(renderList, this.villagers, this.selectedVillagerId, this.camera);

    renderList.sort((a, b) => a.sortKey - b.sortKey);
    for (const item of renderList) {
      item.draw(this.ctx);
    }

    if (this.spriteRenderer && this.projectiles.length > 0) {
      this.spriteRenderer.drawProjectiles(this.ctx, this.projectiles, this.camera);
    }

    this.particles.render(this.ctx);

    const lightSources = [];
    for (const b of this.buildings) {
      const bWorld = IsometricMath.tileToWorld(b.x + b.width / 2, b.y + b.height / 2);
      const bScreen = this.camera.worldToScreen(bWorld.x, bWorld.y);
      const radius = b.type === 'chiefs_hut' || b.type === 'disco' ? 110 : 85;
      lightSources.push({ x: bScreen.x, y: bScreen.y - 10 * this.camera.zoom, radius: radius * this.camera.zoom });
    }
    this.dayNight.renderLighting(this.ctx, this.canvas.width, this.canvas.height, lightSources);

    requestAnimationFrame((t) => this.loop(t));
  }

  updateHUD() {
    const foodEl = document.getElementById('res-food');
    const woodEl = document.getElementById('res-wood');
    const stoneEl = document.getElementById('res-stone');
    const bonesEl = document.getElementById('res-bones');
    const popEl = document.getElementById('res-pop');

    const friendlyCount = this.villagers.filter((u) => !u.isEnemy).length;
    this.resources.population = friendlyCount;

    if (foodEl) foodEl.innerText = `${Math.floor(this.resources.food)}`;
    if (woodEl) woodEl.innerText = `${this.resources.wood}`;
    if (stoneEl) stoneEl.innerText = `${this.resources.stone}`;
    if (bonesEl) bonesEl.innerText = `${this.resources.bones}`;
    if (popEl) popEl.innerText = `${friendlyCount} / ${this.resources.maxLivingSpace}`;
  }

  updateInspector() {
    const inspectorEl = document.getElementById('inspector-panel');
    if (!inspectorEl) return;

    const selected = this.villagers.find((v) => v.id === this.selectedVillagerId);
    if (selected) {
      const portraitSrc = selected.isChild
        ? './assets/images/sprites_hd/icon_portrait_child.png'
        : selected.isChief
          ? './assets/images/sprites_hd/icon_pop_chief.png'
          : selected.isWarrior
            ? './assets/images/sprites_hd/icon_portrait_warrior.png'
            : selected.gender === 'female'
              ? './assets/images/sprites_hd/icon_portrait_female.png'
              : './assets/images/sprites_hd/icon_portrait_mumbo.png';

      const warriorStats = selected.getWarriorStats();
      const starsBadge = selected.isWarrior
        ? `<div class="warrior-badge">${'★'.repeat(selected.warriorStars)}${'☆'.repeat(3 - selected.warriorStars)} ${warriorStats.label}</div>`
        : '';

      const dirLabel =
        selected.facingCardinal === 'south' ? 'Nam (South)' :
        selected.facingCardinal === 'north' ? 'Bắc (North)' :
        selected.facingCardinal === 'diag_back' ? (selected.flipX ? 'Tây Bắc (NW)' : 'Đông Bắc (NE)') :
        (selected.flipX ? 'Tây Nam (SW)' : 'Đông Nam (SE)');

      const roleLabel = selected.isChild
        ? `Child (${Math.floor(selected.growthProgress)}% Grown)`
        : selected.isChief
          ? 'Tribal Chief (+25% Aura)'
          : selected.isWarrior
            ? `Trained Warrior • Speed ${selected.speed.toFixed(2)}`
            : selected.gender === 'female'
              ? 'Forager & Builder'
              : 'Hunter & Woodsman';

      const skillLine = selected.isChild
        ? `<div class="skill-row">Growing into adult...</div>`
        : `<div class="skill-row">Wood Lv.${selected.skills.woodcutting} | Mine Lv.${selected.skills.mining} | Fight Lv.${selected.skills.combat}</div>`;

      const trainProg = Math.floor(selected.getTrainingProgress());
      const warriorDetailsBox = selected.isWarrior
        ? `<div class="warrior-stat-box">
             <div><b>Phi lao:</b> ${warriorStats.javelinDmg + (selected.skills.combat - 1) * 2} dmg (${warriorStats.javelinRange} ô) | <b>Cung:</b> ${warriorStats.bowDmg + (selected.skills.combat - 1) * 2} dmg (${warriorStats.bowRange} ô)</div>
             <div><b>Trinh sát:</b> ${selected.isStealthed ? '<span style="color:#4ade80;">ĐANG ẨN THÂN</span>' : 'Sẵn sàng'} (Hiện ở &lt;${warriorStats.detectRadius} ô, Crit ×${warriorStats.ambushMult})</div>
             <div><b>Đào tạo (${selected.warriorStars}/3★):</b> ${selected.warriorStars >= 3 ? '<span style="color:#fbbf24;">Tối đa 3 sao</span>' : `${trainProg}% tới ${selected.warriorStars + 1}★`}</div>
           </div>`
        : (!selected.isChild && !selected.isChief && selected.trainingTime > 0
          ? `<div class="warrior-stat-box"><b>Tiến độ thành Chiến binh:</b> ${trainProg}% (0 → 1★)</div>`
          : '');

      const actionLabel = selected.isWarrior
        ? `${selected.state.toUpperCase()} • ${selected.isStealthed ? 'STEALTH' : selected.warriorMode.toUpperCase()}`
        : selected.state.toUpperCase();

      inspectorEl.style.display = 'block';
      inspectorEl.innerHTML = `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
          <img src="${portraitSrc}" style="width:46px;height:46px;object-fit:contain;border-radius:50%;border:2px solid #f59e0b;background:#3f2818;padding:2px;" alt="${selected.name}" />
          <div>
            <div style="font-weight: bold; color: #fde047; font-size: 14px;">${selected.name} ${selected.hasChiefAura && !selected.isChief ? '<span style="color:#facc15;font-size:11px;">(+Aura)</span>' : ''}</div>
            <div style="font-size: 11px; color: #cbd5e1;">${roleLabel}</div>
            ${starsBadge}
          </div>
        </div>
        <div style="margin-bottom: 2px;">Health: <span style="color: #22c55e;">${Math.floor(selected.health)} / ${selected.maxHealth}</span></div>
        <div style="margin-bottom: 2px;">Hunger: <span style="color: ${selected.hunger > 60 ? '#ef4444' : '#facc15'};">${Math.floor(selected.hunger)}%</span> | Tired: <span style="color: ${selected.tiredness > 60 ? '#ef4444' : '#38bdf8'};">${Math.floor(selected.tiredness)}%</span></div>
        <div style="margin-bottom: 2px;">Happiness: <span style="color: #4ade80;">${Math.floor(selected.happiness)}%</span> | Góc: <span style="color: #fde047;">${dirLabel}</span></div>
        ${skillLine}
        ${warriorDetailsBox}
        <div style="margin-top: 4px; padding-top: 4px; border-top: 1px solid #451a03;">
          Action: <span style="color: #22c55e; font-weight: bold;">${actionLabel}</span>
        </div>
        <div style="color: #cbd5e1; margin-top: 2px;">
          Cargo: ${selected.cargo.amount > 0 ? `<span style="color: #fde047;">${selected.cargo.amount} ${selected.cargo.type}</span>` : 'Empty (0/15)'}
        </div>
        <div class="insp-actions">
          ${selected.isWarrior ? `
            <button class="insp-btn ${selected.warriorMode === 'javelin' ? 'active' : ''}" data-action="mode_javelin">Phi lao</button>
            <button class="insp-btn ${selected.warriorMode === 'bow' ? 'active' : ''}" data-action="mode_bow">Bắn cung</button>
            <button class="insp-btn ${selected.isStealthed ? 'active' : ''}" data-action="stealth">Trinh sát [F]</button>
          ` : ''}
          ${!selected.isChild && !selected.isChief && selected.warriorStars < 3 ? '<button class="insp-btn" data-action="train">Train ★</button>' : ''}
          <button class="insp-btn" data-action="face_cycle">Xoay góc</button>
          <button class="insp-btn" data-action="eat">Eat</button>
          <button class="insp-btn" data-action="sleep">Sleep</button>
          <button class="insp-btn" data-action="relax">Dance</button>
          <button class="insp-btn" data-action="pray">Pray</button>
          ${!selected.isChild ? '<button class="insp-btn" data-action="fish">Fish</button>' : ''}
          ${!selected.isChild ? '<button class="insp-btn" data-action="craft">Craft</button>' : ''}
          ${!selected.isChild ? '<button class="insp-btn" data-action="breed">Tent-time</button>' : ''}
          ${selected.isChief ? '<button class="insp-btn" data-action="command">Command</button>' : ''}
        </div>
      `;
    } else {
      inspectorEl.style.display = 'none';
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new PrehistoricTribesApp();
});
