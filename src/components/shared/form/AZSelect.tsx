"use client";

import { ChangeEvent, ReactNode } from "react";
import { useFormContext } from "react-hook-form";


export type TAZSelectOption = {
  value?: string;
  key?: string;
  label: string;
  disabled?: boolean;
};

export type TAZSelectProps = {
  name: string;
  label?: ReactNode;
  icon?: ReactNode;
  options?: TAZSelectOption[];
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  selectClassName?: string;
};


const AZSelect = ({
  name,
  label,
  icon,
  options,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  className = "",
  selectClassName = "",
}: TAZSelectProps) => {
  const {
    register,
    formState: { errors },
  } = (useFormContext() || { formState: { errors: {} } }) as any;

  const activeError = errors?.[name]?.message as string | undefined;

  const registerProps =
    register && value === undefined ? register(name) : {};

  return (
    <div className="form-control w-full">
      {label && (
        <label className="label py-1">
          <span className="text-[16px] font-bold text-warning flex items-center gap-1.5">
            {icon && <span className="shrink-0">{icon}</span>}
            {label}
          </span>
        </label>
      )}

      <select
        {...registerProps}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        defaultValue={value === undefined ? "" : undefined}
        className={`select select-bordered w-full rounded-xl bg-[#120824] py-4 font-medium transition-all duration-200 focus:outline-none ${activeError
          ? "select-error"
          : "border-warning hover:border-primary focus:border-primary"
          } ${selectClassName} ${className}`}
      >
        {!options?.some((opt) => (opt.value ?? opt.key ?? "") === "") && (
          <option value="" disabled={required} className="bg-[#120824] text-gray-500">
            {placeholder || `Select ${label || "option"}`}
          </option>
        )}
        {options?.map((option, idx) => {
          const optValue = option.value ?? option.key ?? "";
          const optKey = option.key ?? option.value ?? `opt-${idx}`;
          return (
            <option
              key={optKey}
              value={optValue}
              disabled={option.disabled}
              className="bg-[#120824] text-white"

            >
              {option.label}
            </option>
          );
        })}
      </select>

      {activeError && (
        <p className="text-error text-[10px] font-bold mt-1 tracking-wide">
          {activeError}
        </p>
      )}
    </div>
  );
};

export default AZSelect;
