import { useEffect, useState } from "react";
import { StartScreen } from "./components/StartScreen";
import { RoundScreen } from "./components/RoundScreen";
import { loadLang, saveLang, type Lang } from "./i18n";

export default function App() {
  const [cfg, setCfg] = useState<{ teamA: string; teamB: string; duration: number } | null>(null);
  const [lang, setLang] = useState<Lang>(() => loadLang());

  useEffect(() => {
    saveLang(lang);
  }, [lang]);

  const backToStart = () => {
    setCfg(null);
  };

  if (!cfg) {
    return <StartScreen onStart={(c) => setCfg(c)} lang={lang} setLang={setLang} />;
  }

  return <RoundScreen teamA={cfg.teamA} teamB={cfg.teamB} duration={cfg.duration} lang={lang} onExit={backToStart} />;
}
