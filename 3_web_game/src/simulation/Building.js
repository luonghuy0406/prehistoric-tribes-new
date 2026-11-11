/**
 * Building.js — Thực thể Công trình (Lv1-Lv3), nâng cấp, sửa chữa, và Bẫy phòng thủ.
 * Tham số chuẩn hóa 100% từ GameData.js (dịch ngược từ Prehistoric Tribes).
 */
import { BUILDING_DEFS_AUTH, TRAP_DEFS } from '../data/GameData.js';

export const BUILDING_DEFS = BUILDING_DEFS_AUTH;

export class Building {
  constructor(id, type, x, y, isCompleted = false, owner = 'player', level = 1) {
    this.id = id;
    this.type = type;
    this.owner = owner;
    this.def = BUILDING_DEFS[type] || BUILDING_DEFS.hut;
    this.name = this.def.name;
    this.vnName = this.def.vnName || this.def.name;
    this.x = x;
    this.y = y;
    this.width = this.def.width;
    this.height = this.def.height;

    this.level = Math.max(1, Math.min(3, level));
    this.maxHealth = (this.def.maxHpLevels && this.def.maxHpLevels[this.level - 1]) || 60;
    this.health = isCompleted ? this.maxHealth : Math.max(12, Math.floor(this.maxHealth * 0.25));
    this.progress = isCompleted ? 100 : 0;
    this.isCompleted = isCompleted;
    this.state = isCompleted ? 'normal' : 'building'; // 'building' | 'normal' | 'upgrading' | 'repairing'

    this.occupants = [];
    this.keeperId = null;
    this.productionQueue = [];
    this.productionTimer = 0;
    this.fireCooldown = 0;
    this.selected = false;
    this.isPrisonHut = false;
  }

  getCapacity() {
    if (this.def.capacityLevels) {
      return this.def.capacityLevels[Math.min(2, this.level - 1)] || 0;
    }
    return 0;
  }

  getHappinessBonus() {
    if (!this.isCompleted) return 0;
    if (this.def.happinessLevels) {
      return this.def.happinessLevels[Math.min(2, this.level - 1)] || 0;
    }
    return 0;
  }

  canUpgrade(maxAllowedLevel) {
    const cap = maxAllowedLevel || this.def.maxLevelDefault || 1;
    return this.isCompleted && this.state === 'normal' && this.level < Math.min(3, cap);
  }

  startUpgrade() {
    if (this.state !== 'normal' || !this.isCompleted) return false;
    this.state = 'upgrading';
    this.progress = 0;
    return true;
  }

  startRepair() {
    if (!this.isCompleted || this.health >= this.maxHealth) return false;
    this.state = 'repairing';
    this.progress = Math.floor((this.health / this.maxHealth) * 100);
    return true;
  }

  cancelWork() {
    if (this.state === 'upgrading' || this.state === 'repairing') {
      this.state = 'normal';
      this.progress = 100;
    }
  }

  build(workAmount) {
    if (this.state === 'building') {
      this.progress = Math.min(100, this.progress + workAmount);
      this.health = Math.min(this.maxHealth, Math.max(12, Math.floor(this.maxHealth * (this.progress / 100))));
      if (this.progress >= 100) {
        this.isCompleted = true;
        this.state = 'normal';
        this.health = this.maxHealth;
        return 'completed';
      }
      return 'working';
    }

    if (this.state === 'upgrading') {
      this.progress = Math.min(100, this.progress + workAmount * 0.85);
      if (this.progress >= 100) {
        this.level = Math.min(3, this.level + 1);
        this.maxHealth = (this.def.maxHpLevels && this.def.maxHpLevels[this.level - 1]) || (this.maxHealth + 20);
        this.health = this.maxHealth;
        this.state = 'normal';
        this.progress = 100;
        return 'upgraded';
      }
      return 'working';
    }

    if (this.state === 'repairing') {
      this.health = Math.min(this.maxHealth, this.health + workAmount * 0.8);
      this.progress = Math.floor((this.health / this.maxHealth) * 100);
      if (this.health >= this.maxHealth) {
        this.health = this.maxHealth;
        this.state = 'normal';
        this.progress = 100;
        return 'repaired';
      }
      return 'working';
    }

    return 'idle';
  }

  takeDamage(amount) {
    this.health = Math.max(0, this.health - amount);
    return this.health <= 0;
  }
}

export class Trap {
  constructor(id, type, x, y, owner = 'player', armed = false) {
    this.id = id;
    this.type = type;
    this.def = TRAP_DEFS[type] || TRAP_DEFS.net_trap;
    this.name = this.def.name;
    this.x = x;
    this.y = y;
    this.owner = owner;
    this.isArmed = armed;
    this.isSprung = false;
    this.isRevealed = owner === 'player';
    this.progress = armed ? 100 : 0;
  }
}
