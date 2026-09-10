import CategoriesBread from "@/src/components/ui/Dashboard/admin/categories/CategoriesBread";
import CategoriesData from "@/src/components/ui/Dashboard/admin/categories/CategoriesData";
import CategoriesHeader from "@/src/components/ui/Dashboard/admin/categories/CategoriesHeader";
import CategoriesStats from "@/src/components/ui/Dashboard/admin/categories/CategoriesStats";

const Categories = () => {

    return (
        <div className="space-y-6 w-full pb-10">
            <CategoriesBread />
            <CategoriesHeader />
            <CategoriesStats />
            <CategoriesData />
        </div>
    )
}

export default Categories;