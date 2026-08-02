
import { TInput } from "@/types/global";
import { useFormContext } from "react-hook-form";

interface IProps extends TInput {
    options: {
        key: string;
        label: string;
    }[];
}

const AZSelect = ({ name, label, options }: IProps) => {
    const {
        register,
        formState: { errors },
    } = useFormContext();

    return (
        <div className="form-control w-full">
            <label className="label mb-1">
                <span className="text-[9px] font-black text-success uppercase tracking-widest italic">
                    {label}
                </span>
            </label>
            <select
                {...register(name)}
                className={`w-full bg-success/5 border rounded-2xl px-6 py-4
          text-white font-bold outline-none
          hover:border-blue-500/40 hover:bg-blue-500/5
          focus:border-blue-500/60 focus:bg-blue-500/8
          transition-all duration-300 appearance-none cursor-pointer
          ${errors[name] ? "border-red-500/40" : "border-success/30"}
        `}
            >
                <option value="" disabled className="bg-[#0a0a0a] text-gray-500">
                    Select {label}
                </option>
                {options.map((option) => (
                    <option key={option.key} value={option.key} className="bg-[#0a0a0a] text-white">
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
