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
    <div className="vault-card rounded-card p-4">
      <div className="mb-3 flex items-center gap-2">
        {icon && <ShieldCheck size={16} className="text-sage-200" />}
        <span className="text-[13px] font-semibold text-white/90">{title}</span>
      </div>
      {children}
    </div>
  );
}
