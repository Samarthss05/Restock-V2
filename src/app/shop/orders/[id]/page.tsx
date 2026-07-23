"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  MapPin,
  Truck as TruckIcon,
  AlertCircle,
  Lock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TopNavBar } from "@/components/chrome/TopNavBar";
import { Card } from "@/components/ui/Card";
import { VaultCard } from "@/components/ui/VaultCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { formatSGD } from "@/lib/format";
import { DISPUTE_OUTCOME_LABELS, DISPUTE_REASON_LABELS } from "@/lib/data";
import type { DisputeReason, Order } from "@/lib/types";

const STEPS = ["Placed", "Confirmed", "In Transit", "Delivered"];

function stepDoneIndex(order: Order) {
  if (order.status === "cancelled") return -1;
  return { placed: 0, confirmed: 1, in_transit: 2, delivered: 3 }[order.status];
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { shopOrders, disputes, raiseDispute, acceptDisputeRecommendation, escalateDispute } =
    useAppStore();
  const order = shopOrders.find((o) => o.id === id);
  const [flowStage, setFlowStage] = useState<"closed" | "reason" | "analyzing">("closed");

  if (!order) {
    return (
      <Screen topBar={<TopNavBar title="Order" />}>
        <p className="mt-10 text-center text-[14px] text-black/50">Order not found.</p>
      </Screen>
    );
  }

  const doneIndex = stepDoneIndex(order);
  const itemsSubtotal = order.items.reduce((sum, it) => sum + it.price, 0);
  const dispute = disputes[order.id];

  function selectReason(reason: DisputeReason) {
    setFlowStage("analyzing");
    window.setTimeout(() => {
      raiseDispute(order!.id, reason);
    }, 1300);
  }

  const paymentStatus =
    order.status === "delivered"
      ? "Released to supplier"
      : order.status === "cancelled"
        ? "Refunded to your wallet"
        : "Held in escrow";

  return (
    <Screen
      topBar={
        <TopNavBar
          title={order.ref}
          backLabel="Orders"
          onBack={() => router.push("/shop/orders")}
        />
      }
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[15px] font-semibold text-app-fg">{order.supplierId}</div>
          <div className="text-[12px] text-black/45">Verified</div>
        </div>
        <StatusPill status={order.status} />
      </div>

      {order.status === "cancelled" ? (
        <Card className="mt-4 flex items-start gap-2 border-destructive/20 bg-destructive/[0.04]">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-destructive" />
          <p className="text-[13px] leading-relaxed text-destructive">
            This order was cancelled. Any funds held in escrow have been refunded.
          </p>
        </Card>
      ) : (
        <div className="mt-5 flex flex-col gap-4">
          {STEPS.map((label, i) => {
            const done = i <= doneIndex;
            const isCurrent = i === doneIndex;
            return (
              <div key={label} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full ${
                      done ? "grad-sage text-white" : "bg-black/[0.08] text-black/30"
                    }`}
                  >
                    {done ? <Check size={13} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`w-px flex-1 ${i < doneIndex ? "bg-sage-dark" : "bg-black/10"}`} />
                  )}
                </div>
                <div className="pb-4">
                  <div className={`text-[14px] font-medium ${done ? "text-app-fg" : "text-black/35"}`}>
                    {label}
                  </div>
                  {label === "Placed" && done && (
                    <div className="text-[12px] text-black/45">{order.placedAt}</div>
                  )}
                  {label === "Confirmed" && done && order.confirmedAt && (
                    <div className="text-[12px] text-black/45">{order.confirmedAt}</div>
                  )}
                  {label === "In Transit" && isCurrent && order.etaLabel && (
                    <div className="mt-1 inline-flex items-center gap-1 rounded-pill bg-gold/15 px-2.5 py-1 text-[11.5px] font-semibold text-gold">
                      AI-predicted arrival {order.etaLabel}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <VaultCard title="Payment Protection">
        <div className="mb-3 text-[26px] font-semibold tabular-nums text-white">
          {formatSGD(order.total)}
        </div>
        <div className="flex flex-col gap-1.5 text-[13px]">
          <div className="flex items-center justify-between text-white/80">
            <span>Status</span>
            <span className="font-medium text-white">{paymentStatus}</span>
          </div>
          <div className="flex items-center justify-between text-white/80">
            <span>Release rule</span>
            <span className="font-medium text-white">Paid to supplier after delivery</span>
          </div>
        </div>
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-white/10 p-2.5">
          <Lock size={13} className="mt-0.5 shrink-0 text-sage-200" />
          <p className="text-[11.5px] leading-relaxed text-white/70">
            Payment is held by Ledger until you confirm delivery — it&apos;s never sent directly
            to the supplier.
          </p>
        </div>
      </VaultCard>

      <div className="mt-4">
        <div className="mb-2 text-[13px] font-semibold text-app-fg">Items</div>
        <Card className="divide-y divide-black/[0.05] p-0">
          {order.items.map((it) => (
            <div key={it.id} className="flex items-center justify-between px-4 py-2.5 text-[13.5px]">
              <span className="text-app-fg">
                {it.name} <span className="text-black/40">· {it.quantity}{it.unit}</span>
              </span>
              <span className="tabular-nums text-app-fg">{formatSGD(it.price)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between px-4 py-2.5 text-[13.5px] font-semibold">
            <span className="text-app-fg">Total</span>
            <span className="tabular-nums text-app-fg">
              {formatSGD(itemsSubtotal + order.platformFee)}
            </span>
          </div>
        </Card>
      </div>

      {order.status !== "cancelled" && (
        <div className="mt-4">
          <Card>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-dark">
                <TruckIcon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14px] font-medium text-app-fg">
                  {order.status === "confirmed"
                    ? "Preparing your order"
                    : order.status === "delivered"
                      ? `Delivered via ${order.courier ?? "courier partner"}`
                      : `On the way via ${order.courier ?? "courier partner"}`}
                </div>
                <div className="text-[12.5px] text-black/50">
                  {order.status === "confirmed"
                    ? "Courier will be assigned once packed"
                    : `Driver: ${order.driver ?? "assigning…"}`}
                </div>
              </div>
            </div>
            {order.neighborhood && (
              <div className="mt-3 flex items-center gap-1.5 text-[12.5px] text-black/50">
                <MapPin size={13} />
                {order.neighborhood} (neighborhood-level for privacy)
              </div>
            )}
          </Card>
        </div>
      )}

      {order.status !== "cancelled" && !dispute && (
        <div className="mt-4">
          <Card>
            <div className="text-[14px] font-semibold text-app-fg">Problem with this delivery?</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-black/50">
              Ledger mediates rejected or partial deliveries with a replacement or refund.
            </p>

            {flowStage === "closed" && (
              <Button variant="secondary" className="mt-3" onClick={() => setFlowStage("reason")}>
                Raise a dispute
              </Button>
            )}

            {flowStage === "reason" && (
              <div className="mt-3">
                <p className="mb-2 text-[12.5px] font-medium text-black/50">What happened?</p>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(DISPUTE_REASON_LABELS) as DisputeReason[]).map((reason) => (
                    <button
                      key={reason}
                      onClick={() => selectReason(reason)}
                      className="press rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-left text-[12.5px] font-medium text-app-fg shadow-sm active:border-sage"
                    >
                      {DISPUTE_REASON_LABELS[reason]}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {flowStage === "analyzing" && (
              <div className="mt-3 flex items-center gap-2 rounded-2xl bg-black/[0.03] px-3.5 py-3 text-[12.5px] font-medium text-sage-dark">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-dark" />
                </span>
                AI is reviewing your delivery details…
              </div>
            )}
          </Card>
        </div>
      )}

      {dispute && dispute.status === "recommended" && (
        <div className="mt-4">
          <div className="ai-gradient-surface rounded-hero p-4">
            <div className="relative z-10 mb-1.5 flex items-center gap-1.5">
              <Sparkles size={13} className="text-sage-200" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-sage-200">
                AI recommendation
              </span>
            </div>
            <div className="relative z-10 mb-2 flex items-center gap-2">
              <span className="rounded-pill bg-white/15 px-2.5 py-1 text-[12px] font-bold text-white">
                {DISPUTE_OUTCOME_LABELS[dispute.outcome]}
                {dispute.amount > 0 ? ` · ${formatSGD(dispute.amount)}` : ""}
              </span>
            </div>
            <p className="relative z-10 text-[13px] leading-relaxed text-white/80">
              {dispute.reasoning}
            </p>
            <div className="relative z-10 mt-4 flex flex-col gap-2">
              <button
                onClick={() => acceptDisputeRecommendation(order!.id)}
                className="press flex w-full items-center justify-center gap-2 rounded-pill bg-white py-3 text-[14px] font-bold text-sage-deep shadow-[0_10px_20px_-8px_rgba(0,0,0,0.4)]"
              >
                Accept AI recommendation
              </button>
              <button
                onClick={() => escalateDispute(order!.id)}
                className="press flex w-full items-center justify-center gap-2 rounded-pill bg-white/10 py-3 text-[13.5px] font-semibold text-white ring-1 ring-inset ring-white/15"
              >
                Talk to a Ledger agent instead
              </button>
            </div>
          </div>
        </div>
      )}

      {dispute && dispute.status === "accepted" && (
        <div className="mt-4">
          <Card className="flex items-start gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-sage-dark" />
            <p className="text-[13px] leading-relaxed text-app-fg">
              Resolved — {DISPUTE_OUTCOME_LABELS[dispute.outcome].toLowerCase()}
              {dispute.amount > 0 ? ` of ${formatSGD(dispute.amount)}` : ""} confirmed. Ledger
              will process this automatically.
            </p>
          </Card>
        </div>
      )}

      {dispute && dispute.status === "escalated" && (
        <div className="mt-4">
          <Card className="flex items-start gap-2">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-sage-dark" />
            <p className="text-[13px] leading-relaxed text-app-fg">
              A Ledger agent will review this dispute directly and follow up within 24 hours.
            </p>
          </Card>
        </div>
      )}
    </Screen>
  );
}
