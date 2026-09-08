'use client';

import { Building2, Sparkles } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateDepartmentMutation } from '@/redux/features/department/departmentApi';
import { toast } from 'react-toastify';
import { FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AZForm from '../../../shared/form/AZFrom';
import AZInput from '../../../shared/form/AZInput';
import { departmentSchema } from '@/src/schema/Department';
import { TDepartment } from '@/src/types/department';

interface UpdateDepartmentProps {
    department?: TDepartment | null;
    onSuccess?: () => void;
}

const UpdateDepartment = ({ department, onSuccess }: UpdateDepartmentProps) => {
    const [updateDepartment, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
    const router = useRouter();

    const onSubmit = async (data: FieldValues) => {
        if (!department?._id) {
            toast.error('Department ID not found');
            return;
        }

        const departmentData = {
            name: data.name,
        };

        try {
            const res = await updateDepartment({
                id: department._id,
                data: departmentData,
            }).unwrap();

            if (res?.success) {
                toast.success(res?.message || 'Department updated successfully!', {
                    autoClose: 1000,
                });
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/admin/departments');
                }
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to update department');
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center sm:text-left mb-6">
                <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Organization Management</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-base-content flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-warning" />
                    Update Department
                </h2>
                <p className="text-base-content/70 text-sm mt-1.5">
                    Modify department name and catalog properties
                </p>
            </div>

            {/* Form */}
            <AZForm
                defaultValues={{
                    name: department?.name,
                }}
                resolver={zodResolver(departmentSchema)}
                onSubmit={onSubmit}
            >
                <div className="space-y-5">
                    <AZInput
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Enter department name"
                    />
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        className="w-full group flex items-center justify-center gap-3 bg-warning hover:bg-warning/90 text-black py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] italic transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(234,179,8,0.3)] disabled:opacity-50"
                        type="submit"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Updating Department...' : 'Update Department'}
                    </button>
                </div>
            </AZForm>
        </div>
    );
};

export default UpdateDepartment;
