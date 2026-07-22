import { Signal, Wifi, BatteryFull } from "lucide-react";

export function StatusBar({ light = false }: { light?: boolean }) {
  const textColor = light ? "text-white" : "text-[var(--color-app-fg)]";
  return (
    <div className={`relative flex h-11 shrink-0 items-center justify-between px-6 pt-1 ${textColor}`}>
      <span className="text-[15px] font-semibold tabular-nums">9:41</span>
      <div className="pointer-events-none absolute left-1/2 top-2 h-[28px] w-[104px] -translate-x-1/2 rounded-full bg-black" />
      <div className="flex items-center gap-1.5">
        <Signal size={15} strokeWidth={2.5} />
        <Wifi size={15} strokeWidth={2.5} />
        <BatteryFull size={18} strokeWidth={2} />
      </div>
    </div>
  );
}
