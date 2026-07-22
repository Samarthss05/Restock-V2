import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export function ListRow({
  icon: Icon,
  iconTint = "sage",
  title,
  subtitle,
  trailing,
  chevron = false,
  onClick,
}: {
  icon?: LucideIcon;
  iconTint?: "sage" | "gold" | "destructive" | "slate";
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  chevron?: boolean;
  onClick?: () => void;
}) {
  const tintStyles: Record<string, string> = {
    sage: "bg-sage-100 text-sage-dark",
    gold: "bg-gold/15 text-gold",
    destructive: "bg-destructive/10 text-destructive",
    slate: "bg-black/[0.05] text-black/60",
  };
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`flex w-full items-center gap-3 py-3 text-left ${onClick ? "active:opacity-60" : ""}`}
    >
      {Icon && (
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${tintStyles[iconTint]}`}>
          <Icon size={18} strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14.5px] font-medium text-app-fg">{title}</div>
        {subtitle && <div className="truncate text-[12.5px] text-black/50">{subtitle}</div>}
      </div>
      {trailing && <div className="shrink-0 text-right">{trailing}</div>}
      {chevron && <ChevronRight size={16} className="shrink-0 text-black/25" />}
    </Comp>
  );
}
