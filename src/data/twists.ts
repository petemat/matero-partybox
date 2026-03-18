import type { Lang } from "../i18n";

export type Twist = {
  id: string;
  title: Record<Lang, string>;
  rule: Record<Lang, string>;
};

export const TWISTS: Twist[] = [
  {
    id: "no-gestures",
    title: { de: "🙅‍♂️ Keine Gesten", en: "🙅‍♂️ No gestures" },
    rule: {
      de: "Du darfst NICHT gestikulieren oder zeigen. Nur reden/zeichnen/pantomime wie im Modus erlaubt.",
      en: "No gesturing or pointing. Only use what the mode allows.",
    },
  },
  {
    id: "questions-only",
    title: { de: "❓ Nur Fragen", en: "❓ Questions only" },
    rule: {
      de: "Du darfst nur in FRAGEN sprechen (Ja/Nein oder offen).",
      en: "You may only speak in QUESTIONS (yes/no or open).",
    },
  },
  {
    id: "one-word",
    title: { de: "🧩 Ein-Wort-Regel", en: "🧩 One-word rule" },
    rule: {
      de: "Du darfst pro Hinweis nur EIN WORT sagen.",
      en: "Only ONE WORD per clue.",
    },
  },
  {
    id: "accent",
    title: { de: "🎭 Akzent", en: "🎭 Accent" },
    rule: {
      de: "Sprich die ganze Runde in einem Akzent oder einer Stimme deiner Wahl.",
      en: "Speak the whole round in an accent/voice of your choice.",
    },
  },
  {
    id: "no-fillers",
    title: { de: "🚫 Keine Füllwörter", en: "🚫 No filler words" },
    rule: {
      de: "Keine Füllwörter: äh, ähm, so, quasi, basically… (ihr entscheidet streng).",
      en: "No filler words: um, uh, like, basically… (be strict).",
    },
  },
  {
    id: "slow-mo",
    title: { de: "🐢 Zeitlupe", en: "🐢 Slow motion" },
    rule: {
      de: "Alles nur in Zeitlupe: Bewegungen und Sprache langsam.",
      en: "Everything in slow motion: movements and speech.",
    },
  },
];

export function pickRandomTwist(): Twist {
  return TWISTS[Math.floor(Math.random() * TWISTS.length)];
}
