import AZBread from "@/components/shared/AZBread";
import { ShoppingBag } from "lucide-react";

const CustomerOrdersBread = () => {
    return (
        <AZBread
            title="My Orders & Purchases"
            parentHref="/customer"
            parentLabel="Customer Portal"
            icon={<ShoppingBag className="w-3.5 h-3.5 text-amber-400" />}
            hoverColor="hover:text-amber-400"
        />
    );
};

export default CustomerOrdersBread;
