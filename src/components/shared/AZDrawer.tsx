"use client";

import React, { useEffect, useId, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const emptySubscribe = () => () => {};

export interface AZDrawerProps {
  isOpen: boolean;
  onClose: () => void;

  /** Unique ID for the DaisyUI drawer-toggle checkbox */
  id?: string;

  /** Slide direction: left (default) or right (DaisyUI drawer-end) */
  position?: "left" | "right";

  /** Preset max-width sizes */
  size?: "sm" | "md" | "lg" | "xl" | "full";

  /** Built-in header props (ignored if custom `header` is provided) */
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  showCloseButton?: boolean;

  /** Optional completely custom header slot */
  header?: React.ReactNode;

  children: React.ReactNode;
  footer?: React.ReactNode;

  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  theme?: "light" | "dark";

  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  overlayClassName?: string;
}

const SIZE_CLASSES: Record<NonNullable<AZDrawerProps["size"]>, string> = {
  sm: "max-w-xs sm:max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-full",
};

const AZDrawer: React.FC<AZDrawerProps> = ({
  isOpen,
  onClose,
  id,
  position = "left",
  size = "md",
  title,
  description,
  icon,
  showCloseButton = true,
  header,
  children,
  footer,
  closeOnBackdropClick = true,
  closeOnEsc = true,
  theme = "light",
  className = "",
  headerClassName = "",
  contentClassName = "",
  overlayClassName = "",
}) => {
  const reactId = useId();
  const drawerId = id || `az-drawer-${reactId}`;

  // Hydration-safe client mount check without setState inside useEffect
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Lock background page scroll while drawer is open
  useEffect(() => {
    if (!isOpen || !mounted) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isOpen, mounted]);

  // Close drawer on Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc, onClose]);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const drawerMarkup = (
    <div
      role={isOpen ? "dialog" : undefined}
      aria-modal={isOpen ? "true" : undefined}
      className={`drawer ${
        position === "right" ? "drawer-end" : ""
      } fixed inset-0 pointer-events-none z-[9999] select-auto`}
    >
      {/* DaisyUI Drawer Toggle */}
      <input
        id={drawerId}
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        onChange={(e) => {
          if (!e.target.checked) {
            onClose();
          }
        }}
      />

      {/* DaisyUI Drawer Side (Backdrop Overlay + Sliding Panel) */}
      <div className="drawer-side z-[9999] h-dvh overflow-hidden">
        {/* DaisyUI Backdrop Overlay */}
        <label
          htmlFor={closeOnBackdropClick ? drawerId : undefined}
          aria-label="Close drawer"
          onClick={(e) => {
            if (!closeOnBackdropClick) {
              e.preventDefault();
            }
          }}
          className={`drawer-overlay backdrop-blur-[2px] ${overlayClassName}`}
        />

        {/* Sliding Drawer Container */}
        <aside
          className={`h-full w-full ${SIZE_CLASSES[size]} flex flex-col overflow-hidden shadow-2xl ${
            isDark
              ? "bg-[#170d2f] text-white"
              : "bg-white text-slate-900"
          } ${
            position === "right"
              ? isDark
                ? "border-l border-white/10"
                : "border-l border-slate-200"
              : isDark
                ? "border-r border-white/10"
                : "border-r border-slate-200"
          } ${className}`}
        >
          {/* Header */}
          {header !== undefined ? (
            header
          ) : title || description || icon || showCloseButton ? (
            <div
              className={`flex items-center justify-between px-4 py-3 border-b shrink-0 ${
                isDark
                  ? "bg-[#170d2f] border-white/10 text-white"
                  : "bg-white border-slate-200 text-slate-900"
              } ${headerClassName}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {icon && <div className="shrink-0">{icon}</div>}
                <div className="min-w-0">
                  {title && (
                    <h2 className="text-[17px] font-bold tracking-tight truncate">
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p
                      className={`text-xs mt-0.5 truncate ${
                        isDark ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {description}
                    </p>
                  )}
                </div>
              </div>

              {showCloseButton && (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close drawer"
                  title="Close"
                  className={`btn btn-sm btn-circle btn-ghost shrink-0 cursor-pointer transition-colors ${
                    isDark
                      ? "text-white/80 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ) : null}

          {/* Scrollable Body */}
          <div className={`flex-1 min-h-0 overflow-y-auto ${contentClassName}`}>
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div
              className={`shrink-0 border-t px-4 py-3 ${
                isDark
                  ? "border-white/10 bg-[#170d2f]"
                  : "border-slate-200 bg-white"
              }`}
            >
              {footer}
            </div>
          )}
        </aside>
      </div>
    </div>
  );

  return createPortal(drawerMarkup, document.body);
};

export default AZDrawer;
