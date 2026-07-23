import React from 'react';
import { ShoppingBag, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';

export const AuthBrandShowcase: React.FC = () => {
    return (
        <div className="relative hidden lg:flex flex-col justify-between p-8 lg:p-12 overflow-hidden bg-neutral text-neutral-content rounded-none lg:w-1/2 min-h-[640px]">
            {/* Ambient Background Blur Glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute top-1/2 -right-20 w-80 h-80 bg-warning/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Header */}
            <div className="relative z-10">
                <div className="badge badge-warning badge-outline gap-2.5 p-3.5 mb-6 bg-base-100/10 backdrop-blur">
                    <div className="bg-warning text-slate-950 p-1 rounded-full font-black">
                        <ShoppingBag className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold tracking-wider uppercase text-warning">Amarzone Store</span>
                    <span className="badge badge-success badge-xs animate-ping ml-1" />
                </div>

                <h1 className="text-4xl font-extrabold tracking-tight leading-tight mb-4">
                    Elevate Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-warning via-amber-200 to-orange-400">
                        Shopping Experience
                    </span>
                </h1>
                <p className="text-neutral-content/80 text-sm max-w-md leading-relaxed font-light">
                    Join millions of savvy shoppers discovering daily deals, ultra-fast delivery, and verified premium products all in one place.
                </p>
            </div>

            {/* Middle Feature Cards Grid */}
            <div className="relative z-10 my-6 grid grid-cols-2 gap-3">
                <div className="card card-compact bg-base-100/10 backdrop-blur border border-base-content/10 p-4 transition hover:bg-base-100/20">
                    <div className="w-9 h-9 rounded-xl bg-warning/20 border border-warning/30 flex items-center justify-center text-warning mb-2">
                        <Truck className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs text-neutral-content">Express Delivery</h3>
                    <p className="text-[11px] text-neutral-content/70 mt-0.5">Free 24h shipping on orders over $50</p>
                </div>

                <div className="card card-compact bg-base-100/10 backdrop-blur border border-base-content/10 p-4 transition hover:bg-base-100/20">
                    <div className="w-9 h-9 rounded-xl bg-info/20 border border-info/30 flex items-center justify-center text-info mb-2">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs text-neutral-content">Buyer Protection</h3>
                    <p className="text-[11px] text-neutral-content/70 mt-0.5">100% money back guarantee on returns</p>
                </div>

                <div className="card card-compact bg-base-100/10 backdrop-blur border border-base-content/10 p-4 transition hover:bg-base-100/20">
                    <div className="w-9 h-9 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-secondary mb-2">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs text-neutral-content">Exclusive Deals</h3>
                    <p className="text-[11px] text-neutral-content/70 mt-0.5">Up to 70% off daily member rewards</p>
                </div>

                <div className="card card-compact bg-base-100/10 backdrop-blur border border-base-content/10 p-4 transition hover:bg-base-100/20">
                    <div className="w-9 h-9 rounded-xl bg-success/20 border border-success/30 flex items-center justify-center text-success mb-2">
                        <Award className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-xs text-neutral-content">Verified Quality</h3>
                    <p className="text-[11px] text-neutral-content/70 mt-0.5">Over 50k authentic top-tier brands</p>
                </div>
            </div>

            {/* Bottom Testimonial Banner */}
            <div className="relative z-10 card card-compact bg-base-100/15 backdrop-blur border border-base-content/10 p-4 flex flex-row items-center gap-4">
                <div className="avatar-group -space-x-3 shrink-0">
                    <div className="avatar placeholder">
                        <div className="w-9 rounded-full bg-warning text-slate-950 font-extrabold text-xs ring ring-warning ring-offset-base-100 ring-offset-1">
                            <span>SK</span>
                        </div>
                    </div>
                    <div className="avatar placeholder">
                        <div className="w-9 rounded-full bg-info text-slate-950 font-extrabold text-xs ring ring-info ring-offset-base-100 ring-offset-1">
                            <span>MR</span>
                        </div>
                    </div>
                    <div className="avatar placeholder">
                        <div className="w-9 rounded-full bg-success text-slate-950 font-extrabold text-xs ring ring-success ring-offset-base-100 ring-offset-1">
                            <span>AL</span>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="rating rating-xs">
                            {[...Array(5)].map((_, i) => (
                                <input
                                    key={i}
                                    type="radio"
                                    name="testimonial-rating"
                                    className="mask mask-star-2 bg-warning"
                                    checked
                                    readOnly
                                />
                            ))}
                        </div>
                        <span className="text-xs font-semibold text-warning ml-0.5">4.9 / 5.0</span>
                    </div>
                    <p className="text-xs text-neutral-content/90 italic">&quot;The smoothest checkout and fastest delivery I&apos;ve ever experienced.&quot;</p>
                </div>
            </div>
        </div>
    );
};


