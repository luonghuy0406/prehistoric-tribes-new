import { IsometricMath } from '../core/IsometricMath';

export type Gender = 'male' | 'female';
export type VillagerState = 'idle' | 'walking' | 'gathering' | 'building' | 'resting' | 'eating';

export class Villager {
  public id: number;
  public name: string;
  public gender: Gender;
  public isChief: boolean = false;

  // Grid position (floating point)
  public x: number;
  public y: number;

  // Movement Target
  public targetX: number;
  public targetY: number;
  public isMoving: boolean = false;

  // Visual Orientation & Animation
  public facing: number = 0; // 0..7
  public state: VillagerState = 'idle';
  public animFrame: number = 0;
  public animTimer: number = 0;

  // Vitals & Needs (0 .. 100)
  public health: number = 100;
  public maxHealth: number = 100;
  public hunger: number = 20;     // Higher = more hungry
  public tiredness: number = 15;  // Higher = more tired
  public happiness: number = 85;  // Higher = happier

  // Skills
  public gatheringSkill: number = 10;
  public buildingSkill: number = 10;
  public combatSkill: number = 5;

  public speed: number = 2.5; // Grid tiles per second

  constructor(id: number, name: string, gender: Gender, x: number, y: number, isChief: boolean = false) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.isChief = isChief;
  }

  public moveTo(targetX: number, targetY: number): void {
    this.targetX = targetX;
    this.targetY = targetY;
    this.isMoving = true;
    this.state = 'walking';
  }

  public update(dt: number): void {
    // Animation frame tick
    this.animTimer += dt;
    if (this.animTimer >= 0.15) {
      this.animTimer = 0;
      this.animFrame = (this.animFrame + 1) % 4;
    }

    // Movement update
    if (this.isMoving) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 0.1) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.isMoving = false;
        this.state = 'idle';
      } else {
        const step = Math.min(dist, this.speed * dt);
        this.x += (dx / dist) * step;
        this.y += (dy / dist) * step;
        this.facing = IsometricMath.getDirection8(dx, dy);
      }
    }

    // Passive needs progression
    this.hunger = Math.min(100, this.hunger + dt * 0.5);
    this.tiredness = Math.min(100, this.tiredness + dt * 0.3);

    if (this.hunger > 80 || this.tiredness > 80) {
      this.happiness = Math.max(0, this.happiness - dt * 1.0);
    }
  }
}
