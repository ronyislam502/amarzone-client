import AZFooter from "@/components/shared/AZFooter";
import AZNavbar from "@/components/shared/AZNavbar";
import AiShoppingAssistant from "@/components/ui/artificial/AiShoppingAssistant";


const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <AZNavbar />
            {children}
            <AZFooter />
            <AiShoppingAssistant />
        </div>
    );
};

export default layout;