export class DayNightCycle {
  constructor(dayDurationSeconds = 180) {
    this.dayDurationSeconds = dayDurationSeconds;
    this.time = 8.0; // Start at 8:00 AM
    this.dayCount = 1;
  }

  update(dt) {
    const hoursPerSecond = 24.0 / this.dayDurationSeconds;
    this.time += dt * hoursPerSecond;
    if (this.time >= 24.0) {
      this.time -= 24.0;
      this.dayCount++;
    }
  }

  getFormattedTime() {
    const hours = Math.floor(this.time);
    const minutes = Math.floor((this.time - hours) * 60);
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    return `Day ${this.dayCount} — ${hh}:${mm} ${period}`;
  }

  renderLighting(ctx, width, height, lightSources = []) {
    let color = 'rgba(0, 0, 0, 0)';
    let intensity = 0;

    // Time curve:
    // 08:00 - 16:30 -> Day (intensity 0)
    // 16:30 - 19:30 -> Dusk / Sunset (warm orange/purple)
    // 19:30 - 05:00 -> Night (deep blue/black, intensity up to 0.55)
    // 05:00 - 08:00 -> Dawn (rose / golden glow)

    if (this.time >= 8.0 && this.time < 16.5) {
      // Full daylight
      return;
    } else if (this.time >= 16.5 && this.time < 19.5) {
      // Sunset / Dusk
      const t = (this.time - 16.5) / 3.0;
      intensity = t * 0.35;
      color = `rgba(217, 119, 6, ${intensity})`; // Amber sunset
    } else if (this.time >= 19.5 || this.time < 5.0) {
      // Midnight
      let t = 1.0;
      if (this.time >= 19.5) {
        t = Math.min(1.0, (this.time - 19.5) / 2.0);
      } else {
        t = Math.max(0.7, 1.0 - this.time / 5.0);
      }
      intensity = 0.52 * t;
      color = `rgba(15, 23, 42, ${intensity})`; // Deep navy night
    } else if (this.time >= 5.0 && this.time < 8.0) {
      // Dawn / Sunrise
      const t = 1.0 - (this.time - 5.0) / 3.0;
      intensity = t * 0.3;
      color = `rgba(244, 63, 94, ${intensity})`; // Rose dawn
    }

    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);

    // Render warm glowing torch circles around buildings / campfires during dusk/night
    if (intensity > 0.1 && lightSources.length > 0) {
      ctx.globalCompositeOperation = 'destination-out';
      for (const light of lightSources) {
        const rad = light.radius || 70;
        const grad = ctx.createRadialGradient(light.x, light.y, 10, light.x, light.y, rad);
        grad.addColorStop(0, `rgba(0, 0, 0, ${intensity * 0.85})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(light.x, light.y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }
}
