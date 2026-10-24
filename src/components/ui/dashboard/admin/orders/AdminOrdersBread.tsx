import AZBread from "@/components/shared/AZBread";
import { ShoppingBag } from "lucide-react";

const AdminOrdersBread = () => {
    return (
        <AZBread
            title="Orders Management"
            parentHref="/admin"
            parentLabel="Dashboard"
            icon={<ShoppingBag className="w-3.5 h-3.5 text-amber-400" />}
            hoverColor="hover:text-amber-400"
        />
    );
};

export default AdminOrdersBread;