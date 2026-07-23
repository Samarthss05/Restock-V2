const STORAGE_KEY = "restock-ledger-state-v1";

export type PersistedState = {
  role: "shop" | "supplier" | null;
  rfqs: unknown;
  bidsByRfq: unknown;
  shopOrders: unknown;
  supplierOrders: unknown;
  autoBid: unknown;
  prefs: unknown;
  disputes: unknown;
  shopChat: unknown;
  supplierChat: unknown;
  idCounter: number;
};

export function loadPersisted(): Partial<PersistedState> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function savePersisted(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable (private browsing) — fail silently, session still works in-memory.
  }
}

export function clearPersisted() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
