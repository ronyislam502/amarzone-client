
import { useFormContext } from "react-hook-form";
import { ReactNode, InputHTMLAttributes } from "react";
import { TInput } from "@/types/global";

interface IProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "type">, Partial<Omit<TInput, "size">> {
    name?: string;
    icon?: ReactNode;
    inputClassName?: string;
    size?: "sm" | "md" | "lg" | number;
    type?: string;
}

const AZInput = ({
    name,
    label,
    type = "text",
    placeholder = "",
    disabled,
    icon,
    inputClassName,
    value,
    onChange,
    variant,
    size,
    ...props
}: IProps) => {
    const methods = useFormContext();

    const registerProps = methods && name ? methods.register(name, type === "number" ? { valueAsNumber: true } : {}) : {};
    const errors = methods?.formState?.errors;

    return (
        <div className="w-full">
            {label && (
                <label className="label mb-1">
                    <span className="text-md font-black text-warning uppercase tracking-widest italic group-hover:text-blue-400 transition-colors duration-300">
                        {label}
                    </span>
                </label>
            )}
            <div className="relative group w-full">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-success group-focus-within:text-blue-400 transition-colors duration-300">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...(value !== undefined ? { value } : {})}
                    {...(onChange ? { onChange } : {})}
                    {...registerProps}
                    {...props}
                    className={
                        inputClassName ||
                        `w-full bg-warning/5 border border-warning/50 rounded-2xl py-4
            ${icon ? "pl-12" : "px-6"} pr-6
            text-white font-bold placeholder:text-gray-500 outline-none
            hover:border-blue-500/40 hover:bg-blue-500/5
            focus:border-blue-500/60 focus:bg-blue-500/8
            transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed`
                    }
                />
            </div>
            {name && errors && errors[name] && (
                <p className="text-error text-[10px] font-bold mt-2 uppercase tracking-wide">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    );
};

export default AZInput;

