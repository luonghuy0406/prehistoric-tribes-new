import { IsometricMath } from '../core/IsometricMath.js';

export class SpriteRenderer {
  constructor(assets = null) {
    this.assets = assets;
    this.animTime = 0;
  }

  update(dt) {
    this.animTime += dt;
  }

  appendRenderables(renderList, villagers, selectedVillagerId, camera) {
    for (const v of villagers) {
      const worldPos = IsometricMath.tileToWorld(v.x, v.y);
      const screenPos = camera.worldToScreen(worldPos.x, worldPos.y);
      const isSelected = v.id === selectedVillagerId;
      renderList.push({
        sortKey: v.x + v.y,
        draw: (ctx) => this.drawVillager(ctx, v, screenPos.x, screenPos.y, camera.zoom, isSelected)
      });
    }
  }

  pickAvailable(candidates) {
    if (!this.assets) return candidates[0];
    for (const key of candidates) {
      if (this.assets.get(key)) return key;
    }
    return candidates[0];
  }

  getSpriteKeyForVillager(v) {
    const swing = v.animFrame % 2 === 0;
    const stride3 = v.animFrame % 3;

    // 1. Prehistoric Child Character (8-dir + Full Life/Emotion Suite)
    if (v.isChild) {
      if (v.cheerTimer > 0) return 'char_child_cheer';
      if (v.state === 'eating') return 'char_child_eat';
      if (v.state === 'sleeping') return 'char_child_sleep';
      if (v.state === 'relaxing') return swing ? 'char_child_relax' : 'char_child_cheer';
      if (v.state === 'foraging') return swing ? 'char_child_forage' : 'char_child_idle';

      if (v.isMoving) {
        if (v.facingCardinal === 'south') return 'char_child_south_walk1';
        if (v.facingCardinal === 'north') return 'char_child_north_walk1';
        if (v.facingBack) return 'char_child_back_walk';
        return stride3 === 0 ? 'char_child_walk1' : stride3 === 1 ? 'char_child_walk2' : 'char_child_idle';
      }

      if (v.state === 'playing') {
        if (v.facingBack) return 'char_child_back_play';
        return swing ? 'char_child_play' : 'char_child_relax';
      }
      if (v.hunger > 75) return 'char_child_hungry';
      if (v.tiredness > 75) return 'char_child_tired';
      return 'char_child_idle';
    }

    const role = v.isEnemy ? 'cannibal' : v.isChief ? 'chief' : v.isWarrior ? 'warrior' : v.gender === 'female' ? 'female' : 'male';

    // 2. Transient Combat / Command / Victory Animations
    if (v.hurtTimer > 0) {
      return this.pickAvailable([`char_${role}_hurt`, `char_${role}_idle`]);
    }
    if (v.cheerTimer > 0) {
      return this.pickAvailable([`char_${role}_cheer`, `char_${role}_relax`, `char_${role}_idle`]);
    }
    if (v.commandTimer > 0 && role === 'chief') {
      return 'char_chief_command';
    }

    // 2.5 Warrior Foliage Stealth Mode (Multi-Angle Bush Camouflage)
    if (role === 'warrior' && v.isStealthed) {
      if (v.facingBack || v.facingCardinal === 'north') return 'char_warrior_stealth_back';
      if (v.facingCardinal === 'south') return 'char_warrior_stealth_south';
      if (v.isMoving) return swing ? 'char_warrior_stealth_walk' : 'char_warrior_stealth_idle';
      return 'char_warrior_stealth_idle';
    }

    // 3. Enemy Cannibal (8-dir + Sneak + Throw + War Dance + Hurt + Defeated)
    if (role === 'cannibal') {
      if (v.health <= 0) return 'char_cannibal_defeated';
      if (v.isMoving) {
        if (v.facingCardinal === 'south') return 'char_cannibal_south_walk1';
        if (v.facingCardinal === 'north') return 'char_cannibal_north_walk1';
        if (v.facingBack) return 'char_cannibal_back_walk';
        return stride3 === 0 ? 'char_cannibal_walk1' : stride3 === 1 ? 'char_cannibal_walk2' : 'char_cannibal_sneak';
      }
      if (v.state === 'fighting' || v.state === 'hunting') {
        if (v.facingBack) return swing ? 'char_cannibal_back_chop' : 'char_cannibal_back_work';
        return swing ? 'char_cannibal_work1' : v.animFrame % 4 === 3 ? 'char_cannibal_throw' : 'char_cannibal_work2';
      }
      if (v.state === 'relaxing') return 'char_cannibal_dance';
      return swing ? 'char_cannibal_idle' : 'char_cannibal_sneak';
    }

    // 4. Life & Specialized Camp States (stationary)
    if (!v.isMoving) {
      if (v.state === 'eating') return `char_${role}_eat`;
      if (v.state === 'sleeping') return `char_${role}_sleep`;
      if (v.state === 'relaxing') return swing ? `char_${role}_relax` : this.pickAvailable([`char_${role}_cheer`, `char_${role}_idle`]);
      if (v.state === 'rallying' && role === 'chief') return 'char_chief_rally';
      if (v.state === 'breeding') return 'prop_baby_cradle';
      if (v.state === 'fishing') return `char_${role}_fish`;
      if (v.state === 'praying') return `char_${role}_pray`;
      if (v.state === 'crafting') return role === 'male' ? 'char_male_craft' : role === 'warrior' ? 'char_warrior_train' : this.pickAvailable([`char_${role}_work2`, `char_${role}_idle`]);
      if (v.state === 'training') return role === 'warrior' ? (swing ? 'char_warrior_train' : 'char_warrior_fight') : this.pickAvailable([`char_${role}_work1`, `char_${role}_idle`]);
      if (v.state === 'tending') return role === 'female' ? 'char_female_tend' : `char_${role}_idle`;
    }

    // 5. Walking & Carrying across All 8 Directions (South, North, Diagonal Front & Diagonal Back)
    if (v.isMoving) {
      if (v.state === 'carrying' || v.cargo.amount > 0) {
        if (v.facingBack) {
          return this.pickAvailable([`char_${role}_back_carry`, `char_${role}_back_walk`]);
        }
        if (v.cargo.type === 'stone' && role === 'male') {
          return swing ? 'char_male_carry_stone' : 'char_male_walk1';
        }
        return swing ? `char_${role}_carry` : `char_${role}_walk1`;
      }

      if (v.facingCardinal === 'south') {
        if (role === 'male') return swing ? 'char_male_south_walk1' : 'char_male_south_walk2';
        return `char_${role}_south_walk1`;
      }
      if (v.facingCardinal === 'north') {
        return `char_${role}_north_walk1`;
      }
      if (v.facingBack) {
        return `char_${role}_back_walk`;
      }
      if (role === 'male') {
        return stride3 === 0 ? 'char_male_walk1' : stride3 === 1 ? 'char_male_walk2' : 'char_male_walk3';
      }
      return `char_${role}_walk${(v.animFrame % 2) + 1}`;
    }

    // 6. Back-Right / Upward Work & Combat Angles
    if (v.facingBack) {
      if (role === 'warrior' && (v.state === 'fighting' || v.state === 'hunting')) {
        if (v.facingCardinal === 'north') return swing ? 'char_warrior_north_combat' : 'char_warrior_north_walk1';
        if (v.warriorMode === 'bow') return 'char_warrior_back_bow';
        return swing ? 'char_warrior_back_throw' : 'char_warrior_back_fight';
      }
      if (v.state === 'chopping') return swing ? this.pickAvailable([`char_${role}_back_chop`, `char_${role}_back_work`, `char_${role}_back_walk`]) : `char_${role}_back_walk`;
      if (v.state === 'mining') return swing ? this.pickAvailable([`char_${role}_back_mine`, `char_${role}_back_work`, `char_${role}_back_walk`]) : `char_${role}_back_walk`;
      if (v.state === 'hunting') return swing ? this.pickAvailable([`char_${role}_back_hunt`, `char_${role}_back_work`, `char_${role}_back_walk`]) : `char_${role}_back_walk`;
      if (v.state === 'fighting') return swing ? this.pickAvailable([`char_${role}_back_fight`, `char_${role}_back_work`, `char_${role}_back_walk`]) : `char_${role}_back_walk`;
      return swing ? this.pickAvailable([`char_${role}_back_work`, `char_${role}_back_walk`]) : `char_${role}_back_walk`;
    }

    // 7. Front Work & Combat Poses
    if (role === 'warrior' && (v.state === 'fighting' || v.state === 'hunting')) {
      if (v.warriorMode === 'bow') {
        if (v.facingCardinal === 'south') return 'char_warrior_south_bow';
        return swing ? 'char_warrior_bow' : 'char_warrior_idle';
      }
      if (v.facingCardinal === 'south') return 'char_warrior_south_throw';
      return swing ? 'char_warrior_throw' : 'char_warrior_fight';
    }
    if (v.state === 'chopping') {
      if (role === 'male') return swing ? 'char_male_work1' : 'char_male_work2';
      if (role === 'female') return swing ? 'char_female_chop' : 'char_female_idle';
      if (role === 'warrior') return swing ? 'char_warrior_fight' : 'char_warrior_idle';
      return swing ? 'char_chief_chop' : 'char_chief_work1';
    }
    if (v.state === 'mining') {
      return swing ? this.pickAvailable([`char_${role}_mine`, `char_${role}_fight`, `char_${role}_idle`]) : `char_${role}_idle`;
    }
    if (v.state === 'foraging' || v.state === 'gathering') {
      if (role === 'female') return swing ? 'char_female_work1' : 'char_female_cook';
      return swing ? `char_${role}_carry` : `char_${role}_idle`;
    }
    if (v.state === 'building') {
      if (role === 'male') return swing ? 'char_male_build' : 'char_male_work1';
      if (role === 'female') return swing ? 'char_female_work2' : 'char_female_idle';
      if (role === 'warrior') return swing ? 'char_warrior_train' : 'char_warrior_idle';
      return swing ? 'char_chief_work1' : 'char_chief_work2';
    }
    if (v.state === 'hunting') {
      return swing ? this.pickAvailable([`char_${role}_hunt`, `char_${role}_throw`, `char_${role}_idle`]) : `char_${role}_idle`;
    }
    if (v.state === 'fighting') {
      if (role === 'male') return swing ? 'char_male_fight' : 'char_male_work1';
      if (role === 'female') return swing ? 'char_female_hunt' : 'char_female_idle';
      return swing ? 'char_chief_work1' : 'char_chief_work2';
    }

    // 8. Exhausted / Tired Idle Visual Cue
    if (v.state === 'idle' && v.tiredness > 78 && (role === 'male' || role === 'female')) {
      return `char_${role}_tired`;
    }

    // Keep last cardinal angle when standing idle
    if (v.facingCardinal === 'south' && this.assets && this.assets.get(`char_${role}_south_walk1`)) {
      return `char_${role}_south_walk1`;
    }
    if (v.facingCardinal === 'north' && this.assets && this.assets.get(`char_${role}_north_walk1`)) {
      return `char_${role}_north_walk1`;
    }
    return `char_${role}_idle`;
  }

  drawVillager(ctx, v, sx, sy, zoom, isSelected) {
    ctx.save();

    // 1. Ambient Ground Shadow & Chief Morale Aura
    const shadowW = v.isChild ? 9 : (v.state === 'sleeping' && !v.isMoving) ? 18 : 12;
    ctx.beginPath();
    ctx.ellipse(sx, sy + 2 * zoom, shadowW * zoom, 5.5 * zoom, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fill();

    if (v.isChief) {
      const pulse = 20 + Math.sin(this.animTime * 3) * 2;
      ctx.beginPath();
      ctx.ellipse(sx, sy + 1 * zoom, pulse * zoom, (pulse * 0.5) * zoom, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.45)';
      ctx.lineWidth = 2 * zoom;
      ctx.stroke();
    } else if (v.hasChiefAura && !v.isEnemy) {
      ctx.beginPath();
      ctx.ellipse(sx, sy + 1 * zoom, 15 * zoom, 7.5 * zoom, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
      ctx.lineWidth = 1.5 * zoom;
      ctx.stroke();
    }

    if (v.isProtected) {
      const shieldPulse = 18 + Math.sin(this.animTime * 5) * 1.8;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(sx, sy - 10 * zoom, shieldPulse * 0.65 * zoom, (shieldPulse * 0.95) * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
      ctx.lineWidth = 1.6 * zoom;
      ctx.stroke();
      ctx.restore();
    }

    if (v.isInfected) {
      const miasma = 15 + Math.cos(this.animTime * 6) * 2;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(sx, sy + 1 * zoom, miasma * zoom, (miasma * 0.5) * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(132, 204, 22, 0.26)';
      ctx.fill();
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 1.5 * zoom;
      ctx.stroke();
      ctx.restore();
    }

    if (v.stunTimer > 0) {
      ctx.save();
      ctx.setLineDash([3 * zoom, 2 * zoom]);
      ctx.beginPath();
      ctx.ellipse(sx, sy + 1 * zoom, 15 * zoom, 7.5 * zoom, 0, 0, Math.PI * 2);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.2 * zoom;
      ctx.stroke();
      ctx.restore();
    }

    if ((v.isWarrior || v.role === 'pia_scout') && v.isStealthed) {
      const pulseR = 16 + Math.sin(this.animTime * 4) * 1.5;
      ctx.save();
      ctx.setLineDash([4 * zoom, 3 * zoom]);
      ctx.beginPath();
      ctx.ellipse(sx, sy + 1 * zoom, pulseR * zoom, (pulseR * 0.5) * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(22, 163, 74, 0.22)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.85)';
      ctx.lineWidth = 1.6 * zoom;
      ctx.stroke();
      ctx.restore();
    }

    // 2. Selection / Enemy Ring & Health Bar
    if (isSelected || v.isEnemy) {
      ctx.beginPath();
      ctx.ellipse(sx, sy + 1 * zoom, 16 * zoom, 8 * zoom, 0, 0, Math.PI * 2);
      ctx.strokeStyle = v.isEnemy ? '#ef4444' : '#4ade80';
      ctx.lineWidth = 2.5 * zoom;
      ctx.stroke();

      if (isSelected || v.health < v.maxHealth) {
        const barW = 28 * zoom;
        const barH = 4 * zoom;
        const barY = sy - (v.isChild ? 36 : 46) * zoom;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(sx - barW / 2 - 1, barY - 1, barW + 2, barH + 2);
        ctx.fillStyle = v.isEnemy ? '#ef4444' : v.health > 40 ? '#22c55e' : '#ef4444';
        ctx.fillRect(sx - barW / 2, barY, barW * (v.health / v.maxHealth), barH);
      }
    }

    // 3. Render Exact Direction / Action Sprite
    const spriteKey = this.getSpriteKeyForVillager(v);
    const img = this.assets ? this.assets.get(spriteKey) : null;

    const isHorizontalPose = !v.isMoving && (v.state === 'sleeping' || v.state === 'breeding');
    const isSeatedPose = !v.isMoving && (v.state === 'eating' || v.state === 'praying' || v.state === 'crafting' || v.state === 'tending' || (v.isChild && v.state === 'playing'));

    const walkBob = v.isMoving ? Math.abs(Math.sin(this.animTime * 11 + v.id)) * 2.2 * zoom : 0;
    const danceBob = !v.isMoving && (v.state === 'relaxing' || v.cheerTimer > 0) ? Math.abs(Math.sin(this.animTime * 9 + v.id)) * 3 * zoom : 0;
    const walkTilt = v.isMoving ? Math.sin(this.animTime * 11 + v.id) * 0.035 : 0;

    let topY = sy - (v.isChild ? 28 : 38) * zoom;

    if (img) {
      let drawW;
      let drawH;
      const aspect = img.naturalWidth / img.naturalHeight;

      if (isHorizontalPose) {
        drawW = (v.isChild ? 36 : 46) * zoom;
        drawH = drawW / aspect;
      } else if (isSeatedPose) {
        drawH = (v.isChild ? 23 : 31) * zoom;
        drawW = drawH * aspect;
      } else {
        drawH = (v.isChild ? 27 : v.isChief ? 42 : 37) * zoom;
        drawW = drawH * aspect;
      }

      ctx.save();
      if (v.isStealthed) ctx.globalAlpha = 0.78;
      ctx.translate(sx, sy - walkBob - danceBob);
      if (v.flipX && !isHorizontalPose) ctx.scale(-1, 1);
      ctx.rotate(walkTilt);
      ctx.drawImage(img, -drawW / 2, -drawH * 0.92, drawW, drawH);
      ctx.restore();

      topY = sy - drawH - 4 * zoom;
    }

    // 4. Child Growth Progress Badge OR Warrior Training Progress Bar
    if (v.isChild && !v.isEnemy) {
      const barW = 24 * zoom;
      const barH = 3 * zoom;
      const barY = topY - 8 * zoom;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(sx - barW / 2, barY, barW, barH);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(sx - barW / 2, barY, barW * (v.growthProgress / 100), barH);
    } else if (v.state === 'training' && !v.isMoving && v.warriorStars < 3) {
      const prog = typeof v.getTrainingProgress === 'function' ? v.getTrainingProgress() : 0;
      const barW = 30 * zoom;
      const barH = 3.5 * zoom;
      const barY = topY - 12 * zoom;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(sx - barW / 2 - 1, barY - 1, barW + 2, barH + 2);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(sx - barW / 2, barY, barW * (prog / 100), barH);
    }

    // 5. Cargo Badge with Real PNG Resource Icon
    if (v.cargo.amount > 0) {
      const iconKey =
        v.cargo.type === 'wood' ? 'icon_wood' :
        v.cargo.type === 'stone' ? 'stone_boulder' : 'icon_food';
      const cargoImg = this.assets ? this.assets.get(iconKey) : null;

      const badgeX = sx - 16 * zoom;
      const badgeY = sy - 22 * zoom;
      const badgeR = 8 * zoom;

      ctx.fillStyle = 'rgba(28, 25, 23, 0.88)';
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.2 * zoom;
      ctx.stroke();

      if (cargoImg) {
        const iw = 11 * zoom;
        const ih = iw * (cargoImg.naturalHeight / cargoImg.naturalWidth);
        ctx.drawImage(cargoImg, badgeX - iw / 2, badgeY - ih / 2, iw, ih);
      }

      ctx.font = `bold ${Math.max(8, Math.floor(8.5 * zoom))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde047';
      ctx.fillText(`${v.cargo.amount}`, badgeX, badgeY + 12 * zoom);
    }

    // 6. Name Tag, Role Badge & Warrior Star Rank (1★ - 3★)
    if (v.isWarrior && v.warriorStars > 0) {
      const starsStr = '★'.repeat(Math.min(3, v.warriorStars)) + '☆'.repeat(Math.max(0, 3 - v.warriorStars));
      const starY = topY - 11 * zoom;
      ctx.font = `bold ${Math.max(10, Math.floor(11 * zoom))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#000000';
      ctx.fillText(starsStr, sx + 1, starY + 1);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(starsStr, sx, starY);

      if (v.isStealthed || isSelected) {
        const wTag = v.weapon && v.weapon !== 'none' ? v.weapon.replace('_', ' ').toUpperCase() : (v.warriorMode === 'bow' ? 'BOW' : 'JAVELIN');
        const tag = v.isStealthed ? 'STEALTH' : wTag;
        ctx.font = `bold ${Math.max(7, Math.floor(8 * zoom))}px sans-serif`;
        ctx.fillStyle = v.isStealthed ? '#4ade80' : '#fde047';
        ctx.fillText(tag, sx, starY - 9 * zoom);
      }
    } else if (v.role && v.role !== 'chief') {
      const roleLabels = { cook: 'COOK', armourer: 'ARMOURER', dj: 'DJ', shaman: 'SHAMAN', pia_scout: 'PIA SCOUT', guard: 'GUARD' };
      const rLabel = roleLabels[v.role] || '';
      if (rLabel) {
        ctx.font = `bold ${Math.max(7, Math.floor(8 * zoom))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillStyle = v.role === 'shaman' ? '#c084fc' : v.role === 'pia_scout' ? '#4ade80' : '#38bdf8';
        ctx.fillText(rLabel, sx, topY - 10 * zoom);
      }
    } else if (v.weapon && v.weapon !== 'none' && isSelected) {
      ctx.font = `bold ${Math.max(7, Math.floor(8 * zoom))}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde047';
      ctx.fillText(v.weapon.replace('_', ' ').toUpperCase(), sx, topY - 10 * zoom);
    }

    ctx.font = `bold ${Math.max(9, Math.floor(10 * zoom))}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText(v.name, sx + 1, topY + 1);
    ctx.fillStyle = v.isEnemy ? '#fca5a5' : v.isChild ? '#7dd3fc' : v.isChief ? '#fef08a' : v.isWarrior ? '#fdba74' : '#ffffff';
    ctx.fillText(v.name, sx, topY);

    // 7. Needs Thought Bubble & Sleeping Zzz
    if (!v.isEnemy && ((v.state === 'sleeping' && !v.isMoving) || v.hunger > 70 || v.tiredness > 70)) {
      const bubbleBob = Math.sin(this.animTime * 4) * 2 * zoom;
      const bX = sx + 15 * zoom;
      const bY = topY - 4 * zoom + bubbleBob;

      ctx.fillStyle = '#fffbeb';
      ctx.beginPath();
      ctx.arc(bX, bY, 8 * zoom, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.2 * zoom;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(bX - 6 * zoom, bY + 6 * zoom, 2.5 * zoom, 0, Math.PI * 2);
      ctx.fill();

      if (v.hunger > 70 && v.state !== 'sleeping' && this.assets && this.assets.get('icon_food')) {
        const meatImg = this.assets.get('icon_food');
        const mw = 11 * zoom;
        const mh = mw * (meatImg.naturalHeight / meatImg.naturalWidth);
        ctx.drawImage(meatImg, bX - mw / 2, bY - mh / 2, mw, mh);
      } else {
        ctx.font = `bold ${Math.floor(8 * zoom)}px sans-serif`;
        ctx.fillStyle = '#1e3a8a';
        ctx.fillText('Zzz', bX, bY + 3 * zoom);
      }
    }

    ctx.restore();
  }

  drawProjectiles(ctx, projectiles, camera) {
    const zoom = camera.zoom;
    for (const p of projectiles) {
      const startW = IsometricMath.tileToWorld(p.startX, p.startY);
      const endW = IsometricMath.tileToWorld(p.endX, p.endY);
      const t = Math.min(1, p.progress);
      const curX = startW.x + (endW.x - startW.x) * t;
      const curY = startW.y + (endW.y - startW.y) * t;
      const arcOffset = Math.sin(t * Math.PI) * p.arcHeight;

      const curScreen = camera.worldToScreen(curX, curY);
      const nextT = Math.min(1, t + 0.05);
      const nx = startW.x + (endW.x - startW.x) * nextT;
      const ny = startW.y + (endW.y - startW.y) * nextT;
      const nArc = Math.sin(nextT * Math.PI) * p.arcHeight;
      const nextScreen = camera.worldToScreen(nx, ny);

      const angle = Math.atan2(
        (nextScreen.y - nArc * zoom) - (curScreen.y - arcOffset * zoom),
        nextScreen.x - curScreen.x
      );

      // Ground Shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(curScreen.x, curScreen.y, 6 * zoom, 2.5 * zoom, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
      ctx.fill();

      // Flying Projectile Sprite (Javelin, Arrow, Tomahawk Stone)
      const imgKey = p.type === 'bow' ? 'proj_arrow' : 'proj_javelin';
      const img = this.assets ? this.assets.get(imgKey) : null;
      ctx.translate(curScreen.x, curScreen.y - (18 + arcOffset) * zoom);
      if (p.type === 'stone' || p.type === 'tomahawk') {
        ctx.rotate(t * Math.PI * 6);
        if (p.type === 'stone') {
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(0, 0, 4.5 * zoom, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.stroke();
        } else {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(-7 * zoom, -1.5 * zoom, 14 * zoom, 3 * zoom);
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.moveTo(4 * zoom, -6 * zoom);
          ctx.lineTo(9 * zoom, 0);
          ctx.lineTo(4 * zoom, 4 * zoom);
          ctx.closePath();
          ctx.fill();
        }
      } else {
        ctx.rotate(angle);
        if (img) {
          const w = (p.type === 'bow' ? 22 : 28) * zoom;
          const h = w * (img.naturalHeight / img.naturalWidth);
          ctx.drawImage(img, -w / 2, -h / 2, w, h);
        } else {
          ctx.fillStyle = p.type === 'bow' ? '#fde047' : '#d97706';
          ctx.fillRect(-10 * zoom, -1.5 * zoom, 20 * zoom, 3 * zoom);
        }
      }
      ctx.restore();
    }
  }
}
