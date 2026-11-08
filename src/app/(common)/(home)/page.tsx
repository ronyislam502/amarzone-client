import CategoryProd from "@/components/ui/home/CategoryProd";
import Flashdeal from "@/components/ui/home/Flashdeal";
import Rollback from "@/components/ui/home/Rollback";


const Home = () => {
  return (
    <div className="px-10 py-6">
      <Rollback />
      <Flashdeal />
      <CategoryProd />
    </div>
  )
}

export default Home;