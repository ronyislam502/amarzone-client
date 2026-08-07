import { AuthBrandShowcase } from '@/components/auth/AuthBrandShowcase';
import Link from 'next/link';
import ForgetPassForm from '@/components/auth/ForgetPassForm';
import { AuthBackground } from '@/components/auth/AuthBackground';

export const metadata = {
    title: 'Forgot Password | Amarzone E-Commerce',
    description: 'Request a password reset link to recover your Amarzone account securely.'
};

const ForgetPassPage = () => {
    return (
        <AuthBackground>
            {/* Mobile Header Logo */}
            <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2 z-20">
                <Link href="/">
                    <img
                        src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
                        alt="Amarzone Logo"
                        className="h-8 w-auto object-contain"
                    />
                </Link>
            </div>

            {/* Main Hero Content & Card Container with Glassmorphism */}
            <div className="w-full max-w-5xl z-10 my-auto">
                <div className="card lg:card-side bg-slate-900/75 backdrop-blur-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] border border-white/10 w-full overflow-hidden rounded-3xl relative">
                    {/* Glowing top border highlight ray */}
                    <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent z-20" />
                    
                    {/* Left Side: Brand Showcase (Desktop) */}
                    <AuthBrandShowcase />

                    {/* Right Side: Interactive Forget Password Form Container */}
                    <div className="card-body p-6 sm:p-10 lg:w-1/2 flex flex-col justify-center bg-slate-950/40">
                        <ForgetPassForm />
                    </div>
                </div>
            </div>
        </AuthBackground>
    );
};

export default ForgetPassPage;
