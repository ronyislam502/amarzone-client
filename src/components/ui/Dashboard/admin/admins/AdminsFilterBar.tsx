"use client";

import { Filter, RotateCcw, ShieldCheck, UserCheck, ArrowUpDown } from "lucide-react";

export interface AdminsFilterState {
  status: string;
  role: string;
  sort: string;
}

interface AdminsFilterBarProps {
  filters: AdminsFilterState;
  onFilterChange: (newFilters: Partial<AdminsFilterState>) => void;
  onReset: () => void;
}

const AdminsFilterBar = ({
  filters,
  onFilterChange,
  onReset,
}: AdminsFilterBarProps) => {
  const hasActiveFilters =
    Boolean(filters.status) ||
    Boolean(filters.role) ||
    Boolean(filters.sort);

  return (
    <div className="card bg-base-100 shadow-md border border-base-200">
      <div className="card-body p-4 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          {/* Left: Section Label */}
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-base-content/80">
            <Filter className="w-4 h-4 text-secondary" />
            <span>Staff Directory Filters</span>
          </div>

          {/* Right: Reset Action */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-ghost btn-xs text-error gap-1 font-bold hover:bg-error/10 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Filters Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Status Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-base-content/70 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-success" />
                Account Status
              </span>
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange({ status: e.target.value })}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="">All Statuses</option>
              <option value="active">Active Administrators</option>
              <option value="inactive">Inactive / Suspended</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-base-content/70 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-secondary" />
                Administrative Role
              </span>
            </label>
            <select
              value={filters.role}
              onChange={(e) => onFilterChange({ role: e.target.value })}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="">All Roles</option>
              <option value="super_admin">Super Administrator</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div className="form-control">
            <label className="label py-1">
              <span className="text-[11px] font-bold text-base-content/70 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-base-content/50" />
                Sort Order
              </span>
            </label>
            <select
              value={filters.sort}
              onChange={(e) => onFilterChange({ sort: e.target.value })}
              className="select select-bordered select-sm w-full font-medium"
            >
              <option value="">Default (Newest First)</option>
              <option value="name_asc">Admin Name: A to Z</option>
              <option value="name_desc">Admin Name: Z to A</option>
              <option value="oldest">Onboarding: Oldest First</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminsFilterBar;
