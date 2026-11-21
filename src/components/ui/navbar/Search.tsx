"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search as SearchIcon, Loader2, Star, Tag, ArrowRight } from "lucide-react";
import AZInput from "@/components/shared/form/AZInput";
import { useAllVariantsProductsQuery } from "@/redux/features/variant/variantApi";

const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with URL search param
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || searchParams.get("searchTerm") || ""
  );
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const urlQuery = searchParams.get("search") || searchParams.get("searchTerm") || "";
    setSearchTerm(urlQuery);
  }, [searchParams]);

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Query products via /all-variants-products
  const { data: searchResults, isFetching } = useAllVariantsProductsQuery(
    { search: debouncedTerm, limit: 6 },
    { skip: debouncedTerm.length < 2 }
  );

  const products = searchResults?.data || [];
  const showDropdown = isOpen && debouncedTerm.length >= 2;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOpen(false);
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/products");
    }
  };

  const handleSelectProduct = (product: any) => {
    setIsOpen(false);
    const targetId = product.productId || product._id;
    const variantId = product._id;
    if (targetId) {
      router.push(`/products/${targetId}?variant=${variantId}`);
    } else {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSearchSubmit} className="w-full">
        <AZInput
          name="search"
          type="text"
          value={searchTerm}
          onChange={(e: any) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Search products, brands, categories…"
          icon={
            <button
              type="submit"
              className="cursor-pointer text-slate-400 hover:text-violet-600 transition-colors p-1"
              title="Search"
            >
              {isFetching ? (
                <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
              ) : (
                <SearchIcon className="h-4 w-4" />
              )}
            </button>
          }
          className="bg-white text-slate-800 pr-10"
        />
      </form>

      {/* Autocomplete / Live Search Results Dropdown */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden backdrop-blur-md">
          {isFetching ? (
            <div className="flex items-center justify-center gap-2 py-8 text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
              <span>Searching products...</span>
            </div>
          ) : products.length > 0 ? (
            <div>
              <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 flex items-center justify-between">
                <span>Products ({products.length})</span>
                <span className="text-[10px] lowercase font-normal text-slate-400">
                  press Enter to search
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {products.map((item: any) => {
                  const thumbnail =
                    item.thumbnail ||
                    item.images?.[0] ||
                    item.product?.thumbnail ||
                    item.product?.images?.[0];
                  const title = item.title || item.product?.title || "Untitled Product";
                  const brand = item.brand || item.product?.brand;
                  const price = item.price;
                  const rating = item.rating || 0;

                  return (
                    <div
                      key={item._id}
                      onClick={() => handleSelectProduct(item)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                    >
                      {/* Product Thumbnail */}
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
                        {thumbnail ? (
                          <Image
                            src={thumbnail}
                            alt={title}
                            fill
                            sizes="48px"
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <Tag className="h-5 w-5 text-slate-300" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-violet-600 transition-colors">
                          {title}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          {brand && (
                            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                              {brand}
                            </span>
                          )}
                          {rating > 0 && (
                            <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {rating}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Product Price */}
                      <div className="text-right shrink-0">
                        {price !== null && price !== undefined ? (
                          <span className="text-xs font-bold text-slate-900">
                            ${typeof price === "number" ? price.toFixed(2) : price}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">View</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View all results button */}
              <button
                type="button"
                onClick={handleViewAll}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-violet-50 text-xs font-bold text-slate-700 hover:text-violet-700 transition-colors border-t border-slate-100"
              >
                <span>View all results for &ldquo;{debouncedTerm}&rdquo;</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              <p>No products found for &ldquo;{debouncedTerm}&rdquo;</p>
              <button
                type="button"
                onClick={handleViewAll}
                className="mt-2 text-violet-600 font-bold hover:underline"
              >
                Search all products anyway &rarr;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
