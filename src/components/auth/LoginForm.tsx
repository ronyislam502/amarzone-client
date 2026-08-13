'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle2, Sparkles } from 'lucide-react';
import AZForm from '../form/AZFrom';
import AZInput from '../form/AZInput';
import { loginValidationSchema } from '@/Schema/Auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/redux/hooks';
import { setUser, TUser } from '@/redux/features/auth/authSlice';
import { useLogInMutation } from '@/redux/features/auth/authApi';
import { toast } from 'react-toastify';
import { FieldValues } from 'react-hook-form';
import { verifyToken } from '../utilities/verifyToken';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


const LoginForm: React.FC = () => {
    const dispatch = useAppDispatch();
    const [loginApi, { isLoading: isLoggingIn }] = useLogInMutation();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const onSubmit = async (data: FieldValues) => {

        const authData = {
            email: data.email,
            password: data.password
        }

        const res = await loginApi(authData).unwrap();
        const user = verifyToken(res.data.accessToken) as TUser;
        dispatch(setUser({ user: user, token: res.data.accessToken }));

        if (res?.success) {
            Cookies.set("accessToken", res?.data?.accessToken);
            Cookies.set("refreshToken", res?.data?.refreshToken);
            toast.success(res?.message, {
                autoClose: 1000,
            });
            router.push("/");
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
                    <Link href="/reset-pass" className="text-[10px] font-black text-gray-500 hover:text-warning uppercase tracking-widest italic transition-colors">
                        Forgot Password?
                    </Link>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        className="w-full group flex items-center justify-center gap-3 bg-success hover:bg-success/90 text-black py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] italic transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] disabled:opacity-50"
                        type="submit"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? 'Logging in...' : 'Login'}
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