"use client";

import { ChangeEvent, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { TInput } from "@/src/types/global";

export type TAZInputProps = Partial<TInput> & {
  name: string;
  label?: ReactNode;
  icon?: ReactNode;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  inputClassName?: string;
  containerClassName?: string;
  error?: string;
  clearable?: boolean;
  onClear?: () => void;
};

const sizeClasses = {
  xs: "input-xs text-xs",
  sm: "input-sm text-xs",
  md: "input-md text-sm",
  lg: "input-lg text-base",
};

const AZInput = ({
  name,
  label,
  icon,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onValueChange,
  disabled = false,
  size = "lg",
  className = "",
  inputClassName = "",
  containerClassName = "",
  error,
  clearable = false,
  onClear,
}: TAZInputProps) => {
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e);
    }
    if (onValueChange) {
      onValueChange(e.target.value);
    }
  };

  const registerProps =
    isRHF && name
      ? formContext.register(name, type === "number" ? { valueAsNumber: true } : {})
      : {};

  return (
    <div className={`form-control w-full ${containerClassName}`}>
      {label && (
        <label className="label py-1">
          <span className="text-[16px] font-bold text-warning flex items-center gap-1.5">
            {label}
          </span>
        </label>
      )}

      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-warning pointer-events-none flex items-center justify-center">
            {icon}
          </div>
        )}

        <input
          {...registerProps}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          className={`input input-bordered w-full rounded-xl py-4 font-medium transition-all duration-200 focus:outline-none ${
            activeError
              ? "input-error"
              : "border-warning hover:border-primary focus:border-primary"
          } ${icon ? "pr-12" : "pr-6"} ${
            clearable && value ? "pr-12" : "pr-6"
          } ${sizeClasses[size]} ${inputClassName} ${className}`}
        />

        {clearable && value && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {activeError && (
        <p className="text-error text-[10px] font-bold mt-1 tracking-wide">
          {activeError}
        </p>
      )}
    </div>
  );
};

export default AZInput;
