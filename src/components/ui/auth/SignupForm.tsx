'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Eye,
    EyeOff,
    User,
    Store,
    Sparkles,
    Mail,
    Phone,
    Lock,
    MapPin,
    Building,
    Globe,
    Loader2,
    CheckCircle2,
} from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FieldValues } from 'react-hook-form';
import AZForm from '../../form/AZFrom';
import { registerSchema } from '@/src/schema/Auth';
import AZInput from '../../form/AZInput';


export const SignUpForm = () => {
    const [role, setRole] = useState<'customer' | 'vendor'>('customer');
    const [showPassword, setShowPassword] = useState(false);
    const [showAddressFields, setShowAddressFields] = useState(false);


    const onSubmit = async (data: FieldValues) => {
        const address = {
            street: data.street,
            state: data.state,
            postalCode: data.postalCode,
            country: data.country,
        }

        console.log("address")

    };

    return (
        <div className="w-full max-w-md mx-auto py-2">
            {/* Header */}
            <div className="text-center sm:text-left mb-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="badge badge-warning gap-1.5 px-3 py-2 text-xs font-semibold shadow-md">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Join Amarzone E-Commerce</span>
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold tracking-tight text-white">
                    Create your account
                </h2>
                <p className="text-gray-400 text-sm mt-1.5">
                    {role === 'customer'
                        ? 'Shop millions of products with exclusive deals & instant checkout.'
                        : 'Launch your storefront and start selling to thousands of customers.'}
                </p>
            </div>

            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-900/90 rounded-2xl mb-6 border border-white/10 shadow-inner">
                <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${role === 'customer'
                        ? 'bg-warning text-slate-950 shadow-lg shadow-warning/20 scale-[1.02]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <User className="w-4 h-4" />
                    <span>Customer Account</span>
                </button>

                <button
                    type="button"
                    onClick={() => setRole('vendor')}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${role === 'vendor'
                        ? 'bg-warning text-slate-950 shadow-lg shadow-warning/20 scale-[1.02]'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Store className="w-4 h-4" />
                    <span>Vendor / Seller</span>
                </button>
            </div>

            {/* Registration Form */}
            <AZForm
                resolver={zodResolver(registerSchema)}
                onSubmit={onSubmit}
            >
                <div className="space-y-4">
                    {/* Full Name */}
                    <AZInput
                        label="Full Name"
                        name="name"
                        type="text"
                        placeholder="enter your name"
                        icon={<User size={18} />}
                    />

                    {/* Email & Phone side-by-side or stacked */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <AZInput
                            label="Email"
                            name="email"
                            type="email"
                            placeholder="enter your email"
                            icon={<Mail size={18} />}
                        />
                        <AZInput
                            label="Phone"
                            name="phone"
                            type="text"
                            placeholder="enter your phone number"
                            icon={<Phone size={18} />}
                        />
                    </div>

                    {/* Toggleable Address Section */}
                    <div className="pt-1">
                        <button
                            type="button"
                            onClick={() => setShowAddressFields(!showAddressFields)}
                            className="text-xs font-semibold text-warning hover:text-amber-300 flex items-center gap-1.5 transition-colors focus:outline-none"
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
                                    placeholder="enter your street addess"
                                    icon={<MapPin size={16} />}
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    <AZInput
                                        label="State / City"
                                        name="state"
                                        type="text"
                                        placeholder="State"
                                        icon={<Building size={14} />}
                                    />
                                    <AZInput
                                        label="Postal Code"
                                        name="postalCode"
                                        type="text"
                                        placeholder="1200"
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

                    {/* Password */}
                    <div className="relative">
                        <AZInput
                            label="Password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
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

                {/* Features & Terms Note */}
                <div className="mt-4 flex items-center gap-2 text-[11px] text-gray-400">
                    <CheckCircle2 size={14} className="text-success shrink-0" />
                    <span>
                        By creating an account, you agree to Amarzone Terms & Privacy Policy.
                    </span>
                </div>

                {/* Submit Button */}
                <div className="mt-6">
                    <button
                        className="w-full group flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 text-slate-950 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] italic transition-all duration-300 active:scale-98 shadow-[0_15px_30px_-8px_rgba(34,197,94,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                    >
                        Signup
                    </button>
                </div>
            </AZForm>

            {/* Footer Sign-in Callout */}
            <div className="mt-6 text-center text-xs text-gray-400">
                Already have an Amarzone account?{' '}
                <Link
                    href="/login"
                    className="text-warning hover:underline font-bold inline-flex items-center gap-1 ml-0.5"
                >
                    Sign in here
                </Link>
            </div>
        </div>
    );
};

export default SignUpForm;
