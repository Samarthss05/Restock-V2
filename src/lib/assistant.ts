import type { ChatQuickAction, Order, Rfq, SupplierRfqInboxEntry } from "./types";
import { rankSupplierInbox } from "./data";
import { formatSGD } from "./format";

export type AssistantReply = { text: string; quickActions?: ChatQuickAction[] };

function has(input: string, ...keywords: string[]) {
  return keywords.some((k) => input.includes(k));
}

export function generateShopReply(
  input: string,
  ctx: { orders: Order[]; rfqs: Rfq[] }
): AssistantReply {
  const q = input.toLowerCase();

  if (has(q, "reorder", "usual", "restock")) {
    return {
      text: "Your usual restock is 20kg Cavendish bananas, 15 carton cage-free eggs, and 10kg mixed leafy greens — the same mix you've ordered the last few weeks. Want me to start a request with these preloaded?",
      quickActions: [{ label: "Start RFQ with these items", href: "/shop/new" }],
    };
  }

  if (has(q, "dispute", "problem", "wrong", "missing", "damaged", "refund")) {
    const recent = ctx.orders.find((o) => o.status === "in_transit" || o.status === "confirmed");
    if (recent) {
      return {
        text: `Sorry to hear that. For ${recent.ref} I can walk you through a dispute — tell me what happened and I'll recommend a resolution before looping in a Ledger agent.`,
        quickActions: [{ label: `Open ${recent.ref}`, href: `/shop/orders/${recent.id}` }],
      };
    }
    return { text: "I don't see an active order to raise a dispute on right now." };
  }

  if (has(q, "where", "track", "eta", "arriv", "deliver")) {
    const transit = ctx.orders.find((o) => o.status === "in_transit");
    if (transit) {
      return {
        text: `${transit.ref} is on the way via ${transit.courier ?? "your courier"}${transit.etaLabel ? ` — predicted arrival ${transit.etaLabel}` : ""}. Funds stay in escrow until you confirm delivery.`,
        quickActions: [{ label: `Track ${transit.ref}`, href: `/shop/orders/${transit.id}` }],
      };
    }
    const confirmed = ctx.orders.find((o) => o.status === "confirmed");
    if (confirmed) {
      return {
        text: `${confirmed.ref} is confirmed and being prepared — no courier assigned yet. I'll show an ETA once it's picked up.`,
        quickActions: [{ label: `View ${confirmed.ref}`, href: `/shop/orders/${confirmed.id}` }],
      };
    }
    return { text: "You don't have an order in transit right now — check your Orders tab for past deliveries." };
  }

  if (has(q, "bid", "quote", "price")) {
    const open = ctx.rfqs.filter((r) => r.status === "open" || r.status === "awaiting_response");
    if (open.length > 0) {
      const names = open.map((r) => r.title).join(", ");
      return {
        text: `You have ${open.length} request${open.length > 1 ? "s" : ""} collecting bids right now: ${names}. Want to jump into the leading one?`,
        quickActions: open.map((r) => ({ label: `Review ${r.title}`, href: `/shop/bidding/${r.id}` })),
      };
    }
    return {
      text: "No requests are currently awaiting bids. Post a new RFQ and I'll notify you as suppliers respond.",
      quickActions: [{ label: "Create RFQ", href: "/shop/new" }],
    };
  }

  return {
    text: "I can help you reorder your usual items, track a delivery, review open bids, or start a dispute. Try asking \"where's my order\" or \"reorder my usual vegetables.\"",
  };
}

export function generateSupplierReply(
  input: string,
  ctx: { orders: Order[]; inbox: SupplierRfqInboxEntry[] }
): AssistantReply {
  const q = input.toLowerCase();

  if (has(q, "focus", "which bid", "prioritize", "should i")) {
    const ranked = rankSupplierInbox(ctx.inbox);
    const top = ranked[0];
    if (top) {
      return {
        text: `Focus on ${top.shopRef} — ${top.title}. ${top.reason ?? "Good fit based on your bidding history."} It's due in the window shown in your inbox, so quote it first.`,
        quickActions: [{ label: `Bid on ${top.shopRef}`, href: `/supplier/inbox/${top.id}` }],
      };
    }
    return { text: "No open requests need attention right now — check back after your next deadline window." };
  }

  if (has(q, "demand", "forecast", "trend")) {
    return {
      text: "Leafy greens demand near you may rise 18% this week — 3 shops in your coverage area are due for reorder based on their cadence. Consider pre-positioning stock before Thursday.",
      quickActions: [{ label: "View open requests", href: "/supplier/inbox" }],
    };
  }

  if (has(q, "order", "deliver", "status", "fulfil")) {
    const active = ctx.orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
    if (active.length > 0) {
      const total = active.reduce((sum, o) => sum + o.total, 0);
      return {
        text: `You have ${active.length} active order${active.length > 1 ? "s" : ""} worth ${formatSGD(total)} in flight. Update fulfilment status as you pack and ship so shops see accurate ETAs.`,
        quickActions: [{ label: "View active orders", href: "/supplier/orders" }],
      };
    }
    return { text: "No active orders right now — new confirmed bids will show up here." };
  }

  if (has(q, "auto-bid", "autobid", "auto bid")) {
    return {
      text: "Auto-bid submits competitive bids on your behalf within your price floor whenever you're busy on the floor. You can adjust the floor or turn it off anytime from Account.",
      quickActions: [{ label: "Manage auto-bid", href: "/supplier/account" }],
    };
  }

  return {
    text: "I can help you prioritize open requests, check demand trends, review active orders, or explain auto-bid. Try asking \"which bids should I focus on today?\"",
  };
}
