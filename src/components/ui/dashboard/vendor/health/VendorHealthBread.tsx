import { Activity } from "lucide-react";
import AZBread from "@/components/shared/AZBread";

const VendorHealthBread = () => {
    return (
        <AZBread
            parentHref="/vendor"
            parentLabel="Vendor Dashboard"
            title="Account Health & Performance SLA"
            icon={<Activity className="w-3.5 h-3.5 text-emerald-400" />}
            hoverColor="hover:text-emerald-400"
        />
    );
};

export default VendorHealthBread;