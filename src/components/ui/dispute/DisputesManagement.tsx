"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  AlertCircle,
  Eye,
  DollarSign,
  Package,
  User,
  Store,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ImageIcon,
  ExternalLink,
} from "lucide-react";
import {
  useGetAllDisputesQuery,
  useGetSingleDisputeQuery,
  useCreateDisputeDecisionMutation,
  useUpdateDisputeStatusMutation,
} from "@/redux/features/dispute/disputeApi";
import { toast } from "react-toastify";

interface DisputesManagementProps {
  role?: "ADMIN" | "CUSTOMER" | "VENDOR";
  title?: string;
  subtitle?: string;
}

export const DisputesManagement: React.FC<DisputesManagementProps> = ({
  role = "ADMIN",
  title = "Disputes & Mediation Center",
  subtitle = "Review customer dispute claims, analyze photographic evidence, and execute resolutions or buyer refunds.",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Selected dispute for detail modal
  const [selectedDispute, setSelectedDispute] = useState<any | null>(null);
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(null);

  // Fetch fresh single dispute via GET /disputes/:id
  const { data: singleDisputeResponse, isFetching: isFetchingSingleDispute } = useGetSingleDisputeQuery(
    selectedDisputeId as string,
    { skip: !selectedDisputeId }
  );
  const activeDispute = singleDisputeResponse?.data || selectedDispute;

  const parentPath =
    role === "ADMIN" ? "/admin/disputes" : role === "VENDOR" ? "/vendor/disputes" : "/customer/disputes";

  // Resolution modal state (Admin only)
  const [decisionModalDispute, setDecisionModalDispute] = useState<any | null>(null);
  const [decisionType, setDecisionType] = useState<"REFUNDED" | "REJECTED">("REFUNDED");
  const [decisionNotes, setDecisionNotes] = useState("");

  const queryParams: Record<string, any> = {
    page,
    limit,
    sort: "-createdAt",
  };

  if (searchTerm.trim()) {
    queryParams.searchTerm = searchTerm.trim();
  }

  if (statusFilter !== "ALL") {
    queryParams.status = statusFilter;
  }

  // Fetch disputes using RTK Query
  const { data: response, isLoading, isFetching, refetch } = useGetAllDisputesQuery(queryParams);
  const [createDecision, { isLoading: isSubmittingDecision }] = useCreateDisputeDecisionMutation();
  const [updateDisputeStatus, { isLoading: isUpdatingStatus }] = useUpdateDisputeStatusMutation();

  const [updatingDisputeId, setUpdatingDisputeId] = useState<string | null>(null);
  const [modalTargetStatus, setModalTargetStatus] = useState<string>("");

  const disputes: any[] = response?.data || [];
  const meta = response?.meta || { page: 1, limit: 10, total: 0, totalPage: 1 };

  // Calculate quick badge counts from current data or meta
  const totalCount = meta.total ?? disputes.length;

  const handleUpdateStatus = async (disputeId: string, newStatus: string) => {
    setUpdatingDisputeId(disputeId);
    try {
      await updateDisputeStatus({
        id: disputeId,
        data: { status: newStatus },
      }).unwrap();

      toast.success(`Dispute status updated to ${newStatus.replace("_", " ")}.`);
      if (selectedDispute && selectedDispute._id === disputeId) {
        setSelectedDispute((prev: any) => ({ ...prev, status: newStatus }));
        setModalTargetStatus(newStatus);
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update dispute status.");
    } finally {
      setUpdatingDisputeId(null);
    }
  };

  const handleOpenDecisionModal = (dispute: any) => {
    setDecisionModalDispute(dispute);
    setDecisionType("REFUNDED");
    setDecisionNotes(
      "Customer claim verified. Visual documentation confirms damaged/defective merchandise upon delivery. Full refund approved."
    );
  };

  const handleSubmitDecision = async () => {
    if (!decisionModalDispute) return;
    if (!decisionNotes.trim() || decisionNotes.trim().length < 5) {
      toast.error("Please provide decision notes of at least 5 characters.");
      return;
    }

    try {
      await createDecision({
        dispute: decisionModalDispute._id,
        decision: decisionType,
        notes: decisionNotes.trim(),
      }).unwrap();

      toast.success(
        decisionType === "REFUNDED"
          ? "Dispute approved! Refund executed and order payment updated to REFUNDED."
          : "Dispute rejected and claim closed."
      );
      setDecisionModalDispute(null);
      if (selectedDispute?._id === decisionModalDispute._id) {
        setSelectedDispute(null);
      }
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to record dispute decision.");
    }
  };

  const getStatusBadge = (status: string) => {
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

  return (
    <div className="space-y-6 w-full text-slate-100">
      {/* ── Page Header Banner ─────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#170d2f] via-[#1c123b] to-[#120a26] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-rose-500/60 to-transparent pointer-events-none" />
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="badge badge-error badge-sm font-bold text-white px-2.5">
                {role === "ADMIN" ? "Admin Oversight" : role === "VENDOR" ? "Seller Resolution" : "Buyer Protection"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              {title}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="btn btn-outline border-white/20 hover:border-white/40 text-slate-200 hover:text-white rounded-xl text-xs gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <div className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Total Cases</div>
              <div className="text-lg font-black text-white font-mono">{totalCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter & Search Toolbar ────────────────────────────── */}
      <div className="bg-[#170d2f]/80 backdrop-blur border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {["ALL", "OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"].map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === status
                  ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25 scale-105"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              {status === "ALL"
                ? "All Disputes"
                : status === "RESOLVED"
                ? "Refunded & Resolved"
                : status.replace("_", " ")}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search reasons, details, orders..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-400 transition"
          />
        </div>
      </div>

      {/* ── Disputes Table / List ──────────────────────────────── */}
      <div className="bg-[#170d2f]/90 border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center space-y-4">
            <div className="loading loading-spinner loading-lg text-rose-400 mx-auto" />
            <p className="text-sm text-slate-400">Loading dispute records from database...</p>
          </div>
        ) : disputes.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-slate-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Disputes Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No disputes match your current filter criteria. Try adjusting the search term or status filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px] tracking-wider bg-white/[0.02]">
                  <th className="py-4 pl-6">Dispute / Order</th>
                  <th className="py-4">Parties (Customer & Vendor)</th>
                  <th className="py-4">Reason & Issue</th>
                  <th className="py-4">Status</th>
                  <th className="py-4">Evidence</th>
                  <th className="py-4">Created Date</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {disputes.map((dispute) => {
                  const order = dispute.order;
                  const customer = dispute.customer;
                  const vendor = dispute.vendor;

                  return (
                    <tr
                      key={dispute._id}
                      className="hover:bg-white/[0.04] transition-colors group"
                    >
                      {/* Order info */}
                      <td className="py-4 pl-6">
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-white text-xs">
                            #{order?.orderNo || dispute._id.slice(-8)}
                          </span>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Package className="w-3 h-3 text-slate-400" />
                            <span>Total: ${order?.totalPrice?.toFixed(2) || "N/A"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Customer & Vendor */}
                      <td className="py-4">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5 text-xs text-slate-200">
                            <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span className="truncate max-w-[140px] font-medium">
                              {customer?.name || customer?.email || "Unknown"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Store className="w-3 h-3 text-amber-400 shrink-0" />
                            <span className="truncate max-w-[140px]">
                              {vendor?.name || vendor?.email || "Merchant"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Reason & Details preview */}
                      <td className="py-4 max-w-xs">
                        <div className="space-y-1">
                          <div className="font-bold text-white text-xs">{dispute.reason}</div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {dispute.details}
                          </p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4">{getStatusBadge(dispute.status)}</td>

                      {/* Evidence thumbnail preview */}
                      <td className="py-4">
                        {dispute.evidenceUrls && dispute.evidenceUrls.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="badge badge-ghost badge-xs font-mono text-[10px] text-slate-300">
                              <ImageIcon className="w-3 h-3 mr-1" />
                              {dispute.evidenceUrls.length} file{dispute.evidenceUrls.length > 1 ? "s" : ""}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">None</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 text-slate-400 text-[11px] font-mono">
                        {dispute.createdAt
                          ? new Date(dispute.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setSelectedDisputeId(dispute._id);
                              setModalTargetStatus(dispute.status);
                            }}
                            className="btn btn-xs bg-white/10 hover:bg-white/20 text-white border-0 rounded-lg gap-1"
                            title="View dispute details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Details
                          </button>

                          {role === "ADMIN" && dispute.status === "OPEN" && (
                            <button
                              onClick={() => handleUpdateStatus(dispute._id, "UNDER_REVIEW")}
                              disabled={updatingDisputeId === dispute._id}
                              className="btn btn-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg gap-1"
                              title="Mark dispute as Under Review"
                            >
                              {updatingDisputeId === dispute._id ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                <>
                                  <Clock className="w-3 h-3" />
                                  Review
                                </>
                              )}
                            </button>
                          )}

                          {role === "ADMIN" && dispute.status === "UNDER_REVIEW" && (
                            <button
                              onClick={() => handleUpdateStatus(dispute._id, "OPEN")}
                              disabled={updatingDisputeId === dispute._id}
                              className="btn btn-xs bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 rounded-lg gap-1"
                              title="Move back to Open"
                            >
                              {updatingDisputeId === dispute._id ? (
                                <span className="loading loading-spinner loading-xs" />
                              ) : (
                                "Reopen"
                              )}
                            </button>
                          )}

                          {role === "ADMIN" && (dispute.status === "OPEN" || dispute.status === "UNDER_REVIEW") && (
                            <button
                              onClick={() => handleOpenDecisionModal(dispute)}
                              className="btn btn-xs bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-bold border-0 rounded-lg shadow-lg shadow-rose-500/20 gap-1"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Decide
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Controls ────────────────────────────────── */}
        {meta.totalPage > 1 && (
          <div className="p-4 sm:p-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              Showing page <span className="font-bold text-white">{meta.page}</span> of{" "}
              <span className="font-bold text-white">{meta.totalPage}</span> ({meta.total} total cases)
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-xs btn-outline border-white/10 hover:bg-white/10 text-white rounded-lg gap-1 disabled:opacity-30"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Prev
              </button>
              <div className="font-mono px-2 text-white">{page}</div>
              <button
                onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
                disabled={page >= meta.totalPage}
                className="btn btn-xs btn-outline border-white/10 hover:bg-white/10 text-white rounded-lg gap-1 disabled:opacity-30"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Dispute Details Modal ───────────────────────────────── */}
      {activeDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1a1235] border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-sm font-mono font-bold text-white bg-rose-500 border-0">
                    Dispute #{activeDispute._id.slice(-8)}
                  </span>
                  {getStatusBadge(activeDispute.status)}
                  {isFetchingSingleDispute && (
                    <span className="loading loading-spinner loading-xs text-rose-400" />
                  )}
                </div>
                <h3 className="text-xl font-black text-white">
                  {activeDispute.reason}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedDispute(null);
                  setSelectedDisputeId(null);
                }}
                className="btn btn-sm btn-circle btn-ghost text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Order & Parties Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Order Information</div>
                <div className="text-sm font-bold text-white font-mono">
                  #{activeDispute.order?.orderNo || "N/A"}
                </div>
                <div className="text-xs text-slate-300">
                  Total: <span className="font-bold text-emerald-400">${activeDispute.order?.totalPrice?.toFixed(2)}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Payment Status: <span className="font-bold text-white">{activeDispute.order?.paymentStatus || "PAID"}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-400">Customer & Vendor</div>
                <div className="text-xs text-slate-200">
                  Customer: <span className="font-bold text-white">{activeDispute.customer?.name}</span> ({activeDispute.customer?.email})
                </div>
                <div className="text-xs text-slate-200">
                  Vendor: <span className="font-bold text-white">{activeDispute.vendor?.name}</span> ({activeDispute.vendor?.email})
                </div>
                {activeDispute.resolvedBy && (
                  <div className="text-xs text-amber-300 pt-1 border-t border-white/10">
                    Resolved By: {activeDispute.resolvedBy?.email || "Admin"}
                  </div>
                )}
              </div>
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <div className="text-[11px] uppercase font-bold text-slate-400">
                Customer Claim Description
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-sm text-slate-200 leading-relaxed">
                {activeDispute.details}
              </div>
            </div>

            {/* Evidence Gallery */}
            {activeDispute.evidenceUrls && activeDispute.evidenceUrls.length > 0 && (
              <div className="space-y-2">
                <div className="text-[11px] uppercase font-bold text-slate-400">
                  Photographic Evidence ({activeDispute.evidenceUrls.length} items)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {activeDispute.evidenceUrls.map((url: string, idx: number) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video flex items-center justify-center p-2 hover:border-rose-400 transition"
                    >
                      <ImageIcon className="w-6 h-6 text-slate-400 group-hover:scale-110 transition" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-[10px] font-bold text-white">
                        View Image {idx + 1}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Admin Direct Status Control (PATCH /disputes/:id/status) */}
            {role === "ADMIN" && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] uppercase font-bold text-rose-400 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Admin Lifecycle Status Control
                  </div>
                  <span className="text-[10px] text-slate-400">Current Status: <span className="font-bold text-white">{activeDispute.status}</span></span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setModalTargetStatus(st)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition ${
                        modalTargetStatus === st
                          ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20 scale-105"
                          : "bg-white/5 text-slate-300 hover:bg-white/10"
                      }`}
                    >
                      {st.replace("_", " ")}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={isUpdatingStatus || modalTargetStatus === activeDispute.status}
                    onClick={() => handleUpdateStatus(activeDispute._id, modalTargetStatus)}
                    className="btn btn-xs bg-emerald-400 hover:bg-emerald-500 text-slate-950 font-bold border-0 rounded-xl ml-auto disabled:opacity-30 gap-1"
                  >
                    {isUpdatingStatus ? (
                      <span className="loading loading-spinner loading-xs" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Apply Status Update
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
              <Link
                href={`${parentPath}/${activeDispute._id}`}
                className="btn btn-sm btn-outline border-white/20 hover:border-white/40 text-slate-200 hover:text-white rounded-xl text-xs gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Full Page Inspection
              </Link>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedDispute(null);
                    setSelectedDisputeId(null);
                  }}
                  className="btn btn-sm btn-ghost text-slate-300 hover:text-white"
                >
                  Close
                </button>

                {role === "ADMIN" && activeDispute.status === "OPEN" && (
                  <button
                    onClick={() => {
                      handleOpenDecisionModal(activeDispute);
                    }}
                    className="btn btn-sm bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold border-0 rounded-xl"
                  >
                    Make Decision & Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Decision & Refund Modal ───────────────────────── */}
      {decisionModalDispute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#1a1235] border border-white/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-0.5">
                <div className="text-[10px] font-bold uppercase text-rose-400 tracking-wider">
                  Admin Resolution Action
                </div>
                <h3 className="text-xl font-black text-white">
                  Dispute #{decisionModalDispute._id.slice(-8)}
                </h3>
              </div>
              <button
                onClick={() => setDecisionModalDispute(null)}
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
                      "Dispute claim rejected. Verified carrier scan and recipient signature confirm parcel delivered intact with no defect evidence."
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
                onClick={() => setDecisionModalDispute(null)}
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

export default DisputesManagement;
