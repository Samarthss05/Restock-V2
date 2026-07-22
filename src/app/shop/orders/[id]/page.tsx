"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, MapPin, Truck as TruckIcon, AlertCircle, Lock } from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TopNavBar } from "@/components/chrome/TopNavBar";
import { Card } from "@/components/ui/Card";
import { VaultCard } from "@/components/ui/VaultCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { formatSGD } from "@/lib/format";
import type { Order } from "@/lib/types";

const STEPS = ["Placed", "Confirmed", "In Transit", "Delivered"];

function stepDoneIndex(order: Order) {
  if (order.status === "cancelled") return -1;
  return { placed: 0, confirmed: 1, in_transit: 2, delivered: 3 }[order.status];
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { shopOrders } = useAppStore();
  const order = shopOrders.find((o) => o.id === id);
  const [disputeSent, setDisputeSent] = useState(false);

  if (!order) {
    return (
      <Screen topBar={<TopNavBar title="Order" />}>
        <p className="mt-10 text-center text-[14px] text-black/50">Order not found.</p>
      </Screen>
    );
  }

  const doneIndex = stepDoneIndex(order);
  const itemsSubtotal = order.items.reduce((sum, it) => sum + it.price, 0);

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
                      done ? "bg-sage-dark text-white" : "bg-black/[0.08] text-black/30"
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

      <div className="mt-4">
        <Card>
          <div className="text-[14px] font-semibold text-app-fg">Problem with this delivery?</div>
          <p className="mt-1 text-[12.5px] leading-relaxed text-black/50">
            Ledger mediates rejected or partial deliveries with a replacement or refund.
          </p>
          {disputeSent ? (
            <p className="mt-3 text-[13px] font-medium text-sage-dark">
              Dispute sent — Ledger will follow up within 24 hours.
            </p>
          ) : (
            <Button variant="secondary" className="mt-3" onClick={() => setDisputeSent(true)}>
              Raise a dispute
            </Button>
          )}
        </Card>
      </div>
    </Screen>
  );
}
