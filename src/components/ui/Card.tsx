import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-card border border-black/[0.05] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${className}`}
      {...props}
    />
  );
}
