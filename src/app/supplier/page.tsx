"use client";

import { useRouter } from "next/navigation";
import { Sprout, FileText, Package, Wallet, Send, TrendingUp, Sparkles } from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TabBar } from "@/components/chrome/TabBar";
import { GradientAICard } from "@/components/ui/GradientAICard";
import { StatTile } from "@/components/ui/StatTile";
import { ListRow } from "@/components/ui/ListRow";
import { VaultCard } from "@/components/ui/VaultCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { useAppStore } from "@/lib/store";
import { SUPPLIER_INBOX_SEED, SUPPLIER_PROFILE, rankSupplierInbox } from "@/lib/data";
import { formatDueIn } from "@/lib/format";

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-6 w-10 items-center rounded-full p-0.5 transition ${on ? "bg-sage-dark" : "bg-black/15"}`}
    >
      <span
        className={`h-5 w-5 rounded-full bg-white shadow transition ${on ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  );
}

export default function SupplierHomePage() {
  const router = useRouter();
  const { autoBid, toggleAutoBid, supplierOrders } = useAppStore();
  const rankedRequests = rankSupplierInbox(SUPPLIER_INBOX_SEED);
  const activeOrders = supplierOrders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");

  return (
    <Screen bottomBar={<TabBar variant="supplier" />}>
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-sage-dark">
            <Sprout size={16} className="text-white" />
          </div>
          <span className="text-[15px] font-bold tracking-tight text-app-fg">ReStock</span>
        </div>
        <button
          onClick={() => router.push("/supplier/account")}
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#1f2a24] text-white active:opacity-70"
        >
          <span className="text-[13px] font-semibold">GH</span>
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-gold ring-2 ring-app-bg" />
        </button>
      </div>

      <GradientAICard
        greetingPrefix="Good afternoon,"
        name={SUPPLIER_PROFILE.shortName}
        subtext="Leafy greens demand near you may rise 18% this week — 3 shops in your coverage area are due for reorder."
        prompt="Which bids should I focus on today?"
        onAsk={() =>
          router.push("/supplier/assistant?q=" + encodeURIComponent("Which bids should I focus on today?"))
        }
      />

      <div className="mt-5 grid grid-cols-2 gap-3">
        <StatTile icon={FileText} label="New requests" value={2} tint="sage" />
        <StatTile icon={Package} label="Active orders" value={4} tint="sage" />
        <StatTile icon={Wallet} label="Settled this week" value="S$3.1k" tint="gold" />
        <StatTile icon={Send} label="Bids sent" value={9} tint="sage" />
      </div>

      <div className="mt-5">
        <VaultCard title="Auto-bid with AI">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[13px] text-white/70">Status</div>
              <div className="text-[15px] font-semibold text-white">
                {autoBid.active ? "Active" : "Off"}
              </div>
            </div>
            <Toggle on={autoBid.active} onClick={toggleAutoBid} />
          </div>
          <div className="mb-3 flex items-center justify-between text-[13px]">
            <span className="text-white/70">Price floor</span>
            <span className="font-medium text-white">{autoBid.priceFloorLabel}</span>
          </div>
          <p className="text-[11.5px] leading-relaxed text-white/60">
            AI submits competitive bids automatically within your rules, so you never miss a
            deadline while you&apos;re busy on the floor.
          </p>
        </VaultCard>
      </div>

      <div className="mt-6">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="text-[15px] font-semibold text-app-fg">New requests</h2>
          <TrendingUp size={15} className="text-black/30" />
        </div>
        <div className="flex flex-col gap-2">
          {rankedRequests.map((r) => (
            <button
              key={r.id}
              onClick={() => router.push(`/supplier/inbox/${r.id}`)}
              className={`press w-full rounded-2xl border p-3 text-left ${
                r.recommended
                  ? "glow-gold border-gold/25 bg-gradient-to-b from-gold/[0.06] to-transparent"
                  : "border-black/[0.06] bg-white shadow-sm"
              }`}
            >
              <ListRow
                icon={FileText}
                title={r.title}
                subtitle={`${r.shopRef} · ${formatDueIn(r.dueInMinutes)}`}
                trailing={
                  r.recommended && (
                    <span className="inline-flex items-center gap-1 rounded-pill bg-gold px-2.5 py-1 text-[10.5px] font-bold text-white">
                      <Sparkles size={10} />
                      AI pick
                    </span>
                  )
                }
              />
              {r.reason && (
                <p className="-mt-1 pl-[52px] text-[11.5px] leading-snug text-black/50">{r.reason}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-1 text-[15px] font-semibold text-app-fg">Active orders</h2>
        <div className="divide-y divide-black/[0.05]">
          {activeOrders.map((o) => (
            <ListRow
              key={o.id}
              icon={Package}
              title={o.ref}
              subtitle={o.shopRef}
              trailing={<StatusPill status={o.status} />}
              onClick={() => router.push(`/supplier/orders/${o.id}`)}
            />
          ))}
        </div>
      </div>
    </Screen>
  );
}
