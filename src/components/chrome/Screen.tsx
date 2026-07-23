import type { ReactNode } from "react";

export function Screen({
  topBar,
  bottomBar,
  noPadding = false,
  children,
}: {
  topBar?: ReactNode;
  bottomBar?: ReactNode;
  noPadding?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative flex h-full flex-col bg-app-bg">
      <div className="relative flex-1 overflow-y-auto no-scrollbar">
        {topBar}
        <div className={noPadding ? "" : "px-5 pb-10 pt-4"}>{children}</div>
        {bottomBar}
      </div>
    </div>
  );
}
