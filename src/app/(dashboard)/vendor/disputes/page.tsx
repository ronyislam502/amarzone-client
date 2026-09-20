import { Metadata } from "next";
import DisputesManagement from "@/src/components/ui/dispute/DisputesManagement";

export const metadata: Metadata = {
  title: "Store Disputes | Amarzone Vendor",
  description:
    "Review customer claims and dispute inquiries related to your fulfilled orders on Amarzone.",
};

export default function VendorDisputesPage() {
  return (
    <div className="w-full pb-10">
      <DisputesManagement
        role="VENDOR"
        title="Store Dispute Center"
        subtitle="Monitor customer claims on your delivered products, check claim statuses, and review mediation decisions."
      />
    </div>
  );
}
