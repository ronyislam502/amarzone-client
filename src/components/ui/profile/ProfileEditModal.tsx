'use client';

import React, { ChangeEvent, useEffect, useState } from 'react';
import {
    User,
    Phone,
    MapPin,
    Building,
    Globe,
    Sparkles,
    Loader2,
    Save,
    Edit3,
    CheckCircle2,
    Image as ImageIcon,
} from 'lucide-react';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { TUserProfile, TUserRole } from '@/types/profile';
import AZModal from '@/components/shared/AZModal';
import AZForm from '@/components/shared/form/AZFrom';
import AZInput from '@/components/shared/form/AZInput';
import AZFileInput from '@/components/shared/form/AZFileInput';
import { useUpdateAdminMutation } from '@/redux/features/admin/adminApi';
import { useUpdateVendorMutation } from '@/redux/features/vendor/vendorApi';
import { useUpdateCustomerMutation } from '@/redux/features/customer/customerApi';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: TUserProfile;
    role: TUserRole;
    refetch?: () => void;
}

const editProfileSchema = z.object({
    name: z.string().min(1, 'Full name is required'),
    phone: z.string().min(4, 'Phone number is required'),
    street: z.string().optional(),
    state: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().optional(),
});

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
    isOpen,
    onClose,
    profile,
    role,
    refetch,
}) => {
    const [updateAdmin, { isLoading: isUpdatingAdmin }] = useUpdateAdminMutation();
    const [updateVendor, { isLoading: isUpdatingVendor }] = useUpdateVendorMutation();
    const [updateCustomer, { isLoading: isUpdatingCustomer }] = useUpdateCustomerMutation();

    const isUpdating = isUpdatingAdmin || isUpdatingVendor || isUpdatingCustomer;

    const [showAddressFields, setShowAddressFields] = useState(
        Boolean(
            profile.address?.street ||
            profile.address?.state ||
            profile.address?.postalCode ||
            profile.address?.country
        )
    );

    // Avatar state (for Admin and Customer)
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatar || '');

    // Logo & Banner state (for Vendor)
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>(profile.logo || profile.avatar || '');
    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string>(profile.banner || '');

    const methods = useForm({
        resolver: zodResolver(editProfileSchema),
        defaultValues: {
            name: profile.name,
            phone: profile.phone,
            street: profile.address?.street,
            state: profile.address?.state,
            postalCode: profile.address?.postalCode,
            country: profile.address?.country,
        },
    });

    useEffect(() => {
        if (profile) {
            methods.reset({
                name: profile.name || '',
                phone: profile.phone || '',
                street: profile.address?.street || '',
                state: profile.address?.state || '',
                postalCode: profile.address?.postalCode || '',
                country: profile.address?.country || '',
            });
            setAvatarPreview(profile.avatar || '');
            setAvatarFile(null);
            setLogoPreview(profile.logo || profile.avatar || '');
            setLogoFile(null);
            setBannerPreview(profile.banner || '');
            setBannerFile(null);
            setShowAddressFields(
                Boolean(
                    profile.address?.street ||
                    profile.address?.state ||
                    profile.address?.postalCode ||
                    profile.address?.country
                )
            );
        }
    }, [profile, methods]);

    if (!isOpen) return null;

    // File handlers
    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setAvatarFile(file);
        setAvatarPreview(preview);
    };

    const handleClearAvatar = () => {
        setAvatarFile(null);
        setAvatarPreview('');
    };

    const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setLogoFile(file);
        setLogoPreview(preview);
    };

    const handleClearLogo = () => {
        setLogoFile(null);
        setLogoPreview('');
    };

    const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const preview = URL.createObjectURL(file);
        setBannerFile(file);
        setBannerPreview(preview);
    };

    const handleClearBanner = () => {
        setBannerFile(null);
        setBannerPreview('');
    };

    const handleClose = () => {
        if (isUpdating) return;
        methods.reset();
        setAvatarFile(null);
        setLogoFile(null);
        setBannerFile(null);
        onClose();
    };

    const onSubmit = async (data: FieldValues) => {
        const payload: Record<string, any> = {
            name: data.name,
            phone: data.phone,
            address: {
                street: data.street || '',
                state: data.state || '',
                postalCode: data.postalCode || '',
                country: data.country || '',
            },
        };

        try {
            if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
                if (avatarFile) {
                    const formData = new FormData();
                    formData.append('data', JSON.stringify(payload));
                    formData.append('image', avatarFile);
                    await updateAdmin({ id: profile._id, data: formData }).unwrap();
                } else {
                    await updateAdmin({ id: profile._id, data: payload }).unwrap();
                }
            } else if (role === 'VENDOR') {
                if (logoFile || bannerFile) {
                    const formData = new FormData();
                    formData.append('data', JSON.stringify(payload));
                    if (logoFile) formData.append('logo', logoFile);
                    if (bannerFile) formData.append('banner', bannerFile);
                    await updateVendor({ id: profile._id, data: formData }).unwrap();
                } else {
                    await updateVendor({ id: profile._id, data: payload }).unwrap();
                }
            } else {
                // Customer
                if (avatarFile) {
                    const formData = new FormData();
                    formData.append('data', JSON.stringify(payload));
                    formData.append('image', avatarFile);
                    await updateCustomer({ id: profile._id, data: formData }).unwrap();
                } else {
                    await updateCustomer({ id: profile._id, data: payload }).unwrap();
                }
            }

            toast.success('Profile updated successfully!');
            refetch?.();
            handleClose();
        } catch (err: any) {
            toast.error(
                err?.data?.message || err?.message || 'Failed to update profile. Please try again.'
            );
        }
    };

    return (
        <AZModal
            isOpen={isOpen}
            onClose={handleClose}
            title={
                <div className="flex items-center gap-2">
                    <span>Edit {role === 'VENDOR' ? 'Store & Merchant' : 'Account'} Profile</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                        {role}
                    </span>
                </div>
            }
            description="Update personal credentials, dispatch addresses, and account branding"
            icon={<Edit3 className="w-5 h-5 text-amber-400" />}
            size="lg"
            closeOnBackdropClick={false}
        >
            <div className="w-full mx-auto py-1">
                {/* Header Badge */}
                <div className="mb-5">
                    <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold shadow-md">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Identity Management</span>
                        </div>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                        {role === 'VENDOR' ? 'Update Store Information' : 'Update Profile Information'}
                    </h3>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Modify credentials and address details. Changes synchronize across the entire platform.
                    </p>
                </div>

                <AZForm methods={methods} resolver={zodResolver(editProfileSchema)} onSubmit={onSubmit}>
                    <div className="space-y-4">
                        {/* Name & Phone side-by-side */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <AZInput
                                label={role === 'VENDOR' ? 'Store / Owner Name' : 'Full Name'}
                                name="name"
                                type="text"
                                placeholder="Enter name"
                                icon={<User size={18} />}
                            />
                            <AZInput
                                label="Contact Phone"
                                name="phone"
                                type="text"
                                placeholder="Phone number"
                                icon={<Phone size={18} />}
                            />
                        </div>

                        {/* Toggleable Address Section */}
                        <div className="pt-1">
                            <button
                                type="button"
                                onClick={() => setShowAddressFields(!showAddressFields)}
                                className="text-xs font-semibold text-warning hover:text-amber-300 flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
                            >
                                <MapPin size={14} />
                                <span>
                                    {showAddressFields
                                        ? 'Hide Address Details'
                                        : '+ Add / Edit Address Details'}
                                </span>
                            </button>

                            {showAddressFields && (
                                <div className="mt-3 p-4 bg-slate-900/60 rounded-2xl border border-white/5 space-y-3 animate-fadeIn">
                                    <AZInput
                                        label="Street Address"
                                        name="street"
                                        type="text"
                                        placeholder="Street address line"
                                        icon={<MapPin size={16} />}
                                    />
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                        <AZInput
                                            label="State / City"
                                            name="state"
                                            type="text"
                                            placeholder="State or City"
                                            icon={<Building size={14} />}
                                        />
                                        <AZInput
                                            label="Postal Code"
                                            name="postalCode"
                                            type="text"
                                            placeholder="Postal / Zip code"
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

                        {/* Media Uploads: Vendor has Logo & Banner; Admin & Customer have Avatar */}
                        {role === 'VENDOR' ? (
                            <div className="space-y-4 pt-1">
                                <AZFileInput
                                    name="logo"
                                    label="Store Logo / Brand Mark (1:1)"
                                    file={logoFile}
                                    preview={logoPreview}
                                    onChange={handleLogoChange}
                                    onClear={handleClearLogo}
                                />
                                <AZFileInput
                                    name="banner"
                                    label="Storefront Cover Banner (Wide 16:9)"
                                    file={bannerFile}
                                    preview={bannerPreview}
                                    onChange={handleBannerChange}
                                    onClear={handleClearBanner}
                                />
                            </div>
                        ) : (
                            <AZFileInput
                                name="image"
                                label="Profile Avatar Picture"
                                file={avatarFile}
                                preview={avatarPreview}
                                onChange={handleAvatarChange}
                                onClear={handleClearAvatar}
                            />
                        )}

                        {/* Status Note */}
                        <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400">
                            <CheckCircle2 size={14} className="text-success shrink-0" />
                            <span>
                                Updates to your account take effect immediately across all active platform sessions.
                            </span>
                        </div>

                        {/* Actions (Cancel & Save) */}
                        <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isUpdating}
                                className="px-5 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer disabled:opacity-50"
                            >
                                Cancel
                            </button>

                            <button
                                className="flex-1 group flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 py-3.5 px-6 rounded-xl text-xs font-black uppercase tracking-[0.15em] italic transition-all duration-300 active:scale-98 shadow-[0_15px_30px_-8px_rgba(251,191,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                type="submit"
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Saving Profile Changes...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </AZForm>
            </div>
        </AZModal>
    );
};

export default ProfileEditModal;
