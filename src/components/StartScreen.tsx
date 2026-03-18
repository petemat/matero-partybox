import { useMemo, useState } from "react";
import { t, type Lang } from "../i18n";
import { Button, Card, Pill } from "./ui";

export function StartScreen({
  onStart,
  lang,
  setLang,
}: {
  onStart: (cfg: { teamA: string; teamB: string; duration: number }) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  const [teamA, setTeamA] = useState(t(lang, "teamA"));
  const [teamB, setTeamB] = useState(t(lang, "teamB"));
  const [duration, setDuration] = useState<30 | 60 | 90>(60);

  const durations: Array<30 | 60 | 90> = useMemo(() => [30, 60, 90], []);

  return (
    <div className="screen">
      <div className="container stack-4">
        <div style={{ textAlign: "center" }}>
          <div className="h1">PartyBox</div>
          <div className="sub">{t(lang, "tagline")}</div>
          <div style={{ marginTop: 10 }}>
            <div className="row" style={{ justifyContent: "center", gap: 8 }}>
              <button
                className={`pill ${lang === "de" ? "pill--active" : ""}`}
                onClick={() => setLang("de")}
                type="button"
              >
                DE
              </button>
              <button
                className={`pill ${lang === "en" ? "pill--active" : ""}`}
                onClick={() => setLang("en")}
                type="button"
              >
                EN
              </button>
            </div>
          </div>
        </div>

        <Card className="cardSolid card-pad stack-3">
          <div className="kicker">{t(lang, "teams")}</div>
          <div className="grid-2">
            <label>
              <div className="kicker" style={{ letterSpacing: ".12em", opacity: 0.8 }}>
                {t(lang, "teamA")}
              </div>
              <input className="input" value={teamA} onChange={(e) => setTeamA(e.target.value)} />
            </label>
            <label>
              <div className="kicker" style={{ letterSpacing: ".12em", opacity: 0.8 }}>
                {t(lang, "teamB")}
              </div>
              <input className="input" value={teamB} onChange={(e) => setTeamB(e.target.value)} />
            </label>
          </div>

          <div className="kicker" style={{ marginTop: 6 }}>
            {t(lang, "roundDuration")}
          </div>
          <div className="segmented" role="tablist" aria-label="Round duration">
            {durations.map((d) => {
              const active = duration === d;
              return (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={"segment" + (active ? " segment--active" : "")}
                  type="button"
                  role="tab"
                  aria-selected={active}
                >
                  {d}s
                </button>
              );
            })}
          </div>

          <div className="row-between" style={{ paddingTop: 4 }}>
            <Pill>{t(lang, "modeRandom")}</Pill>
            <Pill>{t(lang, "noRepeats")}</Pill>
          </div>

          <Button
            variant="primary"
            onClick={() =>
              onStart({
                teamA: teamA.trim() || t(lang, "teamA"),
                teamB: teamB.trim() || t(lang, "teamB"),
                duration,
              })
            }
          >
            {t(lang, "startGame")}
          </Button>
        </Card>

        <div className="smallNote">{t(lang, "quickHint")}</div>
      </div>
    </div>
  );
}
