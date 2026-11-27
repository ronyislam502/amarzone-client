"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import AZProductsPage from "@/components/shared/AZProductsPage";
import { useAllDepartmentsQuery } from "@/redux/features/department/departmentApi";
import { useAllVariantsProductsByDepartmentQuery } from "@/redux/features/variant/variantApi";

const DepProductsPage = () => {
    const params = useParams();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(15);
    const [filters, setFilters] = useState<any>({
        search: "",
        department: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        rating: null,
        sort: "",
    });

    const departmentSlug =
        params?.slug ||
        params?.name ||
        (params as any)?.["department.name"];

    const { data: departmentsData, isLoading: isDeptListLoading } = useAllDepartmentsQuery({ limit: 50 });
    const currentDepartment = departmentsData?.data?.find(
        (dept: any) =>
            dept._id === departmentSlug ||
            dept.slug === departmentSlug ||
            dept.name.toLowerCase() === String(departmentSlug).toLowerCase()
    );

    const deptId = currentDepartment?._id || (departmentSlug && departmentSlug.length === 24 ? departmentSlug : undefined);

    const {
        data: deptProductsData,
        isLoading: isProductsLoading,
        isFetching,
        isError,
        refetch,
    } = useAllVariantsProductsByDepartmentQuery(
        {
            id: deptId,
            page,
            limit,
            search: filters.search || undefined,
            sort: filters.sort || undefined,
            category: filters.category || undefined,
            brand: filters.brand || undefined,
            minPrice: filters.minPrice || undefined,
            maxPrice: filters.maxPrice || undefined,
            rating: filters.rating !== null ? filters.rating : undefined,
        },
        { skip: !deptId }
    );

    const rawProducts = (deptProductsData?.data || []).slice(0, limit);
    const apiMeta = deptProductsData?.meta;
    const meta = apiMeta
        ? {
            ...apiMeta,
            limit,
            totalPage: Math.ceil((apiMeta.total ?? 0) / limit),
        }
        : undefined;

    return (
        <div className="w-full">
            <AZProductsPage
                products={rawProducts}
                isLoading={isDeptListLoading || isProductsLoading}
                isFetching={isFetching}
                isError={isError}
                refetch={refetch}
                page={page}
                setPage={setPage}
                limit={limit}
                setLimit={(newLimit) => { setLimit(newLimit); setPage(1); }}
                meta={meta}
                filters={{ ...filters, department: deptId || "" }}
                onFiltersChange={(newFilters) => {
                    setFilters(newFilters);
                    setPage(1);
                }}
            />
        </div>
    );
};

export default DepProductsPage;