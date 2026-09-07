import Footer from "@/src/components/ui/shared/Footer";
import Navbar from "@/src/components/ui/shared/Navbar";


const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    );
};

export default layout;