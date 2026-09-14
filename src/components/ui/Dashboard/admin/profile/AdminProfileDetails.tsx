"use client";

import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  FolderTree,
  Users,
  Store,
  Clock,
  ArrowRight,
  Shield,
  Layers,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { TAdmin } from "@/src/types/admin";

interface AdminProfileDetailsProps {
  adminProfile: TAdmin;
  onOpenEditModal: () => void;
}

const AdminProfileDetails = ({
  adminProfile,
  onOpenEditModal,
}: AdminProfileDetailsProps) => {
  const formattedCreationDate = adminProfile.createdAt
    ? new Date(adminProfile.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Active Tenure";

  const formattedUpdateDate = adminProfile.updatedAt
    ? new Date(adminProfile.updatedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Recent";

  const adminRoleDisplay =
    adminProfile.user?.role === "SUPER_ADMIN"
      ? "Super Administrator"
      : "Platform Administrator";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column (2 cols): Comprehensive Profile Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Section 1: Administrator Contact & Identity */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
          {/* Ambient background glow */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-amber-500/15 via-orange-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* High-tech dot matrix overlay */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-warning badge-sm font-black text-slate-950">
                    Identity
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    Administrative Credentials
                  </h2>
                </div>
                <p className="text-xs text-slate-400">
                  Primary operator contact channels and access clearance.
                </p>
              </div>

              <button
                type="button"
                onClick={onOpenEditModal}
                className="btn btn-outline btn-xs font-bold border-amber-400/40 text-amber-400 hover:bg-amber-400 hover:text-slate-950 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
              >
                Edit Information
              </button>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Administrator Name</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-white truncate">
                  {adminProfile.name || "Administrator"}
                </div>
                <div className="text-[11px] text-slate-400">
                  Registered system operator name
                </div>
              </div>

              {/* Email Address */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    Official Email
                  </span>
                  <span className="badge badge-success badge-xs font-bold text-[10px]">
                    Verified
                  </span>
                </div>
                <a
                  href={`mailto:${adminProfile.email}`}
                  className="text-sm sm:text-base font-bold text-amber-400 hover:underline truncate block"
                  title={adminProfile.email}
                >
                  {adminProfile.email || "No email configured"}
                </a>
                <div className="text-[11px] text-slate-400">
                  Used for system alerts and security logs
                </div>
              </div>

              {/* Telephone */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Phone / Direct Line</span>
                </div>
                <div className="text-sm sm:text-base font-bold text-slate-200">
                  {adminProfile.phone ? (
                    <a
                      href={`tel:${adminProfile.phone}`}
                      className="hover:text-emerald-400 transition-colors"
                    >
                      {adminProfile.phone}
                    </a>
                  ) : (
                    <span className="text-slate-500 font-normal italic">
                      No phone line provided
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  Emergency operator contact line
                </div>
              </div>

              {/* Clearance Role */}
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1.5 hover:border-amber-400/30 transition-colors">
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Administrative Role & Scope</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-indigo-300">
                    {adminRoleDisplay}
                  </span>
                  <span className="badge badge-info badge-sm font-bold text-[10px]">
                    Root Access
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  System-wide governance, moderation & auditing
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Administrative Governance Scope & System Powers */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none z-20" />
          {/* Ambient background glow */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-emerald-500/15 via-teal-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* High-tech dot matrix overlay */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-5">
            <div className="space-y-1 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="badge badge-success badge-sm font-black text-slate-950">
                  Governance
                </span>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  System Governance & Scope
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Operational privileges assigned to this administrator account.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-amber-400 uppercase">
                  <FolderTree className="w-4 h-4" />
                  <span>Taxonomy & Catalog Control</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Full authority to manage product categories, department mappings, and global taxonomy structures.
                </p>
              </div>

              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-400 uppercase">
                  <Users className="w-4 h-4" />
                  <span>User & Vendor Moderation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Authorized to review merchant onboarding, verify shoppers, audit suspensions, and manage staff accounts.
                </p>
              </div>

              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-400 uppercase">
                  <Shield className="w-4 h-4" />
                  <span>Disputes & Settlement Oversight</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Arbitrate customer and merchant disputes, review escrow payouts, and manage refund decisions.
                </p>
              </div>

              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-black text-purple-300 uppercase">
                  <Layers className="w-4 h-4" />
                  <span>System Health & SLA Audits</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Monitor platform background workers, Redis caches, invoice queues, and merchant SLA compliance.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Timeline & Audit Trail */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-7">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-400/60 to-transparent pointer-events-none z-20" />
          {/* Ambient background glow */}
          <div className="absolute -top-16 -left-16 w-56 h-56 bg-gradient-to-br from-indigo-500/15 via-purple-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          {/* High-tech dot matrix overlay */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <span className="badge badge-info badge-sm font-black text-slate-950">
                Audit
              </span>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Account Timeline & Audit Trail
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-amber-400" />
                  <span>Account Onboarding</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-200">
                  {formattedCreationDate}
                </div>
                <div className="text-[10px] text-slate-500">
                  Initial administrator registration
                </div>
              </div>

              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>Last Profile Update</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-200">
                  {formattedUpdateDate}
                </div>
                <div className="text-[10px] text-slate-500">
                  Most recent profile modification
                </div>
              </div>

              <div className="card bg-[#120824] border border-white/10 p-4 rounded-2xl space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-black flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-indigo-400" />
                  <span>Operator Standing</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Active & In Good Standing</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  Full security clearance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (1 col): Management Shortcuts & Security Guarantee */}
      <div className="space-y-6">
        {/* Management Quick Actions Card */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/60 to-transparent pointer-events-none z-20" />
          {/* High-tech dot matrix overlay */}
          <div className="absolute inset-0 bg-dot-grid opacity-20 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black_30%,transparent_100%)] pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="space-y-1 border-b border-white/10 pb-3">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-400">
                Administration
              </span>
              <h3 className="text-base font-black text-white">
                Management Hub
              </h3>
            </div>

            <div className="space-y-2.5">
              {/* Categories Catalog */}
              <Link
                href="/admin/categories"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-amber-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <FolderTree className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                      Category Catalog
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Taxonomy & departments
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Customers Directory */}
              <Link
                href="/admin/customers"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-emerald-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                      Customers Directory
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Shoppers & accounts
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Vendors Directory */}
              <Link
                href="/admin/vendors"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-purple-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                      Vendors Directory
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Merchants & storefronts
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-300 group-hover:translate-x-0.5 transition-all" />
              </Link>

              {/* Staff & Administrators */}
              <Link
                href="/admin/admins"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#120824] border border-white/10 hover:border-indigo-400/40 hover:bg-white/5 transition-all text-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors">
                      System Administrators
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Staff & operator roles
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* Security and Privacy Assurance Card */}
        <div className="card relative overflow-hidden bg-[#170d2f] shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 space-y-4">
          {/* Top glowing accent border line */}
          <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-400/60 to-transparent pointer-events-none z-20" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-300">
                  Root Governance Security
                </h4>
                <div className="text-[10px] text-slate-400">
                  Encrypted Protection
                </div>
              </div>
            </div>

            <div className="card bg-[#120824] border border-white/10 p-3.5 rounded-xl space-y-2 text-xs text-slate-300 leading-relaxed">
              <p>
                Administrative credentials and passwords are hash-protected with high-cost salt factors and strictly withheld from client displays.
              </p>
              <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero-Exposure Password Standard</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileDetails;
