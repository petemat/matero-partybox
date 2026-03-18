import type React from "react";
// (no component imports)

export function TopBar({
  title,
  right,
  onBack,
}: {
  title?: string;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        padding: "10px 16px 8px",
        margin: "-16px -16px 0",
        background: "linear-gradient(180deg, rgba(8,10,24,0.92), rgba(8,10,24,0))",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="row-between">
        <div className="row" style={{ gap: 10, alignItems: "center" }}>
          {onBack ? (
            <button
              className="pill"
              onClick={onBack}
              type="button"
              aria-label="Back"
              style={{ cursor: "pointer" }}
            >
              ←
            </button>
          ) : null}
          {title ? <div style={{ color: "rgba(255,255,255,0.85)", fontWeight: 800 }}>{title}</div> : null}
        </div>
        {right ? <div className="row" style={{ gap: 8 }}>{right}</div> : null}
      </div>
    </div>
  );
}
