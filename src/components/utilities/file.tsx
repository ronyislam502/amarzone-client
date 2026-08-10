'use client';

import React, { ChangeEvent, useState, useEffect, useId } from "react";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

export interface FileProps {
    name?: string;
    title?: string;
    description?: string;
    buttonText?: string;
    accept?: string;
    multiple?: boolean;
    maxCount?: number;
    maxSizeMB?: number;
    disabled?: boolean;
    value?: File | File[] | string | string[] | null;
    onChange?: (files: File | File[] | null) => void;
    className?: string;
}

const File: React.FC<FileProps> = ({
    name,
    title = "Identity Visualization",
    description = "Upload a profile depiction (Optional)",
    buttonText = "Select Transmission",
    accept = "image/*",
    multiple = false,
    maxCount = 6,
    maxSizeMB = 5,
    disabled = false,
    value,
    onChange,
    className = "",
}) => {
    const inputId = useId();

    // Safely attempt to access form context if used inside React Hook Form
    let formContext: ReturnType<typeof useFormContext> | null = null;
    try {
        formContext = useFormContext();
    } catch {
        formContext = null;
    }

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Sync state with controlled value prop if provided
    useEffect(() => {
        if (value !== undefined) {
            if (!value) {
                setSelectedFiles([]);
            } else if (Array.isArray(value)) {
                const files = value.filter((v): v is File => v instanceof File);
                setSelectedFiles(files);
            } else if (value instanceof File) {
                setSelectedFiles([value]);
            }
        }
    }, [value]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setErrorMsg(null);
        const incomingFiles = Array.from(e.target.files || []);

        if (incomingFiles.length === 0) return;

        // Size validation
        const oversized = incomingFiles.find((f) => f.size > maxSizeMB * 1024 * 1024);
        if (oversized) {
            setErrorMsg(`File "${oversized.name}" exceeds maximum size of ${maxSizeMB}MB.`);
            return;
        }

        let updatedFiles: File[];

        if (multiple) {
            const combined = [...selectedFiles, ...incomingFiles];
            if (combined.length > maxCount) {
                setErrorMsg(`You can upload a maximum of ${maxCount} files.`);
                updatedFiles = combined.slice(0, maxCount);
            } else {
                updatedFiles = combined;
            }
        } else {
            updatedFiles = [incomingFiles[0]];
        }

        setSelectedFiles(updatedFiles);

        const result = multiple ? updatedFiles : updatedFiles[0] || null;

        if (onChange) {
            onChange(result);
        }

        if (formContext && name && formContext.setValue) {
            formContext.setValue(name, result, { shouldValidate: true, shouldDirty: true });
        }

        // Reset target value so selecting the exact same file triggers onChange again
        e.target.value = "";
    };

    const handleRemoveFile = (index: number) => {
        const updated = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updated);

        const result = multiple ? updated : updated[0] || null;

        if (onChange) {
            onChange(result);
        }

        if (formContext && name && formContext.setValue) {
            formContext.setValue(name, result, { shouldValidate: true, shouldDirty: true });
        }
    };

    return (
        <div className={`mt-8 p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-6 ${className}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 w-full">
                <div className="space-y-1 text-center md:text-left">
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest italic flex items-center gap-2">
                        {title}
                        {multiple && (
                            <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full not-italic">
                                {selectedFiles.length} / {maxCount}
                            </span>
                        )}
                    </h4>
                    {description && (
                        <p className="text-[9px] text-gray-500 uppercase tracking-tighter italic font-medium">
                            {description}
                        </p>
                    )}
                </div>

                <label
                    htmlFor={inputId}
                    className={`relative group cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    <div className="bg-white/5 border border-dashed border-white/20 px-6 py-3 rounded-xl group-hover:bg-success group-hover:border-success group-hover:text-black transition-all flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-widest italic">
                            {!multiple && selectedFiles.length > 0
                                ? selectedFiles[0].name
                                : buttonText}
                        </span>
                    </div>
                    <input
                        id={inputId}
                        type="file"
                        accept={accept}
                        multiple={multiple}
                        disabled={disabled}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            </div>

            {errorMsg && (
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-lg">
                    {errorMsg}
                </p>
            )}

            {/* Selected File Previews Grid */}
            {selectedFiles.length > 0 && (
                <div className="w-full pt-4 border-t border-white/5">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                        {selectedFiles.map((file, idx) => {
                            const isImage = file.type.startsWith("image/");
                            const previewUrl = isImage ? URL.createObjectURL(file) : null;

                            return (
                                <div
                                    key={`${file.name}-${idx}`}
                                    className="relative group bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col items-center justify-center aspect-square overflow-hidden hover:border-emerald-500/50 transition-all"
                                >
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt={file.name}
                                            className="w-full h-full object-cover rounded-lg"
                                            onLoad={(e) => {
                                                // Revoke object URL after image loads to free memory
                                                URL.revokeObjectURL((e.target as HTMLImageElement).src);
                                            }}
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-2 text-center">
                                            <FileText className="w-6 h-6 text-gray-400 mb-1" />
                                            <span className="text-[8px] text-gray-300 font-mono truncate max-w-full">
                                                {file.name}
                                            </span>
                                        </div>
                                    )}

                                    {/* Action Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                                        <span className="text-[8px] text-white font-medium truncate max-w-full px-1 text-center">
                                            {file.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveFile(idx);
                                            }}
                                            className="p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors shadow-lg"
                                            title="Remove File"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default File;
