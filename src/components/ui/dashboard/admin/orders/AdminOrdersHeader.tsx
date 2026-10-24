import AZHeader from "@/components/shared/AZHeader";
import { ShoppingCart } from "lucide-react";

export interface OrdersHeaderProps {
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

const AdminOrdersHeader = ({ onRefresh, isRefreshing }: OrdersHeaderProps = {}) => {
    return (
        <AZHeader
            badgeLabel="Order Fulfillment"
            badgeIcon={<ShoppingCart className="w-3.5 h-3.5" />}
            statusLabel="Live Marketplace Feed"
            title="Orders &"
            highlightTitle="Fulfillment Pipeline"
            description="Monitor marketplace customer orders, vendor dispatches, platform commissions, payment verification, and delivery tracking."
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
        />
    );
};

export default AdminOrdersHeader;