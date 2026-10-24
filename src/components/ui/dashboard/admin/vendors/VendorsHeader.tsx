
import AZHeader from "@/components/shared/AZHeader";
import { Sparkles } from "lucide-react";

export interface AdminsHeaderProps {
    onExportCsv?: () => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    onOpenCreateModal?: () => void;
}

const VendorsHeader = ({
    onRefresh,
    isRefreshing = false,
}: AdminsHeaderProps) => {
    return (
        <AZHeader
            badgeLabel="Multi-Vendor Ecosystem"
            badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
            statusLabel="Partner Onboarding & Governance"
            title="Vendors"
            highlightTitle="Directory"
            description="Oversee registered merchant storefronts, inspect store branding assets, monitor contact channels, and govern vendor accounts across departments."
            onRefresh={onRefresh}
            isRefreshing={isRefreshing}
        />
    )
}

export default VendorsHeader;