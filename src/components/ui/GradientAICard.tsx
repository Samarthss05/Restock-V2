"use client";

import { Sparkles, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function GradientAICard({
  greetingPrefix,
  name,
  subtext,
  prompt,
  onAsk,
}: {
  greetingPrefix: string;
  name: string;
  subtext: ReactNode;
  prompt: string;
  onAsk: () => void;
}) {
  return (
    <div className="ai-gradient-surface relative overflow-hidden rounded-card border border-black/[0.04] p-4">
      <div className="mb-2 flex items-center gap-1.5">
        <Sparkles size={13} className="text-gold" />
        <span className="ai-gradient-text text-[11px] font-bold uppercase tracking-wide">
          ReStock AI
        </span>
      </div>
      <div className="text-[17px] font-semibold leading-snug text-app-fg">
        {greetingPrefix} <span className="ai-gradient-text">{name}</span>
      </div>
      <p className="mt-1.5 text-[13px] leading-relaxed text-black/60">{subtext}</p>

      <button
        onClick={onAsk}
        className="mt-4 flex w-full items-center gap-2.5 rounded-2xl border border-black/[0.06] bg-white/70 p-2.5 text-left backdrop-blur active:scale-[0.98]"
      >
        <div className="ai-gradient-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-xl">
          <Sparkles size={15} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-bold uppercase tracking-wide text-black/40">
            Ask ReStock AI
          </div>
          <div className="truncate text-[13px] font-medium text-app-fg">{prompt}</div>
        </div>
        <ArrowRight size={16} className="shrink-0 text-sage-dark" />
      </button>
    </div>
  );
}
