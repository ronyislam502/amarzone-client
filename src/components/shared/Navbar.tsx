import Link from "next/link";
import { Menu, LogIn, ShoppingCart } from "lucide-react";
import Departments from "../ui/navbar/Departments";
import Search from "../ui/navbar/Search";
import Services from "../ui/navbar/Services";
import Logo from "../ui/navbar/Logo";

const Navbar = () => {
  return (
    <div className="max-lg:collapse bg-[#0071dc] text-white shadow-md w-full">
      <input
        id="navbar-1-toggle"
        className="peer hidden"
        type="checkbox"
      />

      {/* Mobile Overlay */}
      <label
        htmlFor="navbar-1-toggle"
        className="fixed inset-0 hidden max-lg:peer-checked:block z-40 bg-black/40"
      ></label>

      {/* Main Navbar */}
      <div className="collapse-title navbar px-3 sm:px-6">

        {/* LEFT: Logo + Departments + Services */}
        <div className="navbar-start gap-1 lg:gap-2">

          {/* Mobile Menu Button */}
          <label
            htmlFor="navbar-1-toggle"
            className="btn btn-ghost lg:hidden text-white"
          >
            <Menu className="h-5 w-5" />
          </label>

          {/* Logo */}
          <Logo />

          {/* Desktop Left Menu */}
          <div className="hidden lg:flex ml-4">
            <Departments />
            <Services />
          </div>
        </div>
        {/* CENTER: Search */}
        <div className="navbar-center hidden lg:flex absolute left-1/2 -translate-x-1/2 w-full max-w-4xl px-4">
          <Search />
        </div>
        {/* RIGHT: Login + Cart */}
        <div className="navbar-end gap-1 lg:gap-2">
          {/* Login */}
          <Link
            href="/login"
            className="btn btn-ghost text-white hover:bg-white/10"
          >
            <LogIn className="h-5 w-5" />
            <span className="hidden sm:inline">
              Login
            </span>
          </Link>

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

      {/* Mobile Menu */}
      <div className="collapse-content lg:hidden z-50">
        <ul className="menu w-full">

          {/* Mobile Search */}
          <li className="mb-2">
            <Search />
          </li>

          {/* Departments */}
          <li>
            <Departments />
          </li>

          {/* Services */}
          <li>
            <Services />
          </li>

          {/* Login */}
          <li>
            <Link href="/login">
              Login
            </Link>
          </li>

          {/* Cart */}
          <li>
            <Link href="/cart">
              Cart
            </Link>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default Navbar;