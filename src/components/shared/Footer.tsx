'use client';

import React, { useState } from 'react';
import {
    ShieldCheck,
    Truck,
    RotateCcw,
    Headset,
    Send,
    ShoppingCart,
    Tag,
    Store,
    Globe,
    ChevronDown,
    Check
} from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
    const [email, setEmail] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && agreed) {
            setSubscribed(true);
        }
    };

    return (
        <footer className="bg-[#0b131f] text-slate-300 font-sans border-t border-slate-800">
            {/* 1. TOP FEATURE GUARANTEE BAR */}
            <div className="border-b border-slate-800/80 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
                    {/* Item 1 */}
                    <div className="flex items-center gap-4 lg:px-6 lg:first:pl-0 lg:border-r border-slate-800/80">
                        <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-emerald-400 shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-extrabold text-sm text-white leading-snug">100% Secure Payment</h4>
                            <p className="text-xs text-slate-400 font-normal">Pay with confidence</p>
                        </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex items-center gap-4 lg:px-6 lg:border-r border-slate-800/80">
                        <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-blue-400 shrink-0">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-extrabold text-sm text-white leading-snug">Fast & Free Delivery</h4>
                            <p className="text-xs text-slate-400 font-normal">On orders over $50</p>
                        </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex items-center gap-4 lg:px-6 lg:border-r border-slate-800/80">
                        <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-amber-400 shrink-0">
                            <RotateCcw className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-extrabold text-sm text-white leading-snug">Easy Returns</h4>
                            <p className="text-xs text-slate-400 font-normal">30 days money back</p>
                        </div>
                    </div>

                    {/* Item 4 */}
                    <div className="flex items-center gap-4 lg:px-6 lg:last:pr-0">
                        <div className="w-12 h-12 rounded-full bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-indigo-400 shrink-0">
                            <Headset className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-extrabold text-sm text-white leading-snug">24/7 Customer Support</h4>
                            <p className="text-xs text-slate-400 font-normal">We&apos;re here to help</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. MAIN FOOTER DIRECTORY & NEWSLETTER (6 COLUMNS IN 1 ROW) */}
            <div className="py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-[2.5fr_1.5fr_1.8fr_1.7fr_1.5fr_3fr] gap-6">
                    {/* Col 1: Brand & Socials */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            <img
                                src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
                                alt="Amarzone Logo"
                                className="h-20 w-auto object-contain"
                            />
                        </Link>

                        <p className="text-xs text-slate-400 leading-relaxed font-light">
                            Amarzone is a global online marketplace connecting buyers with trusted sellers. Shop from millions of products across multiple categories at the best prices.
                        </p>

                        {/* Social Buttons Row */}
                        <div className="flex items-center gap-2 pt-2">
                            {/* Facebook */}
                            <a href="#" className="w-8 h-8 rounded-full bg-[#1877f2] hover:opacity-90 flex items-center justify-center text-white transition-opacity" title="Facebook">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            {/* Twitter */}
                            <a href="#" className="w-8 h-8 rounded-full bg-[#1da1f2] hover:opacity-90 flex items-center justify-center text-white transition-opacity" title="Twitter">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.936 9.936 0 0024 4.59z" />
                                </svg>
                            </a>
                            {/* Instagram */}
                            <a href="#" className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90 flex items-center justify-center text-white transition-opacity" title="Instagram">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
                            {/* YouTube */}
                            <a href="#" className="w-8 h-8 rounded-full bg-[#ff0000] hover:opacity-90 flex items-center justify-center text-white transition-opacity" title="YouTube">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </a>
                            {/* LinkedIn */}
                            <a href="#" className="w-8 h-8 rounded-full bg-[#0a66c2] hover:opacity-90 flex items-center justify-center text-white transition-opacity" title="LinkedIn">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Col 2: COMPANY */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-xs font-black tracking-wider uppercase text-white">COMPANY</h3>
                            <div className="w-8 h-0.5 bg-amber-400 mt-1.5" />
                        </div>
                        <ul className="space-y-2 text-xs font-normal text-slate-400">
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Press & Media</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Blog</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Contact Us</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Become an Affiliate</Link></li>
                        </ul>
                    </div>

                    {/* Col 3: CUSTOMER SERVICE */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-xs font-black tracking-wider uppercase text-white">CUSTOMER SERVICE</h3>
                            <div className="w-8 h-0.5 bg-amber-400 mt-1.5" />
                        </div>
                        <ul className="space-y-2 text-xs font-normal text-slate-400">
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">FAQs</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Track Your Order</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Shipping Policy</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Return Policy</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Refund Policy</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Warranty Policy</Link></li>
                        </ul>
                    </div>

                    {/* Col 4: FOR SELLERS */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-xs font-black tracking-wider uppercase text-white">FOR SELLERS</h3>
                            <div className="w-8 h-0.5 bg-amber-400 mt-1.5" />
                        </div>
                        <ul className="space-y-2 text-xs font-normal text-slate-400">
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Sell on Amarzone</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Seller Dashboard</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Seller Guidelines</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Seller Fees</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Seller Policy</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Become a Vendor</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Vendor Login</Link></li>
                        </ul>
                    </div>

                    {/* Col 5: LEGAL */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-xs font-black tracking-wider uppercase text-white">LEGAL</h3>
                            <div className="w-8 h-0.5 bg-amber-400 mt-1.5" />
                        </div>
                        <ul className="space-y-2 text-xs font-normal text-slate-400">
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Cookie Policy</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Buyer Policy</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Intellectual Property</Link></li>
                            <li><Link href="#" className="hover:text-amber-400 transition-colors">Compliance</Link></li>
                        </ul>
                    </div>

                    {/* Col 6: STAY CONNECTED & APP DOWNLOADS */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xs font-black tracking-wider uppercase text-white">STAY CONNECTED</h3>
                            <div className="w-8 h-0.5 bg-amber-400 mt-1.5" />
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed font-light">
                            Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
                        </p>

                        {/* Newsletter Input */}
                        {subscribed ? (
                            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                                <Check className="w-4 h-4 text-emerald-400" />
                                <span>Subscribed successfully!</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="space-y-2.5">
                                <div className="flex items-center">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        className="w-full bg-[#111a28] border border-slate-700/80 rounded-l-lg px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-[#ffc107] hover:bg-amber-400 text-slate-950 px-3.5 py-2.5 rounded-r-lg font-bold transition-all shrink-0 active:scale-95"
                                    >
                                        <Send className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                </div>

                                <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-400">
                                    <input
                                        type="checkbox"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        className="mt-0.5 rounded border-slate-700 bg-slate-900 text-amber-400 focus:ring-0"
                                    />
                                    <span>
                                        I agree to the{' '}
                                        <Link href="#" className="text-slate-300 hover:text-amber-400 underline">
                                            Privacy Policy
                                        </Link>
                                    </span>
                                </label>
                            </form>
                        )}

                        {/* APP DOWNLOAD SECTION */}
                        <div className="pt-2 space-y-2">
                            <div>
                                <h4 className="text-[11px] font-black tracking-wider uppercase text-white">
                                    DOWNLOAD OUR APP
                                </h4>
                                <div className="w-8 h-0.5 bg-amber-400 mt-1" />
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                                {/* Google Play Badge */}
                                <a
                                    href="#"
                                    className="flex items-center gap-2 bg-[#111a28] hover:bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L18.81,13.12C19.43,12.5 19.43,11.5 18.81,10.88L16.81,8.88L14.76,10.93L14.76,13.07L16.81,15.12M15.81,6.88L5.26,1.47C4.94,1.31 4.56,1.44 4.4,1.76C4.34,1.88 4.31,2.02 4.31,2.15L13.69,11.53L15.81,6.88M15.81,17.12L13.69,12.47L4.31,21.85C4.31,21.98 4.34,22.12 4.4,22.24C4.56,22.56 4.94,22.69 5.26,22.53L15.81,17.12Z" />
                                    </svg>
                                    <div className="flex flex-col text-left leading-tight">
                                        <span className="text-[8px] uppercase tracking-wider text-slate-400">GET IT ON</span>
                                        <span className="text-[11px] font-bold text-white tracking-tight">Google Play</span>
                                    </div>
                                </a>

                                {/* App Store Badge */}
                                <a
                                    href="#"
                                    className="flex items-center gap-2 bg-[#111a28] hover:bg-slate-800 border border-slate-700/80 rounded-lg px-3 py-1.5 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.09,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z" />
                                    </svg>
                                    <div className="flex flex-col text-left leading-tight">
                                        <span className="text-[8px] uppercase tracking-wider text-slate-400">Download on the</span>
                                        <span className="text-[11px] font-bold text-white tracking-tight">App Store</span>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. STATS ROW (4 LARGE STAT BADGES) */}
            <div className="border-t border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 bg-[#090f18]/60">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
                    {/* Stat 1 */}
                    <div className="flex items-center gap-4 lg:px-8 lg:first:pl-0 lg:border-r border-slate-800/80">
                        <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300 shrink-0">
                            <ShoppingCart className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">10M+</h3>
                            <p className="text-xs text-slate-400 font-medium">Happy Customers</p>
                        </div>
                    </div>

                    {/* Stat 2 */}
                    <div className="flex items-center gap-4 lg:px-8 lg:border-r border-slate-800/80">
                        <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300 shrink-0">
                            <Tag className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">25M+</h3>
                            <p className="text-xs text-slate-400 font-medium">Products Available</p>
                        </div>
                    </div>

                    {/* Stat 3 */}
                    <div className="flex items-center gap-4 lg:px-8 lg:border-r border-slate-800/80">
                        <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300 shrink-0">
                            <Store className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">50K+</h3>
                            <p className="text-xs text-slate-400 font-medium">Trusted Sellers</p>
                        </div>
                    </div>

                    {/* Stat 4 */}
                    <div className="flex items-center gap-4 lg:px-8 lg:last:pr-0">
                        <div className="w-12 h-12 rounded-full bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-300 shrink-0">
                            <Globe className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white tracking-tight">200+</h3>
                            <p className="text-xs text-slate-400 font-medium">Countries Served</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. BOTTOM FOOTER BAR (COPYRIGHT + PAYMENT BADGES + REGION SELECTORS) */}
            <div className="py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Left Copyright */}
                    <div className="text-slate-400 font-normal">
                        &copy; 2025 Amarzone. All rights reserved.
                    </div>

                    {/* Center Payment Logos */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {/* VISA */}
                        <div className="px-2.5 py-1 bg-white rounded text-[#1a1f71] font-black text-xs shadow-xs">
                            VISA
                        </div>
                        {/* Mastercard */}
                        <div className="px-2.5 py-1 bg-white rounded text-slate-900 font-bold text-xs shadow-xs flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block -ml-2" />
                        </div>
                        {/* AMEX */}
                        <div className="px-2.5 py-1 bg-[#006fcf] text-white rounded font-black text-[10px] shadow-xs">
                            AMEX
                        </div>
                        {/* PayPal */}
                        <div className="px-2.5 py-1 bg-white text-[#003087] rounded font-black text-xs shadow-xs italic">
                            PayPal
                        </div>
                        {/* Stripe */}
                        <div className="px-2.5 py-1 bg-[#635bfc] text-white rounded font-bold text-xs shadow-xs">
                            stripe
                        </div>
                        {/* SSL SECURED */}
                        <div className="px-2.5 py-1 bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-extrabold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span>SSL SECURED</span>
                        </div>
                    </div>

                    {/* Right Selectors */}
                    <div className="flex items-center gap-4 text-xs">
                        {/* Language */}
                        <div className="flex items-center gap-1.5 cursor-pointer hover:text-white transition-colors">
                            <Globe className="w-3.5 h-3.5" />
                            <span>English</span>
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                        </div>

                        {/* Currency */}
                        <div className="flex items-center gap-1 cursor-pointer hover:text-white transition-colors border-l border-slate-800 pl-4">
                            <span>USD ($)</span>
                            <ChevronDown className="w-3 h-3 text-slate-500" />
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
