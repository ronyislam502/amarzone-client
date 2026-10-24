
import AZHeader from "@/components/shared/AZHeader";
import { ShieldAlert, UserCheck } from "lucide-react";

export interface AdminsHeaderProps {
    onExportCsv?: () => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    onOpenCreateModal?: () => void;
}

const AdminsHeader = ({
    onRefresh,
    isRefreshing = false,
    onOpenCreateModal,
}: AdminsHeaderProps) => {
    return (
        <AZHeader
            badgeLabel="Platform Governance"
            badgeIcon={<ShieldAlert className="w-3.5 h-3.5" />}
            statusLabel="Operational Authority"
            title="Admins &"
            highlightTitle="Staff Directory"
            description="Oversee administrative personnel, manage platform access privileges, audit contact credentials, and onboard authorized staff members."
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
            onCreate={onOpenCreateModal}
            createLabel="Add New Admin"
            createIcon={<UserCheck className="w-4 h-4" />}
        />
    )
}

export default AdminsHeader;