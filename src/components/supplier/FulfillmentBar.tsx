export const FULFILLMENT_STEPS = ["Confirmed", "Packed", "In Transit", "Delivered"];

export function FulfillmentBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1">
      {FULFILLMENT_STEPS.map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full ${i <= step ? "grad-sage" : "bg-black/[0.08]"}`}
        />
      ))}
    </div>
  );
}
