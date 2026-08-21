import AuthBrandShowcase from "@/src/components/ui/auth/Branding";
import SignUpForm from "@/src/components/ui/auth/SignupForm";

const Signup = () => {
    return (
        <div className="w-full max-w-5xl z-10">
            <div className="card lg:card-side bg-slate-900/75 backdrop-blur-2xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] border border-white/10 w-full max-h-[95vh] overflow-hidden rounded-3xl relative">
                {/* Glowing top border highlight ray */}
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent z-20" />
                {/* Left Side: Brand Showcase (Desktop) */}
                <AuthBrandShowcase />

                {/* Right Side: Interactive Registration Form Container */}
                <div className="card-body p-6 sm:p-10 lg:w-1/2 flex flex-col justify-start sm:justify-center bg-slate-950/40 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    <SignUpForm />
                </div>
            </div>
        </div>
    )
}
export default Signup;