"use client";

import Link from "next/link";
import { ChevronDown, Layers } from "lucide-react";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { TDepartment } from "@/types/department";
import { slugify } from "@/utils/slug";

const Departments = () => {
    const { data: departmentResponse, isLoading } = useAllDepartmentsQuery({ limit: 100 });
    const departments: TDepartment[] = (departmentResponse as any)?.data || [];

    return (
        <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost">
                <h2 className="text-white text-md flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-amber-400" />
                    Departments
                </h2>
                <ChevronDown className="w-4 h-4 text-white" />
            </div>
            <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-56 p-2 shadow-xl border border-slate-100 text-slate-800 max-h-96 overflow-y-auto"
            >
                {isLoading && (
                    <li className="p-3 text-xs text-slate-400 text-center">Loading departments...</li>
                )}

                {!isLoading && departments.length === 0 && (
                    <li className="p-3 text-xs text-slate-400 text-center">No departments found</li>
                )}

                {departments.map((department) => {
                    const slug = slugify(department.name);
                    return (
                        <li key={department._id}>
                            <Link
                                href={`/${slug}`}
                                className="font-medium py-2 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                            >
                                {department.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Departments;