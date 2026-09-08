"use client";

import React from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  footer?: React.ReactNode;
  closeOnBackdropClick?: boolean;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  showCloseButton = true,
  footer,
  closeOnBackdropClick = true,
  className = "",
}: ModalProps) => {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    full: "max-w-5xl",
  };

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""} z-50`}>
      <div
        className={`modal-box ${sizeClasses[size]} bg-base-100 border border-base-200 shadow-2xl relative p-6 ${className}`}
      >
        {/* Close Button */}
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3 text-base-content/60 hover:text-base-content"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Modal Header */}
        {title && (
          <div className="font-extrabold text-base border-b border-base-200 pb-3 pr-8 flex items-center gap-2 text-base-content">
            {title}
          </div>
        )}

        {/* Modal Content Body */}
        <div className="pt-3">{children}</div>

        {/* Modal Actions Footer */}
        {footer && (
          <div className="modal-action border-t border-base-200 pt-3 mt-4">
            {footer}
          </div>
        )}
      </div>

      {/* Backdrop Overlay */}
      {closeOnBackdropClick && (
        <div
          className="modal-backdrop bg-slate-950/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        ></div>
      )}
    </div>
  );
};

export default Modal;
