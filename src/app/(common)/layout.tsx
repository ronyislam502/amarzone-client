import Footer from "@/src/components/ui/shared/Footer";
import Navbar from "@/src/components/ui/shared/Navbar";
import AiShoppingAssistant from "@/src/components/ui/shared/AiShoppingAssistant";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
            <AiShoppingAssistant />
        </div>
    );
};

export default layout;