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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-base-100 border border-base-200 w-full max-w-xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        {/* Top Gradient Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-secondary via-primary to-accent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20 bg-base-100/80 hover:bg-base-200 shadow"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 text-xs">
          {/* Header Profile Section */}
          <div className="flex items-center gap-4 border-b border-base-200 pb-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-secondary/30 bg-base-200 shadow-md flex items-center justify-center shrink-0">
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-secondary/10 text-secondary flex items-center justify-center text-2xl font-black">
                  {admin.name?.charAt(0)?.toUpperCase() || "A"}
                </div>
              )}
            </div>
            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2">
                {isSuperAdmin ? (
                  <span className="badge badge-primary badge-sm font-bold text-white gap-1">
                    <Shield className="w-3 h-3" /> Super Admin
                  </span>
                ) : (
                  <span className="badge badge-secondary badge-sm font-bold text-white gap-1">
                    <ShieldCheck className="w-3 h-3" /> Administrator
                  </span>
                )}

                {!admin.isDeleted ? (
                  <span className="badge badge-success badge-sm font-bold gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                ) : (
                  <span className="badge badge-error badge-sm font-bold gap-1">
                    <AlertTriangle className="w-3 h-3" /> Suspended
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black tracking-tight text-base-content truncate">
                {admin.name}
              </h3>
              <p className="text-[11px] font-mono text-base-content/50">
                Admin ID: {admin._id}
              </p>
            </div>
          </div>

          {/* Contact & Authority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Contact Channels Card */}
            <div className="card bg-base-200/40 border border-base-200 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-secondary" />
                <span>Contact Channels</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                  <a
                    href={`mailto:${admin.email}`}
                    className="font-bold text-secondary hover:underline truncate"
                  >
                    {admin.email || "N/A"}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-base-content/40 shrink-0" />
                  <span className="font-medium text-base-content/90">
                    {admin.phone || "No phone provided"}
                  </span>
                </div>
              </div>
            </div>

            {/* Platform Role & Access Card */}
            <div className="card bg-base-200/40 border border-base-200 p-4 rounded-2xl space-y-3">
              <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-primary" />
                <span>Security & Permissions</span>
              </div>
              <div className="space-y-1 text-base-content/80">
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60">Privilege Tier:</span>
                  <span className="font-bold text-primary">
                    {isSuperAdmin ? "Root / Full Platform Control" : "Administrative Operations"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60">Access Scope:</span>
                  <span className="font-medium">Products, Vendors, Orders, SLA</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-base-content/60">Status:</span>
                  <span className="font-bold text-success">Compliant 2FA Enabled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Governance & Timestamps */}
          <div className="card bg-base-200/40 border border-base-200 p-4 rounded-2xl space-y-3">
            <div className="text-[11px] font-black uppercase tracking-wider text-base-content/70 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-secondary" />
              <span>Identity & Audit Metadata</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-base-content/50">Auth User Reference</span>
                <div className="flex items-center gap-1 font-mono text-[11px] font-bold">
                  <User className="w-3 h-3 text-secondary" />
                  <span className="truncate">
                    {typeof admin.user === "object"
                      ? (admin.user as any)?._id
                      : admin.user || "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-base-content/50">Account Onboarded</span>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <Calendar className="w-3 h-3 text-base-content/40" />
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
                <span className="text-[10px] text-base-content/50">Profile Updated</span>
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <Calendar className="w-3 h-3 text-base-content/40" />
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
          <div className="pt-3 border-t border-base-200 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-sm btn-outline font-bold px-6 cursor-pointer"
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
