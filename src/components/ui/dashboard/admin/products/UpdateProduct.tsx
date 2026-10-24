"use client";

import { ChangeEvent, useState } from "react";
import {
    Edit3,
    Image as ImageIcon,
    Loader2,
    Save,
} from "lucide-react";
import { toast } from "react-toastify";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import { TProduct } from "./ProductsTable";
import { useUpdateProductMutation } from "@/redux/features/product/productApi";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { TDepartment } from "@/types/department";
import { TCategory } from "@/types/category";
import AZModal from "@/components/shared/AZModal";
import AZForm from "@/components/shared/form/AZFrom";
import { updateProductSchema } from "@/schema/Product";
import AZInput from "@/components/shared/form/AZInput";
import AZSelect from "@/components/shared/form/AZSelect";
import AZFileInput from "@/components/shared/form/AZFileInput";
import AZTextarea from "@/components/shared/form/AZTextarea";

export interface UpdateProductProps {
    isOpen: boolean;
    onClose: () => void;
    product?: TProduct | null;
    refetch?: () => void;
    onSuccess?: () => void;
}

const UpdateProduct = ({
    isOpen,
    onClose,
    product,
    refetch,
    onSuccess,
}: UpdateProductProps) => {
    const [previewImage, setPreviewImage] = useState(product?.thumbnail || "");
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const { data: departmentsData, isLoading: isDepartmentsLoading } =
        useAllDepartmentsQuery({});
    const { data: categoriesData, isLoading: isCategoriesLoading } =
        useAllCategoriesQuery({});



    const departmentOptions = departmentsData?.data?.map((dept) => ({
        value: dept._id,
        label: dept.name,
    }));

    const categoryOptions = categoriesData?.data?.map((cat) => ({
        value: cat._id,
        label: cat.name,
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
        const productPayload = {
            title: data.title,
            brand: data.brand,
            department: data.department,
            category: data.category,
            features:
                typeof data.features === "string"
                    ? data.features
                        .split("\n")
                        .map((f: string) => f.trim())
                        .filter(Boolean)
                    : Array.isArray(data.features)
                        ? data.features
                        : [],
            tags:
                typeof data.tags === "string"
                    ? data.tags
                        .split(",")
                        .map((t: string) => t.trim().toLowerCase().replace(/^#/, ""))
                        .filter(Boolean)
                    : Array.isArray(data.tags)
                        ? data.tags
                        : [],
        };

        const formData = new FormData();
        formData.append("data", JSON.stringify(productPayload));

        if (selectedImage) {
            formData.append("image", selectedImage);
        }

        try {
            const res = await updateProduct({
                id: product?._id,
                data: formData,
            }).unwrap();

            toast.success(res?.message || "Product updated successfully!");
            handleClose();
            refetch?.();
            onSuccess?.();
        } catch (err: any) {
            toast.error(
                err?.data?.message || err?.message || "Failed to update product"
            );
        }
    };


    return (
        <AZModal
            isOpen={isOpen && Boolean(product)}
            onClose={handleClose}
            title={
                <div className="flex items-center gap-2">
                    <span>Edit Product</span>
                    {product?.title && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-wider truncate max-w-[200px]">
                            {product.title}
                        </span>
                    )}
                </div>
            }
            description="Modify product catalog properties, hierarchy assignment, and imagery"
            icon={<Edit3 className="w-5 h-5 text-primary" />}
            size="lg"
        >
            {isOpen && product && (
                <AZForm
                    defaultValues={{
                        title: product.title,
                        brand: product.brand,
                        department: product?.department?._id,
                        category: product?.category?._id,
                        features: product?.features,
                        tags: product?.tags,
                        image: product?.thumbnail,
                    }}
                    resolver={zodResolver(updateProductSchema)}
                    onSubmit={onSubmit}
                >
                    <div className="space-y-4 pt-2">
                        <AZInput
                            label="Product Title"
                            name="title"
                            type="text"
                            placeholder="Enter product title"
                        />

                        <AZInput
                            label="Brand"
                            name="brand"
                            type="text"
                            placeholder="Enter brand name"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AZSelect
                                label="Parent Department"
                                name="department"
                                placeholder={
                                    isDepartmentsLoading
                                        ? "Loading departments..."
                                        : "Select Department"
                                }
                                options={departmentOptions}
                            />

                            <AZSelect
                                label="Category"
                                name="category"
                                placeholder={
                                    isCategoriesLoading
                                        ? "Loading categories..."
                                        : "Select Category"
                                }
                                options={categoryOptions}
                            />
                        </div>

                        <AZTextarea
                            label="Key Specifications & Highlights (One per line)"
                            name="features"
                            placeholder="Enter product features (one per line)..."
                            rows={3}
                        />

                        <AZInput
                            label="Search Discovery Tags (Comma separated)"
                            name="tags"
                            type="text"
                            placeholder="e.g. wireless, bluetooth, audio"
                        />

                        <AZFileInput
                            name="image"
                            label="Product Image"
                            icon={<ImageIcon className="w-4 h-4 text-warning" />}
                            file={selectedImage}
                            preview={previewImage || product?.thumbnail || ""}
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
                                        <span>Updating Product...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-3.5 h-3.5" />
                                        <span>Update Product</span>
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

export default UpdateProduct;
