import { useRef, useState } from "react";
import { Button, Card, Pill } from "./ui";

import { t, type Lang } from "../i18n";

async function copyToClipboard(text: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through
  }

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

export function RoundEndModal({
  open,
  onNextTeam,
  title,
  subtitle,
  details,
  copyText,
  lang,
}: {
  open: boolean;
  onNextTeam: () => void;
  title: string;
  subtitle?: string;
  details?: string;
  copyText?: string;
  lang: Lang;
}) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  if (!open) return null;

  const onCopy = async () => {
    const text = copyText || details || "";
    if (!text.trim()) return;

    const ok = await copyToClipboard(text);
    if (!ok) {
      window.prompt(lang === "en" ? "Copy recap:" : "Recap kopieren:", text);
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
        zIndex: 50,
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
          <div style={{ color: "rgba(255,255,255,0.92)", fontSize: 22, fontWeight: 900 }}>{title}</div>
          {copied && <Pill className="pill--green">{t(lang, "copied")}</Pill>}
        </div>

        {subtitle && <div style={{ color: "rgba(255,255,255,0.58)", marginTop: 2, fontSize: 14 }}>{subtitle}</div>}
        {details && <pre style={{ whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.78)", marginTop: 10, fontSize: 13, lineHeight: 1.25 }}>{details}</pre>}

        <div className="btn-row" style={{ marginTop: 6 }}>
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
