import Flashdeal from "@/components/ui/home/Flashdeal";
import Rollback from "@/components/ui/home/Rollback";
import BrowsingHistoryView from "@/components/ui/home/BrowsingHistoryView";
import Banner from "@/components/ui/home/Banner";

const Home = () => {
  return (
    <div className="bg-white max-w-[1800px] mx-auto">
      <Banner />
      <Rollback />
      <Flashdeal />
      <BrowsingHistoryView />
    </div>
  );
};

export default Home;
