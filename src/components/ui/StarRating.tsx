import { Star } from "lucide-react";

export function StarRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <div className="flex items-center gap-1 text-[12.5px] text-black/60">
      <Star size={13} className="fill-gold text-gold" />
      <span className="font-semibold text-app-fg">{rating.toFixed(1)}</span>
      <span>({reviewCount})</span>
    </div>
  );
}
