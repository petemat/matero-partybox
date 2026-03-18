import { useEffect, useMemo, useRef, useState } from "react";
import { t, type Lang } from "../i18n";
import { getTerms } from "../data/terms.index";
import type { Mode } from "./ModeBadge";
import { ModeBadge } from "./ModeBadge";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";
import { Button, Card, Pill } from "./ui";
import { RoundEndModal } from "./RoundEndModal";
import { TopBar } from "./TopBar";
import { CorrectDelight } from "./CorrectDelight";

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

  // micro-delight
  const [correctFxKey, setCorrectFxKey] = useState(0);
  const [cardPop, setCardPop] = useState(false);

  // countdown
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimersRef = useRef<number[]>([]);
  const countdownAudioRef = useRef<AudioContext | null>(null);

  const current = deck[idx] ?? (lang === "en" ? "(no more words)" : "(keine Begriffe mehr)");
  const activeName = active === "A" ? teamA : teamB;

  const nextCard = () => setIdx((v) => (v + 1 < deck.length ? v + 1 : v));

  const onCorrect = () => {
    setCorrectFxKey((k) => k + 1);
    setCardPop(true);
    window.setTimeout(() => setCardPop(false), 180);
    try {
      (navigator as any)?.vibrate?.(12);
    } catch {}

    if (active === "A") setScoreA((v) => v + 1);
    else setScoreB((v) => v + 1);
    nextCard();
  };

  const onSkip = () => {
    nextCard();
  };

  const clearCountdownTimers = () => {
    for (const id of countdownTimersRef.current) window.clearTimeout(id);
    countdownTimersRef.current = [];
  };

  const closeCountdownAudio = () => {
    const ctx = countdownAudioRef.current;
    countdownAudioRef.current = null;
    try {
      ctx?.close();
    } catch {}
  };

  const playCountdownBeep = (ctx: AudioContext, freq: number) => {
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.value = 0.045;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.07);
    } catch {}
  };

  const onStartRound = () => {
    if (running) return;
    if (countdown !== null) return;

    setMode(randomMode());
    setRoundOver(false);
    setRunning(false);

    setCountdown(3);

    const soundOn = (() => {
      try {
        return window.localStorage.getItem("partybox:sound") !== "off";
      } catch {
        return true;
      }
    })();

    clearCountdownTimers();
    closeCountdownAudio();

    let ctx: AudioContext | null = null;
    if (soundOn) {
      try {
        ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        ctx.resume?.();
        countdownAudioRef.current = ctx;
      } catch {
        ctx = null;
      }
    }

    if (ctx) playCountdownBeep(ctx, 660);

    countdownTimersRef.current.push(
      window.setTimeout(() => {
        setCountdown(2);
        if (ctx) playCountdownBeep(ctx, 660);
      }, 1000),
    );

    countdownTimersRef.current.push(
      window.setTimeout(() => {
        setCountdown(1);
        if (ctx) playCountdownBeep(ctx, 660);
      }, 2000),
    );

    countdownTimersRef.current.push(
      window.setTimeout(() => {
        setCountdown(null);
        setRunning(true);
        if (ctx) playCountdownBeep(ctx, 880);
        window.setTimeout(() => closeCountdownAudio(), 200);
      }, 3000),
    );
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
    if (running || countdown !== null) {
      const ok = window.confirm(lang === "en" ? "End the game and go back to start?" : "Spiel beenden und zurück zum Start?");
      if (!ok) return;
    }
    onExit();
  };

  useEffect(() => {
    return () => {
      clearCountdownTimers();
      closeCountdownAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="roundScreen">
      <TopBar title="PartyBox" onBack={confirmExit} />

      {countdown !== null && (
        <div className="countdownOverlay" aria-hidden>
          <div className="countdownNumber">{countdown}</div>
        </div>
      )}

      <div className="container stack-3" style={{ margin: "0 auto" }}>
        <ScoreBoard teamA={teamA} teamB={teamB} scoreA={scoreA} scoreB={scoreB} active={active} />

        <div className="row-between">
          <Pill>
            {t(lang, "teamTurn")} <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 800 }}>{activeName}</span>
          </Pill>
          <ModeBadge mode={mode} lang={lang} />
        </div>

        <Timer seconds={duration} running={running} onDone={onTimerDone} lang={lang} />

        <Card
          className={`cardSolid card-pad stack-2 ${cardPop ? "pb-card-pop" : ""}`}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <CorrectDelight burstKey={correctFxKey} />
          <div className="kicker">{t(lang, "term")}</div>
          <div className="term">
            <div className="termWord">{current}</div>
            {mode === "MALEN" && (
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginTop: 10 }}>
                {t(lang, "drawMvpNote")}
              </div>
            )}
          </div>
        </Card>

        <div className="smallNote">{running ? t(lang, "noPassing") : t(lang, "passPhone")}</div>

        <RoundEndModal open={roundOver} title={t(lang, "timeUp")} subtitle={summary} onNextTeam={onNextTeam} />
      </div>

      {!roundOver && (
        <div className="stickyCtaBar" role="navigation" aria-label="Round actions">
          <div className="container stickyCtaInner">
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
          </div>
        </div>
      )}
    </div>
  );
}
