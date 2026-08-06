
"use client";

import { TInput } from "@/types/global";
import { useFormContext } from "react-hook-form";

interface IProps extends Partial<TInput> {
    name?: string;
    label?: string;
    options: {
        key: string;
        label: string;
    }[];
    className?: string;
    selectClassName?: string;
    value?: string;
    defaultValue?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const AZSelect = ({
    name = "",
    label,
    options,
    className,
    selectClassName,
    value,
    defaultValue,
    onChange,
    placeholder,
    disabled,
}: IProps) => {
    const formContext = useFormContext();
    const isFormContextAvailable = !!(formContext && name);

    const registerProps = isFormContextAvailable ? formContext.register(name) : undefined;
    const errors = isFormContextAvailable ? formContext.formState.errors : {};
    const errorMsg = name && errors[name]?.message ? (errors[name]?.message as string) : null;

    const defaultContainerClass = label ? "form-control w-full" : "h-full flex items-center";
    const defaultSelectClass = label
        ? `w-full bg-success/5 border rounded-2xl px-6 py-4
          text-white font-bold outline-none
          hover:border-blue-500/40 hover:bg-blue-500/5
          focus:border-blue-500/60 focus:bg-blue-500/8
          transition-all duration-300 appearance-none cursor-pointer
          ${errorMsg ? "border-red-500/40" : "border-success/30"}
        `
        : "h-full bg-transparent text-[#333] text-[12px] pr-4 cursor-pointer focus:outline-none appearance-none font-normal";

    return (
        <div className={className !== undefined ? className : defaultContainerClass}>
            {label && (
                <label className="label mb-1">
                    <span className="text-[9px] font-black text-success uppercase tracking-widest italic">
                        {label}
                    </span>
                </label>
            )}
            <select
                {...(registerProps || {})}
                disabled={disabled}
                {...(value !== undefined ? { value } : {})}
                {...(defaultValue !== undefined ? { defaultValue } : {})}
                onChange={(e) => {
                    if (onChange) onChange(e);
                    if (registerProps?.onChange) registerProps.onChange(e);
                }}
                className={selectClassName !== undefined ? selectClassName : defaultSelectClass}
            >
                {placeholder && (
                    <option value="" disabled className="bg-[#0a0a0a] text-gray-500">
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option.key} value={option.key} className="bg-white text-black">
                        {option.label}
                    </option>
                ))}
            </select>
            {errorMsg && (
                <p className="text-error text-[10px] font-bold mt-2 uppercase tracking-wide">
                    {errorMsg}
                </p>
            )}
        </div>
    );
};

export default AZSelect;
