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
    <div className="sticky top-0 z-20 flex h-14 items-center justify-between bg-app-bg/75 px-3 shadow-[0_1px_0_rgba(0,0,0,0.05)] backdrop-blur-xl">
      <button
        onClick={() => (onBack ? onBack() : router.back())}
        className="press flex min-w-[64px] items-center gap-1 py-2 text-[14px] font-semibold text-sage-dark"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/[0.05]">
          <ChevronLeft size={16} strokeWidth={2.8} />
        </span>
        {backLabel}
      </button>
      <div className="absolute left-1/2 -translate-x-1/2 text-[15px] font-bold tracking-tight text-app-fg">
        {title}
      </div>
      <button
        onClick={rightAction}
        disabled={!rightAction}
        className="press min-w-[64px] px-2 py-2 text-right text-[14px] font-semibold text-sage-dark disabled:opacity-0"
      >
        {rightLabel}
      </button>
    </div>
  );
}
