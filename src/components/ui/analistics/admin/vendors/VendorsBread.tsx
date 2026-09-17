import { Store } from "lucide-react";
import CustomersBread from "../customers/CustomersBread";

const VendorsBread = () => {
  return (
    <CustomersBread
      title="Vendors Directory"
      icon={<Store className="w-3.5 h-3.5 text-warning" />}
      hoverColor="hover:text-warning"
    />
  );
};

export default VendorsBread;
