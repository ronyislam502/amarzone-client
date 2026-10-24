
import AZBread from "@/components/shared/AZBread";
import { UserCheck } from "lucide-react";

const AdminsBread = () => {
    return (
        <AZBread
            title="Admins & Staff Directory"
            parentHref="/admin"
            parentLabel="Dashboard"
            icon={<UserCheck className="w-3.5 h-3.5 text-secondary" />}
            hoverColor="hover:text-secondary"
        />
    )
}

export default AdminsBread;