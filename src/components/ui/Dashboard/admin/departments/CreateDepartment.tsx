'use client';

import { Building2, Sparkles } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateDepartmentMutation } from '@/redux/features/department/departmentApi';
import { toast } from 'react-toastify';
import { FieldValues } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import AZForm from '../../../shared/form/AZFrom';
import AZInput from '../../../shared/form/AZInput';
import { departmentSchema } from '@/src/schema/Department';
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';

interface CreateDepartmentProps {
    onSuccess?: () => void;
}

const CreateDepartment = ({ onSuccess }: CreateDepartmentProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [createDepartment, { isLoading: isCreating }] = useCreateDepartmentMutation();
    const router = useRouter();

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
        const departmentData = {
            name: data.name,
        };

        try {
            formData.append("data", JSON.stringify(departmentData));
            if (image) {
                formData.append("icon", image);
            }
            const res = await createDepartment(formData).unwrap();

            if (res?.success) {
                toast.success(res?.message || 'Department created successfully!', {
                    autoClose: 1000,
                });
                if (onSuccess) {
                    onSuccess();
                } else {
                    router.push('/admin/departments');
                }
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to create department');
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
                    Create Department
                </h2>
                <p className="text-slate-300/80 text-xs sm:text-sm mt-1.5">
                    Add a new top-level department to structure your product catalog
                </p>
            </div>

            {/* Form */}
            <div className="[&_.input]:bg-[#120824] [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-amber-400 [&_.label-text]:text-slate-300">
                <AZForm
                    resolver={zodResolver(departmentSchema)}
                    onSubmit={onSubmit}
                >
                    <div className="space-y-5">
                    <AZInput
                        label="Department Name"
                        name="name"
                        type="text"
                        placeholder="Enter department name"
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
                        className="w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
                        type="submit"
                        disabled={isCreating}
                    >
                        {isCreating ? 'Creating Department...' : 'Create Department'}
                    </button>
                </div>
            </AZForm>
            </div>
        </div>
    );
};

export default CreateDepartment;
