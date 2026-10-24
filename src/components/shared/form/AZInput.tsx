"use client";

import { ChangeEvent, ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { X } from "lucide-react";
import { TInput } from "@/types/global";

export type TAZInputProps = Omit<Partial<TInput>, "label" | "size"> & {
  name: string;
  label?: ReactNode;
  icon?: ReactNode;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  required?: boolean;
  className?: string;
  inputClassName?: string;
};

const AZInput = ({
  name,
  label,
  icon,
  type = "text",
  placeholder = "",
  value,
  onChange,
  disabled = false,
  clearable = false,
  onClear,
  required = false,
  className = "",
  inputClassName = "",
}: TAZInputProps) => {
  const {
    register,
    formState: { errors },
  } = (useFormContext() || { formState: { errors: {} } }) as any;

  const activeError = errors?.[name]?.message as string | undefined;

  const registerProps =
    register && value === undefined
      ? register(name, type === "number" ? { valueAsNumber: true } : {})
      : {};

  return (
    <div className="form-control w-full">
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
          required={required}
          value={value}
          onChange={onChange}
          className={`input input-bordered w-full rounded-xl py-4 font-medium bg-[#120824] transition-all duration-200 focus:outline-none ${activeError
            ? "input-error"
            : "border-warning hover:border-primary focus:border-primary"
            } ${icon ? "pl-11" : ""} ${clearable && value ? "pr-10" : ""} ${inputClassName} ${className}`}
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
