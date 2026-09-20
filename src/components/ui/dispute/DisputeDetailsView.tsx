"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowLeft,
  Package,
  User,
  Store,
  Calendar,
  DollarSign,
  Sparkles,
  RefreshCw,
  ImageIcon,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  Tag,
  BadgeCheck,
} from "lucide-react";
import {
  useGetSingleDisputeQuery,
  useGetDisputeDecisionQuery,
  useUpdateDisputeStatusMutation,
  useCreateDisputeDecisionMutation,
} from "@/redux/features/dispute/disputeApi";
import { toast } from "react-toastify";

interface DisputeDetailsViewProps {
  role?: "ADMIN" | "CUSTOMER" | "VENDOR";
}

export const DisputeDetailsView: React.FC<DisputeDetailsViewProps> = ({ role = "ADMIN" }) => {
  const params = useParams();
  const router = useRouter();
  const disputeId = params?.id as string;

  // ── Fetch Single Dispute from GET /disputes/:id ───────────────────────
  const {
    data: disputeResponse,
    isLoading: isLoadingDispute,
    isFetching: isFetchingDispute,
    error: disputeError,
    refetch: refetchDispute,
  } = useGetSingleDisputeQuery(disputeId, { skip: !disputeId });

  // ── Fetch Dispute Decision (if exists) ────────────────────────────────
  const {
    data: decisionResponse,
    isLoading: isLoadingDecision,
    refetch: refetchDecision,
  } = useGetDisputeDecisionQuery(disputeId, { skip: !disputeId });

  // ── Mutations ─────────────────────────────────────────────────────────
  const [updateDisputeStatus, { isLoading: isUpdatingStatus }] = useUpdateDisputeStatusMutation();
  const [createDecision, { isLoading: isSubmittingDecision }] = useCreateDisputeDecisionMutation();

  // Local state
  const [statusSelector, setStatusSelector] = useState<string>("");
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [decisionType, setDecisionType] = useState<"REFUNDED" | "REJECTED">("REFUNDED");
  const [decisionNotes, setDecisionNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const dispute = disputeResponse?.data;
  const decision = decisionResponse?.data;

  // Initialize status selector with current status once loaded
  React.useEffect(() => {
    if (dispute?.status && !statusSelector) {
      setStatusSelector(dispute.status);
    }
  }, [dispute?.status, statusSelector]);

  const handleUpdateStatus = async () => {
    if (!disputeId || !statusSelector) return;
    try {
      await updateDisputeStatus({
        id: disputeId,
        data: { status: statusSelector },
      }).unwrap();

      toast.success(`Dispute status updated to ${statusSelector.replace("_", " ")}.`);
      refetchDispute();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update dispute status.");
    }
  };

  const handleOpenDecisionModal = () => {
    setDecisionType("REFUNDED");
    setDecisionNotes(
      "Customer claim verified. Visual documentation confirms damaged/defective merchandise upon delivery. Full refund approved."
    );
    setIsDecisionModalOpen(true);
  };

  const handleSubmitDecision = async () => {
    if (!decisionNotes.trim() || decisionNotes.trim().length < 5) {
      toast.error("Please enter decision notes of at least 5 characters.");
      return;
    }

    try {
      await createDecision({
        dispute: disputeId,
        decision: decisionType,
        notes: decisionNotes.trim(),
      }).unwrap();

      toast.success(
        decisionType === "REFUNDED"
          ? "Dispute approved! Refund executed and order payment updated to REFUNDED."
          : "Dispute rejected and claim closed."
      );
      setIsDecisionModalOpen(false);
      refetchDispute();
      refetchDecision();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to record decision.");
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "RESOLVED":
        return (
          <span className="badge badge-success badge-sm gap-1.5 font-bold px-2.5 py-1 text-slate-950 bg-emerald-400 border-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
            RESOLVED / REFUNDED
          </span>
        );
      case "REJECTED":
        return (
          <span className="badge badge-error badge-sm gap-1.5 font-bold px-2.5 py-1 text-white bg-rose-500 border-0">
            <XCircle className="w-3.5 h-3.5" />
            REJECTED
          </span>
        );
      case "UNDER_REVIEW":
        return (
          <span className="badge badge-warning badge-sm gap-1.5 font-bold px-2.5 py-1 text-slate-950 bg-amber-400 border-0">
            <Clock className="w-3.5 h-3.5" />
            UNDER REVIEW
          </span>
        );
      case "OPEN":
      default:
        return (
          <span className="badge badge-info badge-sm gap-1.5 font-bold px-2.5 py-1 text-slate-950 bg-sky-400 border-0 animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            OPEN
          </span>
        );
    }
  };

  const parentPath =
    role === "ADMIN" ? "/admin/disputes" : role === "VENDOR" ? "/vendor/disputes" : "/customer/disputes";

  if (isLoadingDispute) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4 text-slate-400">
        <div className="loading loading-spinner loading-lg text-rose-400" />
        <p className="text-sm font-medium">Fetching dispute #{disputeId} from database...</p>
      </div>
    );
  }

  if (disputeError || !dispute) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4 bg-[#170d2f] border border-white/10 rounded-3xl mt-12">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Dispute Not Found</h3>
        <p className="text-xs text-slate-400">
          The requested dispute does not exist or you do not have permission to view it.
        </p>
        <Link href={parentPath} className="btn btn-sm btn-outline border-white/20 text-white rounded-xl">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Disputes
        </Link>
      </div>
    );
  }

  const order = dispute.order;
  const customer = dispute.customer;
  const vendor = dispute.vendor;

  return (
    <div className="space-y-6 w-full text-slate-100 pb-12">
      {/* ── Breadcrumb & Top Bar ───────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link href={parentPath} className="hover:text-white transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Disputes List
          </Link>
          <span>/</span>
          <span className="font-mono text-white">#{disputeId.slice(-8)}</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              refetchDispute();
              refetchDecision();
            }}
            disabled={isFetchingDispute}
            className="btn btn-xs btn-outline border-white/20 hover:border-white/40 text-slate-200 rounded-xl gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetchingDispute ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <Link
            href={parentPath}
            className="btn btn-xs bg-white/10 hover:bg-white/20 text-white border-0 rounded-xl"
          >
            Return to List
          </Link>
        </div>
      </div>

      {/* ── Hero Banner ────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#170d2f] via-[#1c123b] to-[#120a26] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-sm font-mono font-bold text-white bg-rose-500 border-0">
                Dispute Case #{dispute._id.slice(-8)}
              </span>
              {getStatusBadge(dispute.status)}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {dispute.reason}
            </h1>
            <p className="text-xs text-slate-300 flex items-center gap-4">
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Filed on {new Date(dispute.createdAt).toLocaleString()}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                Order #{order?.orderNo || "N/A"}
              </span>
            </p>
          </div>

          {/* Quick Action Button for Admin */}
          {role === "ADMIN" && (dispute.status === "OPEN" || dispute.status === "UNDER_REVIEW") && (
            <button
              onClick={handleOpenDecisionModal}
              className="btn bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold border-0 rounded-2xl shadow-xl shadow-rose-500/20 gap-2 shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              Make Decision & Resolve
            </button>
          )}
        </div>
      </div>

      {/* ── Main Two-Column Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Dispute Details, Evidence & Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Claim & Statement */}
          <div className="bg-[#170d2f] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                Customer Claim & Details
              </h3>
              <span className="text-xs text-slate-400">Live DB Record</span>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-bold text-slate-400">Stated Issue:</div>
              <p className="text-base font-bold text-white">{dispute.reason}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-xs font-bold text-slate-400">Detailed Statement:</div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-200 leading-relaxed">
                {dispute.details}
              </div>
            </div>
          </div>

          {/* Photographic Evidence Gallery */}
          <div className="bg-[#170d2f] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-sky-400" />
                Photographic Evidence ({dispute.evidenceUrls?.length || 0} attached)
              </h3>
            </div>

            {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {dispute.evidenceUrls.map((url: string, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(url)}
                    className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-video flex items-center justify-center cursor-pointer hover:border-rose-400 transition"
                  >
                    <ImageIcon className="w-8 h-8 text-slate-400 group-hover:scale-110 transition" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-xs font-bold text-white gap-1">
                      <span>View Photo {idx + 1}</span>
                      <span className="text-[10px] text-slate-300">Click to expand</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No photographic evidence was attached to this dispute.</p>
            )}
          </div>

          {/* Order Details & Financial Breakdown */}
          {order && (
            <div className="bg-[#170d2f] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  Associated Order Summary (#{order.orderNo})
                </h3>
                <span className="badge badge-outline border-white/20 text-xs text-slate-300">
                  Status: {order.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Total Price</div>
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    ${order.totalPrice?.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Payment Status</div>
                  <div className="text-sm font-bold text-white font-mono">{order.paymentStatus}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Items Count</div>
                  <div className="text-sm font-bold text-white font-mono">{order.totalQuantity || 1}</div>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-[10px] uppercase text-slate-400 font-bold">Courier</div>
                  <div className="text-sm font-bold text-white truncate">
                    {order.tracking?.courierName || "Standard Delivery"}
                  </div>
                </div>
              </div>

              {order.products && order.products.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-slate-400">Order Items ({order.products.length}):</div>
                  <div className="divide-y divide-white/5 border border-white/10 rounded-2xl overflow-hidden bg-white/[0.02]">
                    {order.products.map((p: any, pIdx: number) => (
                      <div key={pIdx} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center font-mono font-bold text-white text-[11px]">
                            {pIdx + 1}
                          </div>
                          <div>
                            <div className="font-bold text-white">Item Variant #{p.variant?.slice?.(-6) || pIdx + 1}</div>
                            <div className="text-[10px] text-slate-400">Quantity: {p.quantity}</div>
                          </div>
                        </div>
                        <div className="font-mono font-bold text-slate-200">
                          ${p.price ? (p.price * p.quantity).toFixed(2) : "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Official Decision & Refund Audit Log */}
          {decision && (
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#170d2f] to-[#120a26] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
                    Official Decision & Refund Audit
                  </h3>
                </div>
                <span
                  className={`badge font-bold text-xs ${
                    decision.decision === "REFUNDED"
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-rose-500 text-white"
                  }`}
                >
                  {decision.decision}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold">Resolved By:</div>
                  <div className="font-mono text-white font-bold">
                    {decision.resolvedBy?.email || dispute.resolvedBy?.email || "Platform Admin"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold">Decision Date:</div>
                  <div className="font-mono text-white">
                    {decision.createdAt ? new Date(decision.createdAt).toLocaleString() : "Recently Recorded"}
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <div className="text-slate-400 font-bold text-xs">Official Notes:</div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-200 leading-relaxed font-sans">
                  {decision.notes}
                </div>
              </div>

              {decision.decision === "REFUNDED" && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>
                    Full order refund recorded in database. Order and payment status updated to <strong>REFUNDED</strong>.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right 1 Column: Parties, Admin Status Controller, Sidebar Info */}
        <div className="space-y-6">
          {/* Admin Lifecycle Controller (PATCH /disputes/:id/status) */}
          {role === "ADMIN" && (
            <div className="bg-[#170d2f] border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  Admin Status Control
                </h3>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Target Lifecycle Status:</label>
                <div className="grid grid-cols-2 gap-2">
                  {["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusSelector(st)}
                      className={`p-2 rounded-xl text-xs font-bold transition text-center ${
                        statusSelector === st
                          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-105"
                          : "bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={isUpdatingStatus || statusSelector === dispute.status}
                onClick={handleUpdateStatus}
                className="w-full btn btn-sm bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold border-0 rounded-xl disabled:opacity-30 gap-1.5 shadow-lg shadow-emerald-500/10"
              >
                {isUpdatingStatus ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Apply Status (PATCH)
                  </>
                )}
              </button>

              <div className="pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleOpenDecisionModal}
                  className="w-full btn btn-sm bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold border-0 rounded-xl gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  Final Decision Modal
                </button>
              </div>
            </div>
          )}

          {/* Customer Card */}
          <div className="bg-[#170d2f] border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <User className="w-4 h-4 text-sky-400" />
              Customer Details
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white text-sm">{customer?.name || "Customer"}</div>
              <div className="text-xs text-slate-300 font-mono">{customer?.email}</div>
              <div className="text-[10px] text-slate-400">Role: {customer?.role}</div>
            </div>
          </div>

          {/* Vendor Card */}
          <div className="bg-[#170d2f] border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Store className="w-4 h-4 text-amber-400" />
              Vendor Merchant
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <div className="font-bold text-white text-sm">{vendor?.name || "Merchant"}</div>
              <div className="text-xs text-slate-300 font-mono">{vendor?.email}</div>
              <div className="text-[10px] text-slate-400">Role: {vendor?.role}</div>
            </div>
          </div>

          {/* Dispute Policy Information */}
          <div className="bg-gradient-to-br from-[#1c123b] to-[#120a26] border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Buyer Protection Policy
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every Amarzone dispute is reviewed under strict mediation guidelines. Valid photographic proof of
              defect or incorrect fulfillment qualifies for immediate automated reimbursement.
            </p>
          </div>
        </div>
      </div>

      {/* ── Image Lightbox Modal ───────────────────────────────── */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-pointer"
        >
          <div className="max-w-3xl w-full p-2 bg-[#170d2f] border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-3 flex items-center justify-between border-b border-white/10">
              <span className="text-xs font-bold text-white">Photographic Evidence Preview</span>
              <button
                onClick={() => setSelectedImage(null)}
                className="btn btn-xs btn-circle btn-ghost text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex items-center justify-center min-h-[300px] bg-black/40">
              <div className="text-center space-y-3">
                <ImageIcon className="w-16 h-16 text-rose-400 mx-auto opacity-80" />
                <div className="text-xs text-slate-300 font-mono break-all max-w-lg">{selectedImage}</div>
                <a
                  href={selectedImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-xs bg-rose-500 hover:bg-rose-600 text-white rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1" />
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Decision Modal ────────────────────────────────── */}
      {isDecisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1a1235] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase text-rose-400 tracking-wider">
                  Admin Resolution Action
                </div>
                <h3 className="text-xl font-black text-white">
                  Resolve Dispute #{dispute._id.slice(-8)}
                </h3>
              </div>
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Decision Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">Choose Resolution Outcome:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDecisionType("REFUNDED");
                    setDecisionNotes(
                      "Customer claim verified. Visual documentation confirms damaged/defective merchandise upon delivery. Full refund approved."
                    );
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    decisionType === "REFUNDED"
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/10"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Approve & Refund
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Updates order and payment to REFUNDED, records complete refund audit.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setDecisionType("REJECTED");
                    setDecisionNotes(
                      "Dispute claim rejected. Carrier tracking confirms parcel intact with matching weight and recipient signature. Evidence of alleged defect is insufficient."
                    );
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    decisionType === "REJECTED"
                      ? "bg-rose-500/20 border-rose-400 text-rose-300 shadow-lg shadow-rose-500/10"
                      : "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    Reject Claim
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Dismisses dispute. Order remains DELIVERED with no refund.
                  </p>
                </button>
              </div>
            </div>

            {/* Notes Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Official Decision Notes (Visible to Customer & Vendor):
              </label>
              <textarea
                value={decisionNotes}
                onChange={(e) => setDecisionNotes(e.target.value)}
                rows={4}
                placeholder="Enter justification notes explaining the decision..."
                className="w-full p-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-400 transition"
              />
            </div>

            {/* Confirmation Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsDecisionModalOpen(false)}
                className="btn btn-sm btn-ghost text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingDecision}
                onClick={handleSubmitDecision}
                className={`btn btn-sm font-bold rounded-xl text-slate-950 border-0 ${
                  decisionType === "REFUNDED"
                    ? "bg-emerald-400 hover:bg-emerald-500"
                    : "bg-rose-400 hover:bg-rose-500 text-white"
                }`}
              >
                {isSubmittingDecision ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    Confirm {decisionType === "REFUNDED" ? "Refund Approval" : "Rejection"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisputeDetailsView;
