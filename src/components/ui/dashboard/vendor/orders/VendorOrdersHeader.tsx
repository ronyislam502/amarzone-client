import AZHeader from "@/components/shared/AZHeader";
import { PackageCheck } from "lucide-react";

export interface VendorOrdersHeaderProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const VendorOrdersHeader = ({ onRefresh, isRefreshing }: VendorOrdersHeaderProps = {}) => {
    return (
        <AZHeader
            badgeLabel="Store Fulfillment"
            badgeIcon={<PackageCheck className="w-3.5 h-3.5" />}
            statusLabel="Live Merchant Orders"
            title="Store Orders &"
            highlightTitle="Fulfillment Pipeline"
            description="Manage incoming store customer orders, dispatch items with carrier tracking, monitor delivery milestones, and track net payout revenue."
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
        />
    );
};

export default VendorOrdersHeader;
