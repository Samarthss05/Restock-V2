"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function RootPage() {
  const router = useRouter();
  const { role, hydrated } = useAppStore();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(role === "shop" ? "/shop" : role === "supplier" ? "/supplier" : "/login");
  }, [hydrated, role, router]);

  return null;
}
