import type { ReactNode } from "react";
import { StatusBar } from "./StatusBar";
import { HomeIndicator } from "./HomeIndicator";

export function Screen({
  statusBarLight = false,
  homeIndicatorLight = false,
  topBar,
  bottomBar,
  noPadding = false,
  children,
}: {
  statusBarLight?: boolean;
  homeIndicatorLight?: boolean;
  topBar?: ReactNode;
  bottomBar?: ReactNode;
  noPadding?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative flex h-full flex-col bg-app-bg">
      <StatusBar light={statusBarLight} />
      <div className="relative flex-1 overflow-y-auto no-scrollbar">
        {topBar}
        <div className={noPadding ? "" : "px-4 pb-10 pt-4"}>{children}</div>
        {bottomBar}
      </div>
      <HomeIndicator light={homeIndicatorLight} />
    </div>
  );
}
