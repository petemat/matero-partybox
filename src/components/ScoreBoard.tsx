import { Pill } from "./ui";

export function ScoreBoard({
  teamA,
  teamB,
  scoreA,
  scoreB,
  active,
}: {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  active: "A" | "B";
}) {
  return (
    <div className="row">
      <div className={`card`} style={{ flex: 1, padding: 12, borderColor: active === "A" ? "rgba(167,139,250,0.35)" : "rgba(255,255,255,0.12)", background: active === "A" ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.06)" }}>
        <div className="row-between">
          <div style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.86)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {teamA || "Team A"}
          </div>
          <Pill className={active === "A" ? "pill--active" : ""}>{scoreA}</Pill>
        </div>
      </div>
      <div className={`card`} style={{ flex: 1, padding: 12, borderColor: active === "B" ? "rgba(167,139,250,0.35)" : "rgba(255,255,255,0.12)", background: active === "B" ? "rgba(124,58,237,0.14)" : "rgba(255,255,255,0.06)" }}>
        <div className="row-between">
          <div style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.86)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {teamB || "Team B"}
          </div>
          <Pill className={active === "B" ? "pill--active" : ""}>{scoreB}</Pill>
        </div>
      </div>
    </div>
  );
}
