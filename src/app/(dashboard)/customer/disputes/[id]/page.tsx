import { Metadata } from "next";
import DisputeDetailsView from "@/src/components/ui/dispute/DisputeDetailsView";

export const metadata: Metadata = {
  title: "Dispute Claim Details | Amarzone",
  description: "View status, evidence, and refund resolution of your dispute claim.",
};

export default function CustomerSingleDisputePage() {
  return <DisputeDetailsView role="CUSTOMER" />;
}
