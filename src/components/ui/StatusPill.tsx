const STATUS_STYLES: Record<string, string> = {
  open: "bg-sage-100 text-sage-dark",
  awaiting_response: "bg-gold/15 text-[#8a6208]",
  draft: "bg-black/[0.06] text-black/50",
  confirmed: "bg-sage-100 text-sage-dark",
  in_transit: "bg-gold/15 text-[#8a6208]",
  delivered: "bg-sage-100 text-sage-dark",
  cancelled: "bg-destructive/10 text-destructive",
  expired: "bg-destructive/10 text-destructive",
  leading: "bg-gold/15 text-[#8a6208]",
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
