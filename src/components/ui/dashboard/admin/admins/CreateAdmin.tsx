'use client';

import { ChangeEvent, useState } from 'react';
import {
    Eye,
    EyeOff,
    User,
    Mail,
    Phone,
    Lock,
    MapPin,
    Building,
    Globe,
    Sparkles,
    Loader2,
    CheckCircle2,
    UserCheck,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useCreateAdminMutation } from '@/redux/features/user/userApi';
import AZModal from '@/components/shared/AZModal';
import AZForm from '@/components/shared/form/AZFrom';
import AZInput from '@/components/shared/form/AZInput';
import AZFileInput from '@/components/shared/form/AZFileInput';

export interface CreateAdminProps {
    isOpen?: boolean;
    onClose?: () => void;
    refetch?: () => void;
}

const createAdminSchema = z.object({
    name: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(4, 'Phone number is required'),
    password: z
        .string()
        .trim()
        .min(6, 'Password must be at least 6 characters long'),
    street: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
});

const CreateAdmin = ({
    isOpen = true,
    onClose = () => { },
    refetch,
}: CreateAdminProps) => {
    const [createAdmin, { isLoading }] = useCreateAdminMutation();
    const [showPassword, setShowPassword] = useState(false);
    const [showAddressFields, setShowAddressFields] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const methods = useForm();

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const preview = URL.createObjectURL(file);
        setImage(file);
        setImagePreview(preview);
    };

    const handleClearImage = () => {
        setImage(null);
        setImagePreview('');
    };

    const handleClose = () => {
        if (isLoading) return;
        methods.reset();
        setImage(null);
        setImagePreview('');
        setShowAddressFields(false);
        onClose();
    };

    const onSubmit = async (data: FieldValues) => {
        const adminData = {
            password: data.password,
            admin: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: {
                    street: data.street,
                    state: data.state,
                    postalCode: data.postalCode,
                    country: data.country,
                },
            },
        };

        const formData = new FormData();
        formData.append('data', JSON.stringify(adminData));
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await createAdmin(formData).unwrap();
            if (res?.success) {
                toast.success(res?.message || 'Administrator account created successfully!');
                methods.reset();
                setImage(null);
                setImagePreview('');
                setShowAddressFields(false);
                onClose();
                refetch?.();
            }
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to create administrator account.');
        }
    };

    return (
        <AZModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Create Administrator"
            description="Authorize and onboard a new administrative staff member"
            icon={<UserCheck className="w-5 h-5 text-amber-400" />}
            size="lg"
            closeOnBackdropClick={false}
        >
            <div className="w-full mx-auto py-1">
                {/* Header Badge consistent with customer SignupForm */}
                <div className="mb-5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold shadow-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Administrative Access</span>
                        </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                        Admin Credentials & Information
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Register an administrator with system authority, contact credentials, and address.
                    </p>
                </div>

                {/* Form following exact customer SignupForm patterns & spacing */}
                <AZForm
                    methods={methods}
                    resolver={zodResolver(createAdminSchema)}
                    onSubmit={onSubmit}
                >
                    <div className="space-y-4">
                        {/* Name & Email side-by-side on sm screens */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AZInput
                                label="Full Name"
                                name="name"
                                type="text"
                                placeholder="your name"
                                icon={<User size={18} />}
                            />
                            <AZInput
                                label="Email"
                                name="email"
                                type="email"
                                placeholder="your email"
                                icon={<Mail size={18} />}
                            />
                        </div>

                        {/* Phone & Password side-by-side on sm screens */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AZInput
                                label="Phone"
                                name="phone"
                                type="text"
                                placeholder="your phone number"
                                icon={<Phone size={18} />}
                            />
                            <div className="relative">
                                <AZInput
                                    label="Password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="password"
                                    icon={<Lock size={18} />}
                                />
                                <div
                                    className="absolute right-4 top-10 cursor-pointer text-gray-400 hover:text-white transition-colors z-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                </div>
                            </div>
                        </div>

                        {/* Toggleable Address Section matching SignupForm */}
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => setShowAddressFields(!showAddressFields)}
                                className="text-xs font-semibold text-warning hover:text-amber-300 flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
                            >
                                <MapPin size={14} />
                                <span>{showAddressFields ? 'Hide Address Details' : '+ Add Address Details'}</span>
                            </button>

                            {showAddressFields && (
                                <div className="mt-3 p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3 animate-fadeIn">
                                    <AZInput
                                        label="Street"
                                        name="street"
                                        type="text"
                                        placeholder="your street"
                                        icon={<MapPin size={16} />}
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <AZInput
                                            label="State"
                                            name="state"
                                            type="text"
                                            placeholder="State"
                                            icon={<Building size={14} />}
                                        />
                                        <AZInput
                                            label="PO"
                                            name="postalCode"
                                            type="text"
                                            placeholder="postal"
                                        />
                                        <AZInput
                                            label="Country"
                                            name="country"
                                            type="text"
                                            placeholder="Country"
                                            icon={<Globe size={14} />}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Image upload matching customer profile image in SignupForm */}
                        <AZFileInput
                            name="image"
                            label="Profile Image"
                            file={image}
                            preview={imagePreview}
                            onChange={handleImageChange}
                            onClear={handleClearImage}
                        />

                        {/* Privileges Note */}
                        <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400">
                            <CheckCircle2 size={14} className="text-success shrink-0" />
                            <span>
                                This administrator will be granted platform administrative management privileges.
                            </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer disabled:opacity-50 flex items-center"
                            >
                                Cancel
                            </button>

                            <button
                                className="flex-1 group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 py-3.5 px-6 rounded-xl text-xs font-black uppercase tracking-[0.2em] italic transition-all duration-300 active:scale-98 shadow-[0_15px_30px_-8px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Creating Admin...</span>
                                    </>
                                ) : (
                                    'Create Admin Account'
                                )}
                            </button>
                        </div>
                    </div>
                </AZForm>
            </div>
        </AZModal>
    );
};

export default CreateAdmin;
