"use client";

import React from "react";
import { MapPin, Search, ShoppingCart, ChevronDown, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import AZSelect from "../form/AZSelect";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useMyProfileQuery } from "@/redux/features/user/userApi";

const categoryOptions = [
  { key: "All", label: "All" },
  { key: "Arts & Crafts", label: "Arts & Crafts" },
  { key: "Automotive", label: "Automotive" },
  { key: "Baby", label: "Baby" },
  { key: "Beauty", label: "Beauty & Personal Care" },
  { key: "Books", label: "Books" },
  { key: "Computers", label: "Computers" },
  { key: "Electronics", label: "Electronics" },
  { key: "Fashion", label: "Fashion" },
  { key: "Home", label: "Home & Kitchen" },
  { key: "Toys", label: "Toys & Games" },
];

export default function Navbar() {
  const user = useAppSelector(selectCurrentUser);
  const { data: userData } = useMyProfileQuery({}, { skip: !user });
  const profile = userData?.data;

  console.log("role", profile?.user?.role)


  return (
    <div className=" bg-[#0b131f] text-white select-none px-3 py-1.5 flex items-center justify-between gap-2 text-xs font-sans">
      {/* 1. Amarzone Logo */}
      <Link href="/" className="inline-flex items-center gap-2.5 group">
        <Image
          src="https://res.cloudinary.com/dkk9lvbtf/image/upload/v1785693062/amarzone_fnnw8s.png"
          alt="Amarzone Logo"
          width={100}
          height={100}
          className="h-20 w-auto object-contain"
        />
      </Link>

      {/* 3. Search Bar Group */}
      <div className="flex-1 max-w-5xl mx-2 flex items-center h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-[#ff9900]">
        {/* Category Selector (All ▼) */}
        <div className="relative h-full flex items-center bg-[#f3f3f3] hover:bg-[#dadada] text-[#333] border-r border-[#cdcdcd] px-2.5 cursor-pointer shrink-0">
          <AZSelect
            name="category"
            defaultValue="All"
            options={categoryOptions}
            selectClassName="h-full bg-transparent text-[#333] text-[12px] pr-4 cursor-pointer focus:outline-none appearance-none font-normal"
            className="h-full flex items-center"
          />
          <ChevronDown className="w-3.5 h-3.5 text-gray-600 absolute right-1.5 pointer-events-none" />
        </div>

        {/* Search Input Field */}
        <input
          type="text"
          placeholder="Search Amazon"
          className="w-full h-full px-3 text-[15px] text-black bg-white outline-none placeholder-[#767676]"
        />

        {/* Search Button */}
        <button
          type="button"
          aria-label="Search"
          className="w-11 h-full bg-[#febd69] hover:bg-[#f3a847] flex items-center justify-center cursor-pointer shrink-0 transition-colors"
        >
          <Search className="w-5 h-5 text-[#111] stroke-[2.5]" />
        </button>
      </div>

      {/* 5. Account / User Avatar Section */}
      {user ? (
        <Link
          href={`/${profile?.user?.role?.toLowerCase()}`}
          className="flex items-center gap-2 p-1 border border-transparent hover:border-white rounded cursor-pointer shrink-0 transition-all group"
          title={profile?.name || profile?.email}
        >
          <div className="avatar">
            <div className="w-8 h-8 rounded-full ring-2 ring-[#febd69] overflow-hidden bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-sm shadow-md">
              {profile ? (
                <Image
                  src={profile?.avatar || ""}
                  alt={profile?.name || "User Avatar"}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>
                  {profile?.name}
                </span>
              )}
            </div>
          </div>
          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-[10px] text-gray-300">Hello, {profile?.name?.split(" ")[0]}</span>
            <span className="text-[12px] font-bold text-white -mt-0.5 flex items-center gap-0.5">
              Account & Dashboard
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </span>
          </div>
        </Link>
      ) : (
        <Link
          href="/login"
          className="flex items-center p-1.5 border border-transparent hover:border-white rounded cursor-pointer shrink-0 transition-all gap-1.5"
          aria-label="Account Login"
          title="Sign In"
        >
          <User className="w-7 h-7 text-white stroke-[1.75]" />
          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-[10px] text-gray-300">Hello, sign in</span>
            <span className="text-[12px] font-bold text-white -mt-0.5 flex items-center gap-0.5">
              Account & Lists
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </span>
          </div>
        </Link>
      )}

      {/* 6. Returns & Orders */}
      <Link
        href={user ? `${profile?.role?.toLowerCase()}/orders` : "/login"}
        className="hidden sm:flex flex-col text-left p-1 border border-transparent hover:border-white rounded cursor-pointer leading-tight shrink-0"
      >
        <span className="text-[12px] text-gray-300">Returns</span>
        <span className="text-[14px] font-bold text-white -mt-0.5">
          & Orders
        </span>
      </Link>

      {/* 7. Cart */}
      <a
        href="#"
        className="flex items-center p-1 border border-transparent hover:border-white rounded cursor-pointer relative shrink-0"
      >
        <div className="relative flex items-center">
          <span className="absolute -top-1 left-3 text-[#f08804] font-bold text-[14px]">
            0
          </span>
          <ShoppingCart className="w-8 h-8 text-white stroke-[1.5]" />
        </div>
        <span className="text-[14px] font-bold text-white self-end mb-0.5 hidden sm:inline ml-0.5">
          Cart
        </span>
      </a>
    </div >
  );
}
