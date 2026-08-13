"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import VendorDataSection from "@/components/dashboard/admin/VendorDataSection";
import TableSkeleton from "@/components/shared/TableSkeleton";
import {
  Store,
  PlusCircle,
  Download,
  Building2,
  CheckCircle2,
  Clock,
  DollarSign,
  ChevronRight,
  Filter,
  Sparkles
} from "lucide-react";

const AdminVendorsPage = () => {
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
            <Store className="w-3.5 h-3.5 text-primary" />
            <span>Vendors Directory</span>
          </li>
        </ul>
      </div>

      {/* DAISYUI HERO CONTROL HEADER CARD */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-primary gap-1 px-3 py-2 text-xs font-black shadow">
                <Sparkles className="w-3.5 h-3.5" />
                DaisyUI Vendor Control
              </span>
              <span className="badge badge-success badge-outline gap-1 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                Live Merchant Database
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              Vendor <span className="text-primary">Management</span> & Directory
            </h1>
            <p className="text-base-content/70 text-xs sm:text-sm max-w-2xl">
              Audit registered store profiles, inspect merchant performance, review onboarding applications, and handle vendor accounts.
            </p>
          </div>

          {/* DaisyUI Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-outline btn-sm gap-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button type="button" className="btn btn-primary btn-sm gap-2 shadow-md">
              <PlusCircle className="w-4 h-4" />
              <span>Add New Vendor</span>
            </button>
          </div>
        </div>
      </div>

      {/* DAISYUI STATS GRID COMPONENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Stores */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Total Vendors</div>
            <div className="stat-value text-2xl text-primary">428</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              ↗︎ 14 new stores this month
            </div>
          </div>
        </div>

        {/* Stat 2: Active Verified */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-success">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Verified Active</div>
            <div className="stat-value text-2xl text-success">412</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              96.2% active compliance rate
            </div>
          </div>
        </div>

        {/* Stat 3: Pending Approvals */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-warning">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Pending Approvals</div>
            <div className="stat-value text-2xl text-warning">16</div>
            <div className="stat-desc font-bold text-warning flex items-center gap-1 mt-1">
              Requires administrative audit
            </div>
          </div>
        </div>

        {/* Stat 4: Total Commission */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <DollarSign className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">GMV Contribution</div>
            <div className="stat-value text-2xl text-secondary">$1.84M</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              ↗︎ 22.4% revenue increase
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC VENDOR DATA SECTION WITH REACT SUSPENSE FALLBACK */}
      <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} showActions={true} />}>
        <VendorDataSection />
      </Suspense>
    </div>
  );
};

export default AdminVendorsPage;
