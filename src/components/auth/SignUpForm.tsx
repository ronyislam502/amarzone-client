'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    User,
    Store,
    Sparkles,
    ShieldAlert,
    Building,
    Check,
    AlertCircle
} from 'lucide-react';
import { useCreateCustomerMutation, useCreateVendorMutation } from '@/redux/features/auth/authApi';

type RoleType = 'customer' | 'vendor';

interface FormState {
    name: string;
    email: string;
    shopName: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

const getPasswordStrength = (password: string): { score: number; label: string; color: string } => {
    if (!password) return { score: 0, label: 'Empty', color: 'progress-error' };
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    if (/[^A-Za-z0-9]/.test(password)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: 'progress-error' };
    if (score <= 50) return { score, label: 'Fair', color: 'progress-warning' };
    if (score <= 75) return { score, label: 'Good', color: 'progress-info' };
    return { score, label: 'Strong', color: 'progress-success' };
};

import { toast } from 'react-toastify';

export const SignUpForm: React.FC = () => {
    const [createCustomer, { isLoading: isCreatingCustomer }] = useCreateCustomerMutation();
    const [createVendor, { isLoading: isCreatingVendor }] = useCreateVendorMutation();

    const [role, setRole] = useState<RoleType>('customer');
    const [formData, setFormData] = useState<FormState>({
        name: '',
        email: '',
        shopName: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const isLoading = isCreatingCustomer || isCreatingVendor;

    const handleInputChange = (field: keyof FormState, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (statusMessage) setStatusMessage(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            const errMsg = 'Passwords do not match! Please check your entries.';
            setStatusMessage({ type: 'error', text: errMsg });
            toast.error(errMsg);
            return;
        }

        if (!formData.agreeToTerms) {
            const errMsg = 'Please accept the Terms of Service and Privacy Policy to register.';
            setStatusMessage({ type: 'error', text: errMsg });
            toast.error(errMsg);
            return;
        }

        setStatusMessage(null);

        try {
            if (role === 'customer') {
                const customerData = {
                    password: formData.password,
                    customer: {
                        name: formData.name,
                        email: formData.email,
                        phone: '01700000000',
                        address: {
                            street: 'Default St',
                            city: 'Dhaka',
                            state: 'Dhaka',
                            postalCode: '1200',
                            country: 'Bangladesh'
                        }
                    }
                };
                const res = await createCustomer(customerData).unwrap();
                const successMsg = res?.message || `Welcome aboard, ${formData.name}! Your Customer account was created successfully.`;
                setStatusMessage({ type: 'success', text: successMsg });
                toast.success(successMsg);
            } else {
                const vendorData = {
                    password: formData.password,
                    vendor: {
                        name: formData.name,
                        email: formData.email,
                        shopName: formData.shopName || `${formData.name}'s Store`,
                        phone: '01700000000',
                        address: {
                            street: 'Default St',
                            city: 'Dhaka',
                            state: 'Dhaka',
                            postalCode: '1200',
                            country: 'Bangladesh'
                        }
                    }
                };
                const res = await createVendor(vendorData).unwrap();
                const successMsg = res?.message || `Welcome aboard, ${formData.name}! Your Vendor store account was created successfully.`;
                setStatusMessage({ type: 'success', text: successMsg });
                toast.success(successMsg);
            }
        } catch (err: any) {
            const errMsg = err?.data?.message || 'Registration failed. Please try again with valid details.';
            setStatusMessage({ type: 'error', text: errMsg });
            toast.error(errMsg);
        }
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const passwordsMatch = formData.confirmPassword ? formData.password === formData.confirmPassword : true;

    return (
        <div className="w-full max-w-md mx-auto py-2">
            {/* Header */}
            <div className="text-center sm:text-left mb-5">
                <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Join Amarzone</span>
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-base-content">
                    Create an account
                </h2>
                <p className="text-base-content/70 text-sm mt-1">
                    Start your shopping journey or launch your online store today
                </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-base-200 rounded-xl mb-5 border border-base-300">
                <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`btn btn-sm border-none gap-2 text-xs font-bold transition-all ${
                        role === 'customer'
                            ? 'bg-warning text-slate-950 shadow-md'
                            : 'btn-ghost text-base-content/70 hover:text-base-content'
                    }`}
                >
                    <User className="w-4 h-4" />
                    <span>Customer Account</span>
                </button>
                <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`btn btn-sm border-none gap-2 text-xs font-bold transition-all ${
                        role === 'vendor'
                            ? 'bg-warning text-slate-950 shadow-md'
                            : 'btn-ghost text-base-content/70 hover:text-base-content'
                    }`}
                >
                    <Store className="w-4 h-4" />
                    <span>Vendor / Seller</span>
                </button>
            </div>

            {/* Notification Banner */}
            {statusMessage && (
                <div
                    className={`alert ${
                        statusMessage.type === 'success' ? 'alert-success' : 'alert-error'
                    } mb-4 shadow-sm p-3 text-xs flex items-center gap-2`}
                >
                    {statusMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                    )}
                    <span>{statusMessage.text}</span>
                </div>
            )}

            {/* Social Logins */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    className="btn btn-outline btn-sm flex-1 gap-2 border-base-300 font-medium"
                >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    <span>Google</span>
                </button>
                <button
                    type="button"
                    className="btn btn-outline btn-sm flex-1 gap-2 border-base-300 font-medium"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span>GitHub</span>
                </button>
                <button
                    type="button"
                    className="btn btn-outline btn-sm flex-1 gap-2 border-base-300 font-medium"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.85c.66-.8 1.11-1.92.99-3.04-.96.04-2.12.64-2.8 1.44-.61.71-1.14 1.86-1 2.97 1.07.08 2.15-.57 2.81-1.37z" />
                    </svg>
                    <span>Apple</span>
                </button>
            </div>

            {/* Divider */}
            <div className="divider text-xs text-base-content/60 my-4 uppercase font-medium tracking-widest">
                Or fill details
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name Field */}
                <fieldset className="fieldset p-0">
                    <legend className="fieldset-label text-xs font-semibold text-base-content mb-1">
                        Full Name
                    </legend>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50 z-10">
                            <User className="w-4 h-4" />
                        </div>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="e.g. Jane Doe"
                            className="input input-bordered w-full pl-10 pr-4 text-sm"
                        />
                    </div>
                </fieldset>

                {/* Email Field */}
                <fieldset className="fieldset p-0">
                    <legend className="fieldset-label text-xs font-semibold text-base-content mb-1">
                        Email Address
                    </legend>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50 z-10">
                            <Mail className="w-4 h-4" />
                        </div>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="name@example.com"
                            className="input input-bordered w-full pl-10 pr-4 text-sm"
                        />
                    </div>
                </fieldset>

                {/* Vendor Dynamic Field: Shop Name */}
                {role === 'vendor' && (
                    <fieldset className="fieldset p-0 animate-fadeIn">
                        <legend className="fieldset-label text-xs font-semibold text-base-content mb-1">
                            Store / Shop Name
                        </legend>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50 z-10">
                                <Building className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                required
                                value={formData.shopName}
                                onChange={(e) => handleInputChange('shopName', e.target.value)}
                                placeholder="e.g. Global Tech Store"
                                className="input input-bordered w-full pl-10 pr-4 text-sm"
                            />
                        </div>
                    </fieldset>
                )}

                {/* Password Field */}
                <fieldset className="fieldset p-0">
                    <div className="flex items-center justify-between mb-1">
                        <legend className="fieldset-label text-xs font-semibold text-base-content">
                            Password
                        </legend>
                        {formData.password && (
                            <span className="text-[11px] font-medium text-base-content/70 flex items-center gap-1">
                                Strength: <span className="font-bold text-base-content">{passwordStrength.label}</span>
                            </span>
                        )}
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50 z-10">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={formData.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            placeholder="Min. 8 characters"
                            className="input input-bordered w-full pl-10 pr-10 text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/50 hover:text-base-content transition z-10"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* DaisyUI Password Strength Progress Bar */}
                    {formData.password && (
                        <div className="mt-1.5 flex items-center gap-2">
                            <progress
                                className={`progress ${passwordStrength.color} w-full h-1.5`}
                                value={passwordStrength.score}
                                max="100"
                            />
                        </div>
                    )}
                </fieldset>

                {/* Confirm Password Field */}
                <fieldset className="fieldset p-0">
                    <legend className="fieldset-label text-xs font-semibold text-base-content mb-1">
                        Confirm Password
                    </legend>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-base-content/50 z-10">
                            <Lock className="w-4 h-4" />
                        </div>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            placeholder="Re-enter your password"
                            className={`input input-bordered w-full pl-10 pr-10 text-sm ${
                                !passwordsMatch ? 'input-error' : ''
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-base-content/50 hover:text-base-content transition z-10"
                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {!passwordsMatch && (
                        <p className="text-[11px] text-error mt-1 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" /> Passwords do not match
                        </p>
                    )}
                </fieldset>

                {/* Terms and Conditions Checkbox */}
                <div className="py-1">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                            className="checkbox checkbox-warning checkbox-sm mt-0.5"
                        />
                        <span className="text-xs text-base-content/80 leading-relaxed select-none">
                            I agree to Amarzone&apos;s{' '}
                            <Link href="/terms" className="link link-hover link-warning font-semibold">
                                Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="link link-hover link-warning font-semibold">
                                Privacy Policy
                            </Link>
                            .
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-warning btn-block shadow-lg shadow-warning/20 font-bold text-slate-950 gap-2 mt-2"
                >
                    {isLoading ? (
                        <>
                            <span className="loading loading-spinner loading-sm" />
                            <span>Creating Account...</span>
                        </>
                    ) : (
                        <>
                            <span>Register as {role === 'vendor' ? 'Vendor' : 'Customer'}</span>
                            <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>

            {/* Footer Sign-in Callout */}
            <div className="mt-5 text-center text-xs text-base-content/70">
                Already have an account?{' '}
                <Link
                    href="/login"
                    className="link link-hover link-warning font-bold inline-flex items-center gap-1 ml-0.5"
                >
                    Sign in here
                </Link>
            </div>
        </div>
    );
};
