import AmazonHero from "@/components/ui/home/AmazonHero";
import Banner from "@/components/ui/home/Banner";
import CategoryProd from "@/components/ui/home/CategoryProd";
import Flashdeal from "@/components/ui/home/Flashdeal";
import Rollback from "@/components/ui/home/Rollback";

const Home = () => {
  return (
    <div className="w-full bg-[#e3e6e6] min-h-screen">
      {/* Amazon Hero Section Clone */}
      <AmazonHero />

      {/* Main Home Sections */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-10 py-4 space-y-6">
        <Banner />
        <Rollback />
        <Flashdeal />
        <CategoryProd />
      </div>
    </div>
  );
};

export default Home;
