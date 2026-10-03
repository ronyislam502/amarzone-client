"use client";

import React, { useState, ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search as SearchIcon, Loader2, ArrowRight, Package } from "lucide-react";
import { useDebounce } from "@/src/components/utilities/Debaounce";
import { useAllProductsQuery } from "@/src/redux/features/product/productApi";
import { TProduct } from "@/types/product";
import {
  extractProductPriceInfo,
  getProductThumbnail,
} from "@/components/ui/home/homeUtils";
import AZInput from "@/src/components/ui/shared/form/AZInput";

const Search = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const debouncedSearch = useDebounce(value, 400);

  // RTK Query: server-side search matching user architecture
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useAllProductsQuery(
    {
      search: debouncedSearch.trim() || undefined,
      limit: 6,
    },
    {
      skip: !debouncedSearch.trim(),
    }
  );

  const products: TProduct[] = responseData?.data || [];
  const meta = responseData?.meta;
  const totalCount = meta?.total ?? products.length;


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    setIsOpen(false);
    if (trimmed) {
      router.push(`/products?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push("/products");
    }
  };

  const handleSelectProduct = (productId: string) => {
    setIsOpen(false);
    setValue("");
    router.push(`/products/${productId}`);
  };

  const handleClear = () => {
    setValue("");
    setIsOpen(false);
  };

  const showDropdown = isOpen && Boolean(debouncedSearch.trim());

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full relative z-50">
        <AZInput
          name="navbar-search"
          placeholder="Search products, brands, categories…"
          value={value}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setValue(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          icon={<SearchIcon className="h-4 w-4 opacity-50 text-slate-500" />}
          clearable
          onClear={handleClear}
          size="md"
          inputClassName="!bg-white !text-slate-900 !border-slate-300 rounded-full pl-10 pr-10 focus:!border-violet-600 focus:!ring-2 focus:!ring-violet-500 shadow-sm"
          containerClassName="w-full"
        />
      </form>

      {/* Server-side Search Results Dropdown Under the Navbar */}
      {showDropdown && (
        <>
          {/* Backdrop to close dropdown on click outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800">
            {isLoading ? (
              <div className="p-6 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs">
                <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
                <span>Searching products...</span>
              </div>
            ) : products.length > 0 ? (
              <div>
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Matching Products</span>
                  <span>{totalCount} found</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {products.map((product) => {
                    const thumbnail = getProductThumbnail(product);
                    const priceInfo = extractProductPriceInfo(product);
                    const categoryName =
                      typeof product.category === "object"
                        ? product.category?.name
                        : "";

                    return (
                      <div
                        key={product._id}
                        onClick={() => handleSelectProduct(product._id)}
                        className="flex items-center gap-3 p-3 hover:bg-violet-50/70 transition-colors cursor-pointer group"
                      >
                        <div className="relative w-12 h-12 rounded-xl bg-slate-50 shrink-0 overflow-hidden border border-slate-100">
                          {thumbnail ? (
                            <Image
                              src={thumbnail}
                              alt={product.title}
                              fill
                              className="object-contain p-1"
                              sizes="48px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                            {product.brand && (
                              <span className="font-bold text-violet-600 uppercase tracking-wider">
                                {product.brand}
                              </span>
                            )}
                            {categoryName && (
                              <>
                                <span>·</span>
                                <span className="truncate">{categoryName}</span>
                              </>
                            )}
                          </div>
                          <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-violet-700 transition-colors">
                            {product.title}
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-black text-slate-900">
                            ${priceInfo.price.toFixed(2)}
                          </div>
                          {priceInfo.savings > 0 && (
                            <div className="text-[10px] text-slate-400 line-through">
                              ${priceInfo.originalPrice.toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-1.5 px-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>View all {totalCount} results for &ldquo;{debouncedSearch}&rdquo;</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 space-y-1">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No products found</p>
                <p className="text-[11px] text-slate-400">
                  No results matching &ldquo;{debouncedSearch}&rdquo;
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Search;
