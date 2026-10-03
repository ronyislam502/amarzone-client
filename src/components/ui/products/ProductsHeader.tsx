"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Sparkles,
  Layers,
  Tag,
  Check,
  Package,
} from "lucide-react";
import { TCategory } from "@/types/category";
import { TDepartment } from "@/types/department";
import { TProductsCatalogMode } from "./types";
import { slugify, matchesSlug } from "@/utils/slug";

export interface ProductsHeaderProps {
  mode: TProductsCatalogMode;
  departmentSlug?: string;
  categorySlug?: string;
  matchedDepartment: TDepartment | null;
  matchedCategory: TCategory | null;
  categories: TCategory[];
  selectedCategory: string;
  title?: string;
  subtitle?: string;
  badge?: string;
  totalProductsCount: number;
}

export const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  mode,
  departmentSlug = "",
  categorySlug = "",
  matchedDepartment,
  matchedCategory,
  categories,
  selectedCategory,
  title,
  subtitle,
  badge,
  totalProductsCount,
}) => {
  const currentDeptSlug = departmentSlug || (matchedDepartment ? slugify(matchedDepartment.name) : "");
  const deptDisplayName = matchedDepartment?.name || (departmentSlug ? departmentSlug.replace(/-/g, " ") : "Department");
  const categoryDisplayName = matchedCategory?.name || (categorySlug ? categorySlug.replace(/-/g, " ") : "Category");

  const headerTitle =
    title ||
    (mode === "category"
      ? categoryDisplayName
      : mode === "department"
      ? deptDisplayName
      : "All Products");

  const headerSubtitle =
    subtitle ||
    (mode === "category"
      ? `Browse all items in ${categoryDisplayName} from verified sellers`
      : mode === "department"
      ? `Discover top deals, bestsellers and new arrivals in ${deptDisplayName}`
      : "Explore our complete selection of authentic items with fast delivery and buyer protection");

  const headerBadge =
    badge ||
    (mode === "category"
      ? "Category Collection"
      : mode === "department"
      ? "Department Catalog"
      : "Marketplace Catalog");

  const isDeptOrCategoryMode = mode === "department" || mode === "category";

  return (
    <div className="space-y-0">
      {/* ── Top Header Banner with Dark Ambient Gradient ─────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.18),transparent_50%)] pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-8 relative z-10">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-xs text-slate-300 flex-wrap mb-4"
          >
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href="/products"
              className={`hover:text-white transition-colors ${
                mode === "all" ? "text-amber-400 font-bold" : ""
              }`}
            >
              Products
            </Link>

            {isDeptOrCategoryMode && currentDeptSlug && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link
                  href={`/${currentDeptSlug}`}
                  className={`hover:text-white transition-colors ${
                    mode === "department" ? "text-amber-400 font-bold" : ""
                  }`}
                >
                  {deptDisplayName}
                </Link>
              </>
            )}

            {mode === "category" && categoryDisplayName && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-amber-400 font-bold capitalize">
                  {categoryDisplayName}
                </span>
              </>
            )}
          </nav>

          {/* Title & Metadata */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-violet-500/20 border border-violet-400/30 text-violet-300 text-[11px] font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{headerBadge}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight capitalize text-white">
                {headerTitle}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {headerSubtitle}
              </p>
            </div>

            {/* Total items badge */}
            <div className="flex items-center gap-2 self-start md:self-end shrink-0">
              <div className="bg-white/10 backdrop-blur border border-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-600/30 flex items-center justify-center">
                  <Package className="w-4 h-4 text-violet-300" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Total Selection
                  </div>
                  <div className="text-sm font-black text-white">
                    {totalProductsCount.toLocaleString()} Products
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Category Chips Bar for Department & Category Modes ─────────────── */}
      {isDeptOrCategoryMode && categories.length > 0 && (
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
          <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-3.5">
            {mode === "category" && (
              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100 flex-wrap">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] uppercase font-black tracking-wider text-slate-400">
                    Department:
                  </span>
                  <Link
                    href={`/${currentDeptSlug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-black hover:bg-violet-200 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-violet-600" />
                    {deptDisplayName}
                    <span className="text-[10px] bg-violet-600 text-white rounded-full px-1.5 py-0.2">
                      View All
                    </span>
                  </Link>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    Active: {categoryDisplayName}
                  </span>
                </div>

                <Link
                  href={`/${currentDeptSlug}`}
                  className="text-xs font-semibold text-violet-600 hover:text-violet-800 flex items-center gap-1"
                >
                  View all {deptDisplayName} products &rarr;
                </Link>
              </div>
            )}

            {/* Horizontal Scrollable Category Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <Link
                href={`/${currentDeptSlug}`}
                className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  mode === "department" && !selectedCategory
                    ? "bg-violet-600 text-white shadow-sm ring-2 ring-violet-400"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                All {deptDisplayName}
              </Link>

              {categories.map((cat) => {
                const catSlug = slugify(cat.name);
                const isCurrent =
                  mode === "category"
                    ? matchedCategory?._id === cat._id || matchesSlug(cat.name, categorySlug)
                    : selectedCategory === cat._id;

                const href = `/${currentDeptSlug}/${catSlug}`;

                return (
                  <Link
                    key={cat._id}
                    href={href}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? "bg-violet-600 text-white shadow-sm ring-2 ring-violet-400"
                        : "bg-slate-100 text-slate-700 hover:bg-violet-50 hover:text-violet-900 border border-slate-200/70"
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{cat.name.trim()}</span>
                    {isCurrent && <Check className="w-3 h-3 shrink-0 ml-0.5" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsHeader;
