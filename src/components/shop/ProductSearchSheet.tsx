"use client";

import { useMemo, useState } from "react";
import { Search, X, Check, Package } from "lucide-react";
import { StatusBar } from "@/components/chrome/StatusBar";
import { HomeIndicator } from "@/components/chrome/HomeIndicator";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { CATALOG, SUGGESTED_PRODUCT_IDS, findProduct } from "@/lib/data";
import { moderateText } from "@/lib/moderation";
import type { Product, Unit } from "@/lib/types";

type Props =
  | {
      mode: "add";
      onCancel: () => void;
      onDone: (products: Product[]) => void;
    }
  | {
      mode: "replace";
      onCancel: () => void;
      onReplace: (product: Product) => void;
    };

export function ProductSearchSheet(props: Props) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customUnit, setCustomUnit] = useState<Unit>("pcs");
  const [customError, setCustomError] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!query.trim()) return CATALOG;
    const q = query.toLowerCase();
    return CATALOG.filter((p) => p.name.toLowerCase().includes(q));
  }, [query]);

  function toggle(product: Product) {
    if (props.mode === "replace") {
      props.onReplace(product);
      return;
    }
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(product.id)) next.delete(product.id);
      else next.add(product.id);
      return next;
    });
  }

  function handleDone() {
    if (props.mode !== "add") return;
    const products = Array.from(selected)
      .map((id) => findProduct(id))
      .filter((p): p is Product => Boolean(p));
    props.onDone(products);
  }

  function handleAddCustom() {
    const check = moderateText(customName);
    if (check.flagged || !customName.trim()) {
      setCustomError(
        !customName.trim()
          ? "Enter an item name."
          : "Custom items can't include contact details or business names."
      );
      return;
    }
    const product: Product = {
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      unit: customUnit,
      priceLow: 0,
      priceHigh: 0,
    };
    if (props.mode === "add") {
      props.onDone([product]);
    } else {
      props.onReplace(product);
    }
  }

  return (
    <div className="absolute inset-0 z-40 flex flex-col bg-app-bg">
      <StatusBar />
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-black/[0.06] px-4">
        <button onClick={props.onCancel} className="text-[15px] text-sage-dark active:opacity-60">
          Cancel
        </button>
        <div className="text-[15px] font-semibold text-app-fg">Add item</div>
        {props.mode === "add" ? (
          <button
            onClick={handleDone}
            disabled={selected.size === 0}
            className="text-[15px] font-semibold text-sage-dark disabled:opacity-30"
          >
            Done{selected.size > 0 ? ` (${selected.size})` : ""}
          </button>
        ) : (
          <span className="w-8" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-8 pt-4">
        <div className="relative mb-4">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, e.g. bananas"
            className="w-full rounded-2xl border border-black/10 bg-white py-3 pl-10 pr-4 text-[15px] outline-none focus:border-sage"
          />
        </div>

        {!query.trim() && (
          <div className="mb-5">
            <div className="mb-2 text-[13px] font-semibold text-app-fg">Suggested for you</div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PRODUCT_IDS.map((id) => {
                const p = findProduct(id);
                if (!p) return null;
                return (
                  <Chip
                    key={id}
                    label={p.name}
                    active={selected.has(id)}
                    onClick={() => toggle(p)}
                  />
                );
              })}
            </div>
            <div className="mt-1.5 text-[11.5px] text-black/40">Based on your last 6 orders</div>
          </div>
        )}

        <div className="divide-y divide-black/[0.05]">
          {results.map((p) => {
            const isSelected = selected.has(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggle(p)}
                className="flex w-full items-center gap-3 py-3 text-left active:opacity-70"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100 text-sage-dark">
                  <Package size={18} strokeWidth={2} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14.5px] font-medium text-app-fg">{p.name}</div>
                  <div className="truncate text-[12.5px] text-black/50">
                    Typically {p.unit} · ~S${p.priceLow.toFixed(2)}–{p.priceHigh.toFixed(2)}
                  </div>
                </div>
                {props.mode === "add" && (
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                      isSelected ? "border-sage-dark bg-sage-dark" : "border-black/15"
                    }`}
                  >
                    {isSelected && <Check size={13} className="text-white" />}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 border-t border-black/[0.05] pt-4">
          {!customOpen ? (
            <button
              onClick={() => setCustomOpen(true)}
              className="text-[13.5px] font-medium text-sage-dark active:opacity-60"
            >
              Can&apos;t find it? Add a custom item
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCustomOpen(false)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black/[0.05]"
                >
                  <X size={15} />
                </button>
                <input
                  value={customName}
                  onChange={(e) => {
                    setCustomName(e.target.value);
                    setCustomError(null);
                  }}
                  placeholder="Item name"
                  className={`flex-1 rounded-2xl border bg-white px-3.5 py-2.5 text-[14px] outline-none ${
                    customError ? "border-destructive" : "border-black/10 focus:border-sage"
                  }`}
                />
                <select
                  value={customUnit}
                  onChange={(e) => setCustomUnit(e.target.value as Unit)}
                  className="rounded-2xl border border-black/10 bg-white px-2 py-2.5 text-[13px] outline-none"
                >
                  {(["pcs", "kg", "carton", "pack", "bag", "bottle"] as Unit[]).map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11.5px] leading-relaxed text-black/40">
                Custom items are screened automatically — contact details or business names
                can&apos;t be included.
              </p>
              {customError && (
                <p className="text-[12px] font-medium text-destructive">{customError}</p>
              )}
              <Button variant="secondary" onClick={handleAddCustom}>
                Add item
              </Button>
            </div>
          )}
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}
