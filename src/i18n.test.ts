import { describe, expect, it } from "vitest";
import { STRINGS, t, type Lang } from "./i18n";

describe("i18n", () => {
  it("has identical key sets for de and en", () => {
    const deKeys = Object.keys(STRINGS.de).sort();
    const enKeys = Object.keys(STRINGS.en).sort();
    expect(enKeys).toEqual(deKeys);
  });

  it("t() returns a non-empty string for every key in both languages", () => {
    const keys = Object.keys(STRINGS.de) as Array<keyof (typeof STRINGS)["de"]>;
    const langs: Lang[] = ["de", "en"];

    for (const lang of langs) {
      for (const key of keys) {
        const value = t(lang, key);
        expect(typeof value).toBe("string");
        expect(value.length).toBeGreaterThan(0);
      }
    }
  });
});
