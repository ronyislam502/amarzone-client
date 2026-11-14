import { TResponseRedux } from "@/types/global";
import { TVariant } from "@/types/variant";
import { baseApi } from "@/redux/api/baseApi";


const variantApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allVariantsByProduct: builder.query({
            query: (id) => ({
                url: `/variants/variants-product/${id}`,
                method: "GET",
            }),
            providesTags: ["variant"],
            transformResponse: (response: TResponseRedux<TVariant[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        createVariant: builder.mutation({
            query: (data) => ({
                url: "/variants/create-variant",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["variant", "product"],
        }),
        allVariantsProducts: builder.query({
            query: ({ search, sort, page, limit, department, category, brand, minPrice, maxPrice, rating }) => {
                const params = new URLSearchParams();

                if (search) {
                    params.append("searchTerm", search);
                }
                if (sort) {
                    params.append("sort", sort);
                }
                if (page) {
                    params.append("page", String(page));
                }
                if (limit) {
                    params.append("limit", String(limit));
                }
                if (department) {
                    params.append("department", department);
                }
                if (category) {
                    params.append("category", category);
                }
                if (brand) {
                    params.append("brand", brand);
                }
                if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
                    params.append("minPrice", String(minPrice));
                }
                if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
                    params.append("maxPrice", String(maxPrice));
                }

                return {
                    url: "/variants/all-variants-products",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["variant"],
            transformResponse: (response: TResponseRedux<any[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        allVariantsProductsByDepartment: builder.query({
            query: (id) => {
                // { search, sort, page, limit, , brand, minPrice, maxPrice, rating }
                const params = new URLSearchParams();

                // if (search) {
                //     params.append("searchTerm", search);
                // }
                // if (sort) {
                //     params.append("sort", sort);
                // }
                // if (page) {
                //     params.append("page", String(page));
                // }
                // if (limit) {
                //     params.append("limit", String(limit));
                // }
                // if (department) {
                //     params.append("department", department);
                // }
                // if (category) {
                //     params.append("category", category);
                // }
                // if (brand) {
                //     params.append("brand", brand);
                // }
                // if (minPrice !== undefined && minPrice !== null && minPrice !== "") {
                //     params.append("minPrice", String(minPrice));
                // }
                // if (maxPrice !== undefined && maxPrice !== null && maxPrice !== "") {
                //     params.append("maxPrice", String(maxPrice));
                // }

                return {
                    url: `/variants/all-variants-products-department/${id}`,
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["variant"],
            transformResponse: (response: TResponseRedux<any[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
    }),
});

export const {
    useAllVariantsByProductQuery,
    useCreateVariantMutation,
    useAllVariantsProductsQuery,
    useAllVariantsProductsByDepartmentQuery
} = variantApi;
