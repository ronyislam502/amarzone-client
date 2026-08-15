"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import CustomerDataSection from "@/components/dashboard/admin/CustomerDataSection";
import TableSkeleton from "@/components/shared/TableSkeleton";
import {
  Users,
  Download,
  PlusCircle,
  CheckCircle2,
  UserCheck,
  ShoppingBag,
  Sparkles,
  ShieldCheck
} from "lucide-react";

const AdminCustomersPage = () => {
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
            <Users className="w-3.5 h-3.5 text-info" />
            <span>Customers Directory</span>
          </li>
        </ul>
      </div>

      {/* DAISYUI HERO CONTROL HEADER CARD */}
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="badge badge-info gap-1 px-3 py-2 text-xs font-black shadow">
                <Sparkles className="w-3.5 h-3.5" />
                DaisyUI Buyer Telemetry
              </span>
              <span className="badge badge-success badge-outline gap-1 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                Protected Route API (auth: SUPER_ADMIN, ADMIN)
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              Customer <span className="text-info">Management</span> & Directory
            </h1>
            <p className="text-base-content/70 text-xs sm:text-sm max-w-2xl">
              Monitor active platform buyers, audit customer activity, review shipping profiles, and manage buyer account statuses.
            </p>
          </div>

          {/* DaisyUI Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-outline btn-sm gap-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button type="button" className="btn btn-info btn-sm gap-2 text-white shadow-md">
              <PlusCircle className="w-4 h-4" />
              <span>Add Customer</span>
            </button>
          </div>
        </div>
      </div>

      {/* DAISYUI STATS GRID COMPONENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Registered Customers */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-info">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center border border-info/20">
                <Users className="w-6 h-6 text-info" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Total Buyers</div>
            <div className="stat-value text-2xl text-info">Active</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              ↗︎ 8.5% new buyers registered
            </div>
          </div>
        </div>

        {/* Stat 2: Active Accounts */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-success">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Active Accounts</div>
            <div className="stat-value text-2xl text-success">Verified</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              98.4% account compliance
            </div>
          </div>
        </div>

        {/* Stat 3: Order Activity */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Repeat Buyers</div>
            <div className="stat-value text-2xl text-primary">64.2%</div>
            <div className="stat-desc font-bold text-primary flex items-center gap-1 mt-1">
              High platform retention
            </div>
          </div>
        </div>

        {/* Stat 4: Authentication Security */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <ShieldCheck className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Access Governance</div>
            <div className="stat-value text-2xl text-secondary">Secure</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              JWT Protected Route
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC CUSTOMER DATA SECTION WITH REACT SUSPENSE FALLBACK */}
      <Suspense fallback={<TableSkeleton columns={6} rows={5} showAvatar={true} showActions={true} />}>
        <CustomerDataSection />
      </Suspense>
    </div>
  );
};

export default AdminCustomersPage;
