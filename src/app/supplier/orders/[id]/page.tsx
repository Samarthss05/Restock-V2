"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TopNavBar } from "@/components/chrome/TopNavBar";
import { StickyFooter } from "@/components/chrome/StickyFooter";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FULFILLMENT_STEPS } from "@/components/supplier/FulfillmentBar";
import { useAppStore } from "@/lib/store";
import { formatSGD } from "@/lib/format";

export default function SupplierOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { supplierOrders, setSupplierOrderStep } = useAppStore();
  const order = supplierOrders.find((o) => o.id === id);
  const [pendingStep, setPendingStep] = useState<0 | 1 | 2 | 3 | null>(null);
  const [saved, setSaved] = useState(false);

  if (!order) {
    return (
      <Screen topBar={<TopNavBar title="Order" backLabel="Orders" />}>
        <p className="mt-10 text-center text-[14px] text-black/50">Order not found.</p>
      </Screen>
    );
  }

  const activeStep = pendingStep ?? order.fulfillmentStep;
  const dirty = pendingStep !== null && pendingStep !== order.fulfillmentStep;

  function handleSave() {
    if (pendingStep !== null) {
      setSupplierOrderStep(order!.id, pendingStep);
    }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  return (
    <Screen
      topBar={
        <TopNavBar
          title={order.ref}
          backLabel="Orders"
          onBack={() => router.push("/supplier/orders")}
        />
      }
      bottomBar={
        <StickyFooter>
          <Button onClick={handleSave} disabled={!dirty}>
            {saved ? "Saved ✓" : "Save status"}
          </Button>
        </StickyFooter>
      }
    >
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-semibold text-app-fg">{order.shopRef}</span>
        <span className="text-[16px] font-semibold tabular-nums text-app-fg">
          {formatSGD(order.total)}
        </span>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-[13px] font-semibold text-app-fg">Update fulfilment</div>
        <div className="flex flex-col gap-2">
          {FULFILLMENT_STEPS.map((label, i) => {
            const isCurrent = i === activeStep;
            const isDone = i < activeStep;
            return (
              <button
                key={label}
                onClick={() => setPendingStep(i as 0 | 1 | 2 | 3)}
                className={`flex items-center justify-between rounded-2xl border p-3.5 text-left active:opacity-70 ${
                  isCurrent
                    ? "border-sage-dark bg-sage-muted"
                    : "border-black/[0.06] bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full ${
                      isDone || isCurrent ? "grad-sage text-white" : "bg-black/[0.08] text-black/30"
                    }`}
                  >
                    {isDone ? <Check size={14} /> : <span className="text-[12px] font-semibold">{i + 1}</span>}
                  </div>
                  <span className="text-[14.5px] font-medium text-app-fg">{label}</span>
                </div>
                {isCurrent && (
                  <span className="grad-sage rounded-pill px-2.5 py-1 text-[11px] font-semibold text-white">
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-2 text-[13px] font-semibold text-app-fg">Order items</div>
        <Card className="divide-y divide-black/[0.05] p-0">
          {order.items.map((it) => (
            <div key={it.id} className="flex items-center justify-between px-4 py-2.5 text-[13.5px]">
              <span className="text-app-fg">
                {it.name} <span className="text-black/40">· {it.quantity}{it.unit}</span>
              </span>
              <span className="tabular-nums text-app-fg">{formatSGD(it.price)}</span>
            </div>
          ))}
        </Card>
      </div>
    </Screen>
  );
}
