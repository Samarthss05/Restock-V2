"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

export function TopNavBar({
  title,
  backLabel = "Back",
  onBack,
  rightAction,
  rightLabel,
}: {
  title: string;
  backLabel?: string;
  onBack?: () => void;
  rightAction?: () => void;
  rightLabel?: ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-black/[0.06] bg-[var(--color-app-bg)]/80 px-2 backdrop-blur-md">
      <button
        onClick={() => (onBack ? onBack() : router.back())}
        className="flex min-w-[64px] items-center gap-0.5 px-2 py-2 text-[15px] text-sage active:opacity-60"
      >
        <ChevronLeft size={20} strokeWidth={2.5} className="-ml-1" />
        {backLabel}
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 text-[15px] font-semibold text-app-fg">
        {title}
      </div>
      <button
        onClick={rightAction}
        disabled={!rightAction}
        className="min-w-[64px] px-2 py-2 text-right text-[15px] font-medium text-sage disabled:opacity-0"
      >
        {rightLabel}
      </button>
    </div>
  );
}
