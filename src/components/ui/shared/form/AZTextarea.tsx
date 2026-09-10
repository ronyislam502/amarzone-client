"use client";

import { ChangeEvent, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { TInput } from "@/src/types/global";

export type TAZTextareaProps = Partial<TInput> & {
  name: string;
  label?: ReactNode;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  rows?: number;
  className?: string;
  textareaClassName?: string;
  containerClassName?: string;
  error?: string;
};

const AZTextarea = ({
  name,
  label,
  placeholder = "",
  value,
  onChange,
  onValueChange,
  disabled = false,
  rows,
  className = "",
  textareaClassName = "",
  containerClassName = "",
  error,
}: TAZTextareaProps) => {
  let formContext: any = null;
  try {
    formContext = useFormContext();
  } catch {
    formContext = null;
  }

  const isRHF = Boolean(formContext && name && value === undefined);
  const rhfError = isRHF && name ? formContext?.formState?.errors?.[name]?.message : undefined;
  const activeError = error || (typeof rhfError === "string" ? rhfError : undefined);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
            {label}
          </span>
        </label>
      )}
      <textarea
        {...registerProps}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        onChange={handleChange}
        rows={rows}
        className={`textarea textarea-bordered w-full rounded-xl p-4 font-medium transition-all duration-200 focus:outline-none min-h-[120px] ${
          activeError
            ? "textarea-error"
            : "border-warning hover:border-primary focus:border-primary"
        } ${textareaClassName} ${className}`}
      />
      {activeError && (
        <p className="text-error text-[10px] font-bold mt-1 tracking-wide">
          {activeError}
        </p>
      )}
    </div>
  );
};

export default AZTextarea;
