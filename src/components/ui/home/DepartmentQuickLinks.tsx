"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Tag, ChevronDown } from "lucide-react";

const NAV_LINKS = [
    { label: "Departments", href: "/#department-spotlight", isDropdown: true },
    { label: "Services", href: "/#flash-deals", isDropdown: true },
    { label: "Rollbacks & more", href: "/#rollbacks-bento", highlight: true },
    { label: "Grocery", href: "/?department=grocery" },
    { label: "Home", href: "/?department=home" },
    { label: "Patio & garden", href: "/?department=patio" },
    { label: "Fashion", href: "/?department=fashion" },
    { label: "Tech", href: "/?department=electronics" },
    { label: "Toys", href: "/?department=toys" },
    { label: "Health & wellness", href: "/?department=health" },
    { label: "Personal care", href: "/?department=personal" },
    { label: "Beauty", href: "/?department=beauty" },
    { label: "Auto & tires", href: "/?department=auto" },
    { label: "Amarzone+", href: "/#amarzone-plus", isPill: true },
];

export const DepartmentQuickLinks: React.FC = () => {
    return (
        <nav aria-label="Quick Category Navigation" className="w-full border-b border-slate-200/80 bg-white py-2 select-none">
            <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
                <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar text-xs font-semibold whitespace-nowrap text-slate-700">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`flex items-center gap-1 transition-colors hover:text-[#0071dc] ${
                                link.highlight
                                    ? "font-bold text-[#cc0000] hover:text-[#990000]"
                                    : link.isPill
                                    ? "font-bold text-[#0071dc] bg-blue-50 px-2.5 py-0.5 rounded-full hover:bg-blue-100"
                                    : "text-slate-700"
                            }`}
                        >
                            {link.isPill && <Sparkles className="w-3 h-3 text-[#ffc220] fill-[#ffc220]" />}
                            <span>{link.label}</span>
                            {link.isDropdown && <ChevronDown className="w-3 h-3 text-slate-400" />}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default DepartmentQuickLinks;
