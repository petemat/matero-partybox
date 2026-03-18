import { useMemo, useState } from "react";
import { t, type Lang } from "../i18n";
import { getTerms } from "../data/terms.index";
import type { Mode } from "./ModeBadge";
import { ModeBadge } from "./ModeBadge";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";
import { Button, Card, Pill } from "./ui";
import { RoundEndModal } from "./RoundEndModal";
import { TopBar } from "./TopBar";

function randomMode(): Mode {
  const r = Math.random();
  if (r < 0.34) return "PANTOMIME";
  if (r < 0.67) return "MALEN";
  return "ERKLAEREN";
}

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function RoundScreen({
  teamA,
  teamB,
  duration,
  lang,
  onExit,
}: {
  teamA: string;
  teamB: string;
  duration: number;
  lang: Lang;
  onExit: () => void;
}) {
  const [active, setActive] = useState<"A" | "B">("A");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const [mode, setMode] = useState<Mode>(() => randomMode());
  const terms = useMemo(() => getTerms(lang), [lang]);
  const [deck, setDeck] = useState(() => shuffle(terms));
  const [idx, setIdx] = useState(0);

  const [running, setRunning] = useState(false);
  const [roundOver, setRoundOver] = useState(false);

  const current = deck[idx] ?? (lang === "en" ? "(no more words)" : "(keine Begriffe mehr)");

  const activeName = active === "A" ? teamA : teamB;

  const nextCard = () => setIdx((v) => (v + 1 < deck.length ? v + 1 : v));

  const onCorrect = () => {
    if (active === "A") setScoreA((v) => v + 1);
    else setScoreB((v) => v + 1);
    nextCard();
  };

  const onSkip = () => {
    nextCard();
  };

  const onStartRound = () => {
    setMode(randomMode());
    setRunning(true);
    setRoundOver(false);
  };

  const onTimerDone = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = 880;
      g.gain.value = 0.08;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      setTimeout(() => {
        o.stop();
        ctx.close();
      }, 350);
    } catch {}

    setRunning(false);
    setRoundOver(true);
  };

  const summary = useMemo(() => {
    return `${teamA}: ${scoreA}  ·  ${teamB}: ${scoreB}`;
  }, [scoreA, scoreB, teamA, teamB]);

  const onNextTeam = () => {
    setActive((v) => (v === "A" ? "B" : "A"));
    setRoundOver(false);
    setRunning(false);

    if (idx >= deck.length - 1) {
      setDeck(shuffle(terms));
      setIdx(0);
    }
  };

  const confirmExit = () => {
    if (running) {
      const ok = window.confirm(lang === "en" ? "End the game and go back to start?" : "Spiel beenden und zurück zum Start?");
      if (!ok) return;
    }
    onExit();
  };

  return (
    <div style={{ minHeight: "100svh", padding: 16 }}>
      <TopBar title="PartyBox" onBack={confirmExit} />
      <div className="container stack-3" style={{ margin: "0 auto" }}>
        <ScoreBoard teamA={teamA} teamB={teamB} scoreA={scoreA} scoreB={scoreB} active={active} />

        <div className="row-between">
          <Pill>
            {t(lang, "teamTurn")} <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 800 }}>{activeName}</span>
          </Pill>
          <ModeBadge mode={mode} lang={lang} />
        </div>

        <Timer seconds={duration} running={running} onDone={onTimerDone} lang={lang} />

        <Card className="card-pad stack-2">
          <div className="kicker">{t(lang, "term")}</div>
          <div className="term">
            <div className="termWord">{current}</div>
            {mode === "MALEN" && (
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 10 }}>
                {t(lang, "drawMvpNote")}
              </div>
            )}
          </div>

          {!running ? (
            <Button variant="primary" onClick={onStartRound}>
              {t(lang, "startRound")}
            </Button>
          ) : (
            <div className="btn-row">
              <Button variant="good" onClick={onCorrect}>
                {t(lang, "correct")}
              </Button>
              <Button variant="secondary" onClick={onSkip}>
                {t(lang, "skip")}
              </Button>
            </div>
          )}
        </Card>

        <div className="smallNote">{running ? t(lang, "noPassing") : t(lang, "passPhone")}</div>

        <RoundEndModal open={roundOver} title={t(lang, "timeUp")} subtitle={summary} onNextTeam={onNextTeam} />
      </div>
    </div>
  );
}
