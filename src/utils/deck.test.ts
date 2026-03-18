import { describe, expect, it } from "vitest";
import { makeDeck, rngFromSeed, shuffle } from "./deck";

describe("deck utils", () => {
  it("shuffle is deterministic with a fixed seed", () => {
    const arr = Array.from({ length: 20 }, (_, i) => i + 1);
    const a = shuffle(arr, rngFromSeed(12345));
    const b = shuffle(arr, rngFromSeed(12345));
    expect(a).toEqual(b);
    expect(a).not.toEqual(arr); // extremely unlikely to fail
  });

  it("shuffle changes with different seeds", () => {
    const arr = Array.from({ length: 40 }, (_, i) => i);
    const a = shuffle(arr, rngFromSeed(1));
    const b = shuffle(arr, rngFromSeed(2));
    expect(a).not.toEqual(b);
  });

  it("makeDeck removes duplicate terms", () => {
    const terms = ["a", "b", "a", "c", "b", "d", "d"];
    const deck = makeDeck(terms, { seed: 7 });
    expect(deck.sort()).toEqual(["a", "b", "c", "d"].sort());
    expect(new Set(deck).size).toBe(deck.length);
  });
});
