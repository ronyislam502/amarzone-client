import DashboardSidebar from "@/src/components/ui/Dashboard/DashSidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboardSidebar>
            <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-base-300">
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </DashboardSidebar>
    );
};

export default layout;