import { ShieldCheck } from "lucide-react";
import CustomersBread from "../customers/CustomersBread";

const AdminProfileBread = () => {
  return (
    <CustomersBread
      title="Admin Profile"
      icon={<ShieldCheck className="w-3.5 h-3.5 text-amber-400" />}
      parentHref="/admin"
      parentLabel="Admin Dashboard"
      hoverColor="hover:text-amber-400"
    />
  );
};

export default AdminProfileBread;
