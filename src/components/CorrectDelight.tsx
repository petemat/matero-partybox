import { useEffect, useMemo, useRef } from "react";

/** Lightweight micro-delight (no deps): brief confetti burst + +1 pill. */
export function CorrectDelight({ burstKey }: { burstKey: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const colors = useMemo(
    () => [
      "rgba(16,185,129,0.95)",
      "rgba(110,231,183,0.95)",
      "rgba(124,58,237,0.95)",
      "rgba(167,139,250,0.95)",
      "rgba(255,255,255,0.92)",
    ],
    [],
  );

  useEffect(() => {
    if (!burstKey) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Small burst near lower area where buttons live.
    const origin = {
      x: rect.width / 2,
      y: rect.height * 0.74,
    };

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      g: number;
      size: number;
      rot: number;
      vr: number;
      life: number;
      ttl: number;
      color: string;
    };

    const particles: P[] = [];
    const n = 18;
    for (let i = 0; i < n; i++) {
      const a = (-Math.PI / 2) + (Math.random() - 0.5) * Math.PI * 0.95;
      const sp = 180 + Math.random() * 200;
      particles.push({
        x: origin.x,
        y: origin.y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        g: 680 + Math.random() * 220,
        size: 4 + Math.random() * 4,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 10,
        life: 0,
        ttl: 420 + Math.random() * 260,
        color: colors[(Math.random() * colors.length) | 0]!,
      });
    }

    const start = performance.now();
    let last = start;

    const draw = (now: number) => {
      const dt = Math.min(32, now - last);
      last = now;

      ctx.clearRect(0, 0, rect.width, rect.height);

      for (const p of particles) {
        p.life += dt;
        const t = p.life / p.ttl;
        if (t >= 1) continue;

        const dts = dt / 1000;
        p.vy += p.g * dts;
        p.x += p.vx * dts;
        p.y += p.vy * dts;
        p.rot += p.vr * dts;

        const alpha = 1 - t;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        // small rounded rect confetti
        const w = p.size * 1.6;
        const h = p.size * 0.8;
        roundRect(ctx, -w / 2, -h / 2, w, h, 2);
        ctx.fill();
        ctx.restore();
      }

      if (now - start < 760) {
        rafRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
        rafRef.current = null;
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [burstKey, colors]);

  return (
    <>
      <canvas ref={canvasRef} className="pb-confetti" aria-hidden="true" />
      {burstKey > 0 && (
        <div key={burstKey} className="pb-plus1" aria-hidden="true">
          +1
        </div>
      )}
    </>
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}
