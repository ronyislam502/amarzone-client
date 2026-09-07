import Footer from "@/src/components/shared/Footer";
import Navbar from "@/src/components/shared/Navbar";


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