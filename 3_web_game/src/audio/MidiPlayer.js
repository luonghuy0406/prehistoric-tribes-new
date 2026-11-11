/**
 * MidiPlayer.js — Bộ giải mã & phát nhạc Standard MIDI File (.mid Format 0/1) thuần JS qua Web Audio API.
 * Phát trực tiếp 5 bản nhạc nền gốc Prehistoric Tribes (music_track_0..4.mid).
 */

export class MidiPlayer {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.cache = new Map(); // url -> parsedSong
    this.isPlaying = false;
    this.currentUrl = null;
    this.loop = true;
    this.timerId = null;
    this.playbackStartTime = 0;
    this.nextEventIndex = 0;
    this.events = [];
    this.durationSec = 0;
    this.activeVoices = new Set();
  }

  attachContext(audioCtx) {
    this.ctx = audioCtx;
    if (this.ctx && !this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.22;
      this.masterGain.connect(this.ctx.destination);
    }
  }

  static parseMidi(buffer) {
    const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    let pos = 0;
    const readStr = (len) => {
      let s = '';
      for (let i = 0; i < len; i++) s += String.fromCharCode(bytes[pos++]);
      return s;
    };
    const readU32 = () => ((bytes[pos++] << 24) | (bytes[pos++] << 16) | (bytes[pos++] << 8) | bytes[pos++]) >>> 0;
    const readU16 = () => (bytes[pos++] << 8) | bytes[pos++];
    const readVarLen = () => {
      let val = 0;
      while (pos < bytes.length) {
        const b = bytes[pos++];
        val = (val << 7) | (b & 0x7f);
        if ((b & 0x80) === 0) break;
      }
      return val;
    };

    if (readStr(4) !== 'MThd') {
      throw new Error('Invalid MIDI header');
    }
    const hdrLen = readU32();
    const format = readU16();
    const trackCount = readU16();
    const division = readU16();
    pos += Math.max(0, hdrLen - 6);

    const rawEvents = [];
    for (let t = 0; t < trackCount; t++) {
      if (pos + 8 > bytes.length) break;
      const chunkId = readStr(4);
      const chunkLen = readU32();
      const endPos = Math.min(bytes.length, pos + chunkLen);
      if (chunkId !== 'MTrk') {
        pos = endPos;
        continue;
      }

      let tick = 0;
      let runningStatus = 0;

      while (pos < endPos) {
        tick += readVarLen();
        if (pos >= endPos) break;
        let status = bytes[pos];
        if (status < 0x80) {
          status = runningStatus;
        } else {
          pos++;
          if (status < 0xf0) runningStatus = status;
        }

        if (status === 0xff) {
          const metaType = bytes[pos++];
          const len = readVarLen();
          if (metaType === 0x51 && len === 3 && pos + 3 <= endPos) {
            const mpq = (bytes[pos] << 16) | (bytes[pos + 1] << 8) | bytes[pos + 2];
            rawEvents.push({ tick, type: 'tempo', microsecondsPerQuarter: mpq });
          }
          pos += len;
        } else if (status === 0xf0 || status === 0xf7) {
          const len = readVarLen();
          pos += len;
        } else {
          const cmd = status & 0xf0;
          const ch = status & 0x0f;
          if (cmd === 0xc0 || cmd === 0xd0) {
            const p1 = bytes[pos++];
            if (cmd === 0xc0) rawEvents.push({ tick, type: 'program', ch, program: p1 });
          } else {
            const p1 = bytes[pos++];
            const p2 = bytes[pos++];
            if (cmd === 0x90 && p2 > 0) {
              rawEvents.push({ tick, type: 'noteOn', ch, note: p1, velocity: p2 });
            } else if (cmd === 0x80 || (cmd === 0x90 && p2 === 0)) {
              rawEvents.push({ tick, type: 'noteOff', ch, note: p1 });
            }
          }
        }
      }
      pos = endPos;
    }

    rawEvents.sort((a, b) => a.tick - b.tick);

    // Convert ticks -> seconds with tempo map & match note durations
    let tempo = 500000; // 120 BPM default
    let lastTick = 0;
    let currentSec = 0;
    const tpq = division > 0 ? division : 480;

    const noteEvents = [];
    const activeNotes = new Map(); // `${ch}:${note}` -> event
    const channelProgram = new Uint8Array(16);

    for (const ev of rawEvents) {
      const dtTicks = ev.tick - lastTick;
      if (dtTicks > 0) {
        currentSec += (dtTicks / tpq) * (tempo / 1000000);
        lastTick = ev.tick;
      }
      if (ev.type === 'tempo') {
        tempo = ev.microsecondsPerQuarter;
      } else if (ev.type === 'program') {
        channelProgram[ev.ch] = ev.program;
      } else if (ev.type === 'noteOn') {
        const key = `${ev.ch}:${ev.note}`;
        const nEv = {
          time: currentSec,
          ch: ev.ch,
          note: ev.note,
          velocity: ev.velocity,
          program: channelProgram[ev.ch],
          duration: 0.25
        };
        activeNotes.set(key, nEv);
        noteEvents.push(nEv);
      } else if (ev.type === 'noteOff') {
        const key = `${ev.ch}:${ev.note}`;
        const started = activeNotes.get(key);
        if (started) {
          started.duration = Math.max(0.06, Math.min(2.5, currentSec - started.time));
          activeNotes.delete(key);
        }
      }
    }

    return {
      format,
      trackCount,
      tpq,
      noteCount: noteEvents.length,
      durationSec: Math.max(2.0, currentSec + 0.5),
      events: noteEvents
    };
  }

  async playUrl(url, loop = true) {
    if (this.currentUrl === url && this.isPlaying) return;
    this.stop();
    this.currentUrl = url;
    this.loop = loop;

    let parsed = this.cache.get(url);
    if (!parsed) {
      try {
        const resp = await fetch(url);
        if (!resp.ok) return;
        const buf = await resp.arrayBuffer();
        parsed = MidiPlayer.parseMidi(buf);
        this.cache.set(url, parsed);
      } catch {
        return;
      }
    }

    if (this.currentUrl !== url) return;
    this.events = parsed.events;
    this.durationSec = parsed.durationSec;
    this.nextEventIndex = 0;
    this.isPlaying = true;
    this.playbackStartTime = this.ctx ? this.ctx.currentTime + 0.05 : 0;

    if (!this.timerId) {
      this.timerId = setInterval(() => this.schedulerTick(), 60);
    }
  }

  stop() {
    this.isPlaying = false;
    this.currentUrl = null;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    for (const v of this.activeVoices) {
      try { v.stop(); } catch {}
    }
    this.activeVoices.clear();
  }

  schedulerTick() {
    if (!this.isPlaying || !this.ctx || this.ctx.state !== 'running' || !this.masterGain) return;
    const now = this.ctx.currentTime;
    if (this.playbackStartTime === 0) this.playbackStartTime = now + 0.05;

    const elapsed = now - this.playbackStartTime;
    const lookahead = elapsed + 0.18;

    while (this.nextEventIndex < this.events.length && this.events[this.nextEventIndex].time <= lookahead) {
      const ev = this.events[this.nextEventIndex++];
      const playAt = Math.max(now, this.playbackStartTime + ev.time);
      this.triggerNote(ev, playAt);
    }

    if (elapsed >= this.durationSec) {
      if (this.loop) {
        this.nextEventIndex = 0;
        this.playbackStartTime = now + 0.05;
      } else {
        this.stop();
      }
    }
  }

  triggerNote(ev, when) {
    if (!this.ctx || !this.masterGain) return;
    const gainVal = Math.min(0.32, (ev.velocity / 127) * 0.24);

    // Channel 9: Tribal Drum Kit
    if (ev.ch === 9) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const isKick = ev.note <= 38;
      osc.type = isKick ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(isKick ? 130 : 280 + (ev.note % 12) * 35, when);
      osc.frequency.exponentialRampToValueAtTime(isKick ? 42 : 95, when + 0.11);
      gain.gain.setValueAtTime(gainVal * 0.85, when);
      gain.gain.exponentialRampToValueAtTime(0.001, when + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      this.activeVoices.add(osc);
      osc.onended = () => this.activeVoices.delete(osc);
      osc.start(when);
      osc.stop(when + 0.13);
      return;
    }

    const freq = 440 * Math.pow(2, (ev.note - 69) / 12);
    if (!Number.isFinite(freq) || freq < 30 || freq > 4500) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    // Choose warm tribal timbre from GM program number
    const p = ev.program || 0;
    osc.type = p >= 32 && p <= 39 ? 'triangle' : p >= 56 && p <= 79 ? 'sawtooth' : p >= 80 ? 'square' : 'triangle';
    const scaleGain = osc.type === 'sawtooth' || osc.type === 'square' ? gainVal * 0.42 : gainVal * 0.72;

    osc.frequency.setValueAtTime(freq, when);
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(scaleGain, when + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0008, when + ev.duration + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);
    this.activeVoices.add(osc);
    osc.onended = () => this.activeVoices.delete(osc);
    osc.start(when);
    osc.stop(when + ev.duration + 0.1);
  }
}
