import Background from "@/components/shared/Background";


const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Background>{children}</Background>
    );
};

export default layout;