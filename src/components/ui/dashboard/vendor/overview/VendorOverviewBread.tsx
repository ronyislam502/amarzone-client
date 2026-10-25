import AZBread from "@/components/shared/AZBread";
import { LayoutDashboard } from "lucide-react";

const VendorOverviewBread = () => {
    return (
        <AZBread
            parentHref="/vendor"
            parentLabel="Vendor Portal"
            title="Store Overview"
            icon={<LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />}
            hoverColor="hover:text-amber-400"
            className="[&_ul]:text-slate-300"
        />
    );
};

export default VendorOverviewBread;