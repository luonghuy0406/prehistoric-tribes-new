/**
 * AISystems.js — Cập nhật Watchtower phòng thủ, Armoury rèn vũ khí/bẫy, Kitchen nấu ăn,
 * Đám mây Dịch bệnh, Bẫy, Đàn thú sinh sản & Đợt tập kích AI địch (Easy / Hard).
 */
import { WEAPON_DEFS } from '../data/GameData.js';
import { IsometricMath } from '../core/IsometricMath.js';
import { Villager } from './Villager.js';
import { Animal } from './Animal.js';
import { pickUniqueTribeName } from './NameDatabase.js';

export class AISystems {
  static updateWorkshopsAndDefenses(app, dt) {
    // 1. Kitchen: Cook turns raw Food -> Meals periodically
    for (const b of app.buildings) {
      if (b.owner !== 'player' || !b.isCompleted || b.state !== 'normal') continue;

      if (b.type === 'kitchen' && b.keeperId) {
        const cook = app.villagers.find((v) => v.id === b.keeperId && v.health > 0);
        if (cook) {
          b.productionTimer += dt;
          if (b.productionTimer >= 5.5 && app.resources.food >= 2) {
            b.productionTimer = 0;
            app.resources.food -= 2;
            app.resources.meals += 2;
            cook.gainSkillXp('cooking', 12);
          }
        } else {
          b.keeperId = null;
        }
      }

      // 2. Armoury: Armourer fulfills weapon crafting queue
      if (b.type === 'armoury' && b.productionQueue.length > 0 && b.keeperId) {
        const arm = app.villagers.find((v) => v.id === b.keeperId && v.health > 0);
        if (arm) {
          const item = b.productionQueue[0];
          b.productionTimer += dt * (1 + (arm.skills.crafting || 1) * 0.12);
          if (b.productionTimer >= 4.0) {
            b.productionTimer = 0;
            b.productionQueue.shift();
            if (item.kind === 'weapon') {
              app.armouryStock[item.id] = (app.armouryStock[item.id] || 0) + (WEAPON_DEFS[item.id]?.batch || 1);
              const bw = IsometricMath.tileToWorld(b.x + 1, b.y + 1);
              const bs = app.camera.worldToScreen(bw.x, bw.y);
              app.particles.spawnFloatingText(bs.x, bs.y - 26 * app.camera.zoom, `Xong ${item.name}!`, '#fde047', app.camera.zoom);
              app.sound.playBeep(700, 'triangle', 0.12);
              arm.gainSkillXp('crafting', 18);
            }
            app.updateInspector();
          }
        } else {
          b.keeperId = null;
        }
      }

      // 3. Watchtower auto-defense shooting (both Player & Enemy towers)
      if (b.type === 'tower' && b.isCompleted) {
        b.fireCooldown = Math.max(0, b.fireCooldown - dt);
        const cx = b.x + b.width * 0.5;
        const cy = b.y + b.height * 0.5;
        const range = 7 + b.level * 1.5;

        if (b.fireCooldown <= 0) {
          const target = AISystems.findTowerTarget(app, b, cx, cy, range);
          if (target) {
            b.fireCooldown = Math.max(0.85, 1.45 - b.level * 0.2);
            const hasGuard = b.occupants && b.occupants.length > 0;
            const dmg = (hasGuard ? 14 : 9) + b.level * 4;
            app.spawnProjectile(
              { x: cx, y: cy, isWarrior: true, warriorMode: b.level >= 2 ? 'bow' : 'javelin', isEnemy: b.owner === 'enemy' },
              target,
              target instanceof Animal ? 'animal' : 'enemy_or_unit',
              dmg,
              false
            );
            app.sound.playBeep(520, 'triangle', 0.06);
          }
        }
      }
    }

    // Enemy Watchtowers also defend!
    for (const b of app.buildings) {
      if (b.owner !== 'enemy' || b.type !== 'tower' || !b.isCompleted) continue;
      b.fireCooldown = Math.max(0, b.fireCooldown - dt);
      if (b.fireCooldown > 0) continue;
      const cx = b.x + 0.5;
      const cy = b.y + 0.5;
      const range = 6.5 + b.level;
      const target = app.villagers.find((u) => !u.isEnemy && u.health > 0 && !u.isStealthed && Math.hypot(u.x - cx, u.y - cy) <= range);
      if (target) {
        b.fireCooldown = 1.65;
        app.spawnProjectile(
          { x: cx, y: cy, isWarrior: true, warriorMode: 'javelin', isEnemy: true },
          target,
          'enemy_or_unit',
          9 + b.level * 3,
          false
        );
      }
    }
  }

  static findTowerTarget(app, tower, cx, cy, range) {
    let best = null;
    let bestDist = Infinity;
    for (const u of app.villagers) {
      if (!u.isEnemy || u.health <= 0 || u.isStealthed) continue;
      const d = Math.hypot(u.x - cx, u.y - cy);
      if (d <= range && d < bestDist) {
        bestDist = d;
        best = u;
      }
    }
    if (best) return best;
    for (const a of app.animals) {
      if (a.isDead || a.type !== 'tiger') continue;
      const d = Math.hypot(a.x - cx, a.y - cy);
      if (d <= range && d < bestDist) {
        bestDist = d;
        best = a;
      }
    }
    return best;
  }

  static updateTrapsAndDisease(app, dt) {
    // 1. Traps arming & triggering
    for (const trap of app.traps) {
      if (trap.isSprung) continue;

      // PIA Scout reveals hidden enemy traps within their viewRadius
      if (trap.owner === 'enemy' && !trap.isRevealed) {
        for (const v of app.villagers) {
          if (!v.isEnemy && (v.role === 'pia_scout' || v.skills.scouting >= 4) && Math.hypot(v.x - trap.x, v.y - trap.y) <= (v.viewRadius || 7)) {
            trap.isRevealed = true;
            break;
          }
        }
      }

      if (!trap.isArmed) continue;

      const victims = trap.owner === 'player'
        ? app.villagers.filter((v) => v.isEnemy && v.health > 0)
        : app.villagers.filter((v) => !v.isEnemy && v.health > 0);

      for (const victim of victims) {
        if (Math.hypot(victim.x - trap.x, victim.y - trap.y) <= 0.95) {
          trap.isSprung = true;
          const dmg = trap.def.damage || 15;
          victim.stunTimer = trap.def.stunSec || 3;
          victim.isMoving = false;
          const died = victim.applyDamage(dmg);
          const w = IsometricMath.tileToWorld(trap.x, trap.y);
          const s = app.camera.worldToScreen(w.x, w.y);
          app.particles.spawnStoneSparks(s.x, s.y - 8 * app.camera.zoom, app.camera.zoom);
          app.particles.spawnFloatingText(s.x, s.y - 26 * app.camera.zoom, `Bẫy! -${dmg} HP`, '#f97316', app.camera.zoom);
          app.sound.playBeep(260, 'sawtooth', 0.14);
          if (died) {
            app.handleUnitDeath(victim);
          }
          break;
        }
      }
    }

    // 2. Disease Clouds (3x3 Miasma)
    for (let i = app.diseaseClouds.length - 1; i >= 0; i--) {
      const cloud = app.diseaseClouds[i];
      cloud.timer -= dt;
      if (cloud.timer <= 0) {
        app.diseaseClouds.splice(i, 1);
        continue;
      }
      for (const u of app.villagers) {
        if (u.health <= 0 || u.isInfected) continue;
        if (Math.abs(u.x - cloud.x) <= 1.6 && Math.abs(u.y - cloud.y) <= 1.6) {
          u.isInfected = true;
          u.infectionTimer = 18;
        }
      }
    }
  }

  static updateEnemyAI(app, dt) {
    const ai = app.currentLevelConfig?.aiConfig;
    if (!ai || ai.isStealthMission) return;

    app.enemyRaidTimer -= dt;
    const isHard = app.difficulty === 'hard';
    const interval = Math.max(25, (ai.raidInterval || 60) * (isHard ? 0.65 : 1.0));

    // Reinforce / Spawn enemy raid if under popCap
    if (app.enemyRaidTimer <= 0) {
      app.enemyRaidTimer = interval;
      const aliveEnemies = app.villagers.filter((u) => u.isEnemy && u.health > 0);
      const popCap = isHard ? (ai.popCap?.[1] || 24) : (ai.popCap?.[0] || 18);
      const enemyStore = app.buildings.find((b) => b.owner === 'enemy' && b.isCompleted);

      if (enemyStore && aliveEnemies.length < popCap) {
        const spawnCount = isHard ? (ai.raidSize?.[1] || 5) : (ai.raidSize?.[0] || 3);
        const tierWeapons = app.matchElapsed > (ai.heavySec > 0 ? ai.heavySec : 240)
          ? ['bone_mace', 'tomahawk', 'stone_axe']
          : app.matchElapsed > (ai.axesSec > 0 ? ai.axesSec : 120)
            ? ['stone_axe', 'spear', 'club']
            : ['club', 'spear'];

        for (let i = 0; i < spawnCount; i++) {
          const wpn = tierWeapons[i % tierWeapons.length];
          const sx = Math.max(2, Math.min(app.map.width - 2, enemyStore.x + (i % 3)));
          const sy = Math.max(2, Math.min(app.map.height - 2, enemyStore.y + enemyStore.height + 1));
          const r = new Villager(app.nextUnitId++, `Raider`, 'male', sx, sy, false, true, false);
          r.equipWeapon(wpn);
          r.isWarrior = true;
          r.warriorStars = app.matchElapsed > 180 ? 2 : 1;
          r.state = 'fighting';
          const playerAnchor = app.buildings.find((b) => b.owner === 'player') || app.villagers.find((v) => !v.isEnemy && v.health > 0);
          if (playerAnchor) {
            r.moveTo(playerAnchor.x, playerAnchor.y);
          }
          app.villagers.push(r);
          aliveEnemies.push(r);
        }
      }

      // Send idle raiders to probe player settlement
      const raiders = aliveEnemies.filter((u) => u.role !== 'guard' && u.state === 'idle');
      const raidGroupSize = Math.min(raiders.length, isHard ? 5 : 3);
      const targetAnchor = app.buildings.find((b) => b.owner === 'player' && b.type === 'chiefs_hut')
        || app.buildings.find((b) => b.owner === 'player');
      if (targetAnchor && raidGroupSize > 0) {
        for (let i = 0; i < raidGroupSize; i++) {
          raiders[i].state = 'fighting';
          raiders[i].moveTo(targetAnchor.x + Math.random() * 2, targetAnchor.y + Math.random() * 2);
        }
        app.pushAlert('CẢNH BÁO: Quân địch đang kéo sang tập kích làng ta!', targetAnchor.x, targetAnchor.y);
        app.sound.setTheme('alert');
      }
    }

    // Herd Animal Respawns
    const herds = app.currentLevelConfig?.herds || [];
    app.herdRespawnTimer += dt;
    if (app.herdRespawnTimer >= 35 && herds.length > 0 && app.animals.length < 18) {
      app.herdRespawnTimer = 0;
      const h = herds[Math.floor(Math.random() * herds.length)];
      const pool = h.pool || ['boar', 'tiger', 'mammoth'];
      const kind = pool[Math.floor(Math.random() * pool.length)];
      const ax = Math.max(2, Math.min(app.map.width - 3, h.x + (-h.radius + Math.random() * h.radius * 2)));
      const ay = Math.max(2, Math.min(app.map.height - 3, h.y + (-h.radius + Math.random() * h.radius * 2)));
      app.animals.push(new Animal(Date.now() + Math.random(), kind, ax, ay));
    }
  }
}
