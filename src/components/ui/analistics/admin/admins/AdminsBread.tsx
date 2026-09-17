import { UserCheck } from "lucide-react";
import CustomersBread from "../customers/CustomersBread";

const AdminsBread = () => {
  return (
    <CustomersBread
      title="Admins & Staff Directory"
      icon={<UserCheck className="w-3.5 h-3.5 text-secondary" />}
      hoverColor="hover:text-secondary"
    />
  );
};

export default AdminsBread;
