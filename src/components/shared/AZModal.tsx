"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;

  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;

  children: React.ReactNode;

  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  className?: string;
  contentClassName?: string;
}

const AZModal = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  size = "md",
  showCloseButton = true,
  footer,
  closeOnBackdropClick = true,
  className = "",
  contentClassName = "",
}: ModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen && mounted) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isOpen, mounted]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted || !isOpen) return null;

  const sizeClasses: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-6xl",
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto animate-fadeIn select-auto"
    >
      {/* Dimmed Backdrop covering entire window above all headers */}
      <div
        className="fixed inset-0 bg-[#060913]/92 backdrop-blur-md transition-opacity cursor-pointer"
        onClick={closeOnBackdropClick ? onClose : undefined}
      />

      {/* Modal Box */}
      <div
        className={`relative z-10 w-full ${sizeClasses[size] || "max-w-lg"} max-h-[calc(100dvh-2.5rem)] sm:max-h-[calc(100dvh-3.5rem)] my-auto flex flex-col overflow-hidden bg-[#170d2f] border border-white/10 text-white shadow-[0_25px_80px_-15px_rgba(0,0,0,0.95)] rounded-2xl sm:rounded-3xl p-5 sm:p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Accent */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-30" />

        {/* Ambient Background Glow */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-gradient-to-tl from-indigo-600/20 via-purple-700/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        {/* Dot Grid Overlay */}
        <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

        {/* Close Button */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="btn btn-sm btn-circle btn-ghost absolute right-3.5 top-3.5 text-slate-400 hover:text-white hover:bg-white/10 z-40 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header */}
        {(icon || title || description) && (
          <div className="relative z-20 border-b border-white/10 pb-3.5 pr-10 shrink-0">
            <div className="flex items-center gap-3">
              {/* Icon */}
              {icon && (
                <div className="shrink-0 p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                  {icon}
                </div>
              )}

              {/* Title + Description */}
              <div className="min-w-0">
                {title && (
                  <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                    {title}
                  </h3>
                )}

                {description && (
                  <p className="text-[11px] sm:text-xs font-medium text-slate-400 mt-0.5 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Container - Scrollable if content exceeds modal height */}
        <div className={`relative z-10 flex-1 min-h-0 ${contentClassName || "overflow-y-auto overflow-x-hidden"}`}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="pt-3.5 mt-3 border-t border-white/10 flex items-center justify-end gap-2.5 relative z-20 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default AZModal;