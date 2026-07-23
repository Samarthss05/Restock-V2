"use client";

import { Suspense } from "react";
import { AssistantChat } from "@/components/ai/AssistantChat";
import { useAppStore } from "@/lib/store";

const SUGGESTED = [
  "Reorder my usual vegetables",
  "Where's my order?",
  "Which requests have bids?",
];

function ShopAssistantInner() {
  const { shopChat, sendShopMessage } = useAppStore();
  return <AssistantChat messages={shopChat} onSend={sendShopMessage} suggestedPrompts={SUGGESTED} />;
}

export default function ShopAssistantPage() {
  return (
    <Suspense>
      <ShopAssistantInner />
    </Suspense>
  );
}
