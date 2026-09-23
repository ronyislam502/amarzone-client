/**
 * Shared Tailwind className constants for dashboard data-table containers.
 *
 * Usage in any *Data.tsx file:
 *   import { TABLE_CARD_CN } from "@/src/lib/tableStyles";
 *   ...
 *   <div className={TABLE_CARD_CN}>
 *
 * Changing a value here updates every table module at once.
 */

/**
 * Standard amber-accented table card used by:
 * - DepartmentsData, CategoriesData, AdminsData, CustomersData,
 *   VendorsData, ProductsData, admin/OrdersData, vendor/OrdersData
 */
export const TABLE_CARD_CN =
  "card relative overflow-hidden bg-dashboard-category shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl " +
  "[&_.input]:bg-dashboard-category-input [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-amber-400 " +
  "[&_thead_th]:text-slate-300 [&_thead_th]:bg-white/[0.03] [&_thead_th]:border-b [&_thead_th]:border-white/10 " +
  "[&_tbody_tr]:border-b [&_tbody_tr]:border-white/5 [&_tbody_tr:hover]:bg-white/[0.05] [&_tbody_tr]:text-slate-200 " +
  "[&_.border-base-200]:!border-white/10 [&_.border-base-300]:!border-white/10 " +
  "[&_.card-title]:!text-white [&_p]:!text-slate-300 " +
  "[&_.select]:bg-dashboard-category-input [&_.select]:border-white/15 [&_.select]:text-slate-200 [&_.select]:focus:border-amber-400 " +
  "[&_.join-item.btn-outline]:bg-white/5 [&_.join-item.btn-outline]:border-white/15 [&_.join-item.btn-outline]:text-slate-200 [&_.join-item.btn-outline:hover]:bg-white/10 " +
  "[&_.join-item.btn-primary]:bg-amber-400 [&_.join-item.btn-primary]:text-slate-950 [&_.join-item.btn-primary]:border-amber-400 " +
  "[&_strong]:text-amber-400 " +
  "[&_.btn-square.btn-ghost]:border-white/15 [&_.btn-square.btn-ghost]:bg-white/5 [&_.btn-square.btn-ghost]:text-amber-400 " +
  "[&_.badge-primary]:bg-amber-400 [&_.badge-primary]:text-slate-950 [&_.badge-primary]:border-none";

/**
 * Emerald-accented table card used by:
 * - CustomerOrdersData (customer-facing orders table)
 */
export const TABLE_CARD_EMERALD_CN =
  "card relative overflow-hidden bg-dashboard-category shadow-2xl border border-white/10 rounded-2xl sm:rounded-3xl " +
  "[&_.input]:bg-dashboard-category-input [&_.input]:border-white/15 [&_.input]:text-slate-200 [&_.input]:placeholder:text-slate-500 [&_.input:focus]:border-emerald-400 " +
  "[&_thead_th]:text-slate-300 [&_thead_th]:bg-white/[0.03] [&_thead_th]:border-b [&_thead_th]:border-white/10 " +
  "[&_tbody_tr]:border-b [&_tbody_tr]:border-white/5 [&_tbody_tr:hover]:bg-white/[0.05] [&_tbody_tr]:text-slate-200 " +
  "[&_.border-base-200]:!border-white/10 [&_.border-base-300]:!border-white/10 " +
  "[&_.card-title]:!text-white [&_p]:!text-slate-300 " +
  "[&_.select]:bg-dashboard-category-input [&_.select]:border-white/15 [&_.select]:text-slate-200 [&_.select]:focus:border-emerald-400 " +
  "[&_.join-item.btn-outline]:bg-white/5 [&_.join-item.btn-outline]:border-white/15 [&_.join-item.btn-outline]:text-slate-200 [&_.join-item.btn-outline:hover]:bg-white/10 " +
  "[&_.join-item.btn-primary]:bg-emerald-400 [&_.join-item.btn-primary]:text-slate-950 [&_.join-item.btn-primary]:border-emerald-400 " +
  "[&_strong]:text-emerald-400 " +
  "[&_.btn-square.btn-ghost]:border-white/15 [&_.btn-square.btn-ghost]:bg-white/5 [&_.btn-square.btn-ghost]:text-emerald-400 " +
  "[&_.badge-primary]:bg-emerald-400 [&_.badge-primary]:text-slate-950 [&_.badge-primary]:border-none";
