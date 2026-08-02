
import { useFormContext } from "react-hook-form";
import { ReactNode } from "react";
import { TInput } from "@/types/global";

interface IProps extends TInput {
    icon?: ReactNode;
}

const AZInput = ({
    name,
    label,
    type = "text",
    placeholder = "",
    disabled,
    icon,
}: IProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="form-control w-full">
            <label className="label mb-1">
                <span className="text-[9px] font-black text-success uppercase tracking-widest italic group-hover:text-blue-400 transition-colors duration-300">
                    {label}
                </span>
            </label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-success group-focus-within:text-blue-400 transition-colors duration-300">
                        {icon}
                    </div>
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...register(name, type === "number" ? { valueAsNumber: true } : {})}
                    className="w-full bg-success/5 border border-success/30 rounded-2xl py-4"
                />
            </div>
            {errors[name] && (
                <p className="text-error text-[10px] font-bold mt-2 uppercase tracking-wide">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    );
};

export default AZInput;
