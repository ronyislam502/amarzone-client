import { ShoppingBag, Package, Sparkles, ShieldCheck, Truck, Zap } from "lucide-react";


const Loading = () => {
    return (
        <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-500 selection:text-slate-950">
            {/* Background Animated Ambient Orbs */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" />
            <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none animate-float-slow" />
            <div className="absolute top-20 left-10 w-[300px] h-[300px] bg-amber-600/10 rounded-full blur-[90px] pointer-events-none animate-float-reverse" />

            {/* Background Dot Grid Pattern */}
            <div className="absolute inset-0 bg-dot-grid opacity-30 pointer-events-none" />

            {/* Main Container */}
            <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col justify-between">

                {/* Top Header Placeholder */}
                <div className="w-full flex items-center justify-between py-3 border-b border-slate-800/60 backdrop-blur-sm">
                    {/* Logo Brand Skeleton */}
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-pulse">
                            <ShoppingBag className="w-5 h-5 text-slate-950 font-bold" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                            Amarzone
                        </span>
                    </div>

                    {/* Search Bar Skeleton */}
                    <div className="hidden md:flex items-center flex-1 max-w-xl mx-8 relative h-10 rounded-full bg-slate-900/80 border border-slate-800/80 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/40 to-transparent animate-shimmer" />
                    </div>

                    {/* Quick Stats Skeleton */}
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 animate-pulse" />
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 animate-pulse" />
                        <div className="w-20 h-8 rounded-lg bg-slate-900 border border-slate-800 animate-pulse hidden sm:block" />
                    </div>
                </div>

                {/* Hero Loading Centerpiece */}
                <div className="my-12 flex flex-col items-center justify-center text-center relative">
                    {/* Brand Icon Spinner Rings */}
                    <div className="relative flex items-center justify-center mb-6">
                        {/* Outer Spinning Ring */}
                        <div className="w-24 h-24 rounded-full border-2 border-slate-800 border-t-amber-500 border-r-amber-500 animate-spin" />

                        {/* Inner Counter-Spinning Ring */}
                        <div className="absolute w-16 h-16 rounded-full border-2 border-slate-800 border-b-orange-400 border-l-orange-400 animate-[spin_1.5s_linear_infinite_reverse]" />

                        {/* Glowing Core Badge */}
                        <div className="absolute w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-xl shadow-amber-500/30 animate-pulse">
                            <Package className="w-6 h-6 text-slate-950" />
                        </div>
                    </div>

                    {/* Status Message */}
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight flex items-center gap-2 mb-2">
                        Loading <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">Amarzone</span>
                        <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
                    </h2>
                    <p className="text-sm sm:text-base text-slate-400 max-w-md">
                        Curating the best deals, live prices, and personalized recommendations for you...
                    </p>

                    {/* Animated Progress Bar */}
                    <div className="w-full max-w-xs sm:max-w-sm mt-6 h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/60 relative">
                        <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 rounded-full w-2/3 animate-[pulse_1s_ease-in-out_infinite] relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                        </div>
                    </div>
                </div>

                {/* Skeleton Catalog Grid Preview */}
                <div className="space-y-6">
                    {/* Skeleton Category Pills */}
                    <div className="flex items-center gap-2 overflow-hidden py-1">
                        {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                            <div
                                key={item}
                                className="h-8 w-24 sm:w-28 rounded-full bg-slate-900/90 border border-slate-800/80 relative overflow-hidden flex-shrink-0"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/50 to-transparent animate-shimmer" />
                            </div>
                        ))}
                    </div>

                    {/* Skeleton Product Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {[1, 2, 3, 4].map((card) => (
                            <div
                                key={card}
                                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden backdrop-blur-xs"
                            >
                                {/* Shimmer Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-800/30 to-transparent animate-shimmer" />

                                {/* Card Image Skeleton */}
                                <div className="w-full h-44 rounded-xl bg-slate-900/90 border border-slate-800/60 relative flex items-center justify-center">
                                    <ShoppingBag className="w-8 h-8 text-slate-800" />
                                </div>

                                {/* Card Lines Skeleton */}
                                <div className="space-y-2 pt-1">
                                    <div className="h-4 w-3/4 bg-slate-800/80 rounded" />
                                    <div className="h-3 w-1/2 bg-slate-800/50 rounded" />
                                </div>

                                {/* Price and Button Skeleton */}
                                <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
                                    <div className="h-5 w-16 bg-slate-800/80 rounded" />
                                    <div className="h-8 w-24 bg-amber-500/10 border border-amber-500/20 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Features Bar Placeholder */}
                <div className="mt-12 pt-6 border-t border-slate-800/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-3 text-slate-400 text-xs">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                            <Truck className="w-4 h-4" />
                        </div>
                        <span>Fast Express Shipping</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 text-slate-400 text-xs">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                            <ShieldCheck className="w-4 h-4" />
                        </div>
                        <span>100% Secure Checkout</span>
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-3 text-slate-400 text-xs">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400">
                            <Zap className="w-4 h-4" />
                        </div>
                        <span>Instant Order Confirmation</span>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Loading;