
import AZBread from "@/components/shared/AZBread";
import { FolderTree } from "lucide-react";


const CategoriesBread = () => {
    return (
        <AZBread
            title="Category Catalog"
            parentHref="/admin"
            parentLabel="Dashboard"
            icon={<FolderTree className="w-3.5 h-3.5 text-primary" />}
            hoverColor="hover:text-primary"
        />
    )
}

export default CategoriesBread;