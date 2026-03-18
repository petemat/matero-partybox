import { useEffect, useMemo, useState } from "react";
import { t, type Lang } from "../i18n";

export function Timer({
  seconds,
  running,
  onDone,
  lang,
}: {
  seconds: number;
  running: boolean;
  onDone: () => void;
  lang: Lang;
}) {
  const [left, setLeft] = useState(seconds);

  useEffect(() => {
    setLeft(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!running) return;
    if (left <= 0) return;

    const t = setInterval(() => setLeft((v) => v - 1), 1000);
    return () => clearInterval(t);
  }, [running, left]);

  useEffect(() => {
    if (!running) return;
    if (left === 0) onDone();
  }, [left, onDone, running]);

  const mmss = useMemo(() => {
    const m = Math.floor(left / 60);
    const s = left % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  }, [left]);

  const urgent = left <= 5;

  return (
    <div className={`timer ${urgent ? "timer--urgent" : ""}`.trim()}>
      <div className="timerLabel">{t(lang, "timer")}</div>
      <div className="timerValue">{mmss}</div>
      {urgent && (
        <div className="timerLabel" style={{ letterSpacing: ".12em" }}>
          {t(lang, "lastSeconds")}
        </div>
      )}
    </div>
  );
}
