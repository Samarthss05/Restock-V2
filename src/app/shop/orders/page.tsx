"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Screen } from "@/components/chrome/Screen";
import { TabBar } from "@/components/chrome/TabBar";
import { Chip } from "@/components/ui/Chip";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { useAppStore } from "@/lib/store";
import { formatSGD } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const FILTERS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_transit", label: "In Transit" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function ShopOrdersListPage() {
  const router = useRouter();
  const { shopOrders } = useAppStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");

  const filtered = useMemo(
    () => (filter === "all" ? shopOrders : shopOrders.filter((o) => o.status === filter)),
    [shopOrders, filter]
  );

  return (
    <Screen bottomBar={<TabBar variant="shop" />}>
      <h1 className="mb-4 text-[20px] font-semibold text-app-fg">Orders</h1>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 no-scrollbar">
        {FILTERS.map((f) => (
          <Chip key={f.value} label={f.label} active={filter === f.value} onClick={() => setFilter(f.value)} />
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-2.5">
        {filtered.length === 0 && (
          <p className="mt-8 text-center text-[13.5px] text-black/45">No orders in this filter.</p>
        )}
        {filtered.map((order) => (
          <Card
            key={order.id}
            onClick={() => router.push(`/shop/orders/${order.id}`)}
            className="cursor-pointer active:opacity-70"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[13px] font-semibold text-app-fg">{order.ref}</span>
              <StatusPill status={order.status} />
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[12.5px] text-black/50">
                {order.supplierId} · {order.dateLabel}
              </span>
              <span className="text-[14px] font-semibold tabular-nums text-app-fg">
                {formatSGD(order.total)}
              </span>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
