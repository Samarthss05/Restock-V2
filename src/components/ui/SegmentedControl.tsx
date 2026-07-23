export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex rounded-2xl bg-black/[0.05] p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-xl py-2.5 text-[13.5px] font-semibold transition-all duration-200 ${
            value === opt.value
              ? "bg-white text-app-fg shadow-[0_2px_6px_rgba(0,0,0,0.08)]"
              : "text-black/40"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
