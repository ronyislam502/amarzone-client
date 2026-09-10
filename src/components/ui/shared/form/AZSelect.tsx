"use client";

import { ChangeEvent, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { TInput } from "@/src/types/global";

export type TAZSelectOption = {
  key?: string;
  value?: string;
  label: string;
  disabled?: boolean;
};

export type TAZSelectProps = Partial<TInput> & {
  name: string;
  label?: ReactNode;
  icon?: ReactNode;
  options?: TAZSelectOption[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  selectClassName?: string;
  containerClassName?: string;
  error?: string;
};

const sizeClasses = {
  xs: "select-xs text-xs",
  sm: "select-sm text-xs",
  md: "select-md text-sm",
  lg: "select-lg text-base",
};

const AZSelect = ({
  name,
  label,
  icon,
  options = [],
  value,
  onChange,
  onValueChange,
  placeholder,
  disabled = false,
  size = "lg",
  className = "",
  selectClassName = "",
  containerClassName = "",
  error,
}: TAZSelectProps) => {
  // Check if inside React Hook Form
  let formContext: any = null;
  try {
    formContext = useFormContext();
  } catch {
    formContext = null;
  }

  const isRHF = Boolean(formContext && name && value === undefined);
  const rhfError = isRHF && name ? formContext?.formState?.errors?.[name]?.message : undefined;
  const activeError = error || (typeof rhfError === "string" ? rhfError : undefined);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  const registerProps = isRHF && name ? formContext.register(name) : {};

  return (
    <div className={`form-control w-full ${containerClassName}`}>
      {label && (
        <label className="label py-1">
          <span className="text-[16px] font-bold text-warning flex items-center gap-1.5">
            {icon && <span className="shrink-0">{icon}</span>}
            {label}
          </span>
        </label>
      )}

      <div className="relative w-full">
        <select
          {...registerProps}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          className={`select select-bordered w-full rounded-xl font-medium transition-all duration-200 focus:outline-none ${
            activeError
              ? "select-error"
              : "border-warning hover:border-primary focus:border-primary"
          } ${sizeClasses[size]} ${selectClassName} ${className}`}
        >
          {placeholder && (
            <option value="">
              {placeholder}
            </option>
          )}

          {options.map((opt, idx) => {
            const optVal =
              opt.value !== undefined
                ? opt.value
                : opt.key !== undefined
                  ? opt.key
                  : "";
            return (
              <option
                key={opt.key || opt.value || `opt-${idx}`}
                value={optVal}
                disabled={opt.disabled}
              >
                {opt.label}
              </option>
            );
          })}
        </select>
      </div>

      {activeError && (
        <p className="text-error text-[10px] font-bold mt-1 tracking-wide">
          {activeError}
        </p>
      )}
    </div>
  );
};

export default AZSelect;
