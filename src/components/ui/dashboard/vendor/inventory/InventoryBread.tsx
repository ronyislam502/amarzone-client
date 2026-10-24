import AZBread from "@/components/shared/AZBread";
import { Layers } from "lucide-react";

const InventoryBread = () => {
    return (
        <AZBread
            parentHref="/vendor"
            parentLabel="Vendor Portal"
            title="Inventory & Stock Management"
            icon={<Layers className="w-3.5 h-3.5 text-accent" />}
            hoverColor="hover:text-accent"
        />
    );
};

export default InventoryBread;