import { IsometricMath } from '../core/IsometricMath.js';

export class Animal {
  constructor(id, type, x, y) {
    this.id = id;
    this.type = type; // 'boar' | 'mammoth' | 'tiger' | 'triceratops' | 'brontosaurus'
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.isMoving = false;
    this.facing = 0;
    this.flipX = false;
    this.facingBack = false;
    this.attackTimer = 0;

    if (type === 'mammoth') {
      this.name = 'Woolly Mammoth';
      this.health = 160;
      this.maxHealth = 160;
      this.foodYield = 120;
      this.boneYield = 40;
      this.speed = 1.0;
      this.size = 2.0;
    } else if (type === 'tiger') {
      this.name = 'Sabertooth Tiger';
      this.health = 70;
      this.maxHealth = 70;
      this.foodYield = 50;
      this.boneYield = 25;
      this.speed = 2.4;
      this.size = 1.2;
    } else if (type === 'triceratops') {
      this.name = 'Triceratops';
      this.health = 180;
      this.maxHealth = 180;
      this.foodYield = 140;
      this.boneYield = 50;
      this.speed = 1.1;
      this.size = 1.8;
    } else if (type === 'brontosaurus') {
      this.name = 'Brontosaurus';
      this.health = 240;
      this.maxHealth = 240;
      this.foodYield = 200;
      this.boneYield = 80;
      this.speed = 0.8;
      this.size = 2.4;
    } else if (type === 'trex') {
      this.name = 'T-Rex Apex';
      this.health = 280;
      this.maxHealth = 280;
      this.foodYield = 220;
      this.boneYield = 90;
      this.speed = 2.05;
      this.size = 2.1;
    } else {
      // Wild Boar
      this.name = 'Wild Boar';
      this.health = 40;
      this.maxHealth = 40;
      this.foodYield = 35;
      this.boneYield = 10;
      this.speed = 1.8;
      this.size = 0.9;
    }

    this.isDead = false;
    this.carcassHarvested = false;
    this.wanderTimer = 2.0 + Math.random() * 4.0;
  }

  get isAttacking() {
    return this.attackTimer > 0;
  }

  takeDamage(amount, attackerX = null, attackerY = null) {
    if (this.isDead) return;
    this.health = Math.max(0, this.health - amount);
    this.attackTimer = 1.2; // flash fierce attack stance when hit
    if (attackerX !== null && attackerY !== null) {
      const dx = attackerX - this.x;
      const dy = attackerY - this.y;
      const screenDx = dx - dy;
      if (Math.abs(screenDx) > 0.05) {
        this.flipX = screenDx < 0;
        this.facingBack = false; // face toward threat during attack animation
      }
    }
    if (this.health <= 0) {
      this.isDead = true;
      this.isMoving = false;
      this.attackTimer = 0;
    }
  }

  update(dt, mapWidth = 40, mapHeight = 32) {
    if (this.isDead) return;

    if (this.attackTimer > 0) {
      this.attackTimer = Math.max(0, this.attackTimer - dt);
    }

    if (this.isMoving) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 0.1) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.isMoving = false;
      } else {
        const step = Math.min(dist, this.speed * dt);
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
        this.facing = IsometricMath.getDirection8(dx, dy);
        const screenDx = dx - dy;
        const screenDy = dx + dy;
        if (Math.abs(screenDx) > 0.02) {
          this.flipX = screenDx < 0;
        }
        if (Math.abs(screenDy) > 0.02 && this.attackTimer <= 0) {
          this.facingBack = screenDy < -0.02;
        }
      }
    } else {
      this.wanderTimer -= dt;
      if (this.wanderTimer <= 0) {
        this.wanderTimer = 3.0 + Math.random() * 6.0;
        const newX = Math.max(2, Math.min(mapWidth - 3, this.x + (-3 + Math.floor(Math.random() * 7))));
        const newY = Math.max(2, Math.min(mapHeight - 3, this.y + (-3 + Math.floor(Math.random() * 7))));
        this.targetX = newX;
        this.targetY = newY;
        this.isMoving = true;
      }
    }
  }
}
