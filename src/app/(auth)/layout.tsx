import AuthBackground from "@/src/components/ui/auth/Background";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthBackground>{children}</AuthBackground>
    );
};

export default layout;