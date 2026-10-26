import VendorOverviewBread from "./VendorOverviewBread";
import VendorOverviewHeader from "./VendorOverviewHeader";

const VendorOverview = () => {
    return (
        <div className="space-y-6">
            <VendorOverviewBread />
            <VendorOverviewHeader />
        </div>
    );
};

export default VendorOverview;