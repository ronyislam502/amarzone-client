
import AZBread from "@/components/shared/AZBread";
import { Building2 } from "lucide-react";

const DepartmentsBread = () => {
    return (
        <div>
            <AZBread
                title="Department Management"
                parentHref="/admin"
                parentLabel="Dashboard"
                icon={<Building2 className="w-3.5 h-3.5 text-primary" />}
                hoverColor="hover:text-primary"
            />
        </div>
    );
};

export default DepartmentsBread;