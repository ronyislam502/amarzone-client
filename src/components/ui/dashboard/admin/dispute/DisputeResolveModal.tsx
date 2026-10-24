"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Scale,
  FileText,
  User,
  Store,
  Package,
  Calendar,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TDispute, TDecisionType, TDisputeStatus } from "@/types/dispute";
import {
  useUpdateDisputeStatusMutation,
  useCreateDisputeDecisionMutation,
  useGetDecisionByDisputeIdQuery,
} from "@/redux/features/dispute/disputeApi";
import AZModal from "@/components/shared/AZModal";
import AZForm from "@/components/shared/form/AZFrom";
import AZSelect from "@/components/shared/form/AZSelect";
import AZTextarea from "@/components/shared/form/AZTextarea";
import { disputeDecisionSchema } from "@/schema/Dispute";

export interface DisputeResolveModalProps {
  isOpen: boolean;
  onClose: () => void;
  dispute?: TDispute | null;
  refetch?: () => void;
}

const statusOptions = [
  { value: "OPEN", label: "Open (Pending Intake)" },
  { value: "UNDER_REVIEW", label: "Under Review (Active Arbitration)" },
  { value: "RESOLVED", label: "Resolved (Customer Accorded)" },
  { value: "REJECTED", label: "Rejected (Claim Denied)" },
];

const decisionOptions = [
  { value: "REFUNDED", label: "Grant Refund to Customer" },
  { value: "REJECTED", label: "Reject Dispute (Uphold Vendor)" },
];

const DisputeResolveModal = ({
  isOpen,
  onClose,
  dispute,
  refetch,
}: DisputeResolveModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"overview" | "arbitrate">("overview");

  const [updateDisputeStatus, { isLoading: isUpdatingStatus }] =
    useUpdateDisputeStatusMutation();
  const [createDisputeDecision, { isLoading: isCreatingDecision }] =
    useCreateDisputeDecisionMutation();

  const { data: decisionData, isLoading: isDecisionLoading } =
    useGetDecisionByDisputeIdQuery(dispute?._id, {
      skip: !dispute?._id,
    });

  const existingDecision = decisionData?.data;

  const handleStatusUpdate = async () => {
    if (!dispute?._id || !selectedStatus) return;
    try {
      await updateDisputeStatus({
        id: dispute._id,
        data: { status: selectedStatus as TDisputeStatus },
      }).unwrap();
      toast.success("Dispute status updated successfully!");
      refetch?.();
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Failed to update status");
    }
  };

  const handleDecisionSubmit = async (data: FieldValues) => {
    if (!dispute?._id) return;
    try {
      await createDisputeDecision({
        dispute: dispute._id,
        decision: data.decision as TDecisionType,
        notes: data.notes,
      }).unwrap();
      toast.success("Arbitration decision submitted successfully!");
      refetch?.();
      setActiveTab("overview");
    } catch (err: any) {
      toast.error(
        err?.data?.message || err?.message || "Failed to submit arbitration decision"
      );
    }
  };

  if (!dispute) return null;

  const customerName =
    typeof dispute.customer === "object" && dispute.customer !== null
      ? (dispute.customer as any).name || (dispute.customer as any).email || "Customer"
      : "Customer";

  const customerEmail =
    typeof dispute.customer === "object" && dispute.customer !== null
      ? (dispute.customer as any).email || ""
      : "";

  const vendorName =
    typeof dispute.vendor === "object" && dispute.vendor !== null
      ? (dispute.vendor as any).name || (dispute.vendor as any).email || "Vendor"
      : "Vendor";

  const orderId =
    typeof dispute.order === "object" && dispute.order !== null
      ? (dispute.order as any)._id || String(dispute.order)
      : String(dispute.order || "");

  const statusBadgeColor =
    dispute.status === "OPEN"
      ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
      : dispute.status === "UNDER_REVIEW"
      ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
      : dispute.status === "RESOLVED"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-rose-500/10 text-rose-400 border-rose-500/20";

  return (
    <AZModal
      isOpen={isOpen && Boolean(dispute)}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Mediate Dispute</span>
          <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${statusBadgeColor}`}>
            {dispute.status}
          </span>
        </div>
      }
      description={`Case #${dispute._id.slice(-6).toUpperCase()} — Dispute claim mediation and binding escrow ruling`}
      icon={<ShieldAlert className="w-5 h-5 text-error" />}
      size="lg"
    >
      <div className="space-y-4 pt-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-[#100722] p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "overview"
                ? "bg-error text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Case Overview & Status</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("arbitrate")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "arbitrate"
                ? "bg-error text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>
              {existingDecision ? "Arbitration Decision (Filed)" : "Issue Ruling / Decision"}
            </span>
          </button>
        </div>

        {/* Tab 1: Case Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 text-xs">
              <div>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Package className="w-3.5 h-3.5 text-error" />
                  Order ID
                </span>
                <p className="font-mono font-bold text-white mt-0.5 truncate">
                  #{orderId || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-info" />
                  Claimant (Customer)
                </span>
                <p className="font-bold text-white mt-0.5 truncate">{customerName}</p>
                {customerEmail && (
                  <p className="text-[10px] text-slate-400 truncate">{customerEmail}</p>
                )}
              </div>

              <div>
                <span className="text-slate-400 font-medium flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-warning" />
                  Respondent (Vendor)
                </span>
                <p className="font-bold text-white mt-0.5 truncate">{vendorName}</p>
              </div>
            </div>

            {/* Reason & Statement */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2 text-xs">
              <div>
                <span className="text-[11px] font-bold text-error uppercase tracking-wider">
                  Claim Reason
                </span>
                <h4 className="text-sm font-extrabold text-white mt-0.5">
                  {dispute.reason}
                </h4>
              </div>

              <div className="pt-1.5 border-t border-white/10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Detailed Statement
                </span>
                <p className="text-slate-200 mt-1 leading-relaxed whitespace-pre-wrap bg-black/30 p-2.5 rounded-xl border border-white/5">
                  {dispute.details || "No additional text details provided."}
                </p>
              </div>
            </div>

            {/* Evidence Images */}
            {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300">
                  Attached Evidence ({dispute.evidenceUrls.length})
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {dispute.evidenceUrls.map((url, idx) => (
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/15 bg-black/40 group shadow-sm"
                    >
                      <Image
                        src={url}
                        alt={`Evidence ${idx + 1}`}
                        width={64}
                        height={64}
                        unoptimized
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status Modification */}
            <div className="p-3.5 rounded-2xl bg-[#100722] border border-error/30 space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-error" />
                Update Intake Status
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <AZSelect
                    name="disputeStatusSelect"
                    placeholder="Select new status..."
                    options={statusOptions}
                    value={selectedStatus || dispute.status}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleStatusUpdate}
                  disabled={isUpdatingStatus || !selectedStatus || selectedStatus === dispute.status}
                  className="px-4 py-2.5 rounded-xl bg-error hover:bg-error/90 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer shrink-0"
                >
                  {isUpdatingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Status</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Arbitrate / Ruling */}
        {activeTab === "arbitrate" && (
          <div className="space-y-4">
            {existingDecision ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="font-extrabold text-sm text-white">
                      Binding Ruling Issued
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-400/20 text-emerald-300 font-black uppercase text-[10px]">
                    Decision: {existingDecision.decision}
                  </span>
                </div>

                <div className="pt-2 border-t border-emerald-500/20 space-y-1">
                  <span className="text-slate-400 font-semibold block">Arbitration Notes</span>
                  <p className="text-slate-200 bg-black/40 p-3 rounded-xl border border-emerald-500/10 leading-relaxed whitespace-pre-wrap">
                    {existingDecision.notes}
                  </p>
                </div>

                {existingDecision.createdAt && (
                  <div className="text-[10px] text-slate-400 flex items-center gap-1 pt-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>
                      Decided on {new Date(existingDecision.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <AZForm
                onSubmit={handleDecisionSubmit}
                resolver={zodResolver(disputeDecisionSchema)}
                defaultValues={{
                  decision: "REFUNDED",
                  notes: "",
                }}
              >
                <div className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-error/10 border border-error/20 text-xs text-rose-300">
                    ⚖️ <strong>Arbitration Rules:</strong> Issuing this decision will formally close the escrow mediation and notify both parties.
                  </div>

                  <AZSelect
                    label="Binding Decision"
                    name="decision"
                    options={decisionOptions}
                  />

                  <AZTextarea
                    label="Arbitration Rationale & Settlement Notes"
                    name="notes"
                    placeholder="Document justification for ruling, refund deduction amounts, or policy reference..."
                    rows={4}
                  />

                  <div className="pt-3 flex justify-end gap-2 border-t border-white/10">
                    <button
                      type="submit"
                      disabled={isCreatingDecision}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-error to-rose-600 hover:from-error/90 hover:to-rose-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-error/20 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isCreatingDecision ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Issuing Ruling...</span>
                        </>
                      ) : (
                        <>
                          <Scale className="w-4 h-4" />
                          <span>Submit Binding Decision</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </AZForm>
            )}
          </div>
        )}

        {/* Footer Close */}
        <div className="pt-3 flex justify-end border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            Close Modal
          </button>
        </div>
      </div>
    </AZModal>
  );
};

export default DisputeResolveModal;
