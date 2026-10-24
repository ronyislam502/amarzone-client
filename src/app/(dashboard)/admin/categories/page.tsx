import CategoriesBread from "@/components/ui/dashboard/admin/categories/CategoriesBread";
import CategoriesData from "@/components/ui/dashboard/admin/categories/CategoriesData";
import CategoriesHeader from "@/components/ui/dashboard/admin/categories/CategoriesHeader";


const Categories = () => {
    return (
        <div>
            <CategoriesBread />
            <CategoriesHeader />
            <CategoriesData />
        </div>
    );
};

export default Categories;
