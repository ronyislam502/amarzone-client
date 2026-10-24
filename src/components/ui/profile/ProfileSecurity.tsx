'use client';

import React, { useState } from 'react';
import {
    Lock,
    KeyRound,
    Eye,
    EyeOff,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Save,
    Shield,
    Sparkles,
} from 'lucide-react';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { TUserProfile, TUserRole } from '@/types/profile';
import { useChangePasswordMutation } from '@/redux/features/auth/authApi';
import AZForm from '@/components/shared/form/AZFrom';
import AZInput from '@/components/shared/form/AZInput';

interface ProfileSecurityProps {
    profile: TUserProfile;
    role: TUserRole;
}

const changePasswordSchema = z
    .object({
        oldPassword: z.string().min(1, 'Current password is required'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: 'New passwords do not match',
        path: ['confirmPassword'],
    });

export const ProfileSecurity: React.FC<ProfileSecurityProps> = ({ profile, role }) => {
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const methods = useForm({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const onSubmit = async (data: FieldValues) => {
        try {
            const res = await changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            }).unwrap();

            toast.success(res?.message || 'Password changed successfully! Keep your new password safe.');
            methods.reset();
        } catch (err: any) {
            toast.error(
                err?.data?.message || err?.message || 'Failed to change password. Please check your current password.'
            );
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Change Password Form */}
            <div className="lg:col-span-2">
                <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-7">
                    {/* Top glowing line */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/40 to-transparent pointer-events-none" />

                    <div className="flex items-center gap-3 pb-5 border-b border-white/10 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
                            <KeyRound className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-extrabold text-white">
                                Update Password
                            </h3>
                            <p className="text-xs text-slate-400">
                                Maintain account security by ensuring a strong, unique password
                            </p>
                        </div>
                    </div>

                    <AZForm
                        methods={methods}
                        resolver={zodResolver(changePasswordSchema)}
                        onSubmit={onSubmit}
                    >
                        <div className="space-y-4 max-w-xl">
                            {/* Old Password */}
                            <div className="relative">
                                <AZInput
                                    label="Current Password"
                                    name="oldPassword"
                                    type={showOldPassword ? 'text' : 'password'}
                                    placeholder="Enter current password"
                                    icon={<Lock size={18} />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    className="absolute right-3 top-9 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* New Password */}
                            <div className="relative">
                                <AZInput
                                    label="New Password"
                                    name="newPassword"
                                    type={showNewPassword ? 'text' : 'password'}
                                    placeholder="Enter new secure password (min 6 characters)"
                                    icon={<Lock size={18} />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-9 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <AZInput
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    placeholder="Repeat new password"
                                    icon={<Lock size={18} />}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-9 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-3">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 py-3.5 px-7 rounded-xl text-xs font-black uppercase tracking-[0.15em] italic transition-all duration-300 active:scale-98 shadow-[0_15px_30px_-8px_rgba(251,191,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Updating Password...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Change Password</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </AZForm>
                </div>
            </div>

            {/* Right 1 Col: Security Guidelines & Status */}
            <div className="space-y-6">
                {/* Security Standards Card */}
                <div className="card relative overflow-hidden bg-[#170d2f] border border-white/10 shadow-2xl rounded-2xl sm:rounded-3xl p-6">
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />

                    <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-white">Security Checklist</h3>
                            <p className="text-[11px] text-slate-400">Best practice guidelines</p>
                        </div>
                    </div>

                    <div className="space-y-3 text-xs">
                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-white">Password Length</span>
                                <p className="text-[11px] text-slate-400">
                                    Must be at least 6 characters long; 10+ characters recommended.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-white">Role Guard</span>
                                <p className="text-[11px] text-slate-400">
                                    {role === 'ADMIN' || role === 'SUPER_ADMIN'
                                        ? 'Administrative sessions expire automatically after prolonged inactivity.'
                                        : 'Account protected with tokenized refresh authentication.'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-white">Confidentiality</span>
                                <p className="text-[11px] text-slate-400">
                                    Amarzone staff will never ask you for your login password via chat or email.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-5 p-3.5 rounded-2xl bg-cyan-400/[0.04] border border-cyan-400/15 flex items-center gap-3">
                        <Shield className="w-5 h-5 text-cyan-400 shrink-0" />
                        <span className="text-[11px] font-medium text-slate-300 leading-snug">
                            Session verified with secure HTTP cookie tokens and AES encrypted authorization.
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSecurity;
