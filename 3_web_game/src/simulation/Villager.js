import { IsometricMath } from '../core/IsometricMath.js';
import { MELEE_DAMAGE_BY_SKILL, WEAPON_DEFS } from '../data/GameData.js';

export const WARRIOR_TRAINING_THRESHOLDS = [6.0, 16.0, 30.0]; // Seconds needed for 1★, 2★, 3★

export const WARRIOR_STAR_TIERS = {
  1: { maxHp: 135, speed: 2.85, javelinDmg: 16, javelinRange: 5.0, javelinCd: 1.25, bowDmg: 14, bowRange: 7.0, bowCd: 0.95, stealthSpeedMult: 1.20, detectRadius: 1.8, ambushMult: 1.50, label: '1★ Recruit Warrior' },
  2: { maxHp: 170, speed: 3.05, javelinDmg: 24, javelinRange: 5.8, javelinCd: 1.15, bowDmg: 20, bowRange: 8.0, bowCd: 0.85, stealthSpeedMult: 1.30, detectRadius: 1.3, ambushMult: 1.75, label: '2★ Veteran Warrior' },
  3: { maxHp: 220, speed: 3.25, javelinDmg: 34, javelinRange: 6.5, javelinCd: 1.05, bowDmg: 28, bowRange: 9.0, bowCd: 0.72, stealthSpeedMult: 1.40, detectRadius: 0.9, ambushMult: 2.00, label: '3★ Master Warrior' }
};

export class Villager {
  constructor(id, name, gender, x, y, isChief = false, isEnemy = false, isChild = false) {
    this.id = id;
    this.name = name;
    this.gender = gender; // 'male' | 'female'
    this.isChief = isChief;
    this.isEnemy = isEnemy;
    this.isChild = isChild;
    this.age = isChild ? 4 : isChief ? 35 : 18 + Math.floor(Math.random() * 10);
    this.ageTimer = 0;
    this.ageStage = isChild ? 'child' : 'adult';
    this.growthProgress = isChild ? 0 : 100;

    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.isMoving = false;
    this.selected = false;
    this.groupId = null;

    this.facing = 0;
    this.flipX = false;
    this.facingBack = false;
    this.facingCardinal = 'diag_front'; // 'south' | 'north' | 'diag_front' | 'diag_back'

    // 'idle' | 'walking' | 'chopping' | 'mining' | 'foraging' | 'carrying'
    // 'hunting' | 'fighting' | 'building' | 'eating' | 'sleeping' | 'relaxing'
    // 'breeding' | 'playing' | 'rallying' | 'fishing' | 'praying' | 'crafting'
    // 'tending' | 'training'
    this.state = isChild ? 'playing' : 'idle';
    this.animFrame = 0;
    this.animTimer = 0;

    // Warrior Promotion, Star Rank (0..3), Weapon, Role & Stealth
    this.isWarrior = false;
    this.warriorStars = 0;
    this.trainingTime = 0;
    this.warriorMode = 'javelin'; // 'javelin' | 'bow'
    this.weapon = 'none'; // 'none' | 'club' | 'stone' | 'spear' | 'stone_axe' | 'bone_mace' | 'tomahawk'
    this.role = isChief ? 'chief' : null; // null | 'chief' | 'cook' | 'armourer' | 'dj' | 'shaman' | 'pia_scout' | 'guard'
    this.assignedBuildingId = null;

    this.isStealthed = false;
    this.stealthCooldown = 0;

    // Magical & Tactical Status Effects (Sanctuary Spells & Armoury Traps)
    this.isProtected = false;
    this.protectionTimer = 0;
    this.isInfected = false;
    this.infectionTimer = 0;
    this.stunTimer = 0;

    // Transient animation timers
    this.hurtTimer = 0;
    this.cheerTimer = 0;
    this.commandTimer = 0;

    // Vitals
    this.health = isEnemy ? 75 : isChild ? 60 : isChief ? 140 : 100;
    this.maxHealth = isEnemy ? 75 : isChild ? 60 : isChief ? 140 : 100;
    this.hunger = isChild ? 15 : 20;
    this.tiredness = isChild ? 10 : 15;
    this.happiness = isChild ? 95 : 85;

    // Full Skill Set (Gather, Craft, Cook, DJ, Heal, Scout, Combat)
    this.skills = {
      woodcutting: 1,
      mining: 1,
      foraging: 1,
      hunting: 1,
      building: 1,
      combat: isChief ? 3 : isEnemy ? 2 : 1,
      melee: isChief ? 4 : isEnemy ? 2 : 1,
      throwing: isEnemy ? 2 : 1,
      scouting: 1,
      crafting: 1,
      cooking: 1,
      dj: 1,
      healing: 1
    };
    this.skillXp = {
      woodcutting: 0,
      mining: 0,
      foraging: 0,
      hunting: 0,
      building: 0,
      combat: 0,
      melee: 0,
      throwing: 0,
      scouting: 0,
      crafting: 0,
      cooking: 0,
      dj: 0,
      healing: 0
    };

    this.hasChiefAura = false;
    this.viewRadius = isChief ? 7 : 5;
    this.combatSkill = isChief ? 18 : isEnemy ? 12 : 10;
    this.speed = isEnemy ? 2.15 : isChild ? 2.3 : 2.65;

    this.cargo = {
      type: null,
      amount: 0,
      max: 15
    };

    this.targetResource = null;
    this.targetAnimal = null;
    this.targetEnemy = null;
    this.targetBuilding = null;
    this.targetPartner = null;
    this.lastWorkTarget = null;
    this.lastWorkState = null;

    this.workTimer = 0;
    this.attackCooldown = 0;
    this.breedCooldown = isChild ? 45 : 15;
    this.rallyTimer = 0;
    this.wanderTimer = 2.0 + Math.random() * 4.0;
    this.justGrewUp = false;
  }

  equipWeapon(weaponId) {
    if (!WEAPON_DEFS[weaponId]) return false;
    this.weapon = weaponId;
    const def = WEAPON_DEFS[weaponId];
    if (def.type === 'ranged') {
      this.warriorMode = 'javelin';
    }
    this.combatSkill = this.getCombatDamage(false);
    return true;
  }

  getEfficiencyMultiplier() {
    const auraBonus = this.hasChiefAura ? 1.25 : 1.0;
    const happyBonus = this.happiness >= 75 ? 1.15 : this.happiness < 35 ? 0.75 : 1.0;
    return auraBonus * happyBonus;
  }

  getWarriorStats() {
    if (!this.isWarrior || this.warriorStars <= 0) return null;
    return WARRIOR_STAR_TIERS[Math.min(3, this.warriorStars)];
  }

  getTrainingProgress() {
    if (this.warriorStars >= 3) return 100;
    const prevReq = this.warriorStars === 0 ? 0 : WARRIOR_TRAINING_THRESHOLDS[this.warriorStars - 1];
    const nextReq = WARRIOR_TRAINING_THRESHOLDS[this.warriorStars];
    return Math.min(100, Math.max(0, ((this.trainingTime - prevReq) / (nextReq - prevReq)) * 100));
  }

  addTrainingTime(dt, schoolType = 'gym') {
    if (this.isChild || this.isChief || this.warriorStars >= 3) {
      return { promoted: false, newStar: this.warriorStars };
    }
    this.trainingTime += dt;
    if (schoolType === 'pia_center') {
      this.gainSkillXp('scouting', dt * 14);
      this.role = 'pia_scout';
      this.viewRadius = Math.min(10, 6 + this.warriorStars);
    } else if (schoolType === 'range') {
      this.gainSkillXp('throwing', dt * 14);
      this.warriorMode = 'bow';
    } else {
      this.gainSkillXp('melee', dt * 14);
    }

    let targetStars = 0;
    for (let i = 0; i < WARRIOR_TRAINING_THRESHOLDS.length; i++) {
      if (this.trainingTime >= WARRIOR_TRAINING_THRESHOLDS[i]) {
        targetStars = i + 1;
      }
    }
    if (targetStars > this.warriorStars) {
      this.warriorStars = targetStars;
      this.isWarrior = true;
      const tier = WARRIOR_STAR_TIERS[targetStars];
      this.maxHealth = tier.maxHp;
      this.health = tier.maxHp;
      this.speed = tier.speed;
      this.skills.combat = Math.max(this.skills.combat, 2 + targetStars * 2);
      if (schoolType === 'pia_center') {
        this.skills.scouting = Math.max(this.skills.scouting, 3 + targetStars * 2);
        this.viewRadius = 6 + targetStars * 1.5;
      }
      this.combatSkill = this.getCombatDamage(false);
      this.cheerTimer = 1.8;
      return { promoted: true, newStar: targetStars };
    }
    return { promoted: false, newStar: this.warriorStars };
  }

  getAttackRange() {
    const wDef = WEAPON_DEFS[this.weapon];
    const wRange = wDef && wDef.type === 'ranged' ? wDef.range : 1.35;
    const stats = this.getWarriorStats();
    if (!stats) return wRange;
    const starRange = this.warriorMode === 'bow' ? stats.bowRange : stats.javelinRange;
    return Math.max(wRange, starRange);
  }

  getAttackCooldown() {
    const stats = this.getWarriorStats();
    if (!stats) return 0.88;
    return this.warriorMode === 'bow' ? stats.bowCd : stats.javelinCd;
  }

  getDetectRadius() {
    const stats = this.getWarriorStats();
    if (this.isStealthed) {
      const scoutBonus = Math.max(0, (this.skills.scouting - 3) * 0.15);
      const base = stats ? stats.detectRadius : 1.9;
      return Math.max(0.7, base - scoutBonus);
    }
    return this.viewRadius || 6.0;
  }

  getCombatDamage(isAmbush = false) {
    const wDef = WEAPON_DEFS[this.weapon] || WEAPON_DEFS.none;
    const weaponDmg = wDef.damage || 0;
    const meleeIdx = Math.min(MELEE_DAMAGE_BY_SKILL.length - 1, Math.max(0, (this.skills.melee || 1) - 1));
    const meleeTableBonus = MELEE_DAMAGE_BY_SKILL[meleeIdx] * 2;

    const stats = this.getWarriorStats();
    if (stats) {
      const weaponBase = this.warriorMode === 'bow' ? stats.bowDmg : stats.javelinDmg;
      const skillBonus = (this.skills.combat - 1) * 2 + weaponDmg * 3;
      const auraMult = this.hasChiefAura ? 1.25 : 1.0;
      const ambushMult = isAmbush ? stats.ambushMult : 1.0;
      return Math.round((weaponBase + skillBonus) * auraMult * ambushMult);
    }
    const base = (this.isChief ? 18 : this.isEnemy ? 11 : 8) + (this.skills.combat - 1) * 2 + weaponDmg * 3 + Math.floor(meleeTableBonus * 0.5);
    return Math.round(base * (this.hasChiefAura ? 1.25 : 1.0));
  }

  applyDamage(rawDamage) {
    if (this.health <= 0) return true;
    const dmg = this.isProtected ? Math.max(1, Math.round(rawDamage * 0.5)) : rawDamage;
    this.health = Math.max(0, this.health - dmg);
    this.hurtTimer = 0.35;
    this.isStealthed = false;
    return this.health <= 0;
  }

  gainSkillXp(skillName, amount = 10) {
    if (this.skills[skillName] === undefined || this.isChild || this.isEnemy) return false;
    this.skillXp[skillName] = (this.skillXp[skillName] || 0) + amount;
    const nextThreshold = this.skills[skillName] * 40;
    if (this.skillXp[skillName] >= nextThreshold && this.skills[skillName] < 10) {
      this.skillXp[skillName] -= nextThreshold;
      this.skills[skillName]++;
      if (skillName === 'combat' || skillName === 'melee') {
        this.combatSkill = this.getCombatDamage();
      }
      if (skillName === 'scouting') {
        this.viewRadius = Math.min(10, 5 + Math.floor(this.skills.scouting / 2));
      }
      return true;
    }
    return false;
  }

  faceTowards(tx, ty) {
    const dx = tx - this.x;
    const dy = ty - this.y;
    if (Math.hypot(dx, dy) < 0.05) return;

    const screenDx = dx - dy;
    const screenDy = dx + dy;
    const absDx = Math.abs(screenDx);
    const absDy = Math.abs(screenDy);

    if (absDx < absDy * 0.42) {
      this.facingCardinal = screenDy >= 0 ? 'south' : 'north';
      this.facingBack = screenDy < 0;
      this.flipX = false;
    } else {
      this.facingBack = screenDy < -0.05;
      this.facingCardinal = this.facingBack ? 'diag_back' : 'diag_front';
      this.flipX = screenDx < 0;
    }
  }

  moveTo(targetX, targetY) {
    this.targetX = targetX;
    this.targetY = targetY;
    this.isMoving = true;
    this.faceTowards(targetX, targetY);
  }

  update(dt) {
    this.animTimer += dt;
    const fastAnim =
      this.state === 'chopping' ||
      this.state === 'mining' ||
      this.state === 'foraging' ||
      this.state === 'building' ||
      this.state === 'hunting' ||
      this.state === 'fighting' ||
      this.state === 'crafting' ||
      this.state === 'training' ||
      this.state === 'praying';
    const frameInterval = fastAnim ? 0.24 : 0.18;
    if (this.animTimer >= frameInterval) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 6;
    }

    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.stealthCooldown > 0) this.stealthCooldown = Math.max(0, this.stealthCooldown - dt);
    if (this.breedCooldown > 0) this.breedCooldown = Math.max(0, this.breedCooldown - dt);
    if (this.hurtTimer > 0) this.hurtTimer = Math.max(0, this.hurtTimer - dt);
    if (this.cheerTimer > 0) this.cheerTimer = Math.max(0, this.cheerTimer - dt);
    if (this.commandTimer > 0) this.commandTimer = Math.max(0, this.commandTimer - dt);

    if (this.isProtected) {
      this.protectionTimer -= dt;
      if (this.protectionTimer <= 0) {
        this.isProtected = false;
        this.protectionTimer = 0;
      }
    }

    if (this.isInfected) {
      this.infectionTimer -= dt;
      this.health = Math.max(0, this.health - 3.2 * dt);
      if (this.infectionTimer <= 0) {
        this.isInfected = false;
      }
    }

    if (this.stunTimer > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - dt);
    }

    if (this.rallyTimer > 0) {
      this.rallyTimer = Math.max(0, this.rallyTimer - dt);
      if (this.rallyTimer === 0 && this.state === 'rallying') {
        this.state = 'idle';
      }
    }

    // Aging counter (1 game year every 60 real seconds)
    this.ageTimer += dt;
    if (this.ageTimer >= 60) {
      this.ageTimer -= 60;
      this.age++;
    }

    if (this.isChild && !this.isEnemy) {
      const growthRate = this.hunger < 70 && this.happiness > 50 ? 2.4 : 1.2;
      this.growthProgress = Math.min(100, this.growthProgress + dt * growthRate);
      if (this.growthProgress >= 100) {
        this.isChild = false;
        this.age = Math.max(12, this.age);
        this.ageStage = 'adult';
        this.maxHealth = 100;
        this.health = 100;
        this.speed = 2.65;
        this.state = 'idle';
        this.cheerTimer = 2.0;
        this.justGrewUp = true;
      }
    }

    if (this.isMoving && this.stunTimer <= 0) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 0.15) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.isMoving = false;
      } else {
        const stats = this.getWarriorStats();
        const stealthMult = this.isStealthed && stats ? stats.stealthSpeedMult : 1.0;
        const happyMoveMult = this.happiness < 20 ? 0.72 : 1.0;
        const moveSpeed = this.speed * stealthMult * happyMoveMult * (this.hasChiefAura ? 1.15 : 1.0);
        const step = Math.min(dist, moveSpeed * dt);
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
        this.facing = IsometricMath.getDirection8(dx, dy);
        this.faceTowards(this.targetX, this.targetY);
      }
    }

    if (!this.isEnemy) {
      if (this.state !== 'eating') {
        this.hunger = Math.min(100, this.hunger + dt * 0.35);
      }
      if (this.state !== 'sleeping') {
        this.tiredness = Math.min(100, this.tiredness + dt * 0.22);
      }

      if (this.hunger > 80 || this.tiredness > 80) {
        this.happiness = Math.max(0, this.happiness - dt * 0.7);
      }
    }
  }
}
