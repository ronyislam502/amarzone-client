import AZHeader from "@/components/shared/AZHeader";
import { HeaderProps } from "@/types/global";
import { Users, UserPlus } from "lucide-react";

export interface CustomersHeaderProps extends HeaderProps {}

const CustomersHeader = ({
    onRefresh,
    isRefreshing = false,
    onOpenCreateModal,
}: CustomersHeaderProps) => {
    return (
        <AZHeader
            badgeLabel="Customer Base Management"
            badgeIcon={<Users className="w-3.5 h-3.5 text-amber-400" />}
            statusLabel="Verified Consumer Accounts"
            title="Customers &"
            highlightTitle="Directory"
            description="Monitor registered consumer accounts, review verified shipping destinations, evaluate engagement channels, and govern customer account states."
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            onCreate={onOpenCreateModal}
            createLabel="Add New Customer"
            createIcon={<UserPlus className="w-4 h-4" />}
        />
    );
};

export default CustomersHeader;