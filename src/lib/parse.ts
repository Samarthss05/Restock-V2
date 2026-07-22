import { CATALOG } from "./data";
import type { RfqItem, Unit } from "./types";

const UNIT_ALIASES: Record<string, Unit> = {
  kg: "kg",
  kgs: "kg",
  ctn: "carton",
  ctns: "carton",
  carton: "carton",
  cartons: "carton",
  pcs: "pcs",
  pc: "pcs",
  pack: "pack",
  packs: "pack",
  bag: "bag",
  bags: "bag",
  bottle: "bottle",
  bottles: "bottle",
};

const KEYWORD_TO_PRODUCT: Record<string, string> = {
  banana: "p-bananas",
  bananas: "p-bananas",
  egg: "p-eggs",
  eggs: "p-eggs",
  milk: "p-milk",
  kailan: "p-greens",
  greens: "p-greens",
  vegetable: "p-greens",
  vegetables: "p-greens",
  rice: "p-rice",
  kopi: "p-kopio",
  oil: "p-oil",
  carton: "p-cartons",
  cartons: "p-cartons",
  box: "p-cartons",
  boxes: "p-cartons",
};

function matchProduct(name: string) {
  const lower = name.toLowerCase();
  for (const [keyword, productId] of Object.entries(KEYWORD_TO_PRODUCT)) {
    if (lower.includes(keyword)) {
      return CATALOG.find((p) => p.id === productId);
    }
  }
  return undefined;
}

export function parseImportedText(text: string): { items: RfqItem[]; confidence: number } {
  const chunks = text
    .split(/,|\n|;/)
    .map((c) => c.trim())
    .filter(Boolean);

  const items: RfqItem[] = [];
  let matchedCount = 0;

  chunks.forEach((chunk, i) => {
    const match = chunk.match(/(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?\s+(.*)/);
    if (!match) return;
    const [, qtyStr, unitToken, rest] = match;
    const quantity = parseFloat(qtyStr);
    const unit = (unitToken && UNIT_ALIASES[unitToken.toLowerCase()]) || "pcs";
    const product = matchProduct(rest || chunk);
    const matched = Boolean(product);
    if (matched) matchedCount += 1;
    items.push({
      id: `parsed-${i}-${Date.now()}`,
      name: product?.name ?? rest.trim().replace(/^\w/, (c) => c.toUpperCase()),
      quantity: Number.isFinite(quantity) ? quantity : 1,
      unit: product?.unit ?? unit,
      aiMatched: matched,
      confidence: matched ? 0.96 : 0.6,
    });
  });

  const matchRatio = items.length > 0 ? matchedCount / items.length : 0;
  const confidence = items.length === 0 ? 0 : matchRatio === 1 ? 96 : Math.round(matchRatio * 90);

  return { items, confidence };
}
