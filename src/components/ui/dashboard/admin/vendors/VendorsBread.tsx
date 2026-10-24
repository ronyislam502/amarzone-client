
import AZBread from "@/components/shared/AZBread";
import { Store } from "lucide-react";


const VendorsBread = () => {
    return (
        <AZBread
            title="Vendors Directory"
            parentHref="/admin"
            parentLabel="Dashboard"
            icon={<Store className="w-3.5 h-3.5 text-warning" />}
            hoverColor="hover:text-warning"
        />
    )
}

export default VendorsBread;