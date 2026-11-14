// import AmazonHero from "@/components/ui/home/AmazonHero";
import CategoryProd from "@/components/ui/home/CategoryProd";
import Flashdeal from "@/components/ui/home/Flashdeal";
import Rollback from "@/components/ui/home/Rollback";

const Home = () => {
  return (
    <div className="">
      {/* Amazon Hero Section Clone */}
      {/* <AmazonHero /> */}
      {/* <Banner /> */}
      <Rollback />
      <Flashdeal />
      <CategoryProd />
    </div>

  );
};

export default Home;
