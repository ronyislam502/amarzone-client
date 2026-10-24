import AZFooter from "@/components/shared/AZFooter";
import AZNavbar from "@/components/shared/AZNavbar";


const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="">
            <AZNavbar />
            {children}
            <AZFooter />
        </div>
    );
};

export default layout;