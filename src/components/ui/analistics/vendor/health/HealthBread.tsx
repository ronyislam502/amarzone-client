import { Activity } from "lucide-react";
import CustomersBread from "../../admin/customers/CustomersBread";

const HealthBread = () => {
  return (
    <CustomersBread
      parentHref="/vendor"
      parentLabel="Vendor Dashboard"
      title="Account Health & Performance SLA"
      icon={<Activity className="w-3.5 h-3.5 text-emerald-400" />}
      hoverColor="hover:text-emerald-400"
    />
  );
};

export default HealthBread;
