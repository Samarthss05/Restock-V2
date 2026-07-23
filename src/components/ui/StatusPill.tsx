const STATUS_STYLES: Record<string, string> = {
  open: "bg-gradient-to-r from-sage-100 to-sage-100/50 text-sage-dark",
  awaiting_response: "bg-gradient-to-r from-gold/20 to-gold/[0.08] text-[#8a6208]",
  draft: "bg-black/[0.06] text-black/50",
  confirmed: "bg-gradient-to-r from-sage-100 to-sage-100/50 text-sage-dark",
  in_transit: "bg-gradient-to-r from-gold/20 to-gold/[0.08] text-[#8a6208]",
  delivered: "bg-gradient-to-r from-sage-100 to-sage-100/50 text-sage-dark",
  cancelled: "bg-gradient-to-r from-destructive/15 to-destructive/[0.06] text-destructive",
  expired: "bg-gradient-to-r from-destructive/15 to-destructive/[0.06] text-destructive",
  leading: "bg-gradient-to-r from-gold/20 to-gold/[0.08] text-[#8a6208]",
};

const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  awaiting_response: "Awaiting response",
  draft: "Draft",
  confirmed: "Confirmed",
  in_transit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
  expired: "Deadline passed",
};

export function StatusPill({ status, label }: { status: string; label?: string }) {
  const style = STATUS_STYLES[status] ?? "bg-black/[0.06] text-black/60";
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-pill px-2.5 py-1 text-[11px] font-bold tracking-tight ${style}`}
    >
      {label ?? STATUS_LABELS[status] ?? status}
    </span>
  );
}
