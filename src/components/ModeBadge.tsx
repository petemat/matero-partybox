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
      ? "pill--cyan"
      : mode === "MALEN"
        ? "pill--amber"
        : "pill--green";

  return <Pill className={c}>{modeLabel(mode)}</Pill>;
}
