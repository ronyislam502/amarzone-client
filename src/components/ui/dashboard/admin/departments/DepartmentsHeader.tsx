

import AZHeader from "@/components/shared/AZHeader";
import { Sparkles } from "lucide-react";

export interface DepartmentsHeaderProps {
    onExportCsv?: () => void;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    onOpenCreateModal?: () => void;
}

const DepartmentsHeader = ({
    onExportCsv,
    // onRefresh,
    // isRefreshing = false,
    // onOpenCreateModal,
}: DepartmentsHeaderProps) => {
    return (
        <AZHeader
            badgeLabel="Enterprise Architecture"
            badgeIcon={<Sparkles className="w-3.5 h-3.5" />}
            statusLabel="Live Department Taxonomy"
            title="Departments"
            highlightTitle="Management"
            description="Define top-level business departments, structure taxonomy hierarchies, govern catalog segregation, and maintain operational clarity."
        />
    );
};

export default DepartmentsHeader;
