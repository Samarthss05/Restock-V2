"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BIDS_BY_RFQ,
  INITIAL_RFQS,
  SHOP_ORDERS_SEED,
  SUPPLIER_INBOX_SEED,
  SUPPLIER_ORDERS_SEED,
  buildOrderItemsFromRfqAndBid,
  computeAiDisputeRecommendation,
  nextId,
} from "./data";
import { generateShopReply, generateSupplierReply } from "./assistant";
import type { Bid, ChatMessage, Dispute, DisputeReason, Order, Rfq } from "./types";

type AccountPrefs = {
  smartReorderAlerts: boolean;
  aiBidRankingExplanations: boolean;
  autoBidRules: boolean;
  demandForecastAlerts: boolean;
};

type AutoBidConfig = {
  active: boolean;
  priceFloorLabel: string;
};

type Role = "shop" | "supplier" | null;

type AppState = {
  role: Role;
  rfqs: Rfq[];
  bidsByRfq: Record<string, Bid[]>;
  shopOrders: Order[];
  supplierOrders: Order[];
  autoBid: AutoBidConfig;
  prefs: AccountPrefs;
  disputes: Record<string, Dispute>;
  shopChat: ChatMessage[];
  supplierChat: ChatMessage[];
};

type AppActions = {
  setRole: (role: Role) => void;
  logout: () => void;
  addRfq: (rfq: Rfq) => void;
  upsertDraftRfq: (rfq: Rfq) => void;
  acceptBid: (rfqId: string, bidId: string) => string | undefined;
  rejectAllBids: (rfqId: string) => void;
  toggleAutoBid: () => void;
  setAutoBidFloor: (label: string) => void;
  submitSupplierBid: (rfqId: string, total: number, note?: string) => void;
  advanceSupplierOrder: (orderId: string) => void;
  setSupplierOrderStep: (orderId: string, step: 0 | 1 | 2 | 3) => void;
  togglePref: (key: keyof AccountPrefs) => void;
  raiseDispute: (orderId: string, reason: DisputeReason) => void;
  acceptDisputeRecommendation: (orderId: string) => void;
  escalateDispute: (orderId: string) => void;
  sendShopMessage: (text: string) => void;
  sendSupplierMessage: (text: string) => void;
};

const AppStoreContext = createContext<(AppState & AppActions) | null>(null);

const STEP_LABELS: Order["status"][] = ["confirmed", "confirmed", "in_transit", "delivered"];

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [rfqs, setRfqs] = useState<Rfq[]>(INITIAL_RFQS);
  const [bidsByRfq, setBidsByRfq] = useState<Record<string, Bid[]>>(BIDS_BY_RFQ);
  const [shopOrders, setShopOrders] = useState<Order[]>(SHOP_ORDERS_SEED);
  const [supplierOrders, setSupplierOrders] = useState<Order[]>(SUPPLIER_ORDERS_SEED);
  const [autoBid, setAutoBid] = useState<AutoBidConfig>({
    active: true,
    priceFloorLabel: "Your cost + 8%",
  });
  const [prefs, setPrefs] = useState<AccountPrefs>({
    smartReorderAlerts: true,
    aiBidRankingExplanations: true,
    autoBidRules: true,
    demandForecastAlerts: true,
  });
  const [disputes, setDisputes] = useState<Record<string, Dispute>>({});
  const [shopChat, setShopChat] = useState<ChatMessage[]>([]);
  const [supplierChat, setSupplierChat] = useState<ChatMessage[]>([]);

  const setRole = useCallback((r: Role) => setRoleState(r), []);
  const logout = useCallback(() => setRoleState(null), []);

  const addRfq = useCallback((rfq: Rfq) => {
    setRfqs((prev) => [rfq, ...prev.filter((r) => r.id !== rfq.id)]);
  }, []);

  const upsertDraftRfq = useCallback((rfq: Rfq) => {
    setRfqs((prev) => {
      const exists = prev.some((r) => r.id === rfq.id);
      if (exists) return prev.map((r) => (r.id === rfq.id ? rfq : r));
      return [rfq, ...prev];
    });
  }, []);

  const acceptBid = useCallback(
    (rfqId: string, bidId: string) => {
      const rfq = rfqs.find((r) => r.id === rfqId);
      const bid = bidsByRfq[rfqId]?.find((b) => b.id === bidId);
      if (!rfq || !bid) return undefined;

      const { orderItems, platformFee } = buildOrderItemsFromRfqAndBid(rfq.items, bid.total);
      const orderId = nextId("order");
      const refNumber = 1050 + Math.floor(Math.random() * 40);
      const newOrder: Order = {
        id: orderId,
        ref: `RS-${refNumber}`,
        rfqId,
        supplierId: bid.supplierId,
        shopRef: rfq.shopRef,
        status: "confirmed",
        total: bid.total,
        platformFee,
        items: orderItems,
        placedAt: "Just now",
        confirmedAt: "Just now",
        dateLabel: "Today",
        createdAt: Date.now(),
        fulfillmentStep: 1,
      };

      setShopOrders((prev) => [newOrder, ...prev]);
      setRfqs((prev) => prev.map((r) => (r.id === rfqId ? { ...r, status: "closed" } : r)));

      return orderId;
    },
    [rfqs, bidsByRfq]
  );

  const rejectAllBids = useCallback((rfqId: string) => {
    setRfqs((prev) => prev.map((r) => (r.id === rfqId ? { ...r, status: "closed" } : r)));
  }, []);

  const toggleAutoBid = useCallback(() => {
    setAutoBid((prev) => ({ ...prev, active: !prev.active }));
  }, []);

  const setAutoBidFloor = useCallback((label: string) => {
    setAutoBid((prev) => ({ ...prev, priceFloorLabel: label }));
  }, []);

  const submitSupplierBid = useCallback((rfqId: string, total: number, note?: string) => {
    setBidsByRfq((prev) => {
      const existing = prev[rfqId] ?? [];
      const letters = ["A", "B", "C", "D", "E", "F"];
      const label = `Supplier ${letters[existing.length] ?? existing.length + 1}`;
      const newBid: Bid = {
        id: nextId("bid"),
        rfqId,
        supplierLabel: label,
        supplierId: "Supplier #741",
        total,
        fillRate: 100,
        deliveryPromise: "Tomorrow, 7:30 AM",
        deliveryISO: "",
        tags: ["Your bid"],
        note,
        rating: 4.5,
        reviewCount: 12,
        isLeading: existing.length === 0,
      };
      return { ...prev, [rfqId]: [...existing, newBid] };
    });
    setRfqs((prev) =>
      prev.map((r) => (r.id === rfqId ? { ...r, bidsCount: r.bidsCount + 1 } : r))
    );
  }, []);

  const advanceSupplierOrder = useCallback((orderId: string) => {
    setSupplierOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const nextStep = Math.min(3, o.fulfillmentStep + 1) as 0 | 1 | 2 | 3;
        return { ...o, fulfillmentStep: nextStep, status: STEP_LABELS[nextStep] };
      })
    );
  }, []);

  const setSupplierOrderStep = useCallback((orderId: string, step: 0 | 1 | 2 | 3) => {
    setSupplierOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStep: step, status: STEP_LABELS[step] } : o))
    );
  }, []);

  const togglePref = useCallback((key: keyof AccountPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const raiseDispute = useCallback(
    (orderId: string, reason: DisputeReason) => {
      const order = shopOrders.find((o) => o.id === orderId);
      if (!order) return;
      const rec = computeAiDisputeRecommendation(order, reason);
      setDisputes((prev) => ({
        ...prev,
        [orderId]: { orderId, reason, status: "recommended", ...rec, createdAt: Date.now() },
      }));
    },
    [shopOrders]
  );

  const acceptDisputeRecommendation = useCallback((orderId: string) => {
    setDisputes((prev) =>
      prev[orderId] ? { ...prev, [orderId]: { ...prev[orderId], status: "accepted" } } : prev
    );
  }, []);

  const escalateDispute = useCallback((orderId: string) => {
    setDisputes((prev) =>
      prev[orderId] ? { ...prev, [orderId]: { ...prev[orderId], status: "escalated" } } : prev
    );
  }, []);

  const sendShopMessage = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = { id: nextId("msg"), role: "user", text, createdAt: Date.now() };
      const reply = generateShopReply(text, { orders: shopOrders, rfqs });
      const aiMsg: ChatMessage = {
        id: nextId("msg"),
        role: "assistant",
        text: reply.text,
        quickActions: reply.quickActions,
        createdAt: Date.now(),
      };
      setShopChat((prev) => [...prev, userMsg, aiMsg]);
    },
    [shopOrders, rfqs]
  );

  const sendSupplierMessage = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = { id: nextId("msg"), role: "user", text, createdAt: Date.now() };
      const reply = generateSupplierReply(text, {
        orders: supplierOrders,
        inbox: SUPPLIER_INBOX_SEED,
      });
      const aiMsg: ChatMessage = {
        id: nextId("msg"),
        role: "assistant",
        text: reply.text,
        quickActions: reply.quickActions,
        createdAt: Date.now(),
      };
      setSupplierChat((prev) => [...prev, userMsg, aiMsg]);
    },
    [supplierOrders]
  );

  const value = useMemo(
    () => ({
      role,
      rfqs,
      bidsByRfq,
      shopOrders,
      supplierOrders,
      autoBid,
      prefs,
      disputes,
      shopChat,
      supplierChat,
      setRole,
      logout,
      addRfq,
      upsertDraftRfq,
      acceptBid,
      rejectAllBids,
      toggleAutoBid,
      setAutoBidFloor,
      submitSupplierBid,
      advanceSupplierOrder,
      setSupplierOrderStep,
      togglePref,
      raiseDispute,
      acceptDisputeRecommendation,
      escalateDispute,
      sendShopMessage,
      sendSupplierMessage,
    }),
    [
      role,
      rfqs,
      bidsByRfq,
      shopOrders,
      supplierOrders,
      autoBid,
      prefs,
      disputes,
      shopChat,
      supplierChat,
      setRole,
      logout,
      addRfq,
      upsertDraftRfq,
      acceptBid,
      rejectAllBids,
      toggleAutoBid,
      setAutoBidFloor,
      submitSupplierBid,
      advanceSupplierOrder,
      setSupplierOrderStep,
      togglePref,
      raiseDispute,
      acceptDisputeRecommendation,
      escalateDispute,
      sendShopMessage,
      sendSupplierMessage,
    ]
  );

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
