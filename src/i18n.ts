export type Lang = "de" | "en";

export const DEFAULT_LANG: Lang = "de";

export function loadLang(): Lang {
  try {
    const v = localStorage.getItem("partybox.lang");
    return v === "en" ? "en" : "de";
  } catch {
    return DEFAULT_LANG;
  }
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem("partybox.lang", lang);
  } catch {}
}

const STRINGS: Record<Lang, Record<string, string>> = {
  de: {
    tagline: "Activity / Tabu – 2 Teams, 1 Handy.",
    teams: "Teams",
    teamA: "Team A",
    teamB: "Team B",
    roundDuration: "Rundendauer",
    startGame: "Spiel starten",
    quickHint: "Tipp: Handy weitergeben. Eine Runde = ein Team. Danach wechselt ihr.",
    modeRandom: "Modus pro Runde zufällig",
    noRepeats: "Begriffe ohne Wiederholung",

    teamTurn: "Team dran:",
    timer: "Timer",
    lastSeconds: "Letzte Sekunden!",
    term: "Begriff",
    startRound: "Runde starten",
    correct: "Richtig (+1)",
    skip: "Skip",
    timeUp: "Zeit vorbei",
    passPhone: "Handy ans nächste Team geben.",
    noPassing: "Weiterreichen ist verboten 😉",
    handoffTitle: "Handy weitergeben",
    handoffSubtitle: "An",
    handoffTap: "Tippen um zu starten",

    pantomime: "🎭 Pantomime",
    draw: "✏️ Malen",
    explain: "🗣️ Erklären",

    drawMvpNote: "(MVP) Malen-Modus: später kommt Canvas dazu.",
  },
  en: {
    tagline: "Activity / Taboo – 2 teams, 1 phone.",
    teams: "Teams",
    teamA: "Team A",
    teamB: "Team B",
    roundDuration: "Round length",
    startGame: "Start game",
    quickHint: "Tip: pass the phone. One round = one team. Then switch.",
    modeRandom: "Random mode each round",
    noRepeats: "No repeats",

    teamTurn: "Team up:",
    timer: "Timer",
    lastSeconds: "Last seconds!",
    term: "Word",
    startRound: "Start round",
    correct: "Correct (+1)",
    skip: "Skip",
    timeUp: "Time's up",
    passPhone: "Pass the phone to the next team.",
    noPassing: "No passing during the round 😉",
    handoffTitle: "Pass the phone",
    handoffSubtitle: "To",
    handoffTap: "Tap to start",

    pantomime: "🎭 Charades",
    draw: "✏️ Draw",
    explain: "🗣️ Explain",

    drawMvpNote: "(MVP) Draw mode: canvas coming later.",
  },
};

export function t(lang: Lang, key: keyof (typeof STRINGS)["de"]) {
  return STRINGS[lang][key] || STRINGS.de[key] || String(key);
}
