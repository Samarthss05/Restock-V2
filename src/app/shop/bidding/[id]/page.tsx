"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, Truck, Zap, Tag as TagIcon, Repeat } from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TopNavBar } from "@/components/chrome/TopNavBar";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { useAppStore } from "@/lib/store";
import { AI_PICK_COPY } from "@/lib/data";
import { formatSGD, formatCountdown } from "@/lib/format";

const TOTAL_WINDOW_MINUTES = 240;

export default function LiveBiddingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { rfqs, bidsByRfq, acceptBid, rejectAllBids } = useAppStore();
  const rfq = rfqs.find((r) => r.id === id);
  const bids = bidsByRfq[id] ?? [];

  const [remaining, setRemaining] = useState(rfq?.deadlineMinutesFromCreation ?? 0);
  const [rejecting, setRejecting] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!rfq) return;
    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(0, prev - 1 / 60));
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rfq?.id]);

  if (!rfq) {
    return (
      <Screen topBar={<TopNavBar title="Live Bidding" />}>
        <p className="mt-10 text-center text-[14px] text-black/50">Request not found.</p>
      </Screen>
    );
  }

  const progressPct = Math.min(100, Math.max(4, 100 - (remaining / TOTAL_WINDOW_MINUTES) * 100));
  const aiPick = AI_PICK_COPY[rfq.id];
  const liveLine =
    bids.length >= 2
      ? `Live — ${bids[1].supplierLabel} improved their bid 2 minutes ago`
      : "Live — waiting for suppliers to submit bids";

  function handleAccept(bidId: string) {
    const orderId = acceptBid(rfq!.id, bidId);
    if (orderId) router.push(`/shop/orders/${orderId}`);
  }

  function handleSubmitFeedback() {
    rejectAllBids(rfq!.id);
    router.push("/shop");
  }

  return (
    <Screen topBar={<TopNavBar title="Live Bidding" backLabel="Back" />}>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[13px] font-semibold text-app-fg">{rfq.ref}</div>
          <div className="text-[12.5px] text-black/50">
            {rfq.items.length} items · needed by {rfq.neededBy}
          </div>
        </div>
        <span className="rounded-pill bg-gold/15 px-3 py-1.5 text-[12.5px] font-semibold text-gold tabular-nums">
          {formatCountdown(Math.ceil(remaining))}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-black/[0.06]">
        <div
          className="progress-grad h-full rounded-full transition-all duration-1000"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-sage-dark">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-sage-dark" />
        </span>
        {liveLine}
      </div>

      {aiPick && (
        <div className="ai-gradient-surface mt-4 rounded-hero p-4">
          <div className="relative z-10 mb-1.5 flex items-center gap-1.5">
            <Sparkles size={13} className="text-sage-200" />
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-sage-200">
              AI pick
            </span>
          </div>
          <p className="relative z-10 text-[13.5px] leading-relaxed text-white/80">{aiPick}</p>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-2xl bg-black/[0.03] p-3">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-sage-dark" />
        <p className="text-[12px] leading-relaxed text-black/55">
          Bids are anonymous on both sides — accepting one reveals only what&apos;s needed for
          delivery, never a business name.
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {bids.length === 0 && (
          <Card className="text-center text-[13.5px] text-black/50">
            No bids yet — suppliers are reviewing your request.
          </Card>
        )}
        {bids.map((bid, i) => (
          <Card
            key={bid.id}
            className={
              bid.isLeading
                ? "glow-gold border-gold/25 bg-gradient-to-b from-gold/[0.06] to-transparent"
                : undefined
            }
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-bold ${
                    bid.isLeading ? "grad-gold text-white" : "bg-black/[0.06] text-app-fg"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <div className="text-[14.5px] font-bold text-app-fg">{bid.supplierLabel}</div>
                  <StarRating rating={bid.rating} reviewCount={bid.reviewCount} />
                </div>
              </div>
              {bid.isLeading && (
                <span className="grad-gold rounded-pill px-2.5 py-1 text-[11px] font-bold text-white shadow-[0_4px_10px_-4px_rgba(36,64,107,0.7)]">
                  Leading bid
                </span>
              )}
            </div>

            <div className="mt-3.5 flex items-end justify-between">
              <div className="text-[26px] font-bold tabular-nums tracking-tight text-app-fg">
                {formatSGD(bid.total)}
              </div>
              <div className="text-right text-[12px] font-medium text-black/50">
                <div className="flex items-center justify-end gap-1">
                  <Zap size={12} /> {bid.fillRate}% fill
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Truck size={12} /> {bid.deliveryPromise}
                </div>
              </div>
            </div>

            {bid.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {bid.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-pill bg-sage-muted px-2 py-0.5 text-[11px] font-semibold text-sage-dark"
                  >
                    <TagIcon size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {bid.substitution ? (
              <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-gold/10 px-2.5 py-2 text-[11.5px] font-medium text-[#24406B]">
                <Repeat size={12} className="shrink-0" />
                AI-matched substitute: {bid.substitution.from} → {bid.substitution.to}
              </div>
            ) : (
              bid.note && <p className="mt-2.5 text-[12px] italic text-black/50">&ldquo;{bid.note}&rdquo;</p>
            )}

            <Button className="mt-4" onClick={() => handleAccept(bid.id)}>
              Accept this bid
            </Button>
          </Card>
        ))}
      </div>

      <div className="mt-5 text-center">
        {!rejecting ? (
          <button
            onClick={() => setRejecting(true)}
            className="text-[13px] font-medium text-destructive active:opacity-60"
          >
            Reject all bids
          </button>
        ) : (
          <Card className="text-left">
            <div className="mb-2 text-[13.5px] font-semibold text-app-fg">
              What wasn&apos;t a good fit?
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              placeholder="Optional feedback for better matching next time…"
              className="w-full rounded-2xl border border-black/10 bg-white shadow-sm p-3 text-[13.5px] outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
            />
            <div className="mt-2 flex gap-2">
              <Button variant="secondary" onClick={() => setRejecting(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleSubmitFeedback}>
                Submit &amp; reject all
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Screen>
  );
}
