import { useMemo, useState } from "react";
import { Button, Card, Pill } from "./ui";

export function StartScreen({
  onStart,
}: {
  onStart: (cfg: { teamA: string; teamB: string; duration: number }) => void;
}) {
  const [teamA, setTeamA] = useState("Team A");
  const [teamB, setTeamB] = useState("Team B");
  const [duration, setDuration] = useState<30 | 60 | 90>(60);

  const durations: Array<30 | 60 | 90> = useMemo(() => [30, 60, 90], []);

  return (
    <div className="min-h-[100svh] px-5 py-7 flex items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <div className="text-white/90 text-3xl font-extrabold tracking-tight">PartyBox</div>
          <div className="text-white/50 text-sm mt-1">Activity / Tabu – 2 Teams, 1 Handy.</div>
        </div>

        <Card className="p-5 space-y-4">
          <div className="text-xs text-white/50 uppercase tracking-[0.2em]">Teams</div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <div className="text-[11px] text-white/40 mb-1">Team A</div>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/85 outline-none"
                value={teamA}
                onChange={(e) => setTeamA(e.target.value)}
              />
            </label>
            <label className="block">
              <div className="text-[11px] text-white/40 mb-1">Team B</div>
              <input
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white/85 outline-none"
                value={teamB}
                onChange={(e) => setTeamB(e.target.value)}
              />
            </label>
          </div>

          <div className="text-xs text-white/50 uppercase tracking-[0.2em] mt-2">Rundendauer</div>
          <div className="flex gap-2">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={
                  "flex-1 rounded-2xl border px-3 py-3 text-sm font-semibold transition " +
                  (duration === d
                    ? "border-violet-400/40 bg-violet-500/15 text-violet-100"
                    : "border-white/10 bg-white/5 text-white/75 hover:bg-white/8")
                }
              >
                {d}s
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1">
            <Pill>Modus pro Runde zufällig</Pill>
            <Pill>Begriffe ohne Wiederholung</Pill>
          </div>

          <Button
            variant="primary"
            className="w-full mt-2"
            onClick={() => onStart({ teamA: teamA.trim() || "Team A", teamB: teamB.trim() || "Team B", duration })}
          >
            Spiel starten
          </Button>
        </Card>

        <div className="text-center text-[12px] text-white/35">
          Tipp: Handy weitergeben. Eine Runde = ein Team. Danach wechselt ihr.
        </div>
      </div>
    </div>
  );
}
