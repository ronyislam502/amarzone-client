"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import CategoryDataSection from "@/components/dashboard/admin/CategoryDataSection";
import TableSkeleton from "@/components/shared/TableSkeleton";
import {
  FolderTree,
  PlusCircle,
  Download,
  Layers,
  CheckCircle2,
  Tag,
  Sparkles,
  ShoppingBag
} from "lucide-react";

const AdminCategoriesPage = () => {
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
            <FolderTree className="w-3.5 h-3.5 text-primary" />
            <span>Category Catalog</span>
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
                DaisyUI Category Catalog
              </span>
              <span className="badge badge-success badge-outline gap-1 font-bold text-xs">
                <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                Live Department Taxonomy
              </span>
            </div>

            <h1 className="text-3xl font-black tracking-tight">
              Categories <span className="text-primary">Management</span>
            </h1>
            <p className="text-base-content/70 text-xs sm:text-sm max-w-2xl">
              Organize product categories, map departmental structures, audit catalog distribution, and maintain clean navigation.
            </p>
          </div>

          {/* DaisyUI Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" className="btn btn-outline btn-sm gap-2">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* DAISYUI STATS GRID COMPONENT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Stat 1: Total Categories */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <FolderTree className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Total Categories</div>
            <div className="stat-value text-2xl text-primary">64</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              ↗︎ 8 new categories added
            </div>
          </div>
        </div>

        {/* Stat 2: Active Departments */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-success">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
                <Layers className="w-6 h-6 text-success" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Departments Mapped</div>
            <div className="stat-value text-2xl text-success">12</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              100% active coverage
            </div>
          </div>
        </div>

        {/* Stat 3: Total Products Linked */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-warning">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center border border-warning/20">
                <ShoppingBag className="w-6 h-6 text-warning" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Linked Products</div>
            <div className="stat-value text-2xl text-warning">18,420</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              Active merchandise listings
            </div>
          </div>
        </div>

        {/* Stat 4: Catalog Compliance */}
        <div className="stats bg-base-100 shadow-lg border border-base-200">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                <Tag className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="stat-title text-xs font-extrabold uppercase">Taxonomy Status</div>
            <div className="stat-value text-2xl text-secondary">99.4%</div>
            <div className="stat-desc font-bold text-success flex items-center gap-1 mt-1">
              Optimal SEO indexing
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC CATEGORY DATA SECTION WITH REACT SUSPENSE FALLBACK */}
      <Suspense fallback={<TableSkeleton columns={5} rows={5} showAvatar={false} title="Product Categories" />}>
        <CategoryDataSection />
      </Suspense>
    </div>
  );
};

export default AdminCategoriesPage;
