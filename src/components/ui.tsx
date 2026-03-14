import type { PropsWithChildren } from "react";
import type React from "react";

export function Card({
  children,
  className = "",
  style,
}: PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <div className={`card ${className}`.trim()} style={style}>
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
  full = true,
}: PropsWithChildren<{
  onClick?: () => void;
  variant?: "primary" | "secondary" | "good" | "bad";
  disabled?: boolean;
  className?: string;
  full?: boolean;
}>) {
  const v =
    variant === "primary"
      ? "btn--primary"
      : variant === "good"
        ? "btn--good"
        : variant === "bad"
          ? "btn--bad"
          : "btn--secondary";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn ${v} ${full ? "" : ""} ${className}`}
    >
      {children}
    </button>
  );
}

export function Pill({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return <div className={`pill ${className}`}>{children}</div>;
}
