import {
    RotateCcw,
    SlidersHorizontal,
    Star,
    Check,
} from "lucide-react";

const AZProductFilter = () => {
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
                            className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${index === 2
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
                            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors ${rating === 4
                                ? "border border-amber-100 bg-amber-50/70"
                                : "hover:bg-slate-50"
                                }`}
                        >
                            <div className="flex shrink-0 items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-3.5 w-3.5 ${star <= rating
                                            ? "fill-amber-400 text-amber-400"
                                            : "fill-slate-100 text-slate-200"
                                            }`}
                                    />
                                ))}
                            </div>

                            <span
                                className={`text-xs ${rating === 4
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
        </div>
    );
}

export default AZProductFilter;