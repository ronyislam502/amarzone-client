"use client";

import { ChangeEvent, useState } from "react";
import { Building2, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { zodResolver } from '@hookform/resolvers/zod';

import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useCreateDepartmentMutation } from "@/redux/features/department/departmentApi";
import AZModal from "@/components/shared/AZModal";
import AZForm from "@/components/shared/form/AZFrom";
import { createDepartmentSchema } from "@/schema/Department";
import AZFileInput from "@/components/shared/form/AZFileInput";
import AZInput from "@/components/shared/form/AZInput";

export interface AddDepartmentProps {
    isOpen: boolean;
    onClose: () => void;
    refetch?: () => void;
}


const AddDepartment = ({
    isOpen,
    onClose,
    refetch,
}: AddDepartmentProps) => {
    const methods = useForm();
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [iconPreview, setIconPreview] = useState<string>('');

    const [createDepartment, { isLoading: isCreating }] =
        useCreateDepartmentMutation();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIconFile(file);
            setIconPreview(URL.createObjectURL(file));
        }


    };

    const handleClearFile = () => {
        setIconFile(null);
        setIconPreview("");
    };

    const handleClose = () => {
        if (isCreating) return;
        setIconFile(null);
        setIconPreview("");
        onClose();
    };

    const onSubmit = async (data: FieldValues) => {
        const dept = {
            name: data.name
        }

        const formData = new FormData();
        formData.append(
            "data",
            JSON.stringify(dept)
        );

        if (iconFile) {
            formData.append("icon", iconFile);
        }

        try {
            const res = await createDepartment(formData).unwrap();
            toast.success(res?.message || "Department created successfully!");
            methods.reset();
            setIconFile(null);
            setIconPreview("");
            onClose();
            refetch?.();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create department");
        }
    };

    return (
        <AZModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Department"
            description="Create a new catalog category division for the store taxonomy"
            icon={<Building2 className="w-5 h-5" />}
            size="md"
            closeOnBackdropClick={false}
        >
            <FormProvider {...methods}>
                <AZForm
                    resolver={zodResolver(createDepartmentSchema)}
                    onSubmit={onSubmit}
                >
                    <div className="space-y-4 pt-2">
                        <AZInput label="Name" name="name" type="text" placeholder="Enter department name" />

                        <AZFileInput
                            name="icon"
                            label="Department Icon"
                            icon={<ImageIcon className="w-4 h-4 text-warning" />}
                            file={iconFile}
                            preview={iconPreview}
                            onChange={handleFileChange}
                            onClear={handleClearFile}
                        />

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isCreating}
                                className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isCreating}
                                className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-300/40 shadow-lg shadow-amber-400/20 flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isCreating ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Adding Department...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Department</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </AZForm>
            </FormProvider>
        </AZModal>
    );
};

export default AddDepartment;