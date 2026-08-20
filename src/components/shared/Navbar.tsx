"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  ChevronDown,
  User,
  Heart,
  Grid,
  Sparkles,
  MapPin,
  Building2,
  Truck,
  ShoppingBag,
  Shirt,
  Smartphone,
  Home as HomeIcon,
  TreePine,
  Gift,
  X,
  Check,
  ShieldAlert,
  Car,
  Pill,
  Camera,
  CreditCard,
  Wrench
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { useAppSelector } from "@/redux/hooks";
// import { selectCurrentUser } from "@/redux/features/auth/authSlice";
// import { useMyProfileQuery } from "@/redux/features/user/userApi";
// import DepartmentCategoryDropdown from "./DepartmentCategoryDropdown";

const departmentsList = [
  { name: "Grocery & Gourmet Food", icon: ShoppingBag, slug: "Grocery" },
  { name: "Electronics & Tech", icon: Smartphone, slug: "Electronics" },
  { name: "Fashion & Clothing", icon: Shirt, slug: "Fashion" },
  { name: "Home, Kitchen & Furniture", icon: HomeIcon, slug: "Home" },
  { name: "Patio, Lawn & Garden", icon: TreePine, slug: "Patio" },
  { name: "Toys, Games & Video Games", icon: Gift, slug: "Toys" },
  { name: "Beauty & Personal Care", icon: Sparkles, slug: "Beauty" },
  { name: "Automotive & Tires", icon: Car, slug: "Automotive" },
  { name: "Pharmacy & Health", icon: Pill, slug: "Pharmacy" },
];

const servicesList = [
  { name: "Auto Care Center", desc: "Tires, oil changes & battery service", icon: Wrench },
  { name: "Pharmacy & Health", desc: "Refill prescriptions & immunization", icon: Pill },
  { name: "Amarzone Pay & Financial", desc: "Credit cards, money transfers & gift cards", icon: CreditCard },
  { name: "Photo Center", desc: "Custom prints, cards & photo gifts", icon: Camera },
  { name: "Protection Plans", desc: "Extend warranty on electronics & appliances", icon: ShieldAlert },
];

// Walmart 6-petal Spark component
function WalmartSpark({ className = "w-6 h-6 text-[#ffc220]" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2L13.8 8.5L19.5 5.2L16.2 11L22.5 12.8L16.2 14.6L19.5 20.4L13.8 17.1L12 23.6L10.2 17.1L4.5 20.4L7.8 14.6L1.5 12.8L7.8 11L4.5 5.2L10.2 8.5L12 2Z" />
    </svg>
  );
}

const Navbar=() =>{
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isFulfillmentOpen, setIsFulfillmentOpen] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<"pickup" | "delivery" | "shipping">("pickup");

  const deptRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const fulfillmentRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  // const user = useAppSelector(selectCurrentUser);
  // const { data: userData } = useMyProfileQuery({}, { skip: !user });
  // const profile = userData?.data;

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (deptRef.current && !deptRef.current.contains(event.target as Node)) {
        setIsDeptOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (fulfillmentRef.current && !fulfillmentRef.current.contains(event.target as Node)) {
        setIsFulfillmentOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 shadow-md font-sans select-none">
      {/* 1. TOP PRIMARY BLUE WALMART NAVBAR */}
      <div className="bg-[#0071dc] text-white px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 shrink-0 group">
          <Image
            src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
            alt="Amarzone Logo"
            width={125}
            height={38}
            className="object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Center-Left: Departments Dropdown */}
        <div className="relative flex items-center" ref={deptRef}>
          <button
            type="button"
            onClick={() => {
              setIsDeptOpen(!isDeptOpen);
              setIsServicesOpen(false);
            }}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-full hover:bg-[#004f9a] transition-colors text-xs sm:text-sm font-bold"
          >
            <Grid className="w-4 h-4" />
            <span className="hidden xs:inline sm:inline">Departments</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDeptOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Departments Popover */}
          {isDeptOpen && (
            <div className="absolute top-full left-0 mt-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              {/* <DepartmentCategoryDropdown onClose={() => setIsDeptOpen(false)} /> */}
            </div>
          )}
        </div>

        {/* Center-Left: Services Dropdown */}
        <div className="relative hidden xl:block" ref={servicesRef}>
          <button
            type="button"
            onClick={() => {
              setIsServicesOpen(!isServicesOpen);
              setIsDeptOpen(false);
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-[#004f9a] transition-colors text-xs sm:text-sm font-bold"
          >
            <Sparkles className="w-4 h-4 text-[#ffc220]" />
            <span>Services</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Services Popover */}
          {isServicesOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-base-100 text-base-content rounded-2xl shadow-2xl border border-base-300 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 text-xs font-black uppercase tracking-wider text-base-content/50 border-b border-base-300">
                Amarzone Services
              </div>
              <div className="py-1">
                {servicesList.map((svc, idx) => {
                  const Icon = svc.icon;
                  return (
                    <Link
                      key={idx}
                      href="/"
                      onClick={() => setIsServicesOpen(false)}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-base-200 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#0071dc] flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-base-content">{svc.name}</div>
                        <div className="text-[11px] text-slate-500 font-normal">{svc.desc}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Center: Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex-1 max-w-3xl mx-1 sm:mx-3 flex items-center h-10 rounded-full bg-white text-slate-900 shadow-inner px-1 border-2 border-transparent focus-within:border-[#ffc220] transition-all"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search everything at Amarzone online and in store..."
            className="w-full h-full px-4 text-xs sm:text-sm text-slate-900 bg-transparent outline-none placeholder:text-slate-500 font-normal"
          />
          <button
            type="submit"
            aria-label="Search"
            className="w-8 h-8 rounded-full bg-[#ffc220] hover:bg-[#e5ad10] text-[#002d58] flex items-center justify-center cursor-pointer shrink-0 transition-transform active:scale-95 shadow"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>
        </form>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Reorder / My Items */}
          <Link
            href={user ? `/${(profile?.role || 'customer').toLowerCase()}/orders` : "/login"}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#004f9a] transition-colors text-xs font-bold leading-tight"
          >
            <Heart className="w-4 h-4 text-white" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-blue-100 font-normal">Reorder</span>
              <span className="text-xs font-bold text-white -mt-0.5">My Items</span>
            </div>
          </Link>

          {/* User Account Button */}
          {/* {user ? (
            <Link
              href={`/${profile?.user?.role?.toLowerCase() || profile?.role?.toLowerCase() || 'admin'}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#004f9a] transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#ffc220] text-[#002d58] font-black text-xs flex items-center justify-center shadow">
                {(profile?.name || user?.name || user?.email || "U")[0].toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-blue-100 font-normal">Hi, {profile?.name?.split(" ")[0] || "User"}</span>
                <span className="text-xs font-bold text-white -mt-0.5 flex items-center gap-0.5">
                  Account
                  <ChevronDown className="w-3 h-3 text-blue-200" />
                </span>
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-[#004f9a] transition-colors"
            >
              <User className="w-5 h-5 text-white" />
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-[10px] text-blue-100 font-normal">Sign In</span>
                <span className="text-xs font-bold text-white -mt-0.5 flex items-center gap-0.5">
                  Account
                  <ChevronDown className="w-3 h-3 text-blue-200" />
                </span>
              </div>
            </Link>
          )} */}

          {/* Cart Icon */}
          <Link
            href="/cart"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-[#004f9a] transition-colors relative"
          >
            <div className="relative flex items-center">
              <ShoppingCart className="w-6 h-6 text-white stroke-[1.75]" />
              <span className="absolute -top-1.5 -right-2 bg-[#ffc220] text-[#002d58] font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow">
                0
              </span>
            </div>
            <span className="hidden sm:inline text-xs font-bold text-white ml-1">
              $0.00
            </span>
          </Link>
        </div>
      </div>

      {/* 2. SECONDARY WALMART FULFILLMENT & QUICK NAV BAR */}
      <div className="bg-[#004f9a] text-white border-t border-blue-500/30 px-3 sm:px-6 py-1.5 flex items-center justify-between text-xs overflow-x-auto no-scrollbar">
        {/* Left: Fulfillment Selector */}
        <div className="relative shrink-0" ref={fulfillmentRef}>
          <button
            type="button"
            onClick={() => setIsFulfillmentOpen(!isFulfillmentOpen)}
            className="flex items-center gap-2 bg-blue-900/50 hover:bg-blue-900 px-3 py-1 rounded-full text-white font-semibold transition-colors border border-blue-400/30"
          >
            <MapPin className="w-3.5 h-3.5 text-[#ffc220]" />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">How do you want your items?</span>
              <span className="text-blue-200 hidden md:inline">| Pickup at Sacramento Store</span>
            </div>
            <ChevronDown className={`w-3 h-3 text-blue-200 transition-transform ${isFulfillmentOpen ? "rotate-180" : ""}`} />
          </button>

          {/* Fulfillment Options Modal */}
          {isFulfillmentOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 bg-base-100 text-base-content rounded-2xl shadow-2xl border border-base-300 p-4 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-base-300 pb-3 mb-3">
                <span className="font-extrabold text-sm text-base-content">Shipping & Store Options</span>
                <button type="button" onClick={() => setIsFulfillmentOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Toggle Types */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-base-200 rounded-xl text-xs font-bold mb-4">
                <button
                  type="button"
                  onClick={() => setFulfillmentType("pickup")}
                  className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    fulfillmentType === "pickup" ? "bg-[#0071dc] text-white shadow" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>Pickup</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType("delivery")}
                  className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    fulfillmentType === "delivery" ? "bg-[#0071dc] text-white shadow" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentType("shipping")}
                  className={`py-1.5 rounded-lg flex flex-col items-center gap-1 transition-all ${
                    fulfillmentType === "shipping" ? "bg-[#0071dc] text-white shadow" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Truck className="w-4 h-4" />
                  <span>Shipping</span>
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-blue-900">
                  <div>
                    <div className="font-bold">Sacramento Supercenter</div>
                    <div className="text-[11px] text-blue-700">8915 Gerber Rd, Sacramento, CA</div>
                  </div>
                  <Check className="w-4 h-4 text-[#0071dc]" />
                </div>
                <button
                  type="button"
                  onClick={() => setIsFulfillmentOpen(false)}
                  className="w-full py-2 bg-[#0071dc] hover:bg-[#005bb5] text-white font-bold rounded-xl text-xs transition-colors"
                >
                  Confirm Location
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Quick Department Links */}
        {/* <div className="flex items-center gap-4 text-xs font-semibold whitespace-nowrap text-blue-100 ml-4">
          <Link href="/?search=Deals" className="flex items-center gap-1 text-[#ffc220] hover:underline font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#ffc220]" />
            <span>Deals</span>
          </Link>
          <Link href="/bestsellers" className="flex items-center gap-1 text-white hover:underline font-bold hover:text-[#ffc220] transition-colors">
            <Flame className="w-3.5 h-3.5" />
            <span>Best Sellers</span>
          </Link>
          <Link href="/?search=Grocery" className="hover:underline hover:text-white transition-colors">
            Grocery & Essentials
          </Link>
          <Link href="/?search=Fashion" className="hover:underline hover:text-white transition-colors">
            Fashion
          </Link>
          <Link href="/department/Electronics" className="hover:underline hover:text-white transition-colors font-bold">
            Electronics
          </Link>
          <Link href="/?search=Home" className="hover:underline hover:text-white transition-colors">
            Home & Kitchen
          </Link>
          <Link href="/?search=Patio" className="hover:underline hover:text-white transition-colors hidden lg:inline">
            Patio & Garden
          </Link>
          <Link href="/?search=Toys" className="hover:underline hover:text-white transition-colors hidden xl:inline">
            Toys & Video Games
          </Link>
          <Link href="/" className="flex items-center gap-1 font-bold text-white bg-blue-800/80 px-2 py-0.5 rounded-md hover:bg-blue-800">
            <WalmartSpark className="w-3 h-3 text-[#ffc220]" />
            <span>Amarzone+</span>
          </Link>
        </div> */}
      </div>
    </header>
  );
}


export default Navbar