"use client";

import { ChangeEvent, ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface IProps {
  label?: ReactNode;
  name: string;
  icon?: ReactNode;
  preview?: string;
  file?: File | null;
  accept?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const AZFileInput = ({
  label,
  name,
  icon,
  preview,
  file,
  accept = "image/*",
  onChange,
  onClear,
  required = false,
  disabled = false,
  className = "",
}: IProps) => {
  const [internalPreview, setInternalPreview] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (preview) {
      setInternalPreview(preview);
      return;
    }
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setInternalPreview(objectUrl);
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    }
    setInternalPreview("");
  }, [file, preview]);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setInternalPreview("");
    onClear?.();
  };

  const displayPreview = preview || internalPreview;

  return (
    <div className={`form-control w-full ${className}`}>
      {label && (
        <label className="label mb-1 py-1">
          <span className="text-[14px] font-bold text-warning uppercase tracking-wider flex items-center gap-1.5">
            {icon && <span className="text-warning flex items-center justify-center">{icon}</span>}
            <span>{label}</span>
          </span>
        </label>
      )}

      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className="file-input file-input-bordered file-input-warning w-full rounded-xl transition-all duration-200 focus:outline-none bg-slate-900/60 border-warning/40 hover:border-warning text-xs"
      />

      {displayPreview && (
        <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-white/10 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-warning/40 shrink-0 bg-slate-950 flex items-center justify-center relative">
              <Image
                src={displayPreview}
                alt={typeof label === "string" ? `${label} preview` : "File preview"}
                width={48}
                height={48}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-slate-200 truncate max-w-[180px] sm:max-w-[240px]">
                {file?.name || "Uploaded preview"}
              </span>
              {file?.size ? (
                <span className="text-[10px] text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              ) : (
                <span className="text-[10px] text-amber-400/80">
                  Preview ready
                </span>
              )}
            </div>
          </div>

          {onClear && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AZFileInput;