import { useEffect, useMemo, useState } from "react";
import { t, type Lang } from "../i18n";
import { PACKS, type PackId, normalizePackSelection, DEFAULT_PACKS } from "../data/packs";
import { Button, Card, Pill } from "./ui";

export function StartScreen({
  onStart,
  lang,
  setLang,
}: {
  onStart: (cfg: { teamA: string; teamB: string; duration: number; twistsEnabled: boolean; packs: PackId[] }) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
}) {
  const [teamA, setTeamA] = useState(t(lang, "teamA"));
  const [teamB, setTeamB] = useState(t(lang, "teamB"));
  const [duration, setDuration] = useState<30 | 60 | 90>(60);

  const [packs, setPacks] = useState<PackId[]>(() => {
    try {
      const raw = window.localStorage.getItem("partybox:packs");
      return normalizePackSelection(raw ? JSON.parse(raw) : DEFAULT_PACKS);
    } catch {
      return DEFAULT_PACKS;
    }
  });

  const [twistsEnabled, setTwistsEnabled] = useState<boolean>(() => {
    try {
      return window.localStorage.getItem("partybox:twists") !== "off";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("partybox:packs", JSON.stringify(packs));
    } catch {}
  }, [packs]);

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

          <div className="row-between" style={{ paddingTop: 4, gap: 10, alignItems: "center" }}>
            <div className="kicker" style={{ margin: 0 }}>
              {t(lang, "twistsLabel")}
            </div>
            <button
              type="button"
              className={`pill ${twistsEnabled ? "pill--active" : ""}`}
              onClick={() => {
                const next = !twistsEnabled;
                setTwistsEnabled(next);
                try {
                  window.localStorage.setItem("partybox:twists", next ? "on" : "off");
                } catch {}
              }}
              aria-pressed={twistsEnabled}
            >
              {twistsEnabled ? t(lang, "on") : t(lang, "off")}
            </button>
          </div>

          <div className="kicker" style={{ marginTop: 10 }}>
            {t(lang, "packs")}
          </div>
          <div className="row" style={{ flexWrap: "wrap", gap: 8 }} aria-label={t(lang, "packs")}>
            {PACKS.map((p) => {
              const active = packs.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`pill ${active ? "pill--active" : ""}`}
                  aria-pressed={active}
                  onClick={() => {
                    setPacks((prev) => {
                      const has = prev.includes(p.id);
                      const next = has ? prev.filter((x) => x !== p.id) : [...prev, p.id];
                      return next.length ? next : DEFAULT_PACKS;
                    });
                  }}
                >
                  {t(lang, p.labelKey)}
                </button>
              );
            })}
          </div>

          <Button
            variant="primary"
            onClick={() =>
              onStart({
                teamA: teamA.trim() || t(lang, "teamA"),
                teamB: teamB.trim() || t(lang, "teamB"),
                duration,
                twistsEnabled,
                packs,
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
