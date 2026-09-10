import { Layers } from "lucide-react";
import CustomersBread from "../../admin/customers/CustomersBread";

const InventoryBread = () => {
  return (
    <CustomersBread
      parentHref="/vendor"
      parentLabel="Vendor Portal"
      title="Inventory & Stock Management"
      icon={<Layers className="w-3.5 h-3.5 text-accent" />}
      hoverColor="hover:text-accent"
    />
  );
};

export default InventoryBread;
