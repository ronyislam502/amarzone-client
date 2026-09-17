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
        <div className="w-full max-w-md mx-auto text-slate-100">
            {/* Header */}
            <div className="text-center sm:text-left mb-6">
                <div className="badge badge-warning gap-1.5 px-3 py-1.5 text-xs font-semibold mb-3 bg-amber-400/20 border-amber-400/30 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Organization Management</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                    <Building2 className="w-7 h-7 text-amber-400" />
                    Update Department
                </h2>
                <p className="text-slate-300/80 text-xs sm:text-sm mt-1.5">
                    Modify department name and catalog properties
                </p>
            </div>

            {/* Form */}
            <div className="[&_.input]:bg-[#120824] [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-amber-400 [&_.label-text]:text-slate-300">
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
                            className="w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                            type="submit"
                            disabled={isUpdating}
                        >
                            {isUpdating ? 'Updating Department...' : 'Update Department'}
                        </button>
                    </div>
                </AZForm>
            </div>
        </div>
    );
};

export default UpdateDepartment;
