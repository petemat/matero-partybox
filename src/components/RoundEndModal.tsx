import { Button, Card } from "./ui";

export function RoundEndModal({
  open,
  onNextTeam,
  title,
  subtitle,
}: {
  open: boolean;
  onNextTeam: () => void;
  title: string;
  subtitle?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-5 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-md p-5">
        <div className="text-white/90 text-xl font-bold">{title}</div>
        {subtitle && <div className="text-white/60 text-sm mt-2">{subtitle}</div>}
        <div className="mt-5">
          <Button variant="primary" className="w-full" onClick={onNextTeam}>
            Nächstes Team
          </Button>
        </div>
      </Card>
    </div>
  );
}
