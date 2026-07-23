"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "destructive" | "ghost";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "press flex w-full items-center justify-center gap-2 rounded-pill px-5 py-3.5 text-[15px] font-semibold transition-colors disabled:pointer-events-none disabled:opacity-40";
  const variants: Record<Variant, string> = {
    primary: "grad-sage-glossy text-white shadow-[var(--shadow-button)]",
    secondary: "bg-black/[0.05] text-app-fg",
    destructive: "grad-destructive text-white shadow-[0_10px_20px_-10px_rgba(198,90,90,0.6)]",
    ghost: "bg-transparent text-sage-dark",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
