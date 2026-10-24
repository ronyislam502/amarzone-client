import AZBread from "@/components/shared/AZBread";
import { Users } from "lucide-react";

const CustomersBread = () => {
    return (
        <AZBread
            title="Customers Directory"
            parentHref="/admin"
            parentLabel="Dashboard"
            icon={<Users className="w-3.5 h-3.5 text-amber-400" />}
            hoverColor="hover:text-amber-400"
        />
    );
};

export default CustomersBread;