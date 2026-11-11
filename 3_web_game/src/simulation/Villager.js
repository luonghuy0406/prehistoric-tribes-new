import { IsometricMath } from '../core/IsometricMath.js';

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
    this.ageStage = isChild ? 'child' : 'adult';
    this.growthProgress = isChild ? 0 : 100;

    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.isMoving = false;

    this.facing = 0;
    this.flipX = false;
    this.facingBack = false;
    this.facingCardinal = 'diag_front'; // 'south' | 'north' | 'diag_front' | 'diag_back'

    // Rich Work, Combat & Life States:
    // 'idle' | 'walking' | 'chopping' | 'mining' | 'foraging' | 'carrying'
    // 'hunting' | 'fighting' | 'building' | 'eating' | 'sleeping' | 'relaxing'
    // 'breeding' | 'playing' | 'rallying' | 'fishing' | 'praying' | 'crafting'
    // 'tending' | 'training'
    this.state = isChild ? 'playing' : 'idle';
    this.animFrame = 0;
    this.animTimer = 0;

    // Warrior Promotion, Star Rank (0..3), Combat Skills & Stealth
    this.isWarrior = false;
    this.warriorStars = 0; // 0 = Civilian, 1 = 1★ Recruit, 2 = 2★ Veteran, 3 = 3★ Master (Max)
    this.trainingTime = 0; // Accumulated seconds trained at Training Ground
    this.warriorMode = 'javelin'; // 'javelin' | 'bow'
    this.isStealthed = false;
    this.stealthCooldown = 0;

    // Reactive Transient Poses (Hurt, Victory Cheer, Chief Command)
    this.hurtTimer = 0;
    this.cheerTimer = 0;
    this.commandTimer = 0;

    // Vitals
    this.health = isEnemy ? 80 : isChild ? 60 : 100;
    this.maxHealth = isEnemy ? 80 : isChild ? 60 : 100;
    this.hunger = isChild ? 15 : 20;
    this.tiredness = isChild ? 10 : 15;
    this.happiness = isChild ? 95 : 85;

    // RPG Skill Levels & XP
    this.skills = {
      woodcutting: 1,
      mining: 1,
      foraging: 1,
      hunting: 1,
      building: 1,
      combat: isChief ? 3 : isEnemy ? 2 : 1
    };
    this.skillXp = {
      woodcutting: 0,
      mining: 0,
      foraging: 0,
      hunting: 0,
      building: 0,
      combat: 0
    };

    this.hasChiefAura = false;
    this.combatSkill = isChief ? 18 : isEnemy ? 12 : 10;
    this.speed = isEnemy ? 2.1 : isChild ? 2.3 : 2.6;

    // Inventory Cargo (Carrier Loop)
    this.cargo = {
      type: null,
      amount: 0,
      max: 15
    };

    // Task Targets
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

  addTrainingTime(dt) {
    if (this.isChild || this.isChief || this.isEnemy || this.warriorStars >= 3) {
      return { promoted: false, newStar: this.warriorStars };
    }
    this.trainingTime += dt;
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
      this.combatSkill = this.getCombatDamage(false);
      this.cheerTimer = 1.8;
      return { promoted: true, newStar: targetStars };
    }
    return { promoted: false, newStar: this.warriorStars };
  }

  getAttackRange() {
    const stats = this.getWarriorStats();
    if (!stats) return 1.3;
    return this.warriorMode === 'bow' ? stats.bowRange : stats.javelinRange;
  }

  getAttackCooldown() {
    const stats = this.getWarriorStats();
    if (!stats) return 0.85;
    return this.warriorMode === 'bow' ? stats.bowCd : stats.javelinCd;
  }

  getDetectRadius() {
    const stats = this.getWarriorStats();
    if (this.isStealthed && stats) return stats.detectRadius;
    return 8.0;
  }

  getCombatDamage(isAmbush = false) {
    const stats = this.getWarriorStats();
    if (stats) {
      const weaponBase = this.warriorMode === 'bow' ? stats.bowDmg : stats.javelinDmg;
      const skillBonus = (this.skills.combat - 1) * 2;
      const auraMult = this.hasChiefAura ? 1.25 : 1.0;
      const ambushMult = isAmbush ? stats.ambushMult : 1.0;
      return Math.round((weaponBase + skillBonus) * auraMult * ambushMult);
    }
    const base = this.isChief ? 18 : this.isEnemy ? 12 : 9 + (this.skills.combat - 1) * 3;
    return Math.round(base * (this.hasChiefAura ? 1.25 : 1.0));
  }

  gainSkillXp(skillName, amount = 10) {
    if (!this.skills[skillName] || this.isChild || this.isEnemy) return false;
    this.skillXp[skillName] += amount;
    const nextThreshold = this.skills[skillName] * 40;
    if (this.skillXp[skillName] >= nextThreshold && this.skills[skillName] < 10) {
      this.skillXp[skillName] -= nextThreshold;
      this.skills[skillName]++;
      if (skillName === 'combat') {
        this.combatSkill = this.getCombatDamage();
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
      // Cardinal vertical screen movement (Straight South or Straight North)
      this.facingCardinal = screenDy >= 0 ? 'south' : 'north';
      this.facingBack = screenDy < 0;
      this.flipX = false;
    } else {
      // Isometric diagonal movement (SE, SW, NE, NW)
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
      this.state === 'training';
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
    if (this.rallyTimer > 0) {
      this.rallyTimer = Math.max(0, this.rallyTimer - dt);
      if (this.rallyTimer === 0 && this.state === 'rallying') {
        this.state = 'idle';
      }
    }

    if (this.isChild && !this.isEnemy) {
      const growthRate = this.hunger < 70 && this.happiness > 50 ? 2.4 : 1.2;
      this.growthProgress = Math.min(100, this.growthProgress + dt * growthRate);
      if (this.growthProgress >= 100) {
        this.isChild = false;
        this.ageStage = 'adult';
        this.maxHealth = 100;
        this.health = 100;
        this.speed = 2.6;
        this.state = 'idle';
        this.cheerTimer = 2.0;
        this.justGrewUp = true;
      }
    }

    if (this.isMoving) {
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
        const moveSpeed = this.speed * stealthMult * (this.hasChiefAura ? 1.15 : 1.0);
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
