
import AZHeader from "@/components/shared/AZHeader";
import { Sparkles } from "lucide-react";



const CategoriesHeader = () => {
    return (
        <AZHeader
            badgeLabel="Catalog Taxonomy"
            badgeIcon={
                <Sparkles className="w-3.5 h-3.5" />
            }
            statusLabel="Live Department Structure"
            title="Categories &"
            highlightTitle="Department Taxonomy"
            description="Organize product categories, map departmental structures, audit catalog distribution, and maintain clean navigation."

        />
    )
}

export default CategoriesHeader;