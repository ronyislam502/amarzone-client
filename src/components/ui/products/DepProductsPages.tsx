"use client"

import AZProductsPage from "@/components/shared/AZProductsPage";

import { useParams, useSearchParams } from "next/navigation";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";

const DepProductsPage = () => {
    const params = useParams();

    const departmentSlug = params.slug || params.name;
    const { data: departmentsData } = useAllDepartmentsQuery({});
    const currentDepartment = departmentsData?.data?.find(
        (dept: any) => dept.slug === departmentSlug || dept.name.toLowerCase() === String(departmentSlug).toLowerCase()
    );



    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-6">
            {/* <div className="col-span-1"><ProductFilterSidebar /></div> */}
            <div className="col-span-3"><AZProductsPage products={departmentsData} /></div>
        </div>
    )
}

export default DepProductsPage;