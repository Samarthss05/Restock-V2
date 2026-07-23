"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sprout, Check } from "lucide-react";
import { StatusBar } from "@/components/chrome/StatusBar";
import { HomeIndicator } from "@/components/chrome/HomeIndicator";
import { Button } from "@/components/ui/Button";
import { useAppStore } from "@/lib/store";
import { SHOP_PROFILE, SUPPLIER_PROFILE } from "@/lib/data";

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useAppStore();
  const [email, setEmail] = useState(SHOP_PROFILE.email);
  const [password, setPassword] = useState("••••••••");
  const [loading, setLoading] = useState(false);

  function handleLogin() {
    setLoading(true);
    const isSupplier = /goldenharvest|supplier/i.test(email);
    setRole(isSupplier ? "supplier" : "shop");
    window.setTimeout(() => {
      router.push(isSupplier ? "/supplier" : "/shop");
    }, 350);
  }

  return (
    <div className="vault-card relative flex h-full flex-col text-white">
      <StatusBar light />

      <div className="relative z-10 flex flex-col items-center px-8 pt-6">
        <div className="ai-gradient-icon flex h-14 w-14 items-center justify-center rounded-2xl">
          <Sprout size={26} className="text-white" />
        </div>
        <div className="mt-3 text-[22px] font-bold tracking-tight">ReStock</div>
        <div className="text-[11px] font-semibold tracking-[0.2em] text-gold-bright">BY LEDGER</div>

        <h1 className="mt-8 text-center text-[27px] font-bold leading-tight tracking-tight">
          Procurement, handled calmly.
        </h1>
        <p className="mt-3 max-w-[280px] text-center text-[14px] leading-relaxed text-white/55">
          Log in once — we&apos;ll open the right workspace for your account.
        </p>
      </div>

      <div className="relative z-10 mt-auto flex-1 rounded-t-[2rem] bg-app-bg px-5 pb-4 pt-6 text-app-fg shadow-[0_-20px_50px_-10px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-black/50">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="rounded-2xl border border-black/10 bg-white shadow-sm px-4 py-3 text-[15px] outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-medium text-black/50">Password</span>
              <button className="text-[12.5px] font-medium text-sage-dark">Forgot?</button>
            </div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="rounded-2xl border border-black/10 bg-white shadow-sm px-4 py-3 text-[15px] outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
            />
          </label>

          <Button className="mt-2" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in…" : "Log in"}
          </Button>

          <div className="mt-1 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            {["Escrow-protected", "Verified businesses only", "Dispute support"].map((t) => (
              <span key={t} className="flex items-center gap-1 text-[11.5px] text-black/55">
                <Check size={12} className="text-sage-dark" />
                {t}
              </span>
            ))}
          </div>

          <p className="mt-3 text-center text-[12px] text-black/40">
            New here? Ask your Ledger contact for an invite.
          </p>
          <p className="text-center text-[11px] text-black/30">
            Business accounts are verified against UEN &amp; ACRA before activation.
          </p>
          <p className="text-center text-[10.5px] text-black/25">
            Tip: use {SUPPLIER_PROFILE.email} to preview the supplier workspace.
          </p>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}
