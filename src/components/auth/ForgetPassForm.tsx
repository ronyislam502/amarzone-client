'use client';

import React from 'react';
import Link from 'next/link';
import {
    Mail,
    Send,
    ArrowLeft,
    KeyRound,
    ShieldCheck
} from 'lucide-react';
import AZForm from '../form/AZFrom';
import AZInput from '../form/AZInput';
import { useForgotPasswordMutation } from '@/redux/features/auth/authApi';
import { FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';
import { TError } from '@/types/global';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordValidationSchema } from '@/Schema/Auth';

export const ForgetPassForm: React.FC = () => {
    const [forgotPassword, { isSuccess }] = useForgotPasswordMutation();
    const onSubmit = async (data: FieldValues) => {
        try {
            const forgotData = {
                email: data?.email,
            };
            const res = await forgotPassword(forgotData).unwrap();

            if (res?.success) {
                toast.success(res?.message);
                // router.push("/reset-pass");
            }
        } catch (error) {
            const err = error as TError;
            toast.error(err?.data?.message);
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
                    Forgot Password?
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                    Enter your registered email address below and we will send you a secure link to reset your account password.
                </p>
            </div>

            {/* Pure Design Form Presentation */}
            <AZForm resolver={zodResolver(forgotPasswordValidationSchema)}
                onSubmit={onSubmit}>
                <div className="space-y-4">
                    <AZInput
                        label="Registered Email Address"
                        name="email"
                        type="email"
                        placeholder="e.g. alex.shopper@amarzone.com"
                        icon={<Mail className="w-4 h-4" />}
                    />
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        type="submit"
                        className="w-full group flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all shadow-[0_15px_30px_-5px_rgba(245,158,11,0.35)] active:scale-95"
                    >
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        <span>Send Reset Link</span>
                    </button>
                </div>
            </AZForm>

            {/* Navigation Links */}
            <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 font-bold text-slate-400 hover:text-amber-400 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                </Link>

                <Link
                    href="/reset-pass"
                    className="inline-flex items-center gap-1.5 font-bold text-amber-400 hover:text-amber-300 transition-colors"
                >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Have a token? Reset password</span>
                </Link>
            </div>
        </div>
    );
};

export default ForgetPassForm;
