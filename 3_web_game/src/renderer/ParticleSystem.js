export class Particle {
  constructor(x, y, vx, vy, color, size, life, gravity = 0) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = life;
    this.life = life;
    this.gravity = gravity;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vy += this.gravity * dt;
    this.life -= dt;
  }

  render(ctx) {
    if (this.life <= 0) return;
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.5, this.size * alpha), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class FloatingText {
  constructor(x, y, text, color, fontSize = 12, life = 1.2) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
    this.maxLife = life;
    this.life = life;
    this.vy = -28; // float upward
  }

  update(dt) {
    this.y += this.vy * dt;
    this.life -= dt;
  }

  render(ctx) {
    if (this.life <= 0) return;
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${Math.floor(this.fontSize)}px sans-serif`;
    ctx.textAlign = 'center';
    // Shadow outline
    ctx.fillStyle = '#000000';
    ctx.fillText(this.text, this.x + 1, this.y + 1);
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.floatingTexts = [];
  }

  spawnWoodChips(screenX, screenY, zoom) {
    const colors = ['#b45309', '#d97706', '#f59e0b', '#78350f'];
    for (let i = 0; i < 7; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (20 + Math.random() * 40) * zoom;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 22 * zoom; // upward kick
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = (2 + Math.random() * 2.5) * zoom;
      const life = 0.4 + Math.random() * 0.3;
      this.particles.push(new Particle(screenX, screenY, vx, vy, color, size, life, 120 * zoom));
    }
  }

  spawnStoneSparks(screenX, screenY, zoom) {
    const colors = ['#94a3b8', '#cbd5e1', '#f1f5f9', '#fde047', '#f59e0b'];
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (25 + Math.random() * 50) * zoom;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 30 * zoom;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = (1.5 + Math.random() * 2.2) * zoom;
      const life = 0.3 + Math.random() * 0.25;
      this.particles.push(new Particle(screenX, screenY, vx, vy, color, size, life, 150 * zoom));
    }
  }

  spawnSmokePuff(screenX, screenY, zoom) {
    const colors = ['#94a3b8', '#cbd5e1', '#64748b', '#475569'];
    const vx = (-6 + Math.random() * 12) * zoom;
    const vy = (-28 - Math.random() * 20) * zoom;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = (4 + Math.random() * 4) * zoom;
    const life = 1.0 + Math.random() * 0.7;
    this.particles.push(new Particle(screenX, screenY, vx, vy, color, size, life, -4 * zoom));
  }

  spawnFireEmbers(screenX, screenY, zoom) {
    const colors = ['#f59e0b', '#ef4444', '#facc15', '#f97316'];
    const vx = (-10 + Math.random() * 20) * zoom;
    const vy = (-20 - Math.random() * 30) * zoom;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = (1.5 + Math.random() * 2) * zoom;
    const life = 0.5 + Math.random() * 0.4;
    this.particles.push(new Particle(screenX, screenY, vx, vy, color, size, life, -8 * zoom));
  }

  spawnFootstepDust(screenX, screenY, zoom) {
    const vx = (-10 + Math.random() * 20) * zoom;
    const vy = (-5 + Math.random() * 5) * zoom;
    const color = '#a8a29e';
    const size = (2 + Math.random() * 2) * zoom;
    const life = 0.3 + Math.random() * 0.2;
    this.particles.push(new Particle(screenX, screenY, vx, vy, color, size, life, 0));
  }

  spawnFoliageBurst(screenX, screenY, zoom) {
    const colors = ['#15803d', '#22c55e', '#4ade80', '#166534', '#86efac'];
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (22 + Math.random() * 44) * zoom;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed - 24 * zoom;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = (2.5 + Math.random() * 2.5) * zoom;
      const life = 0.45 + Math.random() * 0.35;
      this.particles.push(new Particle(screenX, screenY, vx, vy, color, size, life, 75 * zoom));
    }
  }

  spawnFloatingText(screenX, screenY, text, color = '#facc15', zoom = 1.0) {
    const fontSize = Math.max(11, 13 * zoom);
    this.floatingTexts.push(new FloatingText(screenX, screenY, text, color, fontSize));
  }

  update(dt) {
    // Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.update(dt);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    // Floating text
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const t = this.floatingTexts[i];
      t.update(dt);
      if (t.life <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }

  render(ctx) {
    for (const p of this.particles) {
      p.render(ctx);
    }
    for (const t of this.floatingTexts) {
      t.render(ctx);
    }
  }
}
