
import Background from "@/src/components/ui/auth/Background";
import DashboardSidebar from "@/src/components/ui/Dashboard/DashSidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboardSidebar>
            <Background isDashboard className="flex-1 min-w-0">
                {children}
            </Background>
        </DashboardSidebar>
    );
};

export default layout;