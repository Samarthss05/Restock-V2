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
    sage: "grad-sage text-white",
    gold: "grad-gold text-white",
    destructive: "grad-destructive text-white",
    slate: "bg-black/[0.06] text-black/55",
  };
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={`press flex w-full items-center gap-3 rounded-2xl py-3 text-left ${
        onClick ? "active:bg-black/[0.02]" : ""
      }`}
    >
      {Icon && (
        <div
          className={`icon-tile flex h-10 w-10 shrink-0 items-center justify-center shadow-sm ${tintStyles[iconTint]}`}
        >
          <Icon size={17} strokeWidth={2} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14.5px] font-semibold text-app-fg">{title}</div>
        {subtitle && <div className="truncate text-[12.5px] text-black/45">{subtitle}</div>}
      </div>
      {trailing && <div className="shrink-0 text-right">{trailing}</div>}
      {chevron && <ChevronRight size={16} className="shrink-0 text-black/25" />}
    </Comp>
  );
}
