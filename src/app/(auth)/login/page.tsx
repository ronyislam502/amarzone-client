import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { AuthBrandShowcase } from '@/components/auth/AuthBrandShowcase';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export const metadata = {
    title: 'Sign In | Amarzone E-Commerce',
    description: 'Log in to your Amarzone account to access thousands of exclusive deals, track orders, and manage your wishlist.'
};

const LoginPage = () => {
    return (
        <main className="hero min-h-screen bg-base-200 p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
            {/* Ambient Background Light Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Mobile Header Logo */}
            <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2 z-20">
                <Link href="/" className="flex items-center gap-2">
                    <div className="badge badge-warning p-3 text-slate-950 font-black">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-base-content">Amarzone</span>
                </Link>
            </div>

            {/* Main DaisyUI Hero Content & Card Container */}
            <div className="hero-content p-0 w-full max-w-6xl z-10">
                <div className="card lg:card-side bg-base-100 shadow-2xl border border-base-300 w-full overflow-hidden">
                    {/* Left Side: Brand Showcase (Desktop) */}
                    <AuthBrandShowcase />

                    {/* Right Side: Interactive Login Form Container */}
                    <div className="card-body p-6 sm:p-8 lg:p-10 lg:w-1/2 flex flex-col justify-center">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default LoginPage;