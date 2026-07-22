"use client";

import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TabBar } from "@/components/chrome/TabBar";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { SUPPLIER_INBOX_SEED } from "@/lib/data";
import { formatDueIn } from "@/lib/format";

export default function SupplierInboxPage() {
  const router = useRouter();

  return (
    <Screen bottomBar={<TabBar variant="supplier" />}>
      <h1 className="mb-3 text-[20px] font-semibold text-app-fg">Inbox</h1>

      <div className="mb-4 flex items-start gap-2 rounded-2xl bg-black/[0.03] p-3">
        <ShieldCheck size={15} className="mt-0.5 shrink-0 text-sage-dark" />
        <p className="text-[12px] leading-relaxed text-black/55">
          Shop names are masked until you&apos;re selected — full details unlock automatically
          once an order is placed.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {SUPPLIER_INBOX_SEED.map((rfq) => {
          const expired = rfq.status === "expired";
          return (
            <Card
              key={rfq.id}
              onClick={() => !expired && router.push(`/supplier/inbox/${rfq.id}`)}
              className={`${expired ? "opacity-50" : "cursor-pointer active:opacity-70"}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[14.5px] font-semibold text-app-fg">{rfq.shopRef}</span>
                <StatusPill status={rfq.status} />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[12.5px] text-black/50">
                  {rfq.title} · {rfq.itemCount} items
                </span>
                {!expired && (
                  <span className="text-[12px] font-medium text-gold">{formatDueIn(rfq.dueInMinutes)}</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}
