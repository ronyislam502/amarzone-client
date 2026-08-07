'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import {
    KeyRound,
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';
import AZForm from '../form/AZFrom';
import AZInput from '../form/AZInput';

const ResetPassContent: React.FC = () => {
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleDummySubmit = (e?: any) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header Badge & Title */}
            <div className="text-center sm:text-left mb-6">
                <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold mb-3">
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>Password Recovery</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
                    Set New Password
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Enter your account email and create a secure new password for your account.
                </p>
            </div>

            {/* Pure Design Form Presentation */}
            <AZForm onSubmit={handleDummySubmit}>
                <div className="space-y-4">
                    <AZInput
                        label="Account Email"
                        name="email"
                        type="email"
                        placeholder="Enter your account email"
                        icon={<Mail className="w-4 h-4" />}
                    />

                    {/* Reset Token Field */}
                    <div className="form-control w-full">
                        <label className="label mb-1 flex justify-between items-center">
                            <span className="text-md font-black text-warning uppercase tracking-widest italic">
                                Reset Security Token
                            </span>
                        </label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-success">
                                <KeyRound className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Paste token from email link"
                                className="w-full bg-warning/5 border border-warning/50 rounded-2xl py-4 pl-12 pr-4 text-xs font-mono font-bold text-slate-100 placeholder:text-gray-500 outline-none hover:border-blue-500/40 focus:border-blue-500/60 transition-all"
                            />
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                        <AZInput
                            label="New Password"
                            name="newPassword"
                            type={showNewPassword ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
                            icon={<Lock className="w-4 h-4" />}
                        />
                        <div
                            className="absolute right-4 top-10 cursor-pointer text-gray-400 hover:text-white transition-colors"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <AZInput
                            label="Confirm New Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Re-enter new password"
                            icon={<Lock className="w-4 h-4" />}
                        />
                        <div
                            className="absolute right-4 top-10 cursor-pointer text-gray-400 hover:text-white transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <button
                        type="submit"
                        className="w-full group flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-slate-950 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_15px_30px_-5px_rgba(16,185,129,0.3)] active:scale-95"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Reset Password Now</span>
                    </button>
                </div>
            </AZForm>

            {/* Footer Back to Login Link */}
            <div className="mt-8 text-center pt-4 border-t border-white/10">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                </Link>
            </div>
        </div>
    );
};

export const ResetPassForm: React.FC = () => {
    return (
        <Suspense fallback={<div className="p-6 text-center text-slate-400 text-sm">Loading reset form...</div>}>
            <ResetPassContent />
        </Suspense>
    );
};

export default ResetPassForm;
