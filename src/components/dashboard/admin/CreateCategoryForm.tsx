'use client';

import React from 'react';
import { FolderTree, Sparkles } from 'lucide-react';
import AZForm from '@/components/form/AZFrom';
import AZInput from '@/components/form/AZInput';
import AZSelect from '@/components/form/AZSelect';
import { categoryValidationSchema } from '@/Schema/category';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateCategoryMutation } from '@/redux/features/category/categoryApi';
import { useAllDepartmentsQuery } from '@/redux/features/department/departmentApi';
import { toast } from 'react-toastify';
import { FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';

interface CreateCategoryFormProps {
    onSuccess?: () => void;
}

const CreateCategoryForm: React.FC<CreateCategoryFormProps> = ({ onSuccess }) => {
    const [createCategoryApi, { isLoading: isCreating }] = useCreateCategoryMutation();
    const { data: departmentResponse, isLoading: isDeptLoading } = useAllDepartmentsQuery({});
    const router = useRouter();

    const departments: any[] = departmentResponse?.data || [];
    const departmentOptions = departments.map((dept: any) => ({
        key: dept._id,
        label: dept.name,
    }));

    const onSubmit = async (data: FieldValues) => {
        const categoryData = {
            name: data.name,
            department: data.department,
        };

        try {
            const res = await createCategoryApi(categoryData).unwrap();

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
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center sm:text-left mb-6">
                <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Catalog Management</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
                    <FolderTree className="w-7 h-7 text-warning" />
                    Create Category
                </h2>
                <p className="text-base-content/70 text-sm mt-1.5">
                    Add a new category under a department to organize your catalog
                </p>
            </div>

            {/* Form */}
            <AZForm
                resolver={zodResolver(categoryValidationSchema)}
                onSubmit={onSubmit}
            >
                <div className="space-y-5">
                    <AZInput
                        label="Category Name"
                        name="name"
                        type="text"
                        placeholder="Enter category name"
                    />
                    <AZSelect
                        label="Target Department"
                        name="department"
                        options={departmentOptions}
                        placeholder="Select a department"
                        disabled={isDeptLoading}
                    />
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        className="w-full group flex items-center justify-center gap-3 bg-success hover:bg-success/90 text-black py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] italic transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] disabled:opacity-50"
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

export default CreateCategoryForm;
