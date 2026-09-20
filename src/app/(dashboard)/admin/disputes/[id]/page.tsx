import { Metadata } from "next";
import DisputeDetailsView from "@/src/components/ui/dispute/DisputeDetailsView";

export const metadata: Metadata = {
  title: "Dispute Inspection | Amarzone Admin",
  description: "Detailed single dispute inspection and mediation review.",
};

export default function AdminSingleDisputePage() {
  return <DisputeDetailsView role="ADMIN" />;
}
