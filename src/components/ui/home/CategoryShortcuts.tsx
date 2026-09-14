"use client";

import React from "react";
import Link from "next/link";
import {
    Laptop,
    Shirt,
    Home,
    ShoppingBasket,
    Sparkles,
    HeartPulse,
    Gamepad2,
    Tag,
} from "lucide-react";

interface CategoryShortcutItem {
    id: string;
    name: string;
    href: string;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
}

const CATEGORY_ITEMS: CategoryShortcutItem[] = [
    {
        id: "cat-deals",
        name: "Deals & Rollbacks",
        href: "/?tag=deals",
        icon: <Tag className="w-5 h-5" />,
        bgColor: "bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-100",
        textColor: "text-rose-700 font-bold",
    },
    {
        id: "cat-pet",
        name: "Pet Supplies",
        href: "/?department=pets",
        icon: <HeartPulse className="w-5 h-5" />,
        bgColor: "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100",
        textColor: "text-slate-800",
    },
    {
        id: "cat-electronics",
        name: "Electronics",
        href: "/?department=electronics",
        icon: <Laptop className="w-5 h-5" />,
        bgColor: "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-100",
        textColor: "text-slate-800",
    },
    {
        id: "cat-fashion",
        name: "Fashion & Apparel",
        href: "/?department=fashion",
        icon: <Shirt className="w-5 h-5" />,
        bgColor: "bg-purple-50 text-purple-600 border-purple-100 group-hover:bg-purple-100",
        textColor: "text-slate-800",
    },
    {
        id: "cat-home",
        name: "Home & Living",
        href: "/?department=home",
        icon: <Home className="w-5 h-5" />,
        bgColor: "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-100",
        textColor: "text-slate-800",
    },
    {
        id: "cat-grocery",
        name: "Grocery & Pantry",
        href: "/?department=grocery",
        icon: <ShoppingBasket className="w-5 h-5" />,
        bgColor: "bg-amber-50 text-amber-700 border-amber-100 group-hover:bg-amber-100",
        textColor: "text-slate-800",
    },
    {
        id: "cat-beauty",
        name: "Beauty & Health",
        href: "/?department=beauty",
        icon: <Sparkles className="w-5 h-5" />,
        bgColor: "bg-pink-50 text-pink-600 border-pink-100 group-hover:bg-pink-100",
        textColor: "text-slate-800",
    },
    {
        id: "cat-toys",
        name: "Toys & Games",
        href: "/?department=toys",
        icon: <Gamepad2 className="w-5 h-5" />,
        bgColor: "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-100",
        textColor: "text-slate-800",
    },
];

export const CategoryShortcuts: React.FC = () => {
    return (
        <section aria-label="Shop by Department Categories" className="w-full">
            <div className="flex items-center justify-between gap-3 overflow-x-auto no-scrollbar py-2 px-1">
                {CATEGORY_ITEMS.map((category) => (
                    <Link
                        key={category.id}
                        href={category.href}
                        className="group flex flex-col items-center gap-2 text-center shrink-0 min-w-[76px] sm:min-w-[90px] transition-transform hover:-translate-y-1"
                    >
                        <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center border shadow-xs transition-all duration-200 ${category.bgColor}`}
                        >
                            {category.icon}
                        </div>
                        <span
                            className={`text-xs text-center leading-tight line-clamp-2 max-w-[85px] font-medium group-hover:text-[#0071dc] transition-colors ${category.textColor}`}
                        >
                            {category.name}
                        </span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CategoryShortcuts;
