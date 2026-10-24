'use client';

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import Search from "../ui/navbar/Search";
import Services from "../ui/navbar/Services";
import Logo from "../ui/navbar/Logo";
import NavAvatar from "../ui/navbar/NavAvatar";

const AZNavbar = () => {
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
            className="btn btn-ghost btn-circle text-white hover:bg-white/10"
          >
            <div className="indicator">
              <span className="indicator-item badge badge-secondary badge-sm">
                0
              </span>

              <ShoppingCart className="h-6 w-6" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AZNavbar;