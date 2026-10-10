"use client";

import React, { ButtonHTMLAttributes, ReactNode } from "react";

export type TAZButtonSize = "small" | "medium" | "large" | "sm" | "md" | "lg";
export type AZButtonSize = TAZButtonSize;

export interface TAZButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The size of the button.
   * Options: "small" | "medium" | "large" (also supports "sm" | "md" | "lg").
   * Default: "medium".
   */
  size?: TAZButtonSize;
  children?: ReactNode;
}

export type AZButtonProps = TAZButtonProps;

const sizeClasses: Record<TAZButtonSize, string> = {
  small: "btn-sm text-xs px-3.5 py-1.5 min-h-8 h-8 rounded-lg gap-1.5",
  sm: "btn-sm text-xs px-3.5 py-1.5 min-h-8 h-8 rounded-lg gap-1.5",
  medium: "btn-md text-sm px-5 py-2.5 min-h-10 h-10 rounded-xl gap-2",
  md: "btn-md text-sm px-5 py-2.5 min-h-10 h-10 rounded-xl gap-2",
  large: "btn-lg text-base px-7 py-3.5 min-h-12 h-12 rounded-xl gap-2.5",
  lg: "btn-lg text-base px-7 py-3.5 min-h-12 h-12 rounded-xl gap-2.5",
};

/**
 * Reusable AZButton component used throughout the Amarzone application.
 * Size is customizable ("small" | "medium" | "large").
 */
const AZButton = ({
  children,
  size = "medium",
  className = "",
  type = "button",
  disabled = false,
  ...rest
}: TAZButtonProps) => {
  const selectedSize = size && sizeClasses[size] ? size : "medium";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`btn border-0 inline-flex items-center justify-center font-bold tracking-wide select-none transition-all duration-200 active:scale-95 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer ${sizeClasses[selectedSize]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export default AZButton;
