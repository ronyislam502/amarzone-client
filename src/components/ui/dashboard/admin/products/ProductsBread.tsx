
import AZBread from "@/components/shared/AZBread";
import { ShoppingBag } from "lucide-react";

const ProductsBread = () => {
    return (
        <AZBread
            title="Product Catalog"
            parentHref="/admin"
            parentLabel="Dashboard"
            icon={<ShoppingBag className="w-3.5 h-3.5 text-primary" />}
            hoverColor="hover:text-primary"
        />
    )
}

export default ProductsBread;