"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import AZInput from "@/components/shared/form/AZInput";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL থেকে বর্তমান সার্চ কুয়েরি নিয়ে স্টেট ইনিশিয়ালাইজ করা
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // URL পরিবর্তন হলে ইনপুটের ভ্যালু সিংক রাখার জন্য
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // ইউজারকে `/products?search=...` পেজে নিয়ে যাওয়া
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="w-full">
      <div className="relative">
        <AZInput
          name="search"
          type="text"
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          placeholder="Search products, brands, categories…"
          icon={
            <button type="submit" className="cursor-pointer">
              <SearchIcon className="h-4 w-4 text-green-400 hover:text-green-600 transition-colors" />
            </button>
          }
          className="bg-white text-black pr-10"
        />
      </div>
    </form>
  );
};

export default Search;