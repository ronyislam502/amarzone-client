'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Search from "../ui/navbar/Search";
import Services from "../ui/navbar/Services";
import Logo from "../ui/navbar/Logo";
import NavAvatar from "../ui/navbar/NavAvatar";
import { useAppSelector } from "@/redux/hooks";
import { selectCartCount } from "@/redux/features/order/orderSlice";

const AZNavbar = () => {
  const [mounted, setMounted] = useState(false);
  const cartCount = useAppSelector(selectCartCount);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#170d2f] text-white shadow-md w-full">
      {/* Main Navbar */}
      <div className="navbar max-w-[1600px] mx-auto px-2 sm:px-6 flex items-center justify-between gap-1 sm:gap-4">
        {/* LEFT: Logo + Services */}
        <div className="navbar-start w-auto gap-1 lg:gap-6">
          {/* Logo */}
          <Logo />

          {/* Desktop Left Menu */}
          <div className="hidden lg:flex ml-4">
            {/* <Departments /> */}
            <Services />
          </div>
        </div>

        {/* CENTER: Search */}
        <div className="navbar-center flex-1 px-2 sm:px-4">
          <Search />
        </div>

        {/* RIGHT: Avatar / Login + Cart */}
        <div className="navbar-end w-auto gap-1 sm:gap-2">
          <NavAvatar />

          {/* Cart */}
          <Link
            href="/cart"
            aria-label="View Shopping Cart"
            className="btn btn-ghost btn-circle text-white hover:bg-white/10"
          >
            <div className="indicator">
              {mounted && cartCount > 0 ? (
                <span className="indicator-item badge badge-warning badge-sm font-bold text-slate-900 border-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              ) : null}

              <ShoppingCart className="h-6 w-6" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AZNavbar;