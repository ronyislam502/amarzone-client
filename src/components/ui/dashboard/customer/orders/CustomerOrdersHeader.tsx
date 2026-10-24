import AZHeader from "@/components/shared/AZHeader";
import { PackageCheck } from "lucide-react";

export interface CustomerOrdersHeaderProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const CustomerOrdersHeader = ({ onRefresh, isRefreshing }: CustomerOrdersHeaderProps = {}) => {
    return (
        <AZHeader
            badgeLabel="Purchase History"
            badgeIcon={<PackageCheck className="w-3.5 h-3.5" />}
            statusLabel="Verified Orders"
            title="My Purchases &"
            highlightTitle="Delivery Tracker"
            description="Review your past marketplace orders, live courier shipment tracking, delivery status updates, and digital receipts."
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
        />
    );
};

export default CustomerOrdersHeader;
