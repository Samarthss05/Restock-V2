import type { LucideIcon } from "lucide-react";

export function StatTile({
  icon: Icon,
  label,
  value,
  tint = "sage",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tint?: "sage" | "gold" | "destructive" | "slate";
}) {
  const tintStyles: Record<string, string> = {
    sage: "grad-sage text-white",
    gold: "grad-gold text-white",
    destructive: "grad-destructive text-white",
    slate: "bg-black/[0.06] text-black/60",
  };
  const cardStyles: Record<string, string> = {
    sage: "card-soft-sage",
    gold: "card-soft-gold",
    destructive: "card-soft-destructive",
    slate: "bg-white",
  };
  return (
    <div className={`card-shadow rounded-card border border-black/[0.04] p-4 ${cardStyles[tint]}`}>
      <div
        className={`icon-tile mb-3 flex h-9 w-9 items-center justify-center shadow-sm ${tintStyles[tint]}`}
      >
        <Icon size={16} strokeWidth={2.3} />
      </div>
      <div className="text-[22px] font-bold tabular-nums leading-none tracking-tight text-app-fg">
        {value}
      </div>
      <div className="mt-1.5 text-[12px] text-black/45">{label}</div>
    </div>
  );
}
