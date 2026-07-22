"use client";

import { useRouter } from "next/navigation";
import { Sprout, FileText, ReceiptText, Package, AlertTriangle, CheckCircle2, Truck, MessageSquareText } from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TabBar } from "@/components/chrome/TabBar";
import { GradientAICard } from "@/components/ui/GradientAICard";
import { StatTile } from "@/components/ui/StatTile";
import { ListRow } from "@/components/ui/ListRow";
import { StatusPill } from "@/components/ui/StatusPill";
import { useAppStore } from "@/lib/store";
import { SHOP_PROFILE } from "@/lib/data";
import { formatCountdown } from "@/lib/format";

export default function ShopHomePage() {
  const router = useRouter();
  const { rfqs } = useAppStore();

  const needsAction = rfqs.filter((r) => r.status !== "closed");

  return (
    <Screen bottomBar={<TabBar variant="shop" />}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage-dark">
            <Sprout size={16} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-app-fg">ReStock</span>
        </div>
        <button
          onClick={() => router.push("/shop/account")}
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#1f2a24] text-white active:opacity-70"
        >
          <span className="text-[13px] font-semibold">TF</span>
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-app-bg" />
        </button>
      </div>

      <GradientAICard
        greetingPrefix="Good afternoon,"
        name={SHOP_PROFILE.name}
        subtext="You usually restock cage-free eggs every 6 days — it's been 5. Want a head start?"
        prompt="Reorder my usual vegetables"
        onAsk={() => router.push("/shop/new")}
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatTile icon={FileText} label="Open requests" value={4} tint="sage" />
        <StatTile icon={ReceiptText} label="Bids for you" value={1} tint="gold" />
        <StatTile icon={Package} label="Active orders" value={6} tint="sage" />
        <StatTile icon={AlertTriangle} label="Needs attention" value={1} tint="destructive" />
      </div>

      <div className="mt-6">
        <h2 className="mb-1 text-[15px] font-semibold text-app-fg">Needs your action</h2>
        <div className="divide-y divide-black/[0.05]">
          {needsAction.map((rfq) => {
            const isDraft = rfq.status === "draft";
            const subtitle = isDraft
              ? "Draft not yet submitted"
              : rfq.status === "open"
                ? `Needed by ${rfq.neededBy}`
                : `Quotes due in ${formatCountdown(rfq.deadlineMinutesFromCreation)} · ${rfq.items.length} items`;
            return (
              <ListRow
                key={rfq.id}
                icon={isDraft ? FileText : ReceiptText}
                iconTint={isDraft ? "slate" : "sage"}
                title={rfq.title}
                subtitle={subtitle}
                trailing={<StatusPill status={rfq.status} />}
                onClick={() => router.push(isDraft ? `/shop/new?draft=${rfq.id}` : `/shop/bidding/${rfq.id}`)}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-1 text-[15px] font-semibold text-app-fg">Recent activity</h2>
        <div className="divide-y divide-black/[0.05]">
          <ListRow
            icon={CheckCircle2}
            iconTint="sage"
            title="Order #RS-1042 delivered"
            subtitle="Supplier #482 · 18m ago"
          />
          <ListRow
            icon={MessageSquareText}
            iconTint="gold"
            title="3 bids received"
            subtitle="Vegetables & dry goods · 1h ago"
          />
          <ListRow icon={Truck} iconTint="sage" title="Order #RS-1039 in transit" subtitle="3h ago" />
        </div>
      </div>
    </Screen>
  );
}
