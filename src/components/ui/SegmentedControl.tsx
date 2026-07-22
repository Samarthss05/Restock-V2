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
          className={`flex-1 rounded-xl py-2 text-[13.5px] font-semibold transition ${
            value === opt.value ? "bg-white text-app-fg shadow-sm" : "text-black/45"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
