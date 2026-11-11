export class ResourceNode {
  constructor(id, type, x, y, amount = 50) {
    this.id = id;
    this.type = type; // 'tree' | 'rock' | 'berry_bush'
    this.x = x;
    this.y = y;
    this.amount = amount;
    this.maxAmount = amount;
    this.isDepleted = false;
    this.regrowthTimer = 0;
    this.maxRegrowthTime = 45.0; // 45 seconds to regrow berries
  }

  harvest(harvestAmount = 5) {
    if (this.isDepleted) return 0;

    const gathered = Math.min(this.amount, harvestAmount);
    this.amount -= gathered;

    if (this.amount <= 0) {
      this.isDepleted = true;
      this.regrowthTimer = this.maxRegrowthTime;
    }

    return gathered;
  }

  update(dt) {
    if (this.isDepleted) {
      this.regrowthTimer -= dt;
      if (this.regrowthTimer <= 0) {
        this.isDepleted = false;
        this.amount = this.maxAmount;
      }
    }
  }
}
