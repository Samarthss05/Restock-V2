import type { ReactNode } from "react";

export function StickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 z-20 -mt-10 bg-gradient-to-t from-app-bg via-app-bg/95 to-transparent px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-8">
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
