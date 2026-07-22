"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, Truck, Zap, Tag as TagIcon } from "lucide-react";
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
          className="h-full rounded-full bg-gold transition-all duration-1000"
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
        <div className="ai-gradient-surface mt-4 rounded-card border border-black/[0.04] p-4">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Sparkles size={13} className="text-gold" />
            <span className="ai-gradient-text text-[11px] font-bold uppercase tracking-wide">AI pick</span>
          </div>
          <p className="text-[13.5px] leading-relaxed text-app-fg">{aiPick}</p>
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
            className={bid.isLeading ? "border-gold/40 bg-gold/[0.04]" : undefined}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/[0.06] text-[12px] font-bold text-app-fg">
                  {i + 1}
                </span>
                <div>
                  <div className="text-[14.5px] font-semibold text-app-fg">{bid.supplierLabel}</div>
                  <StarRating rating={bid.rating} reviewCount={bid.reviewCount} />
                </div>
              </div>
              {bid.isLeading && (
                <span className="rounded-pill bg-gold/15 px-2.5 py-1 text-[11px] font-semibold text-gold">
                  Leading bid
                </span>
              )}
            </div>

            <div className="mt-3 flex items-end justify-between">
              <div className="text-[22px] font-semibold tabular-nums text-app-fg">
                {formatSGD(bid.total)}
              </div>
              <div className="text-right text-[12px] text-black/50">
                <div className="flex items-center justify-end gap-1">
                  <Zap size={12} /> {bid.fillRate}% fill
                </div>
                <div className="flex items-center justify-end gap-1">
                  <Truck size={12} /> {bid.deliveryPromise}
                </div>
              </div>
            </div>

            {bid.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {bid.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 rounded-pill bg-sage-muted px-2 py-0.5 text-[11px] font-medium text-sage-dark"
                  >
                    <TagIcon size={10} /> {tag}
                  </span>
                ))}
              </div>
            )}

            {bid.note && <p className="mt-2 text-[12px] italic text-black/50">&ldquo;{bid.note}&rdquo;</p>}

            <Button className="mt-3" onClick={() => handleAccept(bid.id)}>
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
              className="w-full rounded-2xl border border-black/10 bg-white p-3 text-[13.5px] outline-none focus:border-sage"
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
