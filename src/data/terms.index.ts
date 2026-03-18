import type { Lang } from "../i18n";
import { TERMS_DE } from "./terms";
import { TERMS_EN } from "./terms.en";

export function getTerms(lang: Lang): string[] {
  return lang === "en" ? TERMS_EN : TERMS_DE;
}
