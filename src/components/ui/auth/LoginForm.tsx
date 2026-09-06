"use client"

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { FieldValues } from 'react-hook-form';
import AZForm from '../../form/AZFrom';
import AZInput from '../../form/AZInput';
import { loginSchema } from '@/src/schema/Auth';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/src/redux/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { TAuthUser } from '@/src/types/user';
import { verifyToken } from '../../utilities/verifyToken';
import { setUser } from '@/src/redux/features/auth/authSlice';
import { useLogInMutation } from '@/src/redux/features/auth/authApi';
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";



const LoginForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const [signIn, { isLoading: isLoginLoading }] = useLogInMutation();



    const onSubmit = async (data: FieldValues) => {

        try {
            const authData = {
                email: data.email,
                password: data.password
            };

            const res = await signIn(authData).unwrap();

            console.log("res", res)

            const user = verifyToken(res.data.accessToken) as TAuthUser;
            dispatch(setUser({ user: user, token: res.data.accessToken }));

            if (res?.success) {
                Cookies.set("accessToken", res.data.accessToken);

                // refreshToken is usually handled by http-only cookies from server
                toast.success(res?.message);
                // loginMethods.reset();

                if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') {
                    router.push("/admin");
                } else if (user?.role === 'VENDOR') {
                    router.push("/vendor");
                } else if (user?.role === 'CUSTOMER') {
                    router.push("/customer");
                } else {
                    router.push("/");
                }
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Login failed. Please check your credentials.");
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
                resolver={zodResolver(loginSchema)}
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
                    <Link href="/forget" className="text-[10px] font-black text-gray-500 hover:text-warning uppercase tracking-widest italic transition-colors">
                        Forgot Password?
                    </Link>
                </div>

                <div className="mt-8 space-y-4">
                    <button
                        className="w-full group flex items-center justify-center gap-3 bg-success hover:bg-success/90 text-black py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] italic transition-all active:scale-95 shadow-[0_20px_40px_-10px_rgba(34,197,94,0.3)] disabled:opacity-50"
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
                    href="/signup"
                    className="link link-hover link-warning font-bold inline-flex items-center gap-1 ml-0.5"
                >
                    Create an account
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;