import { useState } from "react";
import { StartScreen } from "./components/StartScreen";
import { RoundScreen } from "./components/RoundScreen";

export default function App() {
  const [cfg, setCfg] = useState<{ teamA: string; teamB: string; duration: number } | null>(null);

  if (!cfg) {
    return <StartScreen onStart={(c) => setCfg(c)} />;
  }

  return <RoundScreen teamA={cfg.teamA} teamB={cfg.teamB} duration={cfg.duration} />;
}
