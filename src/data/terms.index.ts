import type { Lang } from "../i18n";
import { PACKS, type PackId, DEFAULT_PACKS } from "./packs";

export function getTerms(lang: Lang, selectedPacks?: PackId[]): string[] {
  const ids = selectedPacks && selectedPacks.length ? selectedPacks : DEFAULT_PACKS;
  const out: string[] = [];
  const seen = new Set<string>();

  for (const id of ids) {
    const pack = PACKS.find((p) => p.id === id);
    if (!pack) continue;
    const list = lang === "en" ? pack.termsEn : pack.termsDe;
    for (const term of list) {
      const key = term.trim();
      if (!key) continue;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(term);
    }
  }

  return out;
}
