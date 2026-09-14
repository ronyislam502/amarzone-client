import { UserCheck } from "lucide-react";
import CustomersBread from "../../admin/customers/CustomersBread";

const CustomerProfileBread = () => {
  return (
    <CustomersBread
      title="Profile Settings"
      icon={<UserCheck className="w-3.5 h-3.5 text-amber-400" />}
      parentHref="/customer"
      parentLabel="Customer Hub"
      hoverColor="hover:text-amber-400"
    />
  );
};

export default CustomerProfileBread;
