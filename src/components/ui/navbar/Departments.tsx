"use client";

import { ChevronDown, Layers } from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { TDepartment } from "@/types/department";
import Link from "next/link";

const Departments = () => {
    const { data: departmentsData } = useAllDepartmentsQuery({});

    return (
        <div className="dropdown">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-sm sm:btn-md bg-[#0071dc] hover:bg-[#005bb5] text-white rounded-full px-3.5 sm:px-4 border-none shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
                <Layers className="w-4 h-4 text-amber-300 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white">Departments</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/90 shrink-0" />
            </div>
            <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-white rounded-2xl z-50 mt-2.5 w-60 p-2 shadow-xl border border-slate-200/80 text-slate-800 max-h-96 overflow-y-auto"
            >
                {departmentsData?.data?.map((department: TDepartment) => {
                    return (
                        <li key={department?._id}>
                            <Link
                                href={`/${department?.name}`}
                                className="font-medium py-2 rounded-xl hover:bg-blue-50 hover:text-[#0071dc] transition-colors"
                            >
                                {department?.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Departments;
