"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, AlertTriangle, Repeat } from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TopNavBar } from "@/components/chrome/TopNavBar";
import { StickyFooter } from "@/components/chrome/StickyFooter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { VaultCard } from "@/components/ui/VaultCard";
import { Tag } from "@/components/ui/Chip";
import {
  INBOX_LINE_ITEMS,
  INBOX_META,
  SUBSTITUTES,
  SUPPLIER_CURRENT_BEST_BID,
  SUPPLIER_INBOX_SEED,
} from "@/lib/data";
import { moderateText } from "@/lib/moderation";
import { useAppStore } from "@/lib/store";
import { formatSGD, formatDueIn } from "@/lib/format";

type LineItem = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  aiSuggestedPrice: number;
  unavailable: boolean;
  substitutedFrom?: string;
};

export default function SubmitBidPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { submitSupplierBid } = useAppStore();

  const rfqMeta = SUPPLIER_INBOX_SEED.find((r) => r.id === id);
  const seedItems = INBOX_LINE_ITEMS[id] ?? [];
  const [lineItems, setLineItems] = useState<LineItem[]>(
    seedItems.map((it) => ({ ...it, unavailable: false }))
  );
  const [deliveryWhen, setDeliveryWhen] = useState("Tomorrow, 7:30 AM");
  const [note, setNote] = useState(
    id === "rfq-veg" ? "Call me at 8123 4567 for bulk discount" : ""
  );
  const [revisionsLeft, setRevisionsLeft] = useState(2);
  const [submitted, setSubmitted] = useState(false);

  const currentBest = SUPPLIER_CURRENT_BEST_BID[id];
  const meta = INBOX_META[id];
  const noteCheck = moderateText(note);

  const bidTotal = useMemo(
    () =>
      lineItems.reduce((sum, it) => (it.unavailable ? sum : sum + it.price * it.quantity), 0),
    [lineItems]
  );

  function updatePrice(itemId: string, price: number) {
    setLineItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, price } : it)));
  }

  function toggleUnavailable(itemId: string) {
    setLineItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, unavailable: !it.unavailable } : it))
    );
  }

  function acceptSubstitute(itemId: string) {
    setLineItems((prev) =>
      prev.map((it) => {
        if (it.id !== itemId) return it;
        const sub = SUBSTITUTES[it.name];
        if (!sub) return it;
        return { ...it, name: sub.name, unit: sub.unit, unavailable: false, substitutedFrom: it.name };
      })
    );
  }

  function applySuggestion() {
    setLineItems((prev) => prev.map((it) => ({ ...it, price: it.aiSuggestedPrice })));
  }

  const suggestedTotal = lineItems.reduce(
    (sum, it) => (it.unavailable ? sum : sum + it.aiSuggestedPrice * it.quantity),
    0
  );

  function handleSubmit() {
    if (noteCheck.flagged || bidTotal <= 0 || revisionsLeft <= 0) return;
    submitSupplierBid(id, Math.round(bidTotal * 100) / 100, note || undefined);
    setRevisionsLeft((r) => r - 1);
    setSubmitted(true);
    window.setTimeout(() => router.push("/supplier/inbox"), 900);
  }

  function handleSaveDraft() {
    router.push("/supplier/inbox");
  }

  if (!rfqMeta) {
    return (
      <Screen topBar={<TopNavBar title="Request" backLabel="Inbox" />}>
        <p className="mt-10 text-center text-[14px] text-black/50">Request not found.</p>
      </Screen>
    );
  }

  return (
    <Screen
      topBar={
        <TopNavBar
          title={rfqMeta.shopRef}
          backLabel="Inbox"
          onBack={() => router.push("/supplier/inbox")}
        />
      }
      bottomBar={
        <StickyFooter>
          <Button variant="secondary" onClick={handleSaveDraft}>
            Save draft
          </Button>
          <Button onClick={handleSubmit} disabled={noteCheck.flagged || bidTotal <= 0 || revisionsLeft <= 0}>
            {submitted ? "Bid submitted ✓" : "Submit bid"}
          </Button>
        </StickyFooter>
      }
    >
      <div className="text-[13px] text-black/50">
        {rfqMeta.itemCount} items · Deliver to {meta?.deliverToArea ?? "shop area"}
      </div>
      <div className="mt-1 inline-flex items-center rounded-pill bg-gold/15 px-2.5 py-1 text-[12.5px] font-semibold text-gold">
        {formatDueIn(rfqMeta.dueInMinutes)}
      </div>

      {currentBest && (
        <div className="mt-4">
          <VaultCard title="Current best bid (anonymous)">
            <div className="flex items-end justify-between">
              <div className="text-[24px] font-semibold tabular-nums text-white">
                {formatSGD(currentBest.total)}
              </div>
              <span className="rounded-pill bg-white/15 px-3 py-1.5 text-[12px] font-semibold text-white">
                You&apos;d rank #{currentBest.rank}
              </span>
            </div>
          </VaultCard>
        </div>
      )}

      <div className="ai-gradient-surface mt-4 rounded-hero p-4">
        <div className="relative z-10 mb-1.5 flex items-center gap-1.5">
          <Sparkles size={13} className="text-sage-200" />
          <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-sage-200">
            AI suggested pricing
          </span>
        </div>
        <p className="relative z-10 text-[13px] leading-relaxed text-white/80">
          Based on market rates and your 92% acceptance history, pricing ~5% below your usual
          would likely move you into 1st place without hurting margin.
        </p>
        <button
          onClick={applySuggestion}
          className="press relative z-10 mt-3 flex w-full items-center justify-center gap-2 rounded-pill bg-white text-sage-deep py-3 text-[14px] font-bold shadow-[0_10px_20px_-8px_rgba(0,0,0,0.4)]"
        >
          Apply suggestion — {formatSGD(suggestedTotal)}
        </button>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-[13px] font-semibold text-app-fg">Line items</div>
        <div className="flex flex-col gap-2">
          {lineItems.map((it) => (
            <Card key={it.id} className={it.unavailable ? "opacity-60" : undefined}>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-medium text-app-fg">{it.name}</div>
                  <div className="text-[12px] text-black/45">
                    {it.quantity} {it.unit} · AI suggests {formatSGD(it.aiSuggestedPrice)}
                  </div>
                  {it.substitutedFrom && (
                    <div className="mt-1 inline-flex items-center gap-1 rounded-pill bg-gold/15 px-2 py-0.5 text-[10.5px] font-semibold text-[#24406B]">
                      <Repeat size={10} />
                      Substituted from {it.substitutedFrom}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[13px] text-black/40">S$</span>
                  <input
                    type="number"
                    step="0.01"
                    disabled={it.unavailable}
                    value={it.price}
                    onChange={(e) => updatePrice(it.id, parseFloat(e.target.value) || 0)}
                    className="w-20 rounded-xl border border-black/10 bg-white shadow-sm px-2 py-1.5 text-right text-[14px] tabular-nums outline-none focus:border-sage disabled:bg-black/[0.03]"
                  />
                </div>
              </div>
              <label className="mt-2 flex items-center gap-2 text-[12px] text-black/50">
                <input
                  type="checkbox"
                  checked={it.unavailable}
                  onChange={() => toggleUnavailable(it.id)}
                  className="h-4 w-4 accent-destructive"
                />
                Mark unavailable (N/A)
              </label>

              {it.unavailable && SUBSTITUTES[it.name] && (
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-sage-muted p-2.5">
                  <Sparkles size={13} className="shrink-0 text-sage-dark" />
                  <div className="min-w-0 flex-1 text-[11.5px] leading-snug text-sage-dark">
                    <span className="font-semibold">AI substitute:</span> {SUBSTITUTES[it.name].name}{" "}
                    — {SUBSTITUTES[it.name].note}
                  </div>
                  <button
                    onClick={() => acceptSubstitute(it.id)}
                    className="press grad-sage shrink-0 rounded-pill px-2.5 py-1.5 text-[11px] font-bold text-white"
                  >
                    Swap
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-sage-deep px-4 py-3.5 shadow-[var(--shadow-vault)]">
          <span className="text-[13px] font-semibold text-white/70">Your bid total</span>
          <span className="text-[20px] font-bold tabular-nums tracking-tight text-white">
            {formatSGD(bidTotal)}
          </span>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <span className="text-[12.5px] font-medium text-black/50">Delivery date &amp; time</span>
        <input
          value={deliveryWhen}
          onChange={(e) => setDeliveryWhen(e.target.value)}
          className="rounded-2xl border border-black/10 bg-white shadow-sm px-4 py-3 text-[14.5px] outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
        />
      </div>

      <div className="mt-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-black/50">Notes for shop (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className={`w-full rounded-2xl border bg-white p-4 text-[14.5px] outline-none ${
              noteCheck.flagged ? "border-destructive" : "border-black/10 focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
            }`}
          />
        </label>
        {noteCheck.flagged && (
          <p className="mt-1.5 flex items-start gap-1.5 text-[12px] font-medium text-destructive">
            <AlertTriangle size={13} className="mt-0.5 shrink-0" />
            Contact details aren&apos;t allowed here. Remove them to submit your bid.
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Tag>{revisionsLeft} revisions left before the deadline.</Tag>
      </div>
    </Screen>
  );
}
