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
    <div className="screen">
      <div className="container stack-4">
        <div style={{ textAlign: "center" }}>
          <div className="h1">PartyBox</div>
          <div className="sub">Activity / Tabu – 2 Teams, 1 Handy.</div>
        </div>

        <Card className="card-pad stack-3">
          <div className="kicker">Teams</div>
          <div className="grid-2">
            <label>
              <div className="kicker" style={{ letterSpacing: ".12em", opacity: 0.8 }}>
                Team A
              </div>
              <input className="input" value={teamA} onChange={(e) => setTeamA(e.target.value)} />
            </label>
            <label>
              <div className="kicker" style={{ letterSpacing: ".12em", opacity: 0.8 }}>
                Team B
              </div>
              <input className="input" value={teamB} onChange={(e) => setTeamB(e.target.value)} />
            </label>
          </div>

          <div className="kicker" style={{ marginTop: 6 }}>
            Rundendauer
          </div>
          <div className="row">
            {durations.map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`btn btn--secondary`}
                style={{ padding: "12px 10px", borderRadius: 16, fontSize: 15, width: "100%", background: "rgba(255,255,255,0.06)" }}
              >
                <span style={{ opacity: duration === d ? 1 : 0.9, fontWeight: duration === d ? 800 : 700 }}>
                  {d}s
                </span>
              </button>
            ))}
          </div>

          <div className="row-between" style={{ paddingTop: 4 }}>
            <Pill>Modus pro Runde zufällig</Pill>
            <Pill>Begriffe ohne Wiederholung</Pill>
          </div>

          <Button
            variant="primary"
            onClick={() =>
              onStart({
                teamA: teamA.trim() || "Team A",
                teamB: teamB.trim() || "Team B",
                duration,
              })
            }
          >
            Spiel starten
          </Button>
        </Card>

        <div className="smallNote">Tipp: Handy weitergeben. Eine Runde = ein Team. Danach wechselt ihr.</div>
      </div>
    </div>
  );
}
