import DashSidebar from "@/components/dashboard/DashSidebar";
import Background from "@/components/shared/Background";


const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashSidebar>
            <Background isDashboard className="flex-1 min-w-0">
                <div> {children}</div>
            </Background>
        </DashSidebar>
    );
};

export default layout;