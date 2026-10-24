import AZHeader from "@/components/shared/AZHeader";
import { ShieldAlert } from "lucide-react";

const DisputeHeader = () => {
    return (
        <AZHeader
            badgeLabel="Escrow & SLA Protection"
            badgeIcon={<ShieldAlert className="w-3.5 h-3.5" />}
            statusLabel="Live Case Arbitration"
            title="Order Disputes &"
            highlightTitle="Arbitration Console"
            description="Mediate customer-vendor conflicts, review evidence submissions, track SLA resolution timeframes, and issue binding arbitration rulings."
        />
    );
};

export default DisputeHeader;
