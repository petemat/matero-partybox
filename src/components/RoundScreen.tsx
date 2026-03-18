import { useEffect, useMemo, useRef, useState } from "react";
import { t, type Lang } from "../i18n";
import { getTerms } from "../data/terms.index";
import type { PackId } from "../data/packs";
import { pickRandomTwist, type Twist } from "../data/twists";
import { makeDeck } from "../utils/deck";
import type { Mode } from "./ModeBadge";
import { ModeBadge } from "./ModeBadge";
import { ScoreBoard } from "./ScoreBoard";
import { Timer } from "./Timer";
import { Button, Card, Pill } from "./ui";
import { RoundEndModal } from "./RoundEndModal";
import type { RoundRecap } from "./RoundRecapModal";
import { TopBar } from "./TopBar";
import { CorrectDelight } from "./CorrectDelight";

function randomMode(): Mode {
  const r = Math.random();
  if (r < 0.34) return "PANTOMIME";
  if (r < 0.67) return "MALEN";
  return "ERKLAEREN";
}

function modeLabel(lang: Lang, mode: Mode) {
  if (mode === "PANTOMIME") return t(lang, "pantomime");
  if (mode === "MALEN") return t(lang, "draw");
  return t(lang, "explain");
}

// shuffle + de-dup moved to ../utils/deck

export function RoundScreen({
  teamA,
  teamB,
  duration,
  twistsEnabled,
  packs,
  lang,
  onExit,
}: {
  teamA: string;
  teamB: string;
  duration: number;
  twistsEnabled: boolean;
  packs: PackId[];
  lang: Lang;
  onExit: () => void;
}) {
  const [active, setActive] = useState<"A" | "B">("A");
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  const [mode, setMode] = useState<Mode>(() => randomMode());
  const [twist, setTwist] = useState<Twist | null>(null);
  const terms = useMemo(() => getTerms(lang, packs), [lang, packs]);
  const [deck, setDeck] = useState(() => makeDeck(terms));
  const [idx, setIdx] = useState(0);

  const [running, setRunning] = useState(false);
  const [roundOver, setRoundOver] = useState(false);
  const [handoff, setHandoff] = useState(true);

  // recap / share
  const roundWordsRef = useRef<string[]>([]);
  const roundStartRef = useRef<{ active: "A" | "B"; scoreA: number; scoreB: number; mode: Mode; twist: Twist | null } | null>(null);
  const [recap, setRecap] = useState<RoundRecap | null>(null);

  // (removed duplicate recap state)

  // micro-delight
  const [correctFxKey, setCorrectFxKey] = useState(0);
  const [cardPop, setCardPop] = useState(false);

  // countdown
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownTimersRef = useRef<number[]>([]);
  const countdownAudioRef = useRef<AudioContext | null>(null);

  const current = deck[idx] ?? (lang === "en" ? "(no more words)" : "(keine Begriffe mehr)");
  const activeName = active === "A" ? teamA : teamB;

  const noteWord = (w: string) => {
    const term = String(w || "").trim();
    if (!term) return;
    const prev = roundWordsRef.current;
    const next = prev.length && prev[prev.length - 1] === term ? prev : [...prev, term];
    roundWordsRef.current = next.slice(-3);
  };

  const nextCard = () => {
    noteWord(current);
    setIdx((v) => (v + 1 < deck.length ? v + 1 : v));
  };

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

    const m = randomMode();
    const tw = twistsEnabled ? pickRandomTwist() : null;
    setMode(m);
    setTwist(tw);

    // reset recap tracking for this round
    const first = String(current || "").trim();
    const initWords = first ? [first] : [];
    roundWordsRef.current = initWords;
    setRecap(null);
    roundStartRef.current = { active, scoreA, scoreB, mode: m, twist: tw };

    setRoundOver(false);
    setRunning(false);

    setHandoff(false);
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

    // include the current word in recap (if it wasn't advanced)
    noteWord(current);

    const start = roundStartRef.current;
    const roundActive = start?.active ?? active;
    const teamName = roundActive === "A" ? teamA : teamB;
    const delta = roundActive === "A" ? scoreA - (start?.scoreA ?? scoreA) : scoreB - (start?.scoreB ?? scoreB);

    setRecap({
      teamName,
      delta,
      mode: start?.mode ?? mode,
      twist: start?.twist ?? twist,
      words: roundWordsRef.current,
      scoreLine: `${teamA}: ${scoreA}  ·  ${teamB}: ${scoreB}`,
    });

    setRoundOver(true);
  };

  const recapDetails = useMemo(() => {
    if (!recap) return "";
    const lines: string[] = [];
    lines.push(`${recap.teamName} (${recap.delta >= 0 ? "+" : ""}${recap.delta})`);
    lines.push(`${t(lang, "recapMode")} ${modeLabel(lang, recap.mode)}`);

    const twistLine = recap.twist
      ? `${recap.twist.title[lang]} — ${recap.twist.rule[lang]}`
      : t(lang, "twistNone");
    lines.push(`${t(lang, "recapTwist")} ${twistLine}`);

    lines.push(`${t(lang, "recapWords")} ${recap.words.length ? recap.words.join(", ") : "-"}`);
    lines.push(`${t(lang, "recapScore")} ${recap.scoreLine}`);
    return lines.join("\n");
  }, [lang, recap]);

  const recapCopyText = useMemo(() => {
    const header = lang === "en" ? "PartyBox — Round recap" : "PartyBox — Runden-Recap";
    return `${header}\n${recapDetails}`;
  }, [lang, recapDetails]);

  const onNextTeam = () => {
    setActive((v) => (v === "A" ? "B" : "A"));
    setRoundOver(false);
    setRunning(false);
    setHandoff(true);

    if (idx >= deck.length - 1) {
      setDeck(makeDeck(terms));
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

      {handoff && countdown === null && !running && !roundOver && (
        <div
          className="countdownOverlay"
          role="button"
          aria-label="Start round"
          onClick={onStartRound}
          style={{ cursor: "pointer" }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "rgba(255,255,255,0.70)", letterSpacing: ".22em", textTransform: "uppercase", fontSize: 12, fontWeight: 800 }}>
              {t(lang, "handoffTitle")}
            </div>
            <div style={{ marginTop: 14, color: "rgba(255,255,255,0.92)", fontSize: 44, fontWeight: 950, letterSpacing: "-0.03em" }}>
              {activeName}
            </div>
            <div style={{ marginTop: 14, color: "rgba(255,255,255,0.55)", fontSize: 14 }}>
              {t(lang, "handoffTap")}
            </div>
          </div>
        </div>
      )}

      {countdown !== null && (
        <div className="countdownOverlay" aria-hidden>
          <div className="countdownNumber">{countdown}</div>
        </div>
      )}

      <div className="container stack-3" style={{ margin: "0 auto" }}>
        <ScoreBoard teamA={teamA} teamB={teamB} scoreA={scoreA} scoreB={scoreB} active={active} />

        <div className="row-between" style={{ gap: 10, flexWrap: "wrap" }}>
          <Pill>
            {t(lang, "teamTurn")} <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 800 }}>{activeName}</span>
          </Pill>
          <div className="row" style={{ gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {twist && <Pill>{t(lang, "twistBadge")}: {twist.title[lang]}</Pill>}
            <ModeBadge mode={mode} lang={lang} />
          </div>
        </div>

        <Timer seconds={duration} running={running} onDone={onTimerDone} lang={lang} />

        <Card
          className={`cardSolid card-pad stack-2 ${cardPop ? "pb-card-pop" : ""}`}
          style={{ position: "relative", overflow: "hidden" }}
        >
          <CorrectDelight burstKey={correctFxKey} />
          {twist && (
            <div
              style={{
                marginBottom: 10,
                padding: "10px 12px",
                borderRadius: 14,
                background: "rgba(0,0,0,0.28)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)" }}>
                {t(lang, "twistActive")}
              </div>
              <div style={{ marginTop: 6, fontSize: 15, fontWeight: 850, color: "rgba(255,255,255,0.92)" }}>{twist.title[lang]}</div>
              <div style={{ marginTop: 6, fontSize: 13, lineHeight: 1.25, color: "rgba(255,255,255,0.70)" }}>{twist.rule[lang]}</div>
            </div>
          )}

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

        <RoundEndModal
          open={roundOver}
          title={t(lang, "recapTitle")}
          subtitle={t(lang, "timeUp")}
          details={recapDetails || undefined}
          copyText={recap ? recapCopyText : undefined}
          onNextTeam={onNextTeam}
          lang={lang}
        />
      </div>

      {!roundOver && (
        <div className="stickyCtaBar" role="navigation" aria-label="Round actions">
          <div className="container stickyCtaInner">
            {!running ? (
              <Button variant="primary" onClick={() => setHandoff(true)}>
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
