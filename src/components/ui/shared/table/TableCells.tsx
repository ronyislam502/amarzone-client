"use client";

import React from "react";
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  Truck,
  PackageCheck,
} from "lucide-react";
import { TColumn } from "@/src/types/table";

/* -------------------------------------------------------------------------- */
/*                               DESIGN TOKENS                                */
/* -------------------------------------------------------------------------- */

export const TABLE_TYPOGRAPHY = {
  primaryTitle: "font-extrabold text-xs text-white",
  subtitle: "text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5",
  bodyText: "text-xs text-slate-300 font-medium flex items-center gap-1.5",
  monoText: "font-mono text-xs font-bold",
  badge: "badge badge-sm font-bold gap-1 text-[10px] uppercase tracking-wider",
  actionBtn: "btn btn-ghost btn-xs font-bold gap-1 rounded-lg cursor-pointer transition-all border",
} as const;

/* -------------------------------------------------------------------------- */
/*                            1. TABLE CELL ENTITY                            */
/* -------------------------------------------------------------------------- */

export interface TableCellEntityProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  subtitleIcon?: React.ReactNode;
  icon?: React.ReactNode;
  avatar?: string | null;
  avatarFallback?: string;
  image?: string | null;
  badge?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TableCellEntity: React.FC<TableCellEntityProps> = ({
  title,
  subtitle,
  subtitleIcon,
  icon,
  avatar,
  avatarFallback,
  image,
  badge,
  className = "",
  onClick,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 max-w-sm ${
        isClickable ? "cursor-pointer group" : ""
      } ${className}`}
    >
      {/* Visual Representation: Image / Avatar / Icon */}
      {(image || avatar) ? (
        <div className="w-10 h-10 rounded-xl bg-slate-900/80 border border-white/15 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
          <img
            src={(image || avatar) as string}
            alt={typeof title === "string" ? title : "Avatar"}
            className="w-full h-full object-cover"
          />
          {badge && <div className="absolute top-1 right-1 z-10">{badge}</div>}
        </div>
      ) : avatarFallback ? (
        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 shadow-sm font-extrabold text-xs">
          {avatarFallback}
        </div>
      ) : icon ? (
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
          {icon}
        </div>
      ) : null}

      {/* Typography: Title & Subtitle */}
      <div className="min-w-0">
        <div
          className={`${TABLE_TYPOGRAPHY.primaryTitle} ${
            isClickable ? "group-hover:text-amber-300 transition-colors" : ""
          } flex items-center gap-1.5`}
        >
          <span className="truncate">{title}</span>
          {(!image && !avatar && badge) && <div>{badge}</div>}
        </div>

        {subtitle && (
          <div className={TABLE_TYPOGRAPHY.subtitle}>
            {subtitleIcon && <span className="shrink-0">{subtitleIcon}</span>}
            <span className="truncate">{subtitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                            2. TABLE CELL STATUS                            */
/* -------------------------------------------------------------------------- */

export type TStatusVariant = "success" | "danger" | "warning" | "info" | "neutral";

export interface TableCellStatusProps {
  status?: string | boolean | null;
  label?: string;
  variant?: TStatusVariant;
  icon?: React.ReactNode;
  className?: string;
}

export const TableCellStatus: React.FC<TableCellStatusProps> = ({
  status,
  label,
  variant,
  icon,
  className = "",
}) => {
  // Infer variant and text from status value
  let resolvedVariant: TStatusVariant = "neutral";
  let resolvedLabel = label || "";
  let resolvedIcon = icon;

  if (typeof status === "boolean") {
    // If status is a boolean (e.g., isDeleted or isActive)
    if (status) {
      resolvedVariant = "danger";
      resolvedLabel = label || "Inactive";
      resolvedIcon = icon || <AlertTriangle className="w-3 h-3" />;
    } else {
      resolvedVariant = "success";
      resolvedLabel = label || "Active";
      resolvedIcon = icon || <CheckCircle2 className="w-3 h-3" />;
    }
  } else if (typeof status === "string") {
    const s = status.toUpperCase();
    resolvedLabel = label || status;

    if (["ACTIVE", "DELIVERED", "COMPLETED", "AUTHORIZED", "PAID", "VERIFIED"].includes(s)) {
      resolvedVariant = "success";
      resolvedIcon = icon || <CheckCircle2 className="w-3 h-3" />;
    } else if (["INACTIVE", "DELETED", "CANCELLED", "REVOKED", "SUSPENDED", "FAILED"].includes(s)) {
      resolvedVariant = "danger";
      resolvedIcon = icon || <XCircle className="w-3 h-3" />;
    } else if (["PENDING", "PROCESSING", "IN_PROGRESS", "REVIEW", "ON_HOLD"].includes(s)) {
      resolvedVariant = "warning";
      resolvedIcon = icon || <Clock className="w-3 h-3" />;
    } else if (["SHIPPED", "IN_TRANSIT", "DISPATCHED"].includes(s)) {
      resolvedVariant = "info";
      resolvedIcon = icon || <Truck className="w-3 h-3" />;
    } else if (["PLACED", "CONFIRMED"].includes(s)) {
      resolvedVariant = "info";
      resolvedIcon = icon || <PackageCheck className="w-3 h-3" />;
    }
  }

  // Explicit prop overrides
  if (variant) resolvedVariant = variant;
  if (label) resolvedLabel = label;
  if (icon !== undefined) resolvedIcon = icon;

  const variantStyles: Record<TStatusVariant, string> = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    neutral: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  };

  return (
    <span
      className={`${TABLE_TYPOGRAPHY.badge} ${variantStyles[resolvedVariant]} ${className}`}
    >
      {resolvedIcon && <span className="shrink-0">{resolvedIcon}</span>}
      <span>{resolvedLabel}</span>
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/*                             3. TABLE CELL DATE                             */
/* -------------------------------------------------------------------------- */

export interface TableCellDateProps {
  date?: string | number | Date | null;
  formatOptions?: Intl.DateTimeFormatOptions;
  icon?: React.ReactNode;
  subtext?: string;
  className?: string;
}

const DEFAULT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export const TableCellDate: React.FC<TableCellDateProps> = ({
  date,
  formatOptions = DEFAULT_DATE_FORMAT,
  icon = <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />,
  subtext,
  className = "",
}) => {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-US", formatOptions)
    : "N/A";

  return (
    <div className={`space-y-0.5 ${className}`}>
      <div className={TABLE_TYPOGRAPHY.bodyText}>
        {icon}
        <span>{formattedDate}</span>
      </div>
      {subtext && (
        <div className="text-[10px] text-slate-500 pl-5">{subtext}</div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                             4. TABLE CELL TEXT                             */
/* -------------------------------------------------------------------------- */

export interface TableCellTextProps {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  icon?: React.ReactNode;
  secondaryIcon?: React.ReactNode;
  badge?: React.ReactNode;
  mono?: boolean;
  className?: string;
}

export const TableCellText: React.FC<TableCellTextProps> = ({
  primary,
  secondary,
  icon,
  secondaryIcon,
  badge,
  mono = false,
  className = "",
}) => {
  return (
    <div className={`space-y-0.5 max-w-[220px] ${className}`}>
      <div
        className={`${
          mono ? TABLE_TYPOGRAPHY.monoText : TABLE_TYPOGRAPHY.bodyText
        } flex items-center gap-1.5`}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{primary}</span>
        {badge && <div className="shrink-0 ml-1">{badge}</div>}
      </div>

      {secondary && (
        <div className={TABLE_TYPOGRAPHY.subtitle}>
          {secondaryIcon && <span className="shrink-0">{secondaryIcon}</span>}
          <span className="truncate">{secondary}</span>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                            5. TABLE CELL PRICE                             */
/* -------------------------------------------------------------------------- */

export interface TableCellPriceProps {
  amount?: number | string | null;
  currency?: string;
  variant?: "emerald" | "amber" | "white";
  subtext?: string;
  className?: string;
}

export const TableCellPrice: React.FC<TableCellPriceProps> = ({
  amount,
  currency = "$",
  variant = "emerald",
  subtext,
  className = "",
}) => {
  const formatted =
    typeof amount === "number"
      ? amount.toFixed(2)
      : typeof amount === "string"
      ? parseFloat(amount).toFixed(2)
      : "0.00";

  const colorStyles = {
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    white: "text-white",
  };

  return (
    <div className={`space-y-0.5 ${className}`}>
      <div className={`${TABLE_TYPOGRAPHY.monoText} ${colorStyles[variant]}`}>
        {currency}
        {formatted}
      </div>
      {subtext && (
        <div className="text-[10px] text-slate-500 font-mono">{subtext}</div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                           6. ACTIONS & BUTTONS                             */
/* -------------------------------------------------------------------------- */

export type TActionVariant = "amber" | "rose" | "sky" | "emerald" | "neutral";

export interface TableActionButtonProps {
  label?: string;
  icon?: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  variant?: TActionVariant;
  title?: string;
  disabled?: boolean;
  className?: string;
}

export const TableActionButton: React.FC<TableActionButtonProps> = ({
  label,
  icon,
  onClick,
  variant = "amber",
  title,
  disabled = false,
  className = "",
}) => {
  const variantStyles: Record<TActionVariant, string> = {
    amber:
      "text-amber-400 hover:bg-amber-400/10 border-amber-400/20 hover:border-amber-400/40",
    rose:
      "text-rose-400 hover:bg-rose-500/10 border-rose-500/20 hover:border-rose-500/40",
    sky:
      "text-sky-400 hover:bg-sky-500/10 border-sky-500/20 hover:border-sky-500/40",
    emerald:
      "text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40",
    neutral:
      "text-slate-300 hover:bg-white/10 border-white/10 hover:border-white/20",
  };

  return (
    <button
      type="button"
      title={title || label}
      disabled={disabled}
      onClick={onClick}
      className={`${TABLE_TYPOGRAPHY.actionBtn} ${variantStyles[variant]} ${className}`}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
};

export interface TableCellActionsProps {
  children?: React.ReactNode;
  actions?: TableActionButtonProps[];
  align?: "left" | "center" | "right";
  className?: string;
}

export const TableCellActions: React.FC<TableCellActionsProps> = ({
  children,
  actions,
  align = "right",
  className = "",
}) => {
  const alignClass =
    align === "center"
      ? "justify-center"
      : align === "left"
      ? "justify-start"
      : "justify-end";

  return (
    <div className={`flex items-center gap-1.5 ${alignClass} ${className}`}>
      {actions?.map((act, idx) => (
        <TableActionButton key={idx} {...act} />
      ))}
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/*                      7. UNIVERSAL COLUMN BUILDERS                          */
/* -------------------------------------------------------------------------- */

/**
 * Universal column builder for primary entity cells (name, icon/avatar, subtitle)
 */
export function createEntityColumn<T>(config: {
  header: React.ReactNode;
  title: (item: T) => React.ReactNode;
  subtitle?: (item: T) => React.ReactNode;
  subtitleIcon?: (item: T) => React.ReactNode;
  icon?: (item: T) => React.ReactNode;
  avatar?: (item: T) => string | null | undefined;
  avatarFallback?: (item: T) => string | undefined;
  image?: (item: T) => string | null | undefined;
  badge?: (item: T) => React.ReactNode;
  onClick?: (item: T) => void;
  align?: "left" | "center" | "right";
  className?: string;
}): TColumn<T> {
  return {
    header: config.header,
    align: config.align || "left",
    className: config.className,
    accessor: (item) => (
      <TableCellEntity
        title={config.title(item)}
        subtitle={config.subtitle ? config.subtitle(item) : undefined}
        subtitleIcon={config.subtitleIcon ? config.subtitleIcon(item) : undefined}
        icon={config.icon ? config.icon(item) : undefined}
        avatar={config.avatar ? config.avatar(item) : undefined}
        avatarFallback={config.avatarFallback ? config.avatarFallback(item) : undefined}
        image={config.image ? config.image(item) : undefined}
        badge={config.badge ? config.badge(item) : undefined}
        onClick={config.onClick ? () => config.onClick!(item) : undefined}
      />
    ),
  };
}

/**
 * Universal column builder for status badges (active/inactive, order status, etc.)
 */
export function createStatusColumn<T>(config: {
  header?: React.ReactNode;
  status: (item: T) => string | boolean | null | undefined;
  label?: (item: T) => string | undefined;
  variant?: (item: T) => TStatusVariant | undefined;
  icon?: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}): TColumn<T> {
  return {
    header: config.header || "Status",
    align: config.align || "left",
    className: config.className,
    accessor: (item) => (
      <TableCellStatus
        status={config.status(item)}
        label={config.label ? config.label(item) : undefined}
        variant={config.variant ? config.variant(item) : undefined}
        icon={config.icon ? config.icon(item) : undefined}
      />
    ),
  };
}

/**
 * Universal column builder for timestamps & dates
 */
export function createDateColumn<T>(config: {
  header?: React.ReactNode;
  date: (item: T) => string | number | Date | null | undefined;
  subtext?: (item: T) => string | undefined;
  formatOptions?: Intl.DateTimeFormatOptions;
  icon?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}): TColumn<T> {
  return {
    header: config.header || "Created At",
    align: config.align || "left",
    className: config.className,
    accessor: (item) => (
      <TableCellDate
        date={config.date(item)}
        subtext={config.subtext ? config.subtext(item) : undefined}
        formatOptions={config.formatOptions}
        icon={config.icon}
      />
    ),
  };
}

/**
 * Universal column builder for generic info/text cells
 */
export function createTextColumn<T>(config: {
  header: React.ReactNode;
  primary: (item: T) => React.ReactNode;
  secondary?: (item: T) => React.ReactNode;
  icon?: (item: T) => React.ReactNode;
  secondaryIcon?: (item: T) => React.ReactNode;
  badge?: (item: T) => React.ReactNode;
  mono?: boolean;
  align?: "left" | "center" | "right";
  className?: string;
}): TColumn<T> {
  return {
    header: config.header,
    align: config.align || "left",
    className: config.className,
    accessor: (item) => (
      <TableCellText
        primary={config.primary(item)}
        secondary={config.secondary ? config.secondary(item) : undefined}
        icon={config.icon ? config.icon(item) : undefined}
        secondaryIcon={config.secondaryIcon ? config.secondaryIcon(item) : undefined}
        badge={config.badge ? config.badge(item) : undefined}
        mono={config.mono}
      />
    ),
  };
}

/**
 * Universal column builder for price / monetary values
 */
export function createPriceColumn<T>(config: {
  header: React.ReactNode;
  amount: (item: T) => number | string | null | undefined;
  currency?: string;
  variant?: "emerald" | "amber" | "white";
  subtext?: (item: T) => string | undefined;
  align?: "left" | "center" | "right";
  className?: string;
}): TColumn<T> {
  return {
    header: config.header,
    align: config.align || "left",
    className: config.className,
    accessor: (item) => (
      <TableCellPrice
        amount={config.amount(item)}
        currency={config.currency}
        variant={config.variant}
        subtext={config.subtext ? config.subtext(item) : undefined}
      />
    ),
  };
}

/**
 * Universal column builder for actions (Edit, View, Delete)
 */
export function createActionsColumn<T>(config: {
  header?: React.ReactNode;
  actions: (item: T) => TableActionButtonProps[];
  align?: "left" | "center" | "right";
  className?: string;
}): TColumn<T> {
  return {
    header: config.header || "Actions",
    align: config.align || "right",
    className: config.className,
    accessor: (item) => (
      <TableCellActions align={config.align || "right"} actions={config.actions(item)} />
    ),
  };
}
