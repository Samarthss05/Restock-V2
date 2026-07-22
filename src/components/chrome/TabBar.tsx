"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, Plus, User, Inbox } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Tab = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const SHOP_TABS: Tab[] = [
  { href: "/shop", label: "Home", icon: Home },
  { href: "/shop/orders", label: "Orders", icon: Package },
  { href: "/shop/new", label: "New", icon: Plus },
  { href: "/shop/account", label: "Account", icon: User },
];

const SUPPLIER_TABS: Tab[] = [
  { href: "/supplier", label: "Home", icon: Home },
  { href: "/supplier/inbox", label: "Inbox", icon: Inbox },
  { href: "/supplier/orders", label: "Orders", icon: Package },
  { href: "/supplier/account", label: "Account", icon: User },
];

export function TabBar({ variant }: { variant: "shop" | "supplier" }) {
  const pathname = usePathname();
  const tabs = variant === "shop" ? SHOP_TABS : SUPPLIER_TABS;

  return (
    <div className="sticky bottom-0 z-20 flex items-stretch justify-around border-t border-black/[0.06] bg-white/85 pb-1 pt-2 backdrop-blur-md">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        const Icon = tab.icon;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-1 flex-col items-center gap-1 py-1 text-[10px] font-medium ${
              active ? "text-sage" : "text-black/35"
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
