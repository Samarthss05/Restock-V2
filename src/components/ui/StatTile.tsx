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
    sage: "bg-sage-100 text-sage-dark",
    gold: "bg-gold/15 text-gold",
    destructive: "bg-destructive/10 text-destructive",
    slate: "bg-black/[0.05] text-black/60",
  };
  return (
    <div className="rounded-card border border-black/[0.05] bg-white p-3.5">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full ${tintStyles[tint]}`}>
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <div className="text-[20px] font-semibold tabular-nums leading-tight text-app-fg">{value}</div>
      <div className="text-[12px] text-black/50">{label}</div>
    </div>
  );
}
