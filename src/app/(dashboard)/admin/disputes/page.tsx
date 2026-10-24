import DisputeBread from "@/components/ui/dashboard/admin/dispute/DisputeBread";
import DisputeData from "@/components/ui/dashboard/admin/dispute/DisputeData";
import DisputeHeader from "@/components/ui/dashboard/admin/dispute/DisputeHeader";

const DisputesPage = () => {
    return (
        <div>
            <DisputeBread />
            <DisputeHeader />
            <DisputeData />
        </div>
    );
};

export default DisputesPage;
