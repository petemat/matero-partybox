import { useMemo, useState } from "react";
import { TERMS } from "../data/terms";
import type { Mode } from "./ModeBadge";
import { ModeBadge } from "./ModeBadge";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";
import { Button, Card, Pill } from "./ui";
import { RoundEndModal } from "./RoundEndModal";

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
}: {
  teamA: string;
  teamB: string;
  duration: number;
}) {
  const [active, setActive] = useState<"A" | "B">("A");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const [mode, setMode] = useState<Mode>(() => randomMode());
  const [deck, setDeck] = useState(() => shuffle(TERMS));
  const [idx, setIdx] = useState(0);

  const [running, setRunning] = useState(false);
  const [roundOver, setRoundOver] = useState(false);

  const current = deck[idx] ?? "(keine Begriffe mehr)";

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
    // Beep (simple WebAudio)
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

    // reshuffle deck if we are at the end
    if (idx >= deck.length - 1) {
      setDeck(shuffle(TERMS));
      setIdx(0);
    }
  };

  return (
    <div className="min-h-[100svh] px-4 py-5">
      <div className="max-w-md mx-auto space-y-4">
        <ScoreBoard teamA={teamA} teamB={teamB} scoreA={scoreA} scoreB={scoreB} active={active} />

        <div className="flex items-center justify-between">
          <Pill>
            Team dran: <span className="text-white/85 font-semibold">{activeName}</span>
          </Pill>
          <ModeBadge mode={mode} />
        </div>

        <Timer seconds={duration} running={running} onDone={onTimerDone} />

        <Card className="p-5">
          <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">Begriff</div>
          <div className="text-center py-6">
            <div className="text-4xl font-extrabold tracking-tight text-white/95 leading-tight">{current}</div>
            {mode === "MALEN" && (
              <div className="text-white/45 text-sm mt-3">(MVP) Malen-Modus: später kommt Canvas dazu.</div>
            )}
          </div>

          {!running ? (
            <Button className="w-full" variant="primary" onClick={onStartRound}>
              Runde starten
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Button variant="good" onClick={onCorrect}>
                Richtig (+1)
              </Button>
              <Button variant="secondary" onClick={onSkip}>
                Skip
              </Button>
            </div>
          )}
        </Card>

        <div className="text-center text-[12px] text-white/35">{running ? "Weiterreichen ist verboten 😉" : "Handy ans nächste Team geben."}</div>

        <RoundEndModal
          open={roundOver}
          title="Zeit vorbei"
          subtitle={summary}
          onNextTeam={onNextTeam}
        />
      </div>
    </div>
  );
}
