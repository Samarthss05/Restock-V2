"use client";

import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Plus, Camera, RotateCcw } from "lucide-react";
import { Screen } from "@/components/chrome/Screen";
import { TopNavBar } from "@/components/chrome/TopNavBar";
import { StickyFooter } from "@/components/chrome/StickyFooter";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Tag } from "@/components/ui/Chip";
import { RfqItemRow } from "@/components/shop/RfqItemRow";
import { ProductSearchSheet } from "@/components/shop/ProductSearchSheet";
import { useAppStore } from "@/lib/store";
import { nextId, SHOP_PROFILE, mockScanShelfPhoto } from "@/lib/data";
import { parseImportedText } from "@/lib/parse";
import { moderateText } from "@/lib/moderation";
import type { Product, Rfq, RfqItem, Unit } from "@/lib/types";

type Mode = "manual" | "import" | "photo";

function CreateRfqInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft");
  const { rfqs, addRfq, upsertDraftRfq } = useAppStore();
  const existingDraft = draftId ? rfqs.find((r) => r.id === draftId) : undefined;

  const [mode, setMode] = useState<Mode>("manual");
  const [deliveryAddress, setDeliveryAddress] = useState(
    existingDraft?.deliveryAddress ?? "12 Tanjong Pagar Rd, #01-04"
  );
  const [neededBy, setNeededBy] = useState(existingDraft?.neededBy ?? "Tomorrow, 9:00 AM");
  const [items, setItems] = useState<RfqItem[]>(
    existingDraft?.items ?? [
      { id: "ri-bananas", name: "Cavendish bananas", quantity: 20, unit: "kg" },
      { id: "ri-eggs", name: "Cage-free eggs", quantity: 15, unit: "carton" },
    ]
  );
  const [notes, setNotes] = useState(existingDraft?.notes ?? "");
  const [importText, setImportText] = useState("");
  const [parsedConfidence, setParsedConfidence] = useState<number | null>(null);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanConfidence, setScanConfidence] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchState, setSearchState] = useState<
    { open: false } | { open: true; mode: "add" } | { open: true; mode: "replace"; itemId: string }
  >({ open: false });

  const notesCheck = moderateText(notes);
  const hasCompleteItem = items.some((it) => it.quantity > 0);

  function addProducts(products: Product[]) {
    setItems((prev) => {
      const additions = products
        .filter((p) => !prev.some((it) => it.name === p.name))
        .map((p) => ({ id: nextId("item"), name: p.name, quantity: 1, unit: p.unit }));
      return [...prev, ...additions];
    });
    setSearchState({ open: false });
  }

  function replaceItem(itemId: string, product: Product) {
    setItems((prev) =>
      prev.map((it) => (it.id === itemId ? { ...it, name: product.name, unit: product.unit } : it))
    );
    setSearchState({ open: false });
  }

  function handleParse() {
    const { items: parsed, confidence } = parseImportedText(importText);
    setItems(parsed);
    setParsedConfidence(confidence);
  }

  function handlePhotoSelected(file: File) {
    setPhotoUrl(URL.createObjectURL(file));
    setScanning(true);
    setScanConfidence(null);
    window.setTimeout(() => {
      const result = mockScanShelfPhoto();
      setItems(result.items);
      setScanConfidence(result.confidence);
      setScanning(false);
    }, 1400);
  }

  function resetPhoto() {
    setPhotoUrl(null);
    setScanning(false);
    setScanConfidence(null);
    setItems([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function buildRfq(status: Rfq["status"]): Rfq {
    return {
      id: existingDraft?.id ?? nextId("rfq"),
      ref: existingDraft?.ref ?? `RS-Q${2200 + Math.floor(Math.random() * 90)}`,
      title: items[0]?.name ? `${items[0].name} & more` : "New request",
      deliveryAddress,
      neededBy,
      neededByISO: "",
      items,
      notes,
      status,
      createdVia: mode === "import" ? "import_chat" : mode === "photo" ? "photo" : "manual",
      deadlineMinutesFromCreation: 240,
      createdAt: existingDraft?.createdAt ?? Date.now(),
      bidsCount: 0,
      shopRef: "Shop #2847",
      shopName: SHOP_PROFILE.name,
    };
  }

  function handleSaveDraft() {
    upsertDraftRfq(buildRfq("draft"));
    router.push("/shop");
  }

  function handleSubmit() {
    if (!hasCompleteItem || notesCheck.flagged) return;
    const rfq = buildRfq("awaiting_response");
    addRfq(rfq);
    router.push(`/shop/bidding/${rfq.id}`);
  }

  return (
    <>
    <Screen
      topBar={<TopNavBar title="Create RFQ" backLabel="Back" rightLabel="Save" rightAction={handleSaveDraft} />}
      bottomBar={
        <StickyFooter>
          <Button variant="secondary" onClick={handleSaveDraft}>
            Save draft
          </Button>
          <Button onClick={handleSubmit} disabled={!hasCompleteItem || notesCheck.flagged}>
            Submit
          </Button>
        </StickyFooter>
      }
    >
      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { value: "manual", label: "Manual" },
          { value: "import", label: "Import chat" },
          { value: "photo", label: "Photo" },
        ]}
      />

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-black/50">Delivery address</span>
          <input
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            className="rounded-2xl border border-black/10 bg-white shadow-sm px-4 py-3 text-[14.5px] outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-black/50">Needed by</span>
          <input
            value={neededBy}
            onChange={(e) => setNeededBy(e.target.value)}
            className="rounded-2xl border border-black/10 bg-white shadow-sm px-4 py-3 text-[14.5px] outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
          />
        </label>
      </div>

      {mode === "manual" && (
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[13px] font-semibold text-app-fg">Items</span>
          </div>
          <div className="flex flex-col gap-2">
            {items.map((item) => (
              <RfqItemRow
                key={item.id}
                item={item}
                onChangeQuantity={(q) =>
                  setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, quantity: q } : it)))
                }
                onChangeUnit={(u: Unit) =>
                  setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, unit: u } : it)))
                }
                onChangeItem={() => setSearchState({ open: true, mode: "replace", itemId: item.id })}
                onDelete={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
              />
            ))}
          </div>
          <button
            onClick={() => setSearchState({ open: true, mode: "add" })}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-black/15 py-3 text-[13.5px] font-medium text-sage-dark active:opacity-60"
          >
            <Plus size={15} />
            Search products to add
          </button>
        </div>
      )}

      {mode === "import" && (
        <div className="mt-5">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Paste it just like you'd send it, e.g. 'Need 20kg bananas, 15 ctn eggs, 10kg kailan'"
            rows={4}
            className="w-full rounded-2xl border border-black/10 bg-white shadow-sm p-4 text-[14.5px] outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
          />
          <button
            onClick={handleParse}
            disabled={!importText.trim()}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-sage-dark py-3 text-[14px] font-semibold text-white active:scale-[0.98] disabled:opacity-40"
          >
            <Sparkles size={15} />
            Parse with AI
          </button>
          <p className="mt-3 text-[12px] leading-relaxed text-black/45">
            We only read what you paste here — this never opens a chat with a supplier.
          </p>

          {parsedConfidence !== null && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-app-fg">
                  Detected items · review before continuing
                </span>
                <Tag>{parsedConfidence}% confidence</Tag>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <RfqItemRow
                    key={item.id}
                    item={item}
                    onChangeQuantity={(q) =>
                      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, quantity: q } : it)))
                    }
                    onChangeUnit={(u: Unit) =>
                      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, unit: u } : it)))
                    }
                    onDelete={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {mode === "photo" && (
        <div className="mt-5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoSelected(file);
            }}
          />

          {!photoUrl && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="press flex w-full flex-col items-center justify-center gap-2 rounded-hero border border-dashed border-black/15 bg-white py-10 text-center"
            >
              <span className="ai-gradient-icon flex h-12 w-12 items-center justify-center rounded-2xl">
                <Camera size={20} className="text-white" />
              </span>
              <span className="mt-1 text-[14px] font-semibold text-app-fg">
                Take a photo of your shelf
              </span>
              <span className="text-[12px] text-black/45">or choose one from your library</span>
            </button>
          )}

          {photoUrl && (
            <div className="overflow-hidden rounded-hero">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="Shelf photo" className="h-44 w-full object-cover" />
            </div>
          )}

          {photoUrl && (
            <p className="mt-3 text-[12px] leading-relaxed text-black/45">
              Photos are analyzed for this preview only — they&apos;re never shared with a
              supplier.
            </p>
          )}

          {scanning && (
            <div className="mt-4 flex items-center gap-2 rounded-2xl bg-black/[0.03] px-3.5 py-3 text-[12.5px] font-medium text-sage-dark">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sage opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sage-dark" />
              </span>
              Scanning shelf with AI…
            </div>
          )}

          {scanConfidence !== null && !scanning && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-semibold text-app-fg">
                  Detected low stock · review before continuing
                </span>
                <Tag>{scanConfidence}% confidence</Tag>
              </div>
              <div className="flex flex-col gap-2">
                {items.map((item) => (
                  <RfqItemRow
                    key={item.id}
                    item={item}
                    onChangeQuantity={(q) =>
                      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, quantity: q } : it)))
                    }
                    onChangeUnit={(u: Unit) =>
                      setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, unit: u } : it)))
                    }
                    onDelete={() => setItems((prev) => prev.filter((it) => it.id !== item.id))}
                  />
                ))}
              </div>
              <button
                onClick={resetPhoto}
                className="mt-3 flex items-center gap-1.5 text-[12.5px] font-medium text-sage-dark active:opacity-60"
              >
                <RotateCcw size={13} />
                Retake photo
              </button>
            </div>
          )}
        </div>
      )}

      <div className="mt-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12.5px] font-medium text-black/50">Notes for suppliers (optional)</span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Delivery instructions…"
            className={`w-full rounded-2xl border bg-white p-4 text-[14.5px] outline-none ${
              notesCheck.flagged ? "border-destructive" : "border-black/10 focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
            }`}
          />
        </label>
        {notesCheck.flagged ? (
          <p className="mt-1.5 text-[12px] font-medium text-destructive">
            Contact details aren&apos;t allowed here. Remove them to continue.
          </p>
        ) : (
          <p className="mt-1.5 text-[12px] leading-relaxed text-black/40">
            Contact details and external links are screened out automatically to keep quoting
            fair.
          </p>
        )}
      </div>

    </Screen>
      {searchState.open && searchState.mode === "add" && (
        <ProductSearchSheet
          mode="add"
          onCancel={() => setSearchState({ open: false })}
          onDone={addProducts}
        />
      )}
      {searchState.open && searchState.mode === "replace" && (
        <ProductSearchSheet
          mode="replace"
          onCancel={() => setSearchState({ open: false })}
          onReplace={(product) => replaceItem(searchState.itemId, product)}
        />
      )}
    </>
  );
}

export default function CreateRfqPage() {
  return (
    <Suspense>
      <CreateRfqInner />
    </Suspense>
  );
}
