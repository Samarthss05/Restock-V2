import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`card-shadow rounded-card border border-black/[0.04] bg-white p-4 ${className}`}
      {...props}
    />
  );
}
