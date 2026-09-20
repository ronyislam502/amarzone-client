import { Metadata } from "next";
import DisputeDetailsView from "@/src/components/ui/dispute/DisputeDetailsView";

export const metadata: Metadata = {
  title: "Store Dispute Details | Amarzone Vendor",
  description: "View customer claim details and mediation decisions.",
};

export default function VendorSingleDisputePage() {
  return <DisputeDetailsView role="VENDOR" />;
}
