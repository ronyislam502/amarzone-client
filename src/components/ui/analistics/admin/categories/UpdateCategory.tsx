'use client';

import { FolderTree, Sparkles } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateCategoryMutation } from '@/redux/features/category/categoryApi';
import { useAllDepartmentsQuery } from '@/redux/features/department/departmentApi';
import { toast } from 'react-toastify';
import { FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AZForm from '../../../shared/form/AZFrom';
import AZInput from '../../../shared/form/AZInput';
import AZSelect from '../../../shared/form/AZSelect';
import { categorySchema } from '@/src/schema/Category';
import { TDepartment } from '@/src/types/department';
import { TCategory } from '@/src/types/category';

interface UpdateCategoryProps {
    category?: TCategory | null;
    onSuccess?: () => void;
}

const UpdateCategory = ({ category, onSuccess }: UpdateCategoryProps) => {
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
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


    const onSubmit = async (data: FieldValues) => {
        if (!category?._id) {
            toast.error('Category ID not found');
            return;
        }

        const categoryData = {
            name: data.name,
            department: data.department,
        };

        try {
            const res = await updateCategory({
                id: category._id,
                data: categoryData,
            }).unwrap();

            if (res?.success) {
                toast.success(res?.message || 'Category updated successfully!', {
                    autoClose: 1000,
                });
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/admin/categories');
                }
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update category');
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
                    <span>Update Category</span>
                </h2>
                <p className="text-slate-400 text-xs mt-1.5">
                    Modify category details and department assignment
                </p>
            </div>

            {/* Form */}
            <AZForm
                defaultValues={{
                    department: category?.department?._id,
                    name: category?.name
                }}
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

                <div className="mt-8 space-y-4">
                    <button
                        className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                        type="submit"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating Category...' : 'Update Category'}
                    </button>
                </div>
            </AZForm>
        </div>
    );
};

export default UpdateCategory;