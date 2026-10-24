import AZBread from "@/components/shared/AZBread";
import { ShoppingBag } from "lucide-react";

const VendorOrdersBread = () => {
    return (
        <AZBread
            title="Store Orders & Fulfillment"
            parentHref="/vendor"
            parentLabel="Vendor Portal"
            icon={<ShoppingBag className="w-3.5 h-3.5 text-amber-400" />}
            hoverColor="hover:text-amber-400"
        />
    );
};

export default VendorOrdersBread;
