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
      className={`whitespace-nowrap rounded-pill border px-3.5 py-2 text-[13px] font-medium transition active:scale-95 ${
        active
          ? "border-sage-dark bg-sage-dark text-white"
          : "border-black/10 bg-white text-app-fg"
      }`}
    >
      {label}
    </button>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-pill bg-sage-muted px-2 py-0.5 text-[11px] font-medium text-sage-dark">
      {children}
    </span>
  );
}
