export type Rng = () => number;

// Small, deterministic PRNG for tests / optional seeding.
// Mulberry32: https://stackoverflow.com/a/47593316
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashSeed(seed: string): number {
  // FNV-1a 32-bit
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function rngFromSeed(seed?: number | string): Rng {
  if (seed === undefined) return Math.random;
  if (typeof seed === "number") return mulberry32(seed);
  return mulberry32(hashSeed(seed));
}

export function shuffle<T>(arr: readonly T[], rng: Rng = Math.random): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function unique<T>(arr: readonly T[]): T[] {
  const out: T[] = [];
  const seen = new Set<T>();
  for (const v of arr) {
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

export function makeDeck(terms: readonly string[], opts?: { seed?: number | string }): string[] {
  const rng = rngFromSeed(opts?.seed);
  return shuffle(unique(terms), rng);
}
