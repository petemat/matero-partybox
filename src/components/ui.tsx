import type { PropsWithChildren } from "react";

export function Card({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={
        "rounded-3xl bg-white/7 border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl " +
        className
      }
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
}: PropsWithChildren<{
  onClick?: () => void;
  variant?: "primary" | "secondary" | "good" | "bad";
  disabled?: boolean;
  className?: string;
}>) {
  const base =
    "select-none rounded-2xl px-5 py-4 text-base font-semibold tracking-tight active:scale-[0.99] transition " +
    "disabled:opacity-60 disabled:cursor-not-allowed";

  const styles: Record<string, string> = {
    primary: "bg-violet-500/90 hover:bg-violet-400/90 text-white border border-violet-300/20",
    secondary: "bg-white/5 hover:bg-white/10 text-white/85 border border-white/10",
    good: "bg-emerald-500/85 hover:bg-emerald-400/85 text-white border border-emerald-300/20",
    bad: "bg-rose-500/85 hover:bg-rose-400/85 text-white border border-rose-300/20",
  };

  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Pill({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 ${className}`}>
      {children}
    </div>
  );
}
