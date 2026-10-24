import InventoryBread from "@/components/ui/dashboard/vendor/inventory/InventoryBread";
import InventoryHeader from "@/components/ui/dashboard/vendor/inventory/InventoryHeader";
import InventoryData from "@/components/ui/dashboard/vendor/inventory/InventoryData";

const Inventory = () => {
    return (
        <div>
            <InventoryBread />
            <InventoryHeader />
            <InventoryData />
        </div>
    );
};

export default Inventory;