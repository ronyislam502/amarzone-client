'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2, User, Store, Shield, Sparkles } from 'lucide-react';
import Image from 'next/image';
import AZForm from '../form/AZFrom';
import AZInput from '../form/AZInput';
import { loginValidationSchema } from '@/Schema/Auth';
import { zodResolver } from '@hookform/resolvers/zod';


import { useAppDispatch } from '@/redux/hooks';
import { setUser } from '@/redux/features/auth/authSlice';
import { useLoginMutation } from '@/redux/features/auth/authApi';

type RoleType = 'customer' | 'vendor' | 'admin';

const DEMO_CREDENTIALS: Record<RoleType, { email: string; pass: string; label: string; icon: React.ReactNode }> = {
    customer: {
        email: 'alex.shopper@amarzone.com',
        pass: 'CustomerPass123!',
        label: 'Customer',
        icon: <User className="w-3.5 h-3.5" />
    },
    vendor: {
        email: 'store.seller@amarzone.com',
        pass: 'VendorPass123!',
        label: 'Vendor / Seller',
        icon: <Store className="w-3.5 h-3.5" />
    },
    admin: {
        email: 'system.admin@amarzone.com',
        pass: 'AdminPass123!',
        label: 'Administrator',
        icon: <Shield className="w-3.5 h-3.5" />
    }
};


const LoginForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const [activeRole, setActiveRole] = useState<RoleType | null>(null);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const handleDemoSelect = (role: RoleType) => {
        setActiveRole(role);
        setEmail(DEMO_CREDENTIALS[role].email);
        setPassword(DEMO_CREDENTIALS[role].pass);
        setStatusMessage({
            type: 'success',
            text: `Autofilled with ${DEMO_CREDENTIALS[role].label} demo credentials!`
        });
    };

    const onSubmit = async (data?: any) => {
        try {
            const loginData = data || { email, password };
            const res = await loginApi(loginData).unwrap();
            if (res?.data?.accessToken) {
                dispatch(setUser({
                    user: res.data.user || { email: loginData.email, role: activeRole || 'customer' },
                    token: res.data.accessToken
                }));
                setStatusMessage({ type: 'success', text: 'Login successful!' });
            }
        } catch (err: any) {
            setStatusMessage({ type: 'error', text: err?.data?.message || 'Login failed. Please check credentials.' });
        }
    };

    return (
        <div className="w-full max-w-md mx-auto">
            {/* Header */}
            <div className="text-center sm:text-left mb-6">
                <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Secure Sign In</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-base-content">
                    Welcome back
                </h2>
                <p className="text-base-content/70 text-sm mt-1.5">
                    Enter your credentials to access your Amarzone account
                </p>
            </div>

            {/* Notification Banner */}
            {statusMessage && (
                <div className={`alert ${statusMessage.type === 'success' ? 'alert-success' : 'alert-error'} mb-5 shadow-sm p-3 text-xs`}>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{statusMessage.text}</span>
                </div>
            )}

            {/* Divider */}
            <div className="divider text-xs text-base-content/60 my-5 uppercase font-medium tracking-widest">
                Or with email
            </div>

            {/* Form */}
            <AZForm
                resolver={zodResolver(loginValidationSchema)}
                onSubmit={onSubmit}
            >
                <div className="space-y-5">
                    <AZInput label="Email" name="email" type="email" placeholder="Enter your email" />
                    <div className="relative">
                        <AZInput
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                        />
                        <div
                            className="absolute right-4 top-10 cursor-pointer text-gray-500 hover:text-white transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? (
                                <Eye size={18} />
                            ) : (
                                <EyeOff size={18} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 text-right">
                    <Link href="/recover" className="text-[10px] font-black text-gray-500 hover:text-success uppercase tracking-widest italic transition-colors">
                        Recover Lost Key?
                    </Link>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        className="w-full group flex items-center justify-center gap-3 bg-success hover:bg-success/90 text-black py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] italic transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)]"
                        type="submit"
                    >
                        Login
                    </button>
                </div>
            </AZForm>
            {/* Footer Sign-up Callout */}
            <div className="mt-6 text-center text-xs text-base-content/70">
                Don&apos;t have an Amarzone account yet?{' '}
                <Link
                    href="/sign-up"
                    className="link link-hover link-warning font-bold inline-flex items-center gap-1 ml-0.5"
                >
                    Create an account
                </Link>
            </div>
        </div>
    );
};


export default LoginForm;