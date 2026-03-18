import { Button, Card } from "./ui";

import { t, type Lang } from "../i18n";

export function RoundEndModal({
  open,
  onNextTeam,
  title,
  subtitle,
  details,
  lang,
}: {
  open: boolean;
  onNextTeam: () => void;
  title: string;
  subtitle?: string;
  details?: string;
  lang: Lang;
}) {
  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(0,0,0,0.62)",
        backdropFilter: "blur(6px)",
      }}
    >
      <Card className="card-pad" style={{ maxWidth: 420, width: "100%" } as any}>
        <div style={{ color: "rgba(255,255,255,0.92)", fontSize: 22, fontWeight: 900 }}>{title}</div>
        {subtitle && <div style={{ color: "rgba(255,255,255,0.58)", marginTop: 8, fontSize: 14 }}>{subtitle}</div>}
        {details && <div style={{ color: "rgba(255,255,255,0.70)", marginTop: 10, fontSize: 13, lineHeight: 1.25 }}>{details}</div>}
        <div style={{ marginTop: 16 }}>
          <Button variant="primary" onClick={onNextTeam}>
            {t(lang, "nextTeam")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
