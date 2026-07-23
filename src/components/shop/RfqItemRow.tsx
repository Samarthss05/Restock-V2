import { Trash2 } from "lucide-react";
import { Tag } from "@/components/ui/Chip";
import type { RfqItem, Unit } from "@/lib/types";

const UNITS: Unit[] = ["pcs", "kg", "carton", "pack", "bag", "bottle"];

export function RfqItemRow({
  item,
  onChangeQuantity,
  onChangeUnit,
  onChangeItem,
  onDelete,
}: {
  item: RfqItem;
  onChangeQuantity: (q: number) => void;
  onChangeUnit: (u: Unit) => void;
  onChangeItem?: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-card border border-black/[0.05] bg-white p-3">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[14px] font-medium text-app-fg">{item.name}</span>
          {item.aiMatched && <Tag>AI matched</Tag>}
        </div>
        {onChangeItem && (
          <button onClick={onChangeItem} className="text-[12px] font-medium text-sage-dark active:opacity-60">
            Change item
          </button>
        )}
      </div>
      <input
        type="number"
        min={0}
        value={item.quantity}
        onChange={(e) => onChangeQuantity(parseFloat(e.target.value) || 0)}
        className="w-16 rounded-xl border border-black/10 bg-white shadow-sm px-2 py-1.5 text-right text-[14px] tabular-nums outline-none focus:border-sage focus:ring-4 focus:ring-sage/10 transition-shadow"
      />
      <select
        value={item.unit}
        onChange={(e) => onChangeUnit(e.target.value as Unit)}
        className="rounded-xl border border-black/10 bg-white shadow-sm px-1.5 py-1.5 text-[13px] outline-none"
      >
        {UNITS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>
      <button onClick={onDelete} className="shrink-0 text-black/30 active:text-destructive">
        <Trash2 size={16} />
      </button>
    </div>
  );
}
