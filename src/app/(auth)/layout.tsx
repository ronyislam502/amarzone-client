import Background from "@/src/components/ui/auth/Background";


const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Background>{children}</Background>
    );
};

export default layout;