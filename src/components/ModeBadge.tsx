import { Pill } from "./ui";

export type Mode = "PANTOMIME" | "MALEN" | "ERKLAEREN";

export function modeLabel(m: Mode) {
  if (m === "PANTOMIME") return "🎭 Pantomime";
  if (m === "MALEN") return "✏️ Malen";
  return "🗣️ Erklären";
}

export function ModeBadge({ mode }: { mode: Mode }) {
  const c =
    mode === "PANTOMIME"
      ? "border-cyan-400/25 bg-cyan-500/10 text-cyan-100"
      : mode === "MALEN"
        ? "border-amber-400/25 bg-amber-500/10 text-amber-100"
        : "border-emerald-400/25 bg-emerald-500/10 text-emerald-100";

  return <Pill className={c}>{modeLabel(mode)}</Pill>;
}
