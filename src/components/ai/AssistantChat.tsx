"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUp, Sparkles } from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TopNavBar } from "@/components/chrome/TopNavBar";
import type { ChatMessage } from "@/lib/types";

export function AssistantChat({
  messages,
  onSend,
  suggestedPrompts,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  suggestedPrompts: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const autoSent = useRef(false);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && messages.length === 0 && !autoSent.current) {
      autoSent.current = true;
      onSend(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput("");
  }

  return (
    <Screen
      topBar={<TopNavBar title="Ask ReStock AI" backLabel="Back" />}
      bottomBar={
        <div className="sticky bottom-0 z-20 flex items-center gap-2 border-t border-black/[0.06] bg-app-bg/85 px-4 py-3 backdrop-blur-xl">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(input);
            }}
            placeholder="Ask ReStock AI…"
            className="flex-1 rounded-pill border border-black/10 bg-white px-4 py-2.5 text-[14px] shadow-sm outline-none focus:border-sage focus:ring-4 focus:ring-sage/10"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            aria-label="Send"
            className="press grad-sage-glossy flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-[var(--shadow-button)] disabled:opacity-40"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      }
    >
      {messages.length === 0 ? (
        <div className="flex flex-col items-center pt-10 text-center">
          <div className="ai-gradient-icon flex h-12 w-12 items-center justify-center rounded-2xl">
            <Sparkles size={20} className="text-white" />
          </div>
          <p className="mt-3 text-[14px] leading-relaxed text-black/50">
            Ask about an order, your usual restock, or open bids.
          </p>
          <div className="mt-5 flex flex-col gap-2 self-stretch">
            {suggestedPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="press rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-[13.5px] font-medium text-app-fg shadow-sm"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div className="grad-sage-glossy max-w-[80%] rounded-2xl rounded-br-md px-4 py-2.5 text-[13.5px] text-white shadow-[var(--shadow-button)]">
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex items-start gap-2">
                <div className="ai-gradient-icon flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                  <Sparkles size={12} className="text-white" />
                </div>
                <div className="max-w-[80%] flex-1">
                  <div className="card-shadow rounded-2xl rounded-tl-md border border-black/[0.04] bg-white px-4 py-2.5 text-[13.5px] leading-relaxed text-app-fg">
                    {m.text}
                  </div>
                  {m.quickActions && m.quickActions.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.quickActions.map((qa) => (
                        <button
                          key={qa.href + qa.label}
                          onClick={() => router.push(qa.href)}
                          className="press rounded-pill border border-sage-dark/30 bg-sage-muted px-3 py-1.5 text-[12px] font-semibold text-sage-dark"
                        >
                          {qa.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
          <div ref={endRef} />
        </div>
      )}
    </Screen>
  );
}
