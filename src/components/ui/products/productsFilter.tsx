
import {
  RotateCcw,
  SlidersHorizontal,
  Star,
  Check,
} from "lucide-react";

const ProductFilterSidebar = () => {
  const categories = [
    "All Categories",
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Health",
  ];

  const brands = [
    "All Brands",
    "Apple",
    "Samsung",
    "Sony",
    "Nike",
  ];

  const priceRanges = [
    "All Prices",
    "$0 - $50",
    "$50 - $100",
    "$100 - $200",
    "$200 - $500",
    "$500+",
  ];

  const ratings = [4, 3, 2, 1];

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm">

      {/* Header */}
      <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
            <SlidersHorizontal className="h-4 w-4 text-violet-600" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Filters
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Refine your products
            </p>
          </div>

          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10px] font-bold text-white">
            3
          </span>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-violet-600"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>

      {/* Category */}
      <section className="mb-5">
        <h4 className="mb-2.5 text-xs font-bold text-slate-800">
          Category
        </h4>

        <div className="relative">
          <select
            defaultValue=""
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-xs text-slate-600 outline-none transition focus:border-violet-400"
          >
            <option value="" disabled>
              Select category
            </option>

            {categories.slice(1).map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="m5 7.5 5 5 5-5" />
            </svg>
          </span>
        </div>
      </section>

      {/* Brand */}
      <section className="mb-5">
        <h4 className="mb-2.5 text-xs font-bold text-slate-800">
          Brand
        </h4>

        <div className="relative">
          <select
            defaultValue=""
            className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-3 pr-9 text-xs text-slate-600 outline-none transition focus:border-violet-400"
          >
            <option value="" disabled>
              Select brand
            </option>

            {brands.slice(1).map((brand) => (
              <option key={brand}>{brand}</option>
            ))}
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            <svg
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
            >
              <path d="m5 7.5 5 5 5-5" />
            </svg>
          </span>
        </div>
      </section>

      {/* Price Range */}
      <section className="mb-5 border-t border-slate-100 pt-5">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-800">
            Price Range
          </h4>

          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-500">
            USD ($)
          </span>
        </div>

        <div className="space-y-1">
          {priceRanges.map((price, index) => (
            <button
              key={price}
              type="button"
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
                index === 2
                  ? "bg-violet-50 font-bold text-violet-700"
                  : "font-medium text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span>{price}</span>

              {index === 2 && (
                <Check className="h-3.5 w-3.5 text-violet-600" />
              )}
            </button>
          ))}
        </div>

        {/* Custom Price */}
        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400"
          />

          <span className="text-xs text-slate-400">—</span>

          <input
            type="number"
            placeholder="Max"
            className="h-10 min-w-0 rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-400"
          />
        </div>

        <button
          type="button"
          className="mt-2.5 h-9 w-full rounded-xl bg-slate-900 text-xs font-bold text-white transition-colors hover:bg-violet-600"
        >
          Apply Price
        </button>
      </section>

      {/* Customer Rating */}
      <section className="mb-5 border-t border-slate-100 pt-5">
        <h4 className="mb-3 text-xs font-bold text-slate-800">
          Customer Rating
        </h4>

        <div className="space-y-1">
          {ratings.map((rating) => (
            <button
              key={rating}
              type="button"
              className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${
                rating === 4
                  ? "border border-amber-100 bg-amber-50/70"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="flex shrink-0 items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${
                      star <= rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-100 text-slate-200"
                    }`}
                  />
                ))}
              </div>

              <span
                className={`text-xs ${
                  rating === 4
                    ? "font-bold text-slate-800"
                    : "font-medium text-slate-600"
                }`}
              >
                {rating} & Up
              </span>

              {rating === 4 && (
                <Check className="ml-auto h-3.5 w-3.5 text-amber-600" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Availability */}
      <section className="border-t border-slate-100 pt-5">
        <h4 className="mb-3 text-xs font-bold text-slate-800">
          Availability
        </h4>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition-colors hover:border-violet-200">
          <input
            type="checkbox"
            defaultChecked
            className="checkbox checkbox-sm rounded-md border-slate-300 [--chkbg:#7c3aed] [--chkfg:white]"
          />

          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-800">
              In Stock Only
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Show available products
            </p>
          </div>

          <span className="h-2 w-2 rounded-full bg-emerald-500" />
        </label>
      </section>

      {/* Bottom Info */}
      <div className="mt-5 flex items-center gap-2 rounded-xl bg-violet-50 p-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
          <SlidersHorizontal className="h-4 w-4 text-violet-600" />
        </div>

        <p className="text-[11px] leading-relaxed text-slate-600">
          Find the right product with your preferred filters.
        </p>
      </div>
    </div>
  );
};

export default ProductFilterSidebar;
