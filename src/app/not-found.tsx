'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Compass,
    Home,
    ArrowLeft,
    ShoppingBag,
    HelpCircle,
    LayoutDashboard,
    Search,
    Sparkles,
} from 'lucide-react';

const NotFound = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#070b12] text-slate-100 flex items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden font-sans antialiased">
            {/* Ambient Background Glow Effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-500/10 via-teal-500/10 to-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-2xl text-center relative z-10 space-y-8">
                {/* 404 Glowing Header & Compass Badge */}
                <div className="relative inline-block">
                    {/* Glowing 404 Text */}
                    <h1 className="text-[120px] sm:text-[160px] md:text-[200px] font-black leading-none tracking-tighter bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent select-none drop-shadow-[0_10px_35px_rgba(16,185,129,0.3)] animate-pulse">
                        404
                    </h1>

                    {/* Floating Icon Overlay */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-950/80 border border-white/10 backdrop-blur-xl p-4 sm:p-5 rounded-3xl shadow-2xl flex items-center gap-3">
                        <div className="p-3 bg-gradient-to-tr from-amber-500 to-emerald-400 text-slate-950 rounded-2xl shadow-lg">
                            <Compass className="w-8 h-8 sm:w-10 sm:h-10 animate-spin-slow" />
                        </div>
                        <div className="text-left hidden sm:block pr-2">
                            <span className="badge badge-warning badge-xs font-black uppercase tracking-widest gap-1">
                                <Sparkles className="w-3 h-3" /> Lost Signal
                            </span>
                            <p className="text-[11px] font-bold text-gray-300 mt-0.5">Route Not Found</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Message */}
                <div className="space-y-3 max-w-lg mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        Page Lost in Transmission
                    </h2>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                        Oops! The requested page or resource doesn&apos;t exist on Amarzone, has been moved, or is temporarily unavailable.
                    </p>
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn btn-outline border-white/15 text-gray-300 hover:bg-white/10 hover:border-white/30 rounded-2xl px-6 text-xs font-bold gap-2 shadow-sm transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" /> Go Back
                    </button>

                    <Link
                        href="/"
                        className="btn bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 border-none rounded-2xl px-7 text-xs font-black uppercase tracking-wider gap-2 shadow-[0_10px_30px_rgba(16,185,129,0.35)] transition-all active:scale-95"
                    >
                        <Home className="w-4 h-4" /> Back to Home
                    </Link>

                    <Link
                        href="/customer"
                        className="btn bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl px-6 text-xs font-bold gap-2 transition-all"
                    >
                        <LayoutDashboard className="w-4 h-4 text-emerald-400" /> Go to Dashboard
                    </Link>
                </div>

                {/* Helpful Quick Links Grid */}
                <div className="pt-8 border-t border-white/10 max-w-xl mx-auto">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] italic text-gray-500 mb-4">
                        Quick Navigation Shortcuts
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Link
                            href="/"
                            className="p-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/30 rounded-2xl text-left transition-all group"
                        >
                            <ShoppingBag className="w-4 h-4 text-amber-400 mb-1 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold text-white">Products</h4>
                            <p className="text-[9px] text-gray-500 truncate">Explore Store</p>
                        </Link>

                        <Link
                            href="/customer"
                            className="p-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/30 rounded-2xl text-left transition-all group"
                        >
                            <LayoutDashboard className="w-4 h-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold text-white">My Account</h4>
                            <p className="text-[9px] text-gray-500 truncate">Customer Portal</p>
                        </Link>

                        <Link
                            href="/vendor"
                            className="p-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/30 rounded-2xl text-left transition-all group"
                        >
                            <Sparkles className="w-4 h-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold text-white">Vendor Hub</h4>
                            <p className="text-[9px] text-gray-500 truncate">Seller Portal</p>
                        </Link>

                        <Link
                            href="/customer/support"
                            className="p-3 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-emerald-500/30 rounded-2xl text-left transition-all group"
                        >
                            <HelpCircle className="w-4 h-4 text-cyan-400 mb-1 group-hover:scale-110 transition-transform" />
                            <h4 className="text-xs font-bold text-white">Support</h4>
                            <p className="text-[9px] text-gray-500 truncate">24/7 Assistance</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFound;
