
import { TInput } from "@/src/types/global";
import { useFormContext } from "react-hook-form";

type IProps = TInput;

const AZTextarea = ({ name, label, placeholder = "" }: IProps) => {
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
            <textarea
                placeholder={placeholder}
                {...register(name)}
                className="w-full bg-success/5 border border-success/30 rounded-2xl p-6
          text-white font-bold placeholder:text-gray-500 outline-none
          hover:border-blue-500/40 hover:bg-blue-500/5
          focus:border-blue-500/60 focus:bg-blue-500/8
          transition-all duration-300
          min-h-[120px] resize-none"
            />
            {errors[name] && (
                <p className="text-error text-[10px] font-bold mt-2 uppercase tracking-wide">
                    {errors[name]?.message as string}
                </p>
            )}
        </div>
    );
};

export default AZTextarea;
