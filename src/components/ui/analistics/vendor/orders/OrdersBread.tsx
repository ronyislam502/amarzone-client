import { Package } from "lucide-react";
import CustomersBread from "../../admin/customers/CustomersBread";

const OrdersBread = () => {
  return (
    <CustomersBread
      parentLabel="Vendor Dashboard"
      parentHref="/vendor"
      title="Orders Management"
      icon={<Package className="w-3.5 h-3.5 text-amber-400" />}
      hoverColor="hover:text-amber-400"
    />
  );
};

export default OrdersBread;
