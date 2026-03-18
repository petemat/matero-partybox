import { t, type Lang } from "../i18n";
import { Pill } from "./ui";

export type Mode = "PANTOMIME" | "MALEN" | "ERKLAEREN";

export function modeLabel(lang: Lang, m: Mode) {
  if (m === "PANTOMIME") return t(lang, "pantomime");
  if (m === "MALEN") return t(lang, "draw");
  return t(lang, "explain");
}

export function ModeBadge({ mode, lang }: { mode: Mode; lang: Lang }) {
  const c =
    mode === "PANTOMIME"
      ? "pill--cyan"
      : mode === "MALEN"
        ? "pill--amber"
        : "pill--green";

  return <Pill className={c}>{modeLabel(lang, mode)}</Pill>;
}
