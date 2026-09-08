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
    const { data: departmentsData, isLoading: isDeptLoading } = useAllDepartmentsQuery({});
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
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center sm:text-left mb-6">
                <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Catalog Management</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
                    <FolderTree className="w-7 h-7 text-warning" />
                    Update Category
                </h2>
                <p className="text-base-content/70 text-sm mt-1.5">
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
                <div className="space-y-5">
                    <AZSelect
                        label="Department"
                        name="department"
                        options={departmentOptions}
                        placeholder="Select a department"
                        disabled={isDeptLoading}
                    />
                    <AZInput
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Enter category name"
                    />
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        className="w-full group flex items-center justify-center gap-3 bg-warning hover:bg-warning/90 text-black py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] italic transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(234,179,8,0.3)] disabled:opacity-50"
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