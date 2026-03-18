import { useMemo, useRef, useState } from "react";
import { t, type Lang } from "../i18n";
import type { Mode } from "./ModeBadge";
import { Button, Card, Pill } from "./ui";
import type { Twist } from "../data/twists";

export type RoundRecap = {
  teamName: string;
  delta: number;
  mode: Mode;
  twist: Twist | null;
  words: string[]; // already trimmed + max 3
  scoreLine: string;
};

async function copyToClipboard(text: string) {
  // Modern API
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }

  // Fallback: textarea + execCommand
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

function modeLabel(lang: Lang, mode: Mode) {
  if (mode === "PANTOMIME") return t(lang, "pantomime");
  if (mode === "MALEN") return t(lang, "draw");
  return t(lang, "explain");
}

function twistLabel(lang: Lang, twist: Twist | null) {
  if (!twist) return t(lang, "twistNone");
  return twist.title[lang];
}

export function RoundRecapModal({
  open,
  lang,
  recap,
  onNextTeam,
}: {
  open: boolean;
  lang: Lang;
  recap: RoundRecap | null;
  onNextTeam: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const shareText = useMemo(() => {
    if (!recap) return "";
    const header = lang === "en" ? "PartyBox — Round recap" : "PartyBox — Runden-Recap";
    const delta = `${recap.teamName} (${recap.delta >= 0 ? "+" : ""}${recap.delta})`;
    const mode = `${t(lang, "recapMode")} ${modeLabel(lang, recap.mode)}`;
    const twist = `${t(lang, "recapTwist")} ${twistLabel(lang, recap.twist)}`;
    const words = `${t(lang, "recapWords")} ${recap.words.join(", ") || "-"}`;
    const score = `${t(lang, "recapScore")} ${recap.scoreLine}`;
    return [header, delta, mode, twist, words, score].join("\n");
  }, [lang, recap]);

  if (!open || !recap) return null;

  const onCopy = async () => {
    const ok = await copyToClipboard(shareText);
    if (!ok) {
      window.prompt(lang === "en" ? "Copy recap:" : "Recap kopieren:", shareText);
      return;
    }

    setCopied(true);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(0,0,0,0.62)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Card className="card-pad stack-3" style={{ maxWidth: 460, width: "100%" } as any}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          <div style={{ color: "rgba(255,255,255,0.92)", fontSize: 22, fontWeight: 900 }}>{t(lang, "recapTitle")}</div>
          <Pill className={copied ? "pill--green" : ""}>{copied ? t(lang, "copied") : t(lang, "timeUp")}</Pill>
        </div>

        <div style={{ color: "rgba(255,255,255,0.92)", fontSize: 16, fontWeight: 850 }}>
          {recap.teamName} <span style={{ color: "rgba(255,255,255,0.65)", fontWeight: 800 }}>
            ({recap.delta >= 0 ? "+" : ""}
            {recap.delta})
          </span>
        </div>

        <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
          <Pill>
            {t(lang, "recapMode")} <span style={{ fontWeight: 800, color: "rgba(255,255,255,0.92)" }}>{modeLabel(lang, recap.mode)}</span>
          </Pill>
          <Pill>
            {t(lang, "recapTwist")} <span style={{ fontWeight: 800, color: "rgba(255,255,255,0.92)" }}>{twistLabel(lang, recap.twist)}</span>
          </Pill>
        </div>

        <div>
          <div className="kicker" style={{ marginBottom: 6 }}>
            {t(lang, "recapWords")}
          </div>
          <div className="row" style={{ gap: 8, flexWrap: "wrap" }}>
            {(recap.words.length ? recap.words : ["-"]).map((w, i) => (
              <Pill key={i} className="pill--cyan">
                {w}
              </Pill>
            ))}
          </div>
        </div>

        <div style={{ color: "rgba(255,255,255,0.60)", fontSize: 14 }}>{t(lang, "recapScore")} {recap.scoreLine}</div>

        <div className="btn-row" style={{ marginTop: 4 }}>
          <Button variant="secondary" onClick={onCopy}>
            {t(lang, "copyRecap")}
          </Button>
          <Button variant="primary" onClick={onNextTeam}>
            {t(lang, "nextTeam")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
