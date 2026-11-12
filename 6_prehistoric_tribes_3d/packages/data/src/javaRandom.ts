/**
 * Bit-exact port of java.util.Random as used by the original engine (ptCore.js class `cn`).
 * The 48-bit state is kept as two 24-bit halves so every intermediate stays below 2^53.
 */
const HALF = 16777216; // 2^24
const MASK24 = 16777215;
const MUL_HI = 1502; // 0x5DEECE66D >> 24
const MUL_LO = 15525485; // 0x5DEECE66D & 0xFFFFFF
const ADDEND = 11;

export interface JavaRandomState {
  high: number;
  low: number;
}

export class JavaRandom {
  high = 0;
  low = 0;

  constructor(seed = 1) {
    this.setSeed(seed);
  }

  static fromState(state: JavaRandomState): JavaRandom {
    const r = new JavaRandom();
    r.high = state.high;
    r.low = state.low;
    return r;
  }

  getState(): JavaRandomState {
    return { high: this.high, low: this.low };
  }

  setSeed(seed: number): void {
    const hi = Math.floor(seed / HALF) & MASK24;
    const lo = seed & MASK24;
    this.high = (hi ^ MUL_HI) & MASK24;
    this.low = (lo ^ MUL_LO) & MASK24;
  }

  next(bits: number): number {
    const t = this.low * MUL_LO + ADDEND;
    const carry = Math.floor(t / HALF);
    const lo = t % HALF;
    const hi = this.high * MUL_LO + this.low * MUL_HI + carry;
    this.high = hi % HALF;
    this.low = lo;
    const state = this.high * HALF + this.low;
    return Math.floor(state / 2 ** (48 - bits)) | 0;
  }

  /** java.util.Random#nextInt() with no bound: a signed 32-bit int. */
  nextInt(): number {
    return this.next(32);
  }

  /** The engine helper `game.randomInt(mask, n) = (nextInt() & mask) % n`. */
  randomInt(mask: number, n: number): number {
    return (this.nextInt() & mask) % n;
  }
}
