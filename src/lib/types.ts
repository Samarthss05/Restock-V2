export type Unit = "pcs" | "kg" | "carton" | "pack" | "bag" | "bottle";

export type RfqItem = {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  aiMatched?: boolean;
  confidence?: number;
};

export type Product = {
  id: string;
  name: string;
  unit: Unit;
  priceLow: number;
  priceHigh: number;
};

export type RfqStatus = "draft" | "open" | "awaiting_response" | "closed";

export type Rfq = {
  id: string;
  ref: string;
  title: string;
  deliveryAddress: string;
  neededBy: string;
  neededByISO: string;
  items: RfqItem[];
  notes?: string;
  status: RfqStatus;
  createdVia: "manual" | "import_chat";
  deadlineMinutesFromCreation: number;
  createdAt: number;
  bidsCount: number;
  shopRef: string;
  shopName: string;
};

export type BidTag = string;

export type Bid = {
  id: string;
  rfqId: string;
  supplierLabel: string; // "Supplier A" pre-acceptance
  supplierId: string; // "Supplier #482" stable id post-acceptance
  total: number;
  fillRate: number;
  deliveryPromise: string;
  deliveryISO: string;
  tags: BidTag[];
  note?: string;
  rating: number;
  reviewCount: number;
  isLeading?: boolean;
};

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  unit: Unit;
  price: number;
};

export type OrderTimelineEntry = {
  label: string;
  timestamp?: string;
  done: boolean;
};

export type Order = {
  id: string;
  ref: string;
  rfqId?: string;
  supplierId: string; // masked, e.g. "Supplier #482"
  shopRef: string; // masked, e.g. "Shop #2847"
  status: OrderStatus;
  total: number;
  platformFee: number;
  items: OrderItem[];
  placedAt: string;
  confirmedAt?: string;
  etaLabel?: string;
  courier?: string;
  driver?: string;
  neighborhood?: string;
  dateLabel: string;
  createdAt: number;
  fulfillmentStep: 0 | 1 | 2 | 3;
};

export type SupplierRfqInboxEntry = {
  id: string;
  shopRef: string;
  title: string;
  itemCount: number;
  status: "open" | "expired";
  dueInMinutes: number;
  createdAt: number;
};
