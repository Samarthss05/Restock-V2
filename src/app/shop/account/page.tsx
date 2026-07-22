"use client";

import { useRouter } from "next/navigation";
import {
  Building2,
  ReceiptText,
  CreditCard,
  Sparkles,
  RotateCcw,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TabBar } from "@/components/chrome/TabBar";
import { ListRow } from "@/components/ui/ListRow";
import { useAppStore } from "@/lib/store";
import { SHOP_PROFILE } from "@/lib/data";

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

export default function ShopAccountPage() {
  const router = useRouter();
  const { prefs, togglePref, logout } = useAppStore();

  return (
    <Screen bottomBar={<TabBar variant="shop" />}>
      <div className="flex items-center gap-3 rounded-card border border-black/[0.05] bg-white p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f2a24] text-[15px] font-semibold text-white">
          TF
        </div>
        <div>
          <div className="text-[15.5px] font-semibold text-app-fg">{SHOP_PROFILE.name}</div>
          <div className="text-[12.5px] text-black/50">shop account · Verified</div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-black/40">Business</h2>
        <div className="divide-y divide-black/[0.05]">
          <ListRow icon={Building2} title="Business profile" chevron onClick={() => {}} />
          <ListRow icon={ReceiptText} title="Invoices & GST" chevron onClick={() => {}} />
          <ListRow icon={CreditCard} title="Payment methods" chevron onClick={() => {}} />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-black/40">
          AI &amp; Automation
        </h2>
        <div className="divide-y divide-black/[0.05]">
          <ListRow
            icon={RotateCcw}
            iconTint="gold"
            title="Smart reorder alerts"
            subtitle="Nudge me before I run out"
            trailing={<Toggle on={prefs.smartReorderAlerts} onClick={() => togglePref("smartReorderAlerts")} />}
          />
          <ListRow
            icon={Sparkles}
            iconTint="gold"
            title="AI bid ranking explanations"
            subtitle="Show reasoning behind AI pick"
            trailing={
              <Toggle
                on={prefs.aiBidRankingExplanations}
                onClick={() => togglePref("aiBidRankingExplanations")}
              />
            }
          />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="mb-1 text-[12.5px] font-semibold uppercase tracking-wide text-black/40">Support</h2>
        <div className="divide-y divide-black/[0.05]">
          <ListRow icon={HelpCircle} title="Help centre" chevron onClick={() => {}} />
          <ListRow
            icon={LogOut}
            iconTint="destructive"
            title="Log out"
            onClick={() => {
              logout();
              router.push("/login");
            }}
          />
        </div>
      </div>
    </Screen>
  );
}
