import { Building2 } from "lucide-react";
import CustomersBread from "../customers/CustomersBread";

const DepartmentsBread = () => {
  return (
    <CustomersBread
      title="Department Management"
      icon={<Building2 className="w-3.5 h-3.5 text-primary" />}
      hoverColor="hover:text-primary"
    />
  );
};

export default DepartmentsBread;
