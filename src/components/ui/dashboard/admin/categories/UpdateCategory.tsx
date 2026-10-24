"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
    Edit3,
    Image as ImageIcon,
    Loader2,
    Save,
} from "lucide-react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import { TCategory } from "@/types/category";
import { useUpdateCategoryMutation } from "@/redux/features/category/categoryApi";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { TDepartment } from "@/types/department";
import AZModal from "@/components/shared/AZModal";
import AZForm from "@/components/shared/form/AZFrom";
import { updateCategorySchema } from "@/schema/Category";
import AZInput from "@/components/shared/form/AZInput";
import AZSelect from "@/components/shared/form/AZSelect";
import AZFileInput from "@/components/shared/form/AZFileInput";

export interface UpdateCategoryProps {
    isOpen: boolean;
    onClose: () => void;
    category?: TCategory | null;
    refetch?: () => void;
    onSuccess?: () => void;
}

const UpdateCategory = ({
    isOpen,
    onClose,
    category,
    refetch,
    onSuccess,
}: UpdateCategoryProps) => {
    const [previewImage, setPreviewImage] = useState(category?.icon || "");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    useEffect(() => {
        if (category) {
            setPreviewImage(category.icon || "");
            setSelectedImage(null);
        }
    }, [category]);

    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const { data: departmentsData, isLoading: isDepartmentsLoading } = useAllDepartmentsQuery({ limit: "100" });

    const departmentOptions = departmentsData?.data?.map((dept: TDepartment) => ({
        value: dept._id,
        label: dept.name,
    }));

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleClearFile = () => {
        setSelectedImage(null);
        setPreviewImage("");
    };

    const handleClose = () => {
        if (isUpdating) return;
        setSelectedImage(null);
        setPreviewImage("");
        onClose();
    };

    const onSubmit = async (data: FieldValues) => {
        const catPayload = {
            name: data.name,
            department: data.department,
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(catPayload));

        if (selectedImage) {
            formData.append("icon", selectedImage);
        }

        try {
            const res = await updateCategory({
                id: category?._id,
                data: formData,
            }).unwrap();

            toast.success(res?.message || "Category updated successfully!");
            handleClose();
            refetch?.();
            onSuccess?.();
        } catch (err: any) {
            toast.error(
                err?.data?.message || err?.message || "Failed to update category"
            );
        }
    };


    // const departmentId = typeof category?.department === "object"
    //     ? category?.department?._id
    //     : category?.department || "";

    return (
        <AZModal
            isOpen={isOpen && Boolean(category)}
            onClose={handleClose}
            title={
                <div className="flex items-center gap-2">
                    <span>Edit Category</span>
                    {category?.name && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-wider">
                            {category.name}
                        </span>
                    )}
                </div>
            }
            description="Modify category catalog properties, hierarchy assignment, and iconography"
            icon={<Edit3 className="w-5 h-5 text-primary" />}
            size="lg"
        >
            {isOpen && category && (
                <AZForm
                    key={category?._id}
                    defaultValues={{
                        name: category?.name,
                        department: category?.department?._id,
                        icon: category?.icon,
                    }}
                    resolver={zodResolver(updateCategorySchema)}
                    onSubmit={onSubmit}
                >
                    <div className="space-y-4 pt-2">
                        <AZInput
                            label="Category Name"
                            name="name"
                            type="text"
                            placeholder="Enter category name"
                        />

                        <AZSelect
                            label="Parent Department"
                            name="department"
                            placeholder={isDepartmentsLoading ? "Loading departments..." : "Select Department"}
                            options={departmentOptions}
                        />

                        <AZFileInput
                            name="icon"
                            label="Category Icon"
                            icon={<ImageIcon className="w-4 h-4 text-warning" />}
                            file={selectedImage}
                            preview={previewImage || category?.icon || ""}
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
                                className="w-full sm:w-auto justify-center px-5 py-2.5 sm:py-2 rounded-xl text-xs font-black text-slate-950 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary border border-primary/40 shadow-lg shadow-primary/20 flex items-center gap-1.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        <span>Updating Category...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3.5 h-3.5" />
                                        <span>Update Category</span>
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

export default UpdateCategory;
