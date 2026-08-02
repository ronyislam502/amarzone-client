import { AuthBrandShowcase } from '@/components/auth/AuthBrandShowcase';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import { AuthBackground } from '@/components/auth/AuthBackground';

export const metadata = {
    title: 'Sign In | Amarzone E-Commerce',
    description: 'Log in to your Amarzone account to access thousands of exclusive deals, track orders, and manage your wishlist.'
};

const LoginPage = () => {
    return (
        <AuthBackground>
            {/* Mobile Header Logo */}
            <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2 z-20">
                <Link href="/" className="flex items-center gap-2">
                    <div className="badge badge-warning p-3 text-slate-950 font-black">
                        <ShoppingBag className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-extrabold tracking-tight text-white">Amarzone</span>
                </Link>
            </div>

            {/* Main Hero Content & Card Container with Glassmorphism */}
            <div className="w-full max-w-5xl z-10 my-auto">
                <div className="card lg:card-side bg-slate-900/75 backdrop-blur-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] border border-white/10 w-full overflow-hidden rounded-3xl relative">
                    {/* Glowing top border highlight ray */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent z-20" />
                    
                    {/* Left Side: Brand Showcase (Desktop) */}
                    <AuthBrandShowcase />

                    {/* Right Side: Interactive Login Form Container */}
                    <div className="card-body p-6 sm:p-10 lg:w-1/2 flex flex-col justify-center bg-slate-950/40">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </AuthBackground>
    );
};

export default LoginPage;