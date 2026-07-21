import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Star, Sparkles, Award } from 'lucide-react';

export const AuthBrandShowcase: React.FC = () => {
    return (
        <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-gradient-to-br from-indigo-950 via-slate-900 to-amber-950 text-white rounded-3xl min-h-[680px]">
            {/* Ambient Background Blur Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 -right-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="relative z-10">
                <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/15 shadow-inner mb-6">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-600 p-1.5 rounded-full text-slate-950 font-black">
                        <ShoppingBag className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold tracking-wide text-amber-200 uppercase">Amarzone Store</span>
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
                    Elevate Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400">
                        Shopping Experience
                    </span>
                </h1>
                <p className="text-slate-300 text-base max-w-md leading-relaxed font-light">
                    Join millions of savvy shoppers discovering daily deals, ultra-fast delivery, and verified premium products all in one place.
                </p>
            </div>

            {/* Middle Feature Cards Grid */}
            <div className="relative z-10 my-8 grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl transition hover:bg-white/10 hover:border-white/20">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3">
                        <Truck className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100">Express Delivery</h3>
                    <p className="text-xs text-slate-400 mt-1">Free 24h shipping on orders over $50</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl transition hover:bg-white/10 hover:border-white/20">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 mb-3">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100">Buyer Protection</h3>
                    <p className="text-xs text-slate-400 mt-1">100% money back guarantee on returns</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl transition hover:bg-white/10 hover:border-white/20">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400 mb-3">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100">Exclusive Deals</h3>
                    <p className="text-xs text-slate-400 mt-1">Up to 70% off daily member rewards</p>
                </div>

                <div className="bg-white/5 backdrop-blur-lg border border-white/10 p-4 rounded-2xl transition hover:bg-white/10 hover:border-white/20">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mb-3">
                        <Award className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-sm text-slate-100">Verified Quality</h3>
                    <p className="text-xs text-slate-400 mt-1">Over 50k authentic top-tier brands</p>
                </div>
            </div>

            {/* Bottom Testimonial Banner */}
            <div className="relative z-10 bg-slate-950/60 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4">
                <div className="flex -space-x-2 overflow-hidden shrink-0">
                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-amber-400 bg-gradient-to-tr from-amber-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                        SK
                    </div>
                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-indigo-400 bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-xs font-bold text-white">
                        MR
                    </div>
                    <div className="inline-block h-10 w-10 rounded-full ring-2 ring-emerald-400 bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                        AL
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs mb-0.5">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                        <span className="ml-1 text-slate-300 font-medium">4.9 / 5.0</span>
                    </div>
                    <p className="text-xs text-slate-300 italic">"The smoothest checkout and fastest delivery I've ever experienced."</p>
                </div>
            </div>
        </div>
    );
};
