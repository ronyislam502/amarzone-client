"use client";

import {
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  X,
  ShieldCheck,
  Shield,
  Key,
} from "lucide-react";
import { TAdmin } from "@/types/admin";

interface AdminDetailsModalProps {
  admin: TAdmin | null;
  isOpen: boolean;
  onClose: () => void;
}

const AdminDetailsModal = ({
  admin,
  isOpen,
  onClose,
}: AdminDetailsModalProps) => {
  if (!isOpen || !admin) return null;

  const role = typeof admin.user === "object" ? admin.user?.role : undefined;
  const isSuperAdmin = role === "super_admin" || role === "SUPER_ADMIN";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#170d2f] border border-white/10 w-full max-w-xl max-h-[90vh] rounded-3xl shadow-[0_25px_80px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative text-slate-100">
        {/* Top glowing accent border ray */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />

        {/* Ambient background glow orbs */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="relative z-10 overflow-y-auto flex-1 p-6 space-y-6 text-xs">
          {/* Header Profile Section */}
          <div className="flex items-center gap-4 border-b border-white/10 pb-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-amber-400/30 bg-white/[0.04] shadow-md flex items-center justify-center shrink-0">
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-amber-400/10 text-amber-400 flex items-center justify-center text-2xl font-black">
                  {admin.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                {isSuperAdmin ? (
                  <span className="badge badge-warning badge-sm font-black text-slate-950 gap-1 shadow">
                    <Shield className="w-3 h-3" /> Super Admin
                  </span>
                ) : (
                  <span className="badge badge-outline border-amber-400/40 text-amber-400 badge-sm font-bold gap-1">
                    <ShieldCheck className="w-3 h-3" /> Administrator
                  </span>
                )}

                {!admin.isDeleted ? (
                  <span className="badge badge-success badge-outline bg-success/10 border-success/30 text-success badge-sm font-bold gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="badge badge-error badge-outline bg-error/10 border-error/30 text-error badge-sm font-bold gap-1">
                    <AlertTriangle className="w-3 h-3" /> Suspended
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-white truncate">
                {admin.name}
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Admin ID: {admin._id}
              </p>
            </div>
          </div>

          {/* Contact & Authority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Channels Card */}
            <div className="card bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Contact Channels</span>
              </div>
              <div className="space-y-2 text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a
                    href={`mailto:${admin.email}`}
                    className="font-bold text-amber-400 hover:underline truncate"
                  >
                    {admin.email || "N/A"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-medium text-slate-200">
                    {admin.phone || "No phone provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Role & Access Card */}
            <div className="card bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Security & Permissions</span>
              </div>
              <div className="space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Privilege Tier:</span>
                  <span className="font-bold text-amber-400">
                    {isSuperAdmin ? "Root / Full Control" : "Administrative Operations"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Access Scope:</span>
                  <span className="font-medium text-slate-200">Products, Vendors, Orders</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-success">Compliant 2FA Enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Governance & Timestamps */}
          <div className="card bg-white/[0.03] backdrop-blur-md border border-white/10 p-4 rounded-2xl space-y-3">
            <div className="text-[11px] font-black uppercase tracking-wider text-amber-400/90 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Identity & Audit Metadata</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">Auth User Reference</span>
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold text-slate-200">
                  <User className="w-3 h-3 text-amber-400" />
                  <span className="truncate">
                    {typeof admin.user === "object"
                      ? (admin.user as any)?._id
                      : admin.user || "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">Account Onboarded</span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>
                    {admin.createdAt
                      ? new Date(admin.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">Profile Updated</span>
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-200">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>
                    {admin.updatedAt
                      ? new Date(admin.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-white/10 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-outline border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 font-bold px-6 cursor-pointer rounded-xl transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsModal;
