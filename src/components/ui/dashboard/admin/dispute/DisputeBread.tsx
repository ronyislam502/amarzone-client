import AZBread from "@/components/shared/AZBread";
import { ShieldAlert } from "lucide-react";

const DisputeBread = () => {
    return (
        <AZBread
            title="Dispute Mediation"
            parentHref="/admin"
            parentLabel="Dashboard"
            icon={<ShieldAlert className="w-3.5 h-3.5 text-error" />}
            hoverColor="hover:text-error"
        />
    );
};

export default DisputeBread;
