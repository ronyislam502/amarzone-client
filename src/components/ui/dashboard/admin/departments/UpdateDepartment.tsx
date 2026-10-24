"use client";

import { ChangeEvent, useState } from "react";
import {
    Edit3,
    Image as ImageIcon,
    Loader2,
    Plus,
    Save,

} from "lucide-react";
import { toast } from "react-toastify";
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from "react-hook-form";
import { TDepartment } from "@/types/department";
import AZModal from "@/components/shared/AZModal";
import AZForm from "@/components/shared/form/AZFrom";
import { updateDepartmentSchema } from "@/schema/Department";
import AZInput from "@/components/shared/form/AZInput";
import AZFileInput from "@/components/shared/form/AZFileInput";
import { useUpdateDepartmentMutation } from "@/redux/features/department/departmentApi";

export interface UpdateDepartmentProps {
    isOpen: boolean;
    onClose: () => void;
    department?: TDepartment | null;
    refetch?: () => void;
    onSuccess?: () => void;
}

const UpdateDepartment = ({
    isOpen,
    onClose,
    department,
    refetch,
    onSuccess,
}: UpdateDepartmentProps) => {
    const [iconPreview, setIconPreview] = useState(department?.icon || "");
    const [iconFile, setIconFile] = useState<File | null>(null);

    const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
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
        if (isUpdating) return;
        setIconFile(null);
        setIconPreview("");
        onClose();
    };

    const onSubmit = async (data: FieldValues) => {
        const dept = {
            name: data.name,
        };

        console.log("data", dept)

        const formData = new FormData();
        formData.append("data", JSON.stringify(dept));

        if (iconFile) {
            formData.append("icon", iconFile);
        }
        console.log("iconFile", iconFile)
        console.log("data", formData)

        try {
            const res = await updateDepartment({
                id: department?._id,
                data: formData,
            }).unwrap();

            console.log("res", res)

            toast.success(res?.message || "Department updated successfully!");
            handleClose();
            refetch?.();
            onSuccess?.();
        } catch (err: any) {
            toast.error(
                err?.data?.message || err?.message || "Failed to update department"
            );
        }
    };

    return (
        <AZModal
            isOpen={isOpen && Boolean(department)}
            onClose={handleClose}
            title={
                <div className="flex items-center gap-2">
                    <span>Edit Department</span>
                    {department?.name && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                            {department.name}
                        </span>
                    )}
                </div>
            }
            description="Modify department taxonomy, catalog division, and brand iconography"
            icon={<Edit3 className="w-5 h-5 text-amber-400" />}
            size="lg"
        >
            {isOpen && department && (
                <AZForm
                    key={department._id}
                    defaultValues={{
                        name: department.name,
                        icon: department.icon
                    }}
                    resolver={zodResolver(updateDepartmentSchema)}
                    onSubmit={onSubmit}
                >
                    <div className="space-y-4 pt-2">
                        <AZInput
                            label="Name"
                            name="name"
                            type="text"
                            placeholder="Enter department name"
                        />
                        <AZFileInput
                            name="icon"
                            label="Department Icon"
                            icon={<ImageIcon className="w-4 h-4 text-warning" />}
                            file={iconFile}
                            preview={iconPreview || department?.icon || ""}
                            onChange={handleImage}
                            onClear={handleClearFile}
                        />

                        {/* Actions */}
                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isUpdating}
                                className="w-full sm:w-auto justify-center px-4 py-2.5 sm:py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer flex items-center"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 border border-amber-300/40 shadow-lg shadow-amber-400/20 flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Updating Department...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3.5 h-3.5" />
                                        <span>Update Department</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </AZForm>
            )}
        </AZModal>
    );
};

export default UpdateDepartment;
