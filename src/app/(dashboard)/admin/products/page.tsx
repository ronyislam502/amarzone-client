import ProductsBread from "@/components/ui/dashboard/admin/products/ProductsBread";
import ProductsData from "@/components/ui/dashboard/admin/products/ProductsData";
import ProductsHeader from "@/components/ui/dashboard/admin/products/ProductsHeader";


const Products = () => {
    return (
        <div>
            <ProductsBread />
            <ProductsHeader />
            <ProductsData />
        </div>
    )
}

export default Products;