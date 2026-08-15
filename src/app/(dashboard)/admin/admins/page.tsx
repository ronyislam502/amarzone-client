"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import AdminDataSection from "@/components/dashboard/admin/AdminDataSection";
import TableSkeleton from "@/components/shared/TableSkeleton";
import {
  ShieldCheck,
  UserCheck,
  Download,
  PlusCircle,
  Shield,
  Key,
  Lock,
  Sparkles
} from "lucide-react";

const AdminUsersPage = () => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* DAISYUI BREADCRUMBS */}
      <div className="breadcrumbs text-xs text-base-content/70">
        <ul>
          <li>
            <Link href="/admin" className="hover:text-primary transition-colors">
              Admin Dashboard
            </Link>
          </li>
          <li className="font-extrabold text-base-content flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-secondary" />
            <span>Admins Directory</span>
          </li>
        </ul>
      </div>

      {/* DAISYUI HERO CONTROL HEADER CARD */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-secondary gap-1 px-3 py-2 text-xs font-black shadow">
                <Sparkles className="w-3.5 h-3.5" />
                Root Governance & RBAC
              </span>
              <span className="badge badge-success badge-outline gap-1 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                Protected Route API (auth: SUPER_ADMIN, ADMIN)
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              Administrator <span className="text-secondary">Directory</span> & Staff
            </h1>
            <p className="text-base-content/70 text-xs sm:text-sm max-w-2xl">
              Inspect root administrators, platform staff credentials, privilege roles, and manage system security access across the marketplace.
            </p>
          </div>

          {/* DaisyUI Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-outline btn-sm gap-2">
              <Download className="w-4 h-4" />
              <span>Export Audit Log</span>
            </button>
            <button type="button" className="btn btn-secondary btn-sm gap-2 shadow-md">
              <PlusCircle className="w-4 h-4" />
              <span>Create New Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* DAISYUI STATS GRID COMPONENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Admins */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <UserCheck className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Total Admins</div>
            <div className="stat-value text-2xl text-secondary">Active</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              Protected authentication
            </div>
          </div>
        </div>

        {/* Stat 2: Super Admins */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <ShieldCheck className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Super Admin Role</div>
            <div className="stat-value text-2xl text-primary">Root</div>
            <div className="stat-desc font-bold text-primary flex items-center gap-1 mt-1">
              Full system privileges
            </div>
          </div>
        </div>

        {/* Stat 3: Standard Admins */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-info">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center border border-info/20">
                <Shield className="w-6 h-6 text-info" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Staff Managers</div>
            <div className="stat-value text-2xl text-info">Granted</div>
            <div className="stat-desc font-bold text-info flex items-center gap-1 mt-1">
              Operational permissions
            </div>
          </div>
        </div>

        {/* Stat 4: Security Status */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-success">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
                <Key className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Security Health</div>
            <div className="stat-value text-2xl text-success">100%</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              JWT Bearer Verified
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC ADMIN DATA SECTION WITH REACT SUSPENSE FALLBACK */}
      <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} showActions={true} />}>
        <AdminDataSection />
      </Suspense>
    </div>
  );
};

export default AdminUsersPage;
