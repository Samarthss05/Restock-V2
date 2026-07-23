import type { ReactNode } from "react";

export function Chip({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`press whitespace-nowrap rounded-pill border px-3.5 py-2 text-[13px] font-semibold transition-colors ${
        active
          ? "grad-sage border-sage-dark text-white shadow-[var(--shadow-button)]"
          : "border-black/[0.07] bg-white text-app-fg"
      }`}
    >
      {label}
    </button>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-pill bg-sage-muted px-2 py-0.5 text-[11px] font-semibold text-sage-dark">
      {children}
    </span>
  );
}
