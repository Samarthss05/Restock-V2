"use client";

import { useRouter } from "next/navigation";
import { Screen } from "@/components/chrome/Screen";
import { TabBar } from "@/components/chrome/TabBar";
import { Card } from "@/components/ui/Card";
import { FulfillmentBar, FULFILLMENT_STEPS } from "@/components/supplier/FulfillmentBar";
import { useAppStore } from "@/lib/store";
import { formatSGD } from "@/lib/format";

export default function SupplierOrdersListPage() {
  const router = useRouter();
  const { supplierOrders } = useAppStore();

  return (
    <Screen bottomBar={<TabBar variant="supplier" />}>
      <h1 className="mb-4 text-[20px] font-semibold text-app-fg">Orders</h1>
      <div className="flex flex-col gap-2.5">
        {supplierOrders.map((order) => (
          <Card
            key={order.id}
            onClick={() => router.push(`/supplier/orders/${order.id}`)}
            className="cursor-pointer active:opacity-70"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[13px] font-semibold text-app-fg">{order.ref}</span>
              <span className="text-[14px] font-semibold tabular-nums text-app-fg">
                {formatSGD(order.total)}
              </span>
            </div>
            <div className="mt-0.5 text-[12.5px] text-black/50">{order.shopRef}</div>
            <div className="mt-2.5">
              <FulfillmentBar step={order.fulfillmentStep} />
              <div className="mt-1 text-[11.5px] font-medium text-sage-dark">
                {FULFILLMENT_STEPS[order.fulfillmentStep]}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
