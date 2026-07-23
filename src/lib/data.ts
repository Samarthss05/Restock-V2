import type {
  Bid,
  Dispute,
  DisputeReason,
  Order,
  OrderItem,
  Product,
  Rfq,
  RfqItem,
  SupplierRfqInboxEntry,
  Unit,
} from "./types";
import { formatSGD } from "./format";

export const SHOP_PROFILE = {
  name: "Tanjong Fresh Mart",
  accountType: "shop account",
  verified: true,
  email: "hello@tanjongfresh.sg",
};

export const SUPPLIER_PROFILE = {
  name: "Golden Harvest Supplies",
  shortName: "Golden Harvest",
  accountType: "supplier account",
  verified: true,
  email: "hello@goldenharvest.sg",
};

export const CATALOG: Product[] = [
  { id: "p-bananas", name: "Cavendish bananas", unit: "kg", priceLow: 1.8, priceHigh: 2.2 },
  { id: "p-eggs", name: "Cage-free eggs", unit: "carton", priceLow: 7.2, priceHigh: 7.8 },
  { id: "p-milk", name: "Full cream milk 1L", unit: "carton", priceLow: 26.0, priceHigh: 29.0 },
  { id: "p-greens", name: "Mixed leafy greens", unit: "kg", priceLow: 5.8, priceHigh: 6.5 },
  { id: "p-rice", name: "Jasmine rice 5kg", unit: "bag", priceLow: 9.5, priceHigh: 10.8 },
  { id: "p-kopio", name: "Kopi-O sachets", unit: "pack", priceLow: 4.2, priceHigh: 4.9 },
  { id: "p-oil", name: "Cooking oil 5L", unit: "bottle", priceLow: 13.0, priceHigh: 15.5 },
  { id: "p-cartons", name: "Cardboard cartons", unit: "pcs", priceLow: 0.9, priceHigh: 1.3 },
];

export const SUGGESTED_PRODUCT_IDS = ["p-eggs", "p-bananas", "p-rice"];

export function findProduct(id: string): Product | undefined {
  return CATALOG.find((p) => p.id === id);
}

let idCounter = 1;
export function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export const VEG_RFQ_ITEMS: RfqItem[] = [
  { id: "ri-1", name: "Cavendish bananas", quantity: 20, unit: "kg" },
  { id: "ri-2", name: "Cage-free eggs", quantity: 15, unit: "carton" },
  { id: "ri-3", name: "Mixed leafy greens", quantity: 10, unit: "kg" },
  { id: "ri-4", name: "Jasmine rice 5kg", quantity: 4, unit: "bag" },
  { id: "ri-5", name: "Full cream milk 1L", quantity: 6, unit: "carton" },
  { id: "ri-6", name: "Cooking oil 5L", quantity: 3, unit: "bottle" },
  { id: "ri-7", name: "Kopi-O sachets", quantity: 6, unit: "pack" },
  { id: "ri-8", name: "Cardboard cartons", quantity: 30, unit: "pcs" },
];

export const INITIAL_RFQS: Rfq[] = [
  {
    id: "rfq-veg",
    ref: "RS-Q2214",
    title: "Vegetables & dry goods",
    deliveryAddress: "12 Tanjong Pagar Rd, #01-04",
    neededBy: "Tomorrow, 9:00 AM",
    neededByISO: "",
    items: VEG_RFQ_ITEMS,
    status: "awaiting_response",
    createdVia: "manual",
    deadlineMinutesFromCreation: 134,
    createdAt: Date.now() - 1000 * 60 * 30,
    bidsCount: 3,
    shopRef: "Shop #2847",
    shopName: SHOP_PROFILE.name,
  },
  {
    id: "rfq-cleaning",
    ref: "RS-Q2219",
    title: "Cleaning supplies",
    deliveryAddress: "12 Tanjong Pagar Rd, #01-04",
    neededBy: "Tomorrow, 9:00 AM",
    neededByISO: "",
    items: [
      { id: "ci-1", name: "Dish soap 1L", quantity: 12, unit: "bottle" },
      { id: "ci-2", name: "Trash bags (roll)", quantity: 10, unit: "pack" },
      { id: "ci-3", name: "Paper towels", quantity: 20, unit: "pack" },
    ],
    status: "open",
    createdVia: "manual",
    deadlineMinutesFromCreation: 60 * 20,
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
    bidsCount: 1,
    shopRef: "Shop #2847",
    shopName: SHOP_PROFILE.name,
  },
  {
    id: "rfq-packaging-draft",
    ref: "RS-Q2221",
    title: "Packaging cartons",
    deliveryAddress: "12 Tanjong Pagar Rd, #01-04",
    neededBy: "",
    neededByISO: "",
    items: [{ id: "pi-1", name: "Cardboard cartons", quantity: 50, unit: "pcs" }],
    status: "draft",
    createdVia: "manual",
    deadlineMinutesFromCreation: 0,
    createdAt: Date.now() - 1000 * 60 * 60 * 20,
    bidsCount: 0,
    shopRef: "Shop #2847",
    shopName: SHOP_PROFILE.name,
  },
];

export const BIDS_BY_RFQ: Record<string, Bid[]> = {
  "rfq-veg": [
    {
      id: "bid-a",
      rfqId: "rfq-veg",
      supplierLabel: "Supplier A",
      supplierId: "Supplier #482",
      total: 486.2,
      fillRate: 100,
      deliveryPromise: "Tomorrow, 7:30 AM",
      deliveryISO: "",
      tags: ["Full fill rate", "Fastest delivery"],
      note: "Can bundle with your standing weekly order.",
      rating: 4.8,
      reviewCount: 128,
      isLeading: true,
    },
    {
      id: "bid-b",
      rfqId: "rfq-veg",
      supplierLabel: "Supplier B",
      supplierId: "Supplier #963",
      total: 461.9,
      fillRate: 87,
      deliveryPromise: "Tomorrow, 8:45 AM",
      deliveryISO: "",
      tags: ["Lowest price"],
      note: "Eggs unavailable — substitute offered.",
      substitution: { from: "Cage-free eggs", to: "Barn-laid eggs" },
      rating: 4.6,
      reviewCount: 74,
    },
    {
      id: "bid-c",
      rfqId: "rfq-veg",
      supplierLabel: "Supplier C",
      supplierId: "Supplier #217",
      total: 502.0,
      fillRate: 100,
      deliveryPromise: "Tomorrow, 9:00 AM",
      deliveryISO: "",
      tags: ["Full fill rate"],
      rating: 4.9,
      reviewCount: 203,
    },
  ],
  "rfq-cleaning": [
    {
      id: "bid-d",
      rfqId: "rfq-cleaning",
      supplierLabel: "Supplier A",
      supplierId: "Supplier #650",
      total: 158.4,
      fillRate: 100,
      deliveryPromise: "Tomorrow, 8:00 AM",
      deliveryISO: "",
      tags: ["Full fill rate", "Fastest delivery"],
      rating: 4.7,
      reviewCount: 61,
      isLeading: true,
    },
  ],
};

export const AI_PICK_COPY: Record<string, string> = {
  "rfq-veg":
    "Supplier A — Best overall balance for this request — full fill rate, delivery well before your 9:00 AM deadline, and a 4.8★ reliability history. Supplier B is S$24 cheaper but only covers 87% of items.",
  "rfq-cleaning":
    "Supplier A — the only full-fill bid so far, arriving well ahead of your deadline with a strong 4.7★ history.",
};

function distributeAmount(subtotal: number, weights: number[]): number[] {
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => Math.round(((w / totalWeight) * subtotal) / 0.05) * 0.05);
  const diff = Math.round((subtotal - raw.reduce((a, b) => a + b, 0)) * 100) / 100;
  raw[raw.length - 1] = Math.round((raw[raw.length - 1] + diff) * 100) / 100;
  return raw;
}

function referenceUnitPrice(name: string): number {
  const product = CATALOG.find((p) => p.name === name);
  if (!product) return 5;
  return (product.priceLow + product.priceHigh) / 2;
}

export function buildOrderItemsFromRfqAndBid(
  items: RfqItem[],
  bidTotal: number,
  platformFeeRate = 0.045
): { orderItems: OrderItem[]; platformFee: number } {
  const platformFee = Math.round(bidTotal * platformFeeRate * 100) / 100;
  const subtotal = Math.round((bidTotal - platformFee) * 100) / 100;
  const weights = items.map((it) => it.quantity * referenceUnitPrice(it.name));
  const prices = distributeAmount(subtotal, weights);
  const orderItems: OrderItem[] = items.map((it, i) => ({
    id: it.id,
    name: it.name,
    quantity: it.quantity,
    unit: it.unit,
    price: prices[i],
  }));
  return { orderItems, platformFee };
}

export const SHOP_ORDERS_SEED: Order[] = [
  {
    id: "order-1042",
    ref: "RS-1042",
    supplierId: "Supplier #482",
    shopRef: "Shop #2847",
    status: "in_transit",
    total: 236.2,
    platformFee: 10.7,
    items: [
      { id: "oi-1", name: "Cavendish bananas", quantity: 20, unit: "kg", price: 48.0 },
      { id: "oi-2", name: "Cage-free eggs", quantity: 15, unit: "carton", price: 112.5 },
      { id: "oi-3", name: "Mixed leafy greens", quantity: 10, unit: "kg", price: 65.0 },
    ],
    placedAt: "Today, 6:12 AM",
    confirmedAt: "Today, 6:20 AM",
    etaLabel: "12:40 PM (±5 min)",
    courier: "Lalamove",
    driver: "S. Rahman",
    neighborhood: "Tanjong Pagar",
    dateLabel: "Today",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    fulfillmentStep: 2,
  },
  {
    id: "order-1039",
    ref: "RS-1039",
    supplierId: "Supplier #963",
    shopRef: "Shop #2847",
    status: "confirmed",
    total: 410.0,
    platformFee: 17.6,
    items: [
      { id: "oi-4", name: "Jasmine rice 5kg", quantity: 20, unit: "bag", price: 190.0 },
      { id: "oi-5", name: "Cooking oil 5L", quantity: 10, unit: "bottle", price: 140.0 },
      { id: "oi-6", name: "Kopi-O sachets", quantity: 15, unit: "pack", price: 62.4 },
    ],
    placedAt: "Today, 8:05 AM",
    confirmedAt: "Today, 8:10 AM",
    dateLabel: "Today",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    fulfillmentStep: 1,
  },
  {
    id: "order-1031",
    ref: "RS-1031",
    supplierId: "Supplier #217",
    shopRef: "Shop #2847",
    status: "delivered",
    total: 128.5,
    platformFee: 5.5,
    items: [
      { id: "oi-7", name: "Full cream milk 1L", quantity: 4, unit: "carton", price: 108.0 },
      { id: "oi-8", name: "Cardboard cartons", quantity: 14, unit: "pcs", price: 15.0 },
    ],
    placedAt: "Yesterday, 7:40 AM",
    confirmedAt: "Yesterday, 7:45 AM",
    dateLabel: "Yesterday",
    createdAt: Date.now() - 1000 * 60 * 60 * 28,
    fulfillmentStep: 3,
  },
  {
    id: "order-1019",
    ref: "RS-1019",
    supplierId: "Supplier #963",
    shopRef: "Shop #2847",
    status: "cancelled",
    total: 44.0,
    platformFee: 1.9,
    items: [{ id: "oi-9", name: "Kopi-O sachets", quantity: 10, unit: "pack", price: 42.1 }],
    placedAt: "1 week ago",
    dateLabel: "1 week ago",
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
    fulfillmentStep: 0,
  },
];

export const SUPPLIER_ORDERS_SEED: Order[] = [
  {
    id: "s-order-1042",
    ref: "RS-1042",
    supplierId: "Supplier #482",
    shopRef: "Shop #2847",
    status: "confirmed",
    total: 486.2,
    platformFee: 21.9,
    items: [
      { id: "soi-1", name: "Cavendish bananas", quantity: 20, unit: "kg", price: 48.0 },
      { id: "soi-2", name: "Cage-free eggs", quantity: 15, unit: "carton", price: 112.5 },
      { id: "soi-3", name: "Mixed leafy greens", quantity: 10, unit: "kg", price: 63.0 },
      { id: "soi-4", name: "Jasmine rice 5kg", quantity: 4, unit: "bag", price: 42.0 },
      { id: "soi-5", name: "Full cream milk 1L", quantity: 6, unit: "carton", price: 165.0 },
      { id: "soi-6", name: "Cooking oil 5L", quantity: 3, unit: "bottle", price: 43.0 },
      { id: "soi-7", name: "Kopi-O sachets", quantity: 6, unit: "pack", price: 24.0 },
      { id: "soi-8", name: "Cardboard cartons", quantity: 30, unit: "pcs", price: 6.9 },
    ],
    placedAt: "Today, 6:12 AM",
    confirmedAt: "Today, 6:20 AM",
    dateLabel: "Today",
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    fulfillmentStep: 1,
  },
  {
    id: "s-order-1038",
    ref: "RS-1038",
    supplierId: "Supplier #482",
    shopRef: "Shop #4410",
    status: "in_transit",
    total: 244.0,
    platformFee: 10.6,
    items: [
      { id: "soi-9", name: "Dish soap 1L", quantity: 12, unit: "bottle", price: 108.0 },
      { id: "soi-10", name: "Trash bags (roll)", quantity: 10, unit: "pack", price: 125.4 },
    ],
    placedAt: "Today, 5:00 AM",
    confirmedAt: "Today, 5:15 AM",
    etaLabel: "1:15 PM (±10 min)",
    courier: "Lalamove",
    driver: "K. Osman",
    neighborhood: "Jurong East",
    dateLabel: "Today",
    createdAt: Date.now() - 1000 * 60 * 60 * 6,
    fulfillmentStep: 2,
  },
  {
    id: "s-order-1030",
    ref: "RS-1030",
    supplierId: "Supplier #482",
    shopRef: "Shop #1190",
    status: "delivered",
    total: 128.9,
    platformFee: 5.6,
    items: [
      { id: "soi-11", name: "Jasmine rice 5kg", quantity: 8, unit: "bag", price: 80.0 },
      { id: "soi-12", name: "Kopi-O sachets", quantity: 9, unit: "pack", price: 43.3 },
    ],
    placedAt: "Yesterday, 6:30 AM",
    confirmedAt: "Yesterday, 6:40 AM",
    dateLabel: "Yesterday",
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
    fulfillmentStep: 3,
  },
];

export const SUPPLIER_INBOX_SEED: SupplierRfqInboxEntry[] = [
  {
    id: "rfq-veg",
    shopRef: "Shop #2847",
    title: "Vegetables & dry goods",
    itemCount: 8,
    status: "open",
    dueInMinutes: 100,
    createdAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "rfq-bakery",
    shopRef: "Shop #1190",
    title: "Bakery staples",
    itemCount: 4,
    status: "open",
    dueInMinutes: 300,
    createdAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: "rfq-cleaning-expired",
    shopRef: "Shop #4410",
    title: "Cleaning supplies",
    itemCount: 3,
    status: "expired",
    dueInMinutes: 0,
    createdAt: Date.now() - 1000 * 60 * 60 * 30,
  },
];

export const SUPPLIER_CURRENT_BEST_BID: Record<string, { total: number; rank: number }> = {
  "rfq-veg": { total: 461.9, rank: 2 },
};

const NAMED_UNIT_PRICES: Record<string, number> = {
  "ri-1": 2.4, // Cavendish bananas
  "ri-2": 7.5, // Cage-free eggs
  "ri-3": 6.2, // Mixed leafy greens
};
const NAMED_TOTAL = 48.0 + 112.5 + 62.0; // 222.50 — matches RS-1042 item pricing
const SUPPLIER_OWN_BID_TOTAL = 486.2; // ties this supplier to "Supplier A" from the shop's view
const fillerItems = VEG_RFQ_ITEMS.filter((it) => !NAMED_UNIT_PRICES[it.id]);
const fillerLineTotals = distributeAmount(
  SUPPLIER_OWN_BID_TOTAL - NAMED_TOTAL,
  fillerItems.map((it) => it.quantity * referenceUnitPrice(it.name))
);

export const BID_LINE_ITEMS_SEED = VEG_RFQ_ITEMS.map((item) => {
  let base: number;
  if (NAMED_UNIT_PRICES[item.id]) {
    base = NAMED_UNIT_PRICES[item.id];
  } else {
    const idx = fillerItems.findIndex((it) => it.id === item.id);
    base = Math.round((fillerLineTotals[idx] / item.quantity) * 100) / 100;
  }
  const suggestedOverrides: Record<string, number> = { "ri-1": 2.25, "ri-2": 7.1, "ri-3": 5.95 };
  const suggested = suggestedOverrides[item.id] ?? Math.round(base * 0.95 * 100) / 100;
  return {
    id: item.id,
    name: item.name,
    quantity: item.quantity,
    unit: item.unit,
    price: base,
    aiSuggestedPrice: suggested,
  };
});

const BAKERY_ITEMS = [
  { id: "bi-1", name: "All-purpose flour 5kg", quantity: 6, unit: "bag" as const },
  { id: "bi-2", name: "Butter blocks 500g", quantity: 10, unit: "pcs" as const },
  { id: "bi-3", name: "Caster sugar 2kg", quantity: 5, unit: "bag" as const },
  { id: "bi-4", name: "Yeast sachets", quantity: 8, unit: "pack" as const },
];

const CLEANING_ITEMS_FOR_BID = [
  { id: "ci-1", name: "Dish soap 1L", quantity: 12, unit: "bottle" as const },
  { id: "ci-2", name: "Trash bags (roll)", quantity: 10, unit: "pack" as const },
  { id: "ci-3", name: "Paper towels", quantity: 20, unit: "pack" as const },
];

export type BidLineItemSeed = {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  price: number;
  aiSuggestedPrice: number;
};

function buildLineItems(
  items: { id: string; name: string; quantity: number; unit: Unit }[],
  bases: number[]
): BidLineItemSeed[] {
  return items.map((item, i) => {
    const base = bases[i] ?? 5;
    return {
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: base,
      aiSuggestedPrice: Math.round(base * 0.95 * 100) / 100,
    };
  });
}

export const INBOX_LINE_ITEMS: Record<string, BidLineItemSeed[]> = {
  "rfq-veg": BID_LINE_ITEMS_SEED,
  "rfq-bakery": buildLineItems(BAKERY_ITEMS, [16.5, 5.4, 6.8, 3.9]),
  "rfq-cleaning-expired": buildLineItems(CLEANING_ITEMS_FOR_BID, [12.4, 11.2, 15.6]),
};

export const INBOX_META: Record<string, { deliverToArea: string }> = {
  "rfq-veg": { deliverToArea: "Tanjong Pagar" },
  "rfq-bakery": { deliverToArea: "Toa Payoh" },
  "rfq-cleaning-expired": { deliverToArea: "Jurong East" },
};

// ---------------------------------------------------------------------------
// AI feature support: substitution, dispute recommendations, photo scan,
// supplier win-likelihood ranking, and the conversational assistant.
// ---------------------------------------------------------------------------

export const SUBSTITUTES: Record<string, { name: string; unit: Unit; note: string }> = {
  "Cage-free eggs": {
    name: "Barn-laid eggs",
    unit: "carton",
    note: "Same pack size, typically 8% cheaper",
  },
  "Mixed leafy greens": {
    name: "Kai lan (Chinese kale)",
    unit: "kg",
    note: "Comparable leafy green, in stock now",
  },
  "Full cream milk 1L": {
    name: "UHT full cream milk 1L",
    unit: "carton",
    note: "Longer shelf life, same volume",
  },
  "Jasmine rice 5kg": {
    name: "Fragrant rice 5kg",
    unit: "bag",
    note: "Similar grade, next-day stock",
  },
  "Cavendish bananas": {
    name: "Pisang Awak bananas",
    unit: "kg",
    note: "Local variety, ready now",
  },
  "Cooking oil 5L": {
    name: "Vegetable oil 5L",
    unit: "bottle",
    note: "Same volume, neutral flavour",
  },
  "Kopi-O sachets": {
    name: "Kopi-C sachets",
    unit: "pack",
    note: "Same brand line, in stock",
  },
  "Cardboard cartons": {
    name: "Recycled cardboard cartons",
    unit: "pcs",
    note: "Same size, eco-grade stock",
  },
};

export const DISPUTE_REASON_LABELS: Record<DisputeReason, string> = {
  missing_item: "Item missing from delivery",
  late_delivery: "Delivery arrived late",
  damaged: "Item arrived damaged",
  wrong_item: "Received the wrong item",
};

export const DISPUTE_OUTCOME_LABELS: Record<"refund" | "partial_refund" | "replacement", string> = {
  refund: "Full refund",
  partial_refund: "Partial refund",
  replacement: "Replacement",
};

export function computeAiDisputeRecommendation(
  order: Order,
  reason: DisputeReason
): Pick<Dispute, "outcome" | "amount" | "reasoning"> {
  const affected = order.items[0];

  if (reason === "missing_item") {
    return {
      outcome: "partial_refund",
      amount: affected.price,
      reasoning: `Delivery confirmation shows ${affected.name} wasn't scanned at drop-off. The rest of the order matches your RFQ, so we recommend refunding just the missing line — ${formatSGD(affected.price)} — rather than the full order.`,
    };
  }
  if (reason === "wrong_item") {
    return {
      outcome: "partial_refund",
      amount: affected.price,
      reasoning: `You reported ${affected.name} was swapped for something else. Since the rest of the order matches, we recommend a partial refund of ${formatSGD(affected.price)} for that line — the supplier keeps their fill-rate score for the remaining items.`,
    };
  }
  if (reason === "damaged") {
    return {
      outcome: "replacement",
      amount: 0,
      reasoning: `Damage claims on a ${order.supplierId} order with no prior disputes are usually packaging-related rather than a stock issue, so a reshipped replacement is faster than a refund. Ledger will hold the supplier's payout until the replacement is confirmed delivered.`,
    };
  }
  const goodwill = Math.max(5, Math.round(order.platformFee * 100) / 100);
  return {
    outcome: "partial_refund",
    amount: goodwill,
    reasoning: `Your order was confirmed at ${order.confirmedAt ?? order.placedAt} against a promised window — late enough to affect your prep time. We recommend a ${formatSGD(goodwill)} goodwill credit rather than a full refund, since the order still arrived complete.`,
  };
}

export function mockScanShelfPhoto(): { items: RfqItem[]; confidence: number } {
  return {
    items: [
      { id: `scan-1-${Date.now()}`, name: "Cage-free eggs", quantity: 10, unit: "carton", aiMatched: true, confidence: 0.93 },
      { id: `scan-2-${Date.now()}`, name: "Full cream milk 1L", quantity: 8, unit: "carton", aiMatched: true, confidence: 0.9 },
      { id: `scan-3-${Date.now()}`, name: "Cavendish bananas", quantity: 12, unit: "kg", aiMatched: true, confidence: 0.88 },
    ],
    confidence: 90,
  };
}

export const SUPPLIER_WIN_INSIGHTS: Record<string, { score: number; reason: string }> = {
  "rfq-veg": {
    score: 92,
    reason: "Strong fit — matches your usual catalog and this shop reorders weekly.",
  },
  "rfq-bakery": {
    score: 58,
    reason: "Outside your usual categories — lower win odds unless priced aggressively.",
  },
};

export function rankSupplierInbox<T extends { id: string; status: string }>(
  entries: T[]
): (T & { winScore: number; reason?: string; recommended: boolean })[] {
  const scored = entries
    .filter((e) => e.status === "open")
    .map((e) => ({
      ...e,
      winScore: SUPPLIER_WIN_INSIGHTS[e.id]?.score ?? 50,
      reason: SUPPLIER_WIN_INSIGHTS[e.id]?.reason,
    }))
    .sort((a, b) => b.winScore - a.winScore);
  return scored.map((e, i) => ({ ...e, recommended: i === 0 }));
}
