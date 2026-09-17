import { Store } from "lucide-react";
import CustomersBread from "../../admin/customers/CustomersBread";

const VendorProfileBread = () => {
  return (
    <CustomersBread
      title="Store Profile"
      icon={<Store className="w-3.5 h-3.5 text-amber-400" />}
      parentHref="/vendor"
      parentLabel="Vendor Hub"
      hoverColor="hover:text-amber-400"
    />
  );
};

export default VendorProfileBread;
