"use client";

import { Suspense } from "react";
import { AssistantChat } from "@/components/ai/AssistantChat";
import { useAppStore } from "@/lib/store";

const SUGGESTED = [
  "Which bids should I focus on today?",
  "What's the demand forecast?",
  "Show my active orders",
];

function SupplierAssistantInner() {
  const { supplierChat, sendSupplierMessage } = useAppStore();
  return (
    <AssistantChat messages={supplierChat} onSend={sendSupplierMessage} suggestedPrompts={SUGGESTED} />
  );
}

export default function SupplierAssistantPage() {
  return (
    <Suspense>
      <SupplierAssistantInner />
    </Suspense>
  );
}
