import AuthBrandShowcase from "@/src/components/ui/auth/Branding";
import LoginForm from "@/src/components/ui/auth/LoginForm";


const Login = () => {
    return (
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
    )
}
export default Login;