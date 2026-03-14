import { useEffect, useMemo, useState } from "react";

export function Timer({
  seconds,
  running,
  onDone,
}: {
  seconds: number;
  running: boolean;
  onDone: () => void;
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
    <div
      className={
        "rounded-2xl border px-4 py-3 text-center font-bold tabular-nums " +
        (urgent
          ? "border-rose-400/30 bg-rose-500/15 text-rose-100"
          : "border-white/10 bg-white/5 text-white/80")
      }
    >
      <div className="text-[11px] uppercase tracking-[0.22em] opacity-70">Timer</div>
      <div className="text-3xl leading-tight">{mmss}</div>
      {urgent && <div className="text-[11px] opacity-80">Letzte Sekunden!</div>}
    </div>
  );
}
