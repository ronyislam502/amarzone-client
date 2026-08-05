"use client";

import React, { useState } from "react";
import {
  MapPin,
  Search,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  User,
  Globe,
  Package,
  Heart,
  HelpCircle,
  ChevronRight,
  Loader2,
} from "lucide-react";

import { useAppSelector } from "@/redux/hooks";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { TDepartment } from "@/types/department";

import AZInput from "../form/AZInput";

export default function AmazonNavbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const user = useAppSelector((state) => state.auth.user);
  const cartCount = 0;

  // Fetch Department data from Redux RTK Query
  const { data: departmentResponse, isLoading: isDepartmentsLoading } = useAllDepartmentsQuery({});
  const departments: TDepartment[] = departmentResponse?.data || [];

  console.log("department", departments)

  const subNavItems = [
    { label: "Health AI", href: "#", hasDropdown: false },
    { label: "Amazon Haul", href: "#", hasDropdown: false },
    { label: "Medical Care", href: "#", hasDropdown: true },
    { label: "Amazon Basics", href: "#", hasDropdown: false },
    { label: "Best Sellers", href: "#", hasDropdown: false },
    { label: "Prime", href: "#", hasDropdown: true },
    { label: "New Releases", href: "/new-releases", hasDropdown: false },
    { label: "Today's Deals", href: "#", hasDropdown: false },
    { label: "Books", href: "#", hasDropdown: false },
    { label: "Groceries", href: "#", hasDropdown: true },
    { label: "Whole Foods", href: "#", hasDropdown: false },
    { label: "Gift Cards", href: "#", hasDropdown: true },
    { label: "Fashion", href: "#", hasDropdown: false },
    { label: "Sell", href: "#", hasDropdown: false },
    { label: "Registry", href: "#", hasDropdown: false },
    { label: "Music", href: "#", hasDropdown: false },
    { label: "Amazon Home", href: "#", hasDropdown: true },
    { label: "Automotive", href: "#", hasDropdown: false },
    { label: "Toys & Games", href: "#", hasDropdown: true },
  ];

  return (
    <header className="w-full select-none text-white font-sans">
      {/* Drawer Toggle Input for DaisyUI Drawer */}
      <input
        id="amazon-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={drawerOpen}
        onChange={(e) => setDrawerOpen(e.target.checked)}
      />

      {/* TOP NAVBAR (Dark Navy: #131921) */}
      <div className="bg-[#131921] px-2 py-1 flex items-center justify-between gap-2 border-b border-gray-800">
        {/* 1. Amazon Logo */}
        <a
          href="/"
          className="flex items-center px-2 py-1 rounded border border-transparent hover:border-white transition-all"
        >
          <img
            src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
            alt="Amarzone Logo"
            className="h-16 w-auto object-contain"
          />
        </a>

        {/* 2. Deliver To Location Picker */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1.5 rounded border border-transparent hover:border-white cursor-pointer transition-all">
          <MapPin className="w-4 h-4 text-gray-300 mt-2" />
          <div className="flex flex-col text-left leading-tight">
            <span className="text-[11px] text-gray-300 font-normal">Deliver to</span>
            <span className="text-xs font-bold text-white tracking-tight">
              Brooklyn 11211
            </span>
          </div>
        </div>

        {/* 3. Search Bar Group using DaisyUI Join */}
        <div className="flex-1 max-w-4xl mx-1 sm:mx-2">
          <div className="join w-full rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#ff9900]">
            {/* Dynamic Department / Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="join-item select select-sm sm:select-md bg-gray-200 hover:bg-gray-300 text-gray-800 border-none font-normal text-xs px-2 focus:outline-none cursor-pointer h-10 min-h-0 rounded-l-md rounded-r-none max-w-[75px] sm:max-w-[120px] md:max-w-[150px]"
            >
              <option value="All">All Departments</option>
              {isDepartmentsLoading ? (
                <option value="" disabled>Loading...</option>
              ) : (
                departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))
              )}
            </select>

            {/* Reusable Search Text Input */}
            <AZInput
              name="searchTerm"
              type="text"
              placeholder="Search Amarzone"
              inputClassName="join-item input input-sm sm:input-md w-full bg-white text-gray-900 border-none focus:outline-none placeholder-gray-500 text-sm h-10 min-h-0 rounded-none px-3"
            />

            {/* Search Submit Button */}
            <button
              aria-label="Search"
              className="join-item btn btn-sm sm:btn-md bg-[#febd69] hover:bg-[#f3a847] active:bg-[#e29633] text-gray-900 border-none h-10 min-h-0 px-4 rounded-r-md rounded-l-none"
            >
              <Search className="w-5 h-5 text-gray-900 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 4. Language Selector Dropdown */}
        <div className="hidden lg:block dropdown dropdown-hover dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="flex items-center gap-1 px-2 py-1.5 rounded border border-transparent hover:border-white cursor-pointer transition-all"
          >
            {/* US Flag SVG Icon */}
            <svg
              className="w-5 h-3.5 rounded-xs shadow-xs"
              viewBox="0 0 640 480"
            >
              <path fill="#bd3d44" d="M0 0h640v480H0z" />
              <path
                stroke="#fff"
                strokeWidth="37"
                d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
              />
              <path fill="#192f5d" d="M0 0h288v259H0z" />
            </svg>
            <span className="text-xs font-bold text-white">EN</span>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          <div
            tabIndex={0}
            className="dropdown-content menu p-3 shadow-xl bg-white text-gray-800 rounded-md w-60 z-50 border border-gray-200 mt-1"
          >
            <div className="text-xs font-bold text-gray-700 pb-2 border-b border-gray-200 mb-2">
              Change language <a href="#" className="text-blue-600 font-normal hover:underline ml-1">Learn more</a>
            </div>
            <label className="label cursor-pointer justify-start gap-2 py-1">
              <input type="radio" name="lang" className="radio radio-xs radio-warning" defaultChecked />
              <span className="text-xs font-medium text-gray-800">English - EN</span>
            </label>
            <label className="label cursor-pointer justify-start gap-2 py-1">
              <input type="radio" name="lang" className="radio radio-xs radio-warning" />
              <span className="text-xs font-medium text-gray-800">Español - ES</span>
            </label>
            <label className="label cursor-pointer justify-start gap-2 py-1">
              <input type="radio" name="lang" className="radio radio-xs radio-warning" />
              <span className="text-xs font-medium text-gray-800">Deutsch - DE</span>
            </label>
            <div className="pt-2 border-t border-gray-200 mt-2 text-xs text-gray-600">
              <div className="flex items-center gap-1 font-bold text-gray-700">
                <Globe className="w-3.5 h-3.5" /> Currency
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>$ - USD - US Dollar</span>
                <a href="#" className="text-blue-600 hover:underline text-[11px]">Change</a>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Account & Lists Dropdown */}
        <div className="dropdown dropdown-hover dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="flex flex-col text-left px-2 py-1 rounded border border-transparent hover:border-white cursor-pointer transition-all leading-tight"
          >
            <span className="text-[11px] text-gray-300 font-normal">
              {user ? `Hello, ${user.name || 'User'}` : 'Hello, sign in'}
            </span>
            <span className="text-xs font-bold text-white flex items-center gap-0.5">
              Account & Lists
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </span>
          </div>

          <div
            tabIndex={0}
            className="dropdown-content p-4 shadow-xl bg-white text-gray-900 rounded-md w-72 sm:w-80 z-50 border border-gray-200 mt-1"
          >
            <div className="flex flex-col items-center pb-3 border-b border-gray-200">
              <a href="/login" className="btn btn-sm bg-[#ffd814] hover:bg-[#f7ca00] text-gray-900 border border-[#fcd200] w-48 shadow-xs normal-case font-medium flex items-center justify-center">
                Sign in
              </a>
              <span className="text-[11px] text-gray-600 mt-2">
                New customer?{" "}
                <a href="/register" className="text-blue-600 hover:underline hover:text-orange-700">
                  Start here.
                </a>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Your Lists</h4>
                <ul className="space-y-1.5 text-gray-700">
                  <li className="hover:text-orange-600 hover:underline cursor-pointer">Create a List</li>
                  <li className="hover:text-orange-600 hover:underline cursor-pointer">Find a List or Registry</li>
                </ul>
              </div>
              <div className="border-l border-gray-200 pl-4">
                <h4 className="font-bold text-gray-900 mb-2 text-sm">Your Account</h4>
                <ul className="space-y-1.5 text-gray-700">
                  <li className="hover:text-orange-600 hover:underline cursor-pointer">Account</li>
                  <li className="hover:text-orange-600 hover:underline cursor-pointer">Orders</li>
                  <li className="hover:text-orange-600 hover:underline cursor-pointer">Recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 6. Returns & Orders Link */}
        <a
          href="#"
          className="hidden sm:flex flex-col text-left px-2 py-1 rounded border border-transparent hover:border-white cursor-pointer transition-all leading-tight"
        >
          <span className="text-[11px] text-gray-300 font-normal">Returns</span>
          <span className="text-xs font-bold text-white tracking-tight">
            & Orders
          </span>
        </a>

        {/* 7. Cart Component (DaisyUI Indicator) */}
        <a
          href="#"
          className="flex items-center gap-1 px-2 py-1 rounded border border-transparent hover:border-white cursor-pointer transition-all relative"
        >
          <div className="indicator">
            <span className="indicator-item badge badge-sm bg-[#f08804] text-white border-none font-extrabold text-xs -top-1 right-3 px-1.5 h-4 min-h-0">
              {cartCount}
            </span>
            <ShoppingCart className="w-8 h-8 text-white stroke-[1.75]" />
          </div>
          <span className="text-xs font-bold text-white self-end mb-1 hidden sm:inline">
            Cart
          </span>
        </a>
      </div>

      {/* SUB NAVBAR (Dark Teal-Gray: #232f3e) */}
      <div className="bg-[#232f3e] px-2 py-1 flex items-center gap-1 overflow-x-auto text-xs text-white no-scrollbar">
        {/* Drawer Menu Trigger: "All" */}
        <label
          htmlFor="amazon-drawer"
          className="flex items-center gap-1 px-2 py-1 rounded border border-transparent hover:border-white cursor-pointer font-bold shrink-0 transition-all"
        >
          <Menu className="w-5 h-5" />
          <span>All</span>
        </label>

        {/* Sub-Nav Menu Items */}
        <div className="flex items-center gap-0.5 shrink-0">
          {subNavItems.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="flex items-center gap-0.5 px-2 py-1 rounded border border-transparent hover:border-white whitespace-nowrap transition-all text-gray-100 hover:text-white"
            >
              <span>{item.label}</span>
              {item.hasDropdown && (
                <ChevronDown className="w-3 h-3 text-gray-400 stroke-[2.5]" />
              )}
            </a>
          ))}
        </div>
      </div>

      {/* DAISYUI DRAWER SIDEBAR MENU */}
      <div className="drawer-side z-50">
        <label htmlFor="amazon-drawer" className="drawer-overlay"></label>
        <div className="menu p-0 w-80 min-h-full bg-white text-gray-900 flex flex-col">
          {/* Drawer Header */}
          <div className="bg-[#232f3e] text-white p-4 flex items-center gap-3">
            <User className="w-7 h-7 bg-gray-600 rounded-full p-1 text-white" />
            <span className="font-bold text-lg">
              {user ? `Hello, ${user.name}` : "Hello, sign in"}
            </span>
          </div>

          {/* Drawer Links */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm text-gray-800">
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Digital Content & Devices</h3>
              <ul className="space-y-2">
                <li className="flex justify-between items-center py-1 hover:text-orange-600 cursor-pointer">
                  <span>Amazon Music</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </li>
                <li className="flex justify-between items-center py-1 hover:text-orange-600 cursor-pointer">
                  <span>Kindle E-readers & Books</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </li>
                <li className="flex justify-between items-center py-1 hover:text-orange-600 cursor-pointer">
                  <span>Amazon Appstore</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </li>
              </ul>
            </div>

            <hr className="border-gray-200" />

            {/* Dynamic Shop by Department */}
            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Shop by Department</h3>
              <ul className="space-y-2">
                {isDepartmentsLoading ? (
                  <div className="flex items-center gap-2 py-2 text-xs text-gray-500 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    <span>Loading departments...</span>
                  </div>
                ) : departments.length > 0 ? (
                  departments.map((dept) => (
                    <li
                      key={dept._id}
                      className="flex justify-between items-center py-1 hover:text-orange-600 cursor-pointer transition-colors"
                    >
                      <span>{dept.name}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-gray-500 py-1">No departments available</li>
                )}
              </ul>
            </div>

            <hr className="border-gray-200" />

            <div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Programs & Features</h3>
              <ul className="space-y-2">
                <li className="py-1 hover:text-orange-600 cursor-pointer">Gift Cards</li>
                <li className="py-1 hover:text-orange-600 cursor-pointer">Shop By Interest</li>
                <li className="py-1 hover:text-orange-600 cursor-pointer">Amazon Live</li>
                <li className="py-1 hover:text-orange-600 cursor-pointer">International Shopping</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

