'use client';

import { FolderTree, Sparkles } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCategoryMutation } from '@/redux/features/category/categoryApi';
import { useAllDepartmentsQuery } from '@/redux/features/department/departmentApi';
import { toast } from 'react-toastify';
import { FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AZForm from '../../../shared/form/AZFrom';
import AZInput from '../../../shared/form/AZInput';
import AZSelect from '../../../shared/form/AZSelect';
import { categorySchema } from '@/src/schema/Category';
import { TDepartment } from '@/src/types/department';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';

interface CreateCategoryFormProps {
    onSuccess?: () => void;
}

const CreateCategory = ({ onSuccess }: CreateCategoryFormProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const { data: departmentsData, isLoading: isDeptLoading } = useAllDepartmentsQuery({
        limit: 0,
    });
    const router = useRouter();



    let departmentOptions: { key: string; label: string }[] = [];

    if (departmentsData?.data && !isDeptLoading) {
        departmentOptions = departmentsData?.data?.map(
            (dept: TDepartment) => ({
                key: dept?._id,
                label: `${dept?.name}`,
            })
        );
    }

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
        }
    };

    const onSubmit = async (data: FieldValues) => {
        const formData = new FormData();
        const categoryData = {
            name: data.name,
            department: data.department,
        };

        try {

            formData.append("data", JSON.stringify(categoryData));
            if (image) {
                formData.append("icon", image);
            }
            const res = await createCategory(formData).unwrap();

            if (res?.success) {
                toast.success(res?.message || 'Category created successfully!', {
                    autoClose: 1000,
                });
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/admin');
                }
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to create category');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto text-slate-100">
            {/* Header */}
            <div className="text-center sm:text-left mb-6">
                <div className="badge badge-warning gap-1.5 px-3 py-1.5 text-xs font-black shadow mb-3 text-slate-950">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Catalog Management</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400">
                        <FolderTree className="w-6 h-6" />
                    </div>
                    <span>Create Category</span>
                </h2>
                <p className="text-slate-400 text-xs mt-1.5">
                    Add a new category under a department to organize your catalog
                </p>
            </div>

            {/* Form */}
            <AZForm
                resolver={zodResolver(categorySchema)}
                onSubmit={onSubmit}
            >
                <div className="space-y-4">
                    <AZSelect
                        label="Department"
                        name="department"
                        size="sm"
                        options={departmentOptions}
                        placeholder="Select a department"
                        disabled={isDeptLoading}
                        selectClassName="bg-[#120824] border-white/15 text-slate-200 focus:border-amber-400 rounded-xl text-xs"
                    />
                    <AZInput
                        label="Category Name"
                        name="name"
                        type="text"
                        size="sm"
                        placeholder="Enter category name"
                        inputClassName="bg-[#120824] border-white/15 text-slate-200 placeholder:text-slate-500 focus:border-amber-400 rounded-xl text-xs"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="form-control w-full">
                        <label className="label mb-1">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Image / Icon
                            </span>
                        </label>
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleImage}
                            className="file-input file-input-bordered w-full h-12 rounded-2xl bg-[#120824] border-white/15 text-slate-200 text-xs file:bg-amber-400 file:text-slate-950 file:border-none file:font-bold"
                        />
                    </div>

                    <div className="form-control w-full">
                        <label className="label mb-1">
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                                Preview
                            </span>
                        </label>
                        <div className="w-full h-12 rounded-2xl overflow-hidden">
                            {imagePreview ? (
                                <div className="flex items-center gap-3 w-full h-full px-3 bg-[#120824] rounded-2xl border border-white/15">
                                    <Image
                                        src={imagePreview}
                                        alt="Department preview"
                                        height={36}
                                        width={36}
                                        className="w-9 h-9 object-cover rounded-xl border border-amber-400/50 shrink-0"
                                    />
                                    <span className="text-xs text-slate-300 truncate font-medium">
                                        {image?.name}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-full h-full px-3 bg-[#120824]/60 rounded-2xl border border-dashed border-white/15 text-slate-400 text-xs">
                                    No image chosen
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                        type="submit"
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating Category...' : 'Create Category'}
                    </button>
                </div>
            </AZForm>
        </div>
    );
};

export default CreateCategory;
