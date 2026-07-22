export function HomeIndicator({ light = false }: { light?: boolean }) {
  return (
    <div className="pointer-events-none relative z-30 flex h-6 shrink-0 items-center justify-center">
      <div
        className={`h-[5px] w-[134px] rounded-full ${light ? "bg-white/90" : "bg-black/80"}`}
      />
    </div>
  );
}
