"use client";

import { ChangeEvent, useState } from "react";
import { FolderTree, Image as ImageIcon, Loader2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useCreateCategoryMutation } from "@/redux/features/category/categoryApi";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { TDepartment } from "@/types/department";
import AZModal from "@/components/shared/AZModal";
import AZForm from "@/components/shared/form/AZFrom";
import { createCategorySchema } from "@/schema/Category";
import AZInput from "@/components/shared/form/AZInput";
import AZSelect from "@/components/shared/form/AZSelect";
import AZFileInput from "@/components/shared/form/AZFileInput";

export interface AddCategoryProps {
    isOpen: boolean;
    onClose: () => void;
    refetch?: () => void;
}

const AddCategory = ({
    isOpen,
    onClose,
    refetch,
}: AddCategoryProps) => {
    const methods = useForm();

    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const { data: departmentsData, isLoading: isDepartmentsLoading } = useAllDepartmentsQuery({ limit: "100" });

    const rawDepartments: TDepartment[] = Array.isArray(departmentsData?.data)
        ? departmentsData.data
        : (departmentsData?.data as any)?.data || [];

    const departmentOptions = rawDepartments.map((dept) => ({
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
        if (isCreating) return;
        setSelectedImage(null);
        setPreviewImage("");
        methods.reset();
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
            const res = await createCategory(formData).unwrap();
            toast.success(res?.message || "Category created successfully!");
            methods.reset();
            setSelectedImage(null);
            setPreviewImage("");
            onClose();
            refetch?.();
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to create category");
        }
    };

    return (
        <AZModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add Category"
            description="Create a new catalog category mapped to a store department"
            icon={<FolderTree className="w-5 h-5" />}
            size="md"
            closeOnBackdropClick={false}
        >
            <FormProvider {...methods}>
                <AZForm
                    methods={methods}
                    resolver={zodResolver(createCategorySchema)}
                    onSubmit={onSubmit}
                >
                    <div className="space-y-4 pt-2">
                        <AZInput
                            label="Category Name"
                            name="name"
                            type="text"
                            placeholder="e.g. Organic Produce, Men's Footwear"
                        />

                        <AZSelect
                            label="Parent Department"
                            name="department"
                            placeholder={isDepartmentsLoading ? "Loading departments..." : "Select Department"}
                            options={departmentOptions}
                        />

                        <AZFileInput
                            name="icon"
                            label="Category Icon / Image"
                            icon={<ImageIcon className="w-4 h-4 text-warning" />}
                            file={selectedImage}
                            preview={previewImage}
                            onChange={handleImage}
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
                                        <span>Adding Category...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Category</span>
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

export default AddCategory;
