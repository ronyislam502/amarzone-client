import { Metadata } from "next";
import Link from "next/link";
import { Package, ShoppingBag, ArrowLeft } from "lucide-react";
import CustomerOrdersData from "@/src/components/ui/analistics/customer/orders/CustomerOrdersData";

export const metadata: Metadata = {
  title: "My Orders | Amarzone",
  description:
    "Track your orders, view shipment details, and manage your complete purchase history on Amarzone.",
};

const CustomerOrdersPage = () => {
  return (
    <div className="space-y-6 w-full pb-10 text-slate-100">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#170d2f] via-[#1c123b] to-[#120a26] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
        {/* Accent ray */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent pointer-events-none" />
        {/* Glow orb */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">
                <Package className="w-5 h-5" />
              </div>
              <span className="badge badge-success badge-sm font-bold text-slate-950 px-2.5">
                Customer Portal
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              My Orders
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Track your shipments, view order details, manage your purchase
              history, and download invoices — all in one place.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/customer"
              className="btn btn-outline border-white/20 hover:border-white/40 text-slate-200 hover:text-white rounded-xl text-xs gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <Link
              href="/"
              className="btn bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 gap-2 border-0"
            >
              <ShoppingBag className="w-4 h-4" />
              Shop More
            </Link>
          </div>
        </div>
      </div>

      {/* ── Orders Dashboard ─────────────────────────────────────── */}
      <CustomerOrdersData />
    </div>
  );
};

export default CustomerOrdersPage;
