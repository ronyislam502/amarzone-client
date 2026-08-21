interface AuthBackgroundProps {
    children: React.ReactNode;
}

export const AuthBackground = ({ children }: AuthBackgroundProps) => {
    return (
        <div data-theme="dark" className="relative h-screen w-full bg-[#090d16] text-slate-100 overflow-hidden flex items-center justify-center font-sans antialiased">
            {/* Base Radial Mesh Background Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

            {/* Ambient Animated Light Orbs */}
            {/* Orb 1: Golden Amber Glow (Top Left) */}
            <div
                className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-amber-500/25 via-orange-600/15 to-transparent rounded-full blur-[140px] pointer-events-none animate-float-slow animate-pulse-slow"
            />

            {/* Orb 2: Royal Indigo / Violet Glow (Bottom Right) */}
            <div
                className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-tl from-indigo-600/25 via-purple-700/15 to-transparent rounded-full blur-[160px] pointer-events-none animate-float-reverse animate-pulse-slow"
            />

            {/* Orb 3: Emerald Spark Accent (Top Right) */}
            <div
                className="absolute top-1/4 -right-20 w-[450px] h-[450px] bg-gradient-to-bl from-emerald-500/20 via-teal-600/10 to-transparent rounded-full blur-[120px] pointer-events-none animate-float-slow"
            />

            {/* Orb 4: Center Core Subtle Warmth */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-400/5 rounded-full blur-[180px] pointer-events-none"
            />

            {/* Rotating Light Beam Ray Layer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(245,158,11,0.06)_330deg,transparent_360deg)] rounded-full pointer-events-none animate-shimmer-ray" />

            {/* High-Tech Dot Matrix Grid overlay with vignette mask */}
            <div className="absolute inset-0 bg-dot-grid opacity-30 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

            {/* Decorative Floating Geometric Accents */}
            <div className="absolute top-12 left-12 hidden lg:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs text-amber-300 font-medium tracking-wide shadow-lg pointer-events-none animate-float-slow">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Amarzone Luxury Auth Engine
            </div>

            <div className="absolute bottom-12 right-12 hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-xs text-slate-300 font-medium shadow-lg pointer-events-none animate-float-reverse">
                <span className="text-emerald-400 font-bold">256-bit</span> Bank-Grade Security
            </div>

            {/* Floating Sparkle Particles */}
            <div className="absolute top-1/3 left-1/5 w-1.5 h-1.5 rounded-full bg-amber-300 blur-[1px] opacity-70 animate-ping pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-indigo-300 blur-[1px] opacity-60 animate-pulse pointer-events-none" />
            <div className="absolute top-2/3 left-1/6 w-1 h-1 rounded-full bg-emerald-300 blur-[0.5px] opacity-80 animate-ping pointer-events-none" />

            {/* Main Content Container */}
            <div className="relative z-10 w-full flex items-center justify-center p-4 sm:p-6 lg:p-10">
                {children}
            </div>
        </div>
    );
};

export default AuthBackground;
