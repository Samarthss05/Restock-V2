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
    <div className="ai-gradient-surface relative overflow-hidden rounded-hero p-5">
      <div className="mb-2.5 flex items-center gap-1.5">
        <Sparkles size={13} className="text-sage-200" />
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-sage-200">
          ReStock AI
        </span>
      </div>
      <div className="text-[19px] font-bold leading-snug tracking-tight text-white">
        {greetingPrefix} <span className="text-white">{name}</span>
      </div>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-white/60">{subtext}</p>

      <button
        onClick={onAsk}
        className="press mt-5 flex w-full items-center gap-3 rounded-2xl bg-white/[0.08] p-3 text-left ring-1 ring-inset ring-white/10 backdrop-blur"
      >
        <div className="ai-icon-frost flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
          <Sparkles size={16} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[9.5px] font-bold uppercase tracking-[0.12em] text-white/45">
            Ask ReStock AI
          </div>
          <div className="truncate text-[13.5px] font-semibold text-white">{prompt}</div>
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/15">
          <ArrowRight size={14} className="text-white" />
        </span>
      </button>
    </div>
  );
}
