"use client";

import { ChangeEvent, useState, useEffect } from "react";
import {
    Edit3,
    Image as ImageIcon,
    Loader2,
    Plus,
    Save,
    X,
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
    const [formFeatures, setFormFeatures] = useState<string[]>([]);
    const [featureInput, setFeatureInput] = useState("");
    const [formTags, setFormTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");

    useEffect(() => {
        if (product) {
            const initialFeatures = Array.isArray(product.features)
                ? product.features
                : typeof product.features === "string"
                    ? (product.features as string)
                        .split("\n")
                        .map((f: string) => f.trim())
                        .filter(Boolean)
                    : [];
            setFormFeatures(initialFeatures);

            const initialTags = Array.isArray(product.tags)
                ? product.tags
                : typeof product.tags === "string"
                    ? (product.tags as string)
                        .split(",")
                        .map((t: string) => t.trim().toLowerCase().replace(/^#/, ""))
                        .filter(Boolean)
                    : [];
            setFormTags(initialTags);

            setPreviewImage(product.thumbnail || "");
            setSelectedImage(null);
            setFeatureInput("");
            setTagInput("");
        }
    }, [product]);

    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
    const { data: departmentsData, isLoading: isDepartmentsLoading } =
        useAllDepartmentsQuery({});
    const { data: categoriesData, isLoading: isCategoriesLoading } =
        useAllCategoriesQuery({});


    const departmentOptions = departmentsData?.data?.map((dept: TDepartment) => ({
        value: dept?._id,
        label: dept?.name,
    }));

    const categoryOptions = categoriesData?.data?.map((cat: TCategory) => ({
        value: cat?._id,
        label: cat?.name,
    }));

    const handleAddFeature = () => {
        if (featureInput.trim()) {
            setFormFeatures((prev) => [...prev, featureInput.trim()]);
            setFeatureInput("");
        }
    };

    const handleRemoveFeature = (idx: number) => {
        setFormFeatures((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleAddTag = () => {
        const trimmed = tagInput.trim().toLowerCase().replace(/^#/, "");
        if (trimmed && !formTags.includes(trimmed)) {
            setFormTags((prev) => [...prev, trimmed]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (idx: number) => {
        setFormTags((prev) => prev.filter((_, i) => i !== idx));
    };


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
        const finalFeatures =
            formFeatures.length > 0
                ? formFeatures
                : featureInput.trim()
                    ? [featureInput.trim()]
                    : [];

        const finalTags =
            formTags.length > 0
                ? formTags
                : tagInput.trim()
                    ? [tagInput.trim().toLowerCase()]
                    : [];

        const productPayload = {
            title: data.title,
            brand: data.brand,
            department: data.department,
            category: data.category,
            features: finalFeatures,
            tags: finalTags,
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
            size="xl"

        >
            {isOpen && product && (
                <AZForm
                    key={product?._id}
                    defaultValues={{
                        title: product.title,
                        brand: product.brand,
                        department:
                            typeof product?.department === "object" && product.department !== null
                                ? product.department._id
                                : typeof product?.department === "string"
                                    ? product.department
                                    : "",
                        category:
                            typeof product?.category === "object" && product.category !== null
                                ? product.category._id
                                : typeof product?.category === "string"
                                    ? product.category
                                    : "",
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

                        <div className="space-y-1.5">
                            <div
                                className="flex gap-2 items-center"
                                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddFeature();
                                    }
                                }}
                            >
                                <AZInput
                                    label="Bullet Features"
                                    name="featureInput"
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    placeholder="Type feature bullet and press Add"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="btn btn-sm bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {formFeatures.length > 0 && (
                                <div className="space-y-1 max-h-32 overflow-y-auto pt-1">
                                    {formFeatures.map((feat, idx) => (
                                        <div
                                            key={idx}
                                            className="p-1.5 px-2.5 rounded-lg bg-[#100722]/80 border border-white/10 flex items-center justify-between gap-2 text-xs"
                                        >
                                            <span className="text-slate-300 truncate">
                                                • {feat}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeature(idx)}
                                                className="text-slate-400 hover:text-rose-400 cursor-pointer"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <div
                                className="flex gap-2 items-center"
                                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                            >
                                <AZInput
                                    label="Discovery Tags"
                                    name="tagInput"
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Type tag and press Add"
                                />

                                <button
                                    type="button"
                                    onClick={handleAddTag}
                                    className="btn btn-sm bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs shrink-0"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {formTags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {formTags.map((t, idx) => (
                                        <span
                                            key={idx}
                                            className="badge badge-sm bg-white/5 border border-white/15 text-slate-200 gap-1 text-[11px] py-1"
                                        >
                                            #{t}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTag(idx)}
                                                className="hover:text-rose-400 cursor-pointer ml-0.5"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>


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
            )
            }
        </AZModal >
    );
};

export default UpdateProduct;
