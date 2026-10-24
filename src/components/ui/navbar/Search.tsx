"use client";

import { Search as SearchIcon, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  // Pre-fill from URL if on /products
  const [value, setValue] = useState(
    pathname === "/products" ? (searchParams.get("search") ?? "") : ""
  );

  // Keep value in sync when URL changes (e.g., browser back)
  useEffect(() => {
    if (pathname === "/products") {
      setValue(searchParams.get("search") ?? "");
    } else {
      setValue("");
    }
  }, [pathname, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
    inputRef.current?.blur();
  };

  const handleClear = () => {
    setValue("");
    if (pathname === "/products") {
      router.push("/products");
    }
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <label className="input input-bordered flex items-center gap-3 w-full bg-white text-black h-12 px-5 rounded-full overflow-hidden">
        <SearchIcon className="h-4 w-4 opacity-50 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search products, brands, categories…"
          className="grow outline-none text-sm min-w-0"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="shrink-0 text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </label>
    </form>
  );
};

export default Search;
