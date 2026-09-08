
import { TInput } from "@/src/types/global";
import { useFormContext } from "react-hook-form";

type TProps = TInput & {
    options?: {
        key: string;
        label: string;
    }[];
}

const AZSelect = ({ name, label, options, disabled, placeholder }: TProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="form-control w-full">
            <label className="label mb-1">
                <span className="text-md font-black text-warning uppercase tracking-widest italic group-hover:text-blue-400 transition-colors duration-300">
                    {label}
                </span>
            </label>
            <select
                {...register(name)}
                disabled={disabled}
                className={`w-full bg-warning/5 border border-warning/50 rounded-2xl px-6 py-4
          text-black font-bold outline-none
          hover:border-blue-500/40 hover:bg-blue-500/5
          focus:border-blue-500/60 focus:bg-blue-500/8
          transition-all duration-300 appearance-none cursor-pointer
          disabled:opacity-50 disabled:cursor-not-allowed
          ${errors[name] ? "border-red-500/40" : "border-success/30"}
        `}
            >
                <option value="" disabled className="bg-warning/10 text-gray-500">
                    {placeholder || `Select ${label}`}
                </option>
                {options?.map((option) => (
                    <option key={option.key} value={option.key} className="bg-warning text-white">
                        {option.label}
                    </option>
                ))}
            </select>
            {errors[name] && (
                <p className="text-error text-[10px] font-bold mt-2 uppercase tracking-wide">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    );
};

export default AZSelect;
