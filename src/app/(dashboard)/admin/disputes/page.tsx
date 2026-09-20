import { Metadata } from "next";
import DisputesManagement from "@/src/components/ui/dispute/DisputesManagement";

export const metadata: Metadata = {
  title: "Disputes & Mediation | Amarzone Admin",
  description:
    "Review active disputes, inspect photographic evidence, make binding decisions, and process customer refunds on Amarzone.",
};

export default function AdminDisputesPage() {
  return (
    <div className="w-full pb-10">
      <DisputesManagement
        role="ADMIN"
        title="Admin Dispute Mediation Center"
        subtitle="Full administrative authority to review customer claims, examine evidence, resolve disputes, and trigger automated order refunds."
      />
    </div>
  );
}
