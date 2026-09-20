import { Metadata } from "next";
import DisputesManagement from "@/src/components/ui/dispute/DisputesManagement";

export const metadata: Metadata = {
  title: "My Disputes & Claims | Amarzone",
  description:
    "Track your filed disputes, examine refund progress, and view resolution decisions with Amarzone Buyer Protection.",
};

export default function CustomerDisputesPage() {
  return (
    <div className="w-full pb-10">
      <DisputesManagement
        role="CUSTOMER"
        title="My Disputes & Refund Claims"
        subtitle="Track claims raised on delivered orders, review mediator decisions, and inspect completed buyer refunds."
      />
    </div>
  );
}
