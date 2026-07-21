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
        <main className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
            {/* Ambient Background Light Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

            {/* Mobile Header Logo */}
            <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-amber-500 p-2 rounded-xl text-slate-950 font-black">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-white">Amarzone</span>
                </Link>
            </div>

            {/* Main Outer Container */}
            <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl shadow-black/50">
                {/* Left Side: Brand Showcase (Desktop) */}
                <AuthBrandShowcase />

                {/* Right Side: Interactive Login Form Container */}
                <div className="px-2 sm:px-6 py-4">
                    <LoginForm />
                </div>
            </div>
        </main>
    );
};

export default LoginPage;