import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function VaultCard({
  title,
  children,
  icon = true,
}: {
  title: string;
  children: ReactNode;
  icon?: boolean;
}) {
  return (
    <div className="vault-card rounded-hero p-5">
      <div className="relative z-10 mb-3.5 flex items-center gap-2">
        {icon && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
            <ShieldCheck size={13} className="text-sage-200" />
          </span>
        )}
        <span className="text-[12.5px] font-bold uppercase tracking-[0.08em] text-white/70">
          {title}
        </span>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
