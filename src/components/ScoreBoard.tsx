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
    <div className="flex items-center justify-between gap-3">
      <div className={`flex-1 rounded-2xl border px-4 py-3 ${active === "A" ? "border-violet-400/40 bg-violet-500/10" : "border-white/10 bg-white/5"}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/80 font-semibold truncate">{teamA || "Team A"}</div>
          <Pill className={active === "A" ? "border-violet-400/30 bg-violet-500/15 text-violet-100" : ""}>
            {scoreA}
          </Pill>
        </div>
      </div>
      <div className={`flex-1 rounded-2xl border px-4 py-3 ${active === "B" ? "border-violet-400/40 bg-violet-500/10" : "border-white/10 bg-white/5"}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/80 font-semibold truncate">{teamB || "Team B"}</div>
          <Pill className={active === "B" ? "border-violet-400/30 bg-violet-500/15 text-violet-100" : ""}>
            {scoreB}
          </Pill>
        </div>
      </div>
    </div>
  );
}
