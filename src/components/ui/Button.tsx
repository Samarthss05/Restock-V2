"use client";

import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "destructive" | "ghost";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const base =
    "flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5 text-[15px] font-semibold transition active:scale-[0.98] disabled:active:scale-100 disabled:opacity-40";
  const variants: Record<Variant, string> = {
    primary: "bg-sage-dark text-white",
    secondary: "bg-black/[0.05] text-app-fg",
    destructive: "bg-destructive text-white",
    ghost: "bg-transparent text-sage-dark",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
