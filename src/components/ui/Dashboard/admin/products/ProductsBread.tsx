import { ShoppingBag } from "lucide-react";
import CustomersBread from "../customers/CustomersBread";

const ProductsBread = () => {
  return (
    <CustomersBread
      title="Product Catalog"
      icon={<ShoppingBag className="w-3.5 h-3.5 text-primary" />}
      hoverColor="hover:text-primary"
    />
  );
};

export default ProductsBread;
