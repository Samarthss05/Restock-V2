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
    sage: "bg-gradient-to-br from-sage-dark to-sage text-white",
    gold: "bg-gradient-to-br from-gold-bright to-gold text-white",
    destructive: "bg-gradient-to-br from-destructive to-[#a84545] text-white",
    slate: "bg-black/[0.06] text-black/60",
  };
  return (
    <div className="card-shadow rounded-card border border-black/[0.04] bg-white p-4">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-2xl ${tintStyles[tint]}`}
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
