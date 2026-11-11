/**
 * SoundEngine.js — Hệ thống âm thanh SFX & Trình phát 5 bản nhạc nền MIDI gốc qua Web Audio API.
 */
import { MidiPlayer } from './MidiPlayer.js';

const THEME_MIDI_MAP = {
  menu:    './assets/audio/music_track_1_6315b.mid',
  calm:    './assets/audio/music_track_0_8014b.mid',
  alert:   './assets/audio/music_track_2_5648b.mid',
  combat:  './assets/audio/music_track_2_5648b.mid',
  victory: './assets/audio/music_track_3_3405b.mid',
  defeat:  './assets/audio/music_track_4_3234b.mid'
};

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.musicEnabled = true;
    this.sfxEnabled = true;
    this.currentTheme = 'menu';
    this.midi = new MidiPlayer();
  }

  ensureContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.midi.attachContext(this.ctx);
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().then(() => {
        if (this.musicEnabled && !this.midi.isPlaying) {
          this.playCurrentThemeMidi();
        }
      }).catch(() => {});
    }
    return this.ctx;
  }

  playBeep(freq = 440, type = 'sine', duration = 0.1, vol = 0.1) {
    if (!this.sfxEnabled) return;
    try {
      const ctx = this.ensureContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  }

  setMusicEnabled(enabled) {
    this.musicEnabled = !!enabled;
    if (this.musicEnabled) {
      this.ensureContext();
      this.playCurrentThemeMidi();
    } else {
      this.midi.stop();
    }
  }

  setTheme(theme) {
    if (!THEME_MIDI_MAP[theme]) theme = 'calm';
    if (this.currentTheme === theme && this.midi.isPlaying) return;
    this.currentTheme = theme;
    if (this.musicEnabled) {
      this.playCurrentThemeMidi();
    }
  }

  playCurrentThemeMidi() {
    const url = THEME_MIDI_MAP[this.currentTheme] || THEME_MIDI_MAP.calm;
    const shouldLoop = this.currentTheme !== 'victory' && this.currentTheme !== 'defeat';
    this.midi.playUrl(url, shouldLoop);
  }
}
