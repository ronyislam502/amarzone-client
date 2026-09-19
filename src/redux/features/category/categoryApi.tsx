import { TResponseRedux } from "@/types/global";
import { baseApi } from "../../api/baseApi";
import { TCategory } from "@/types/category";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allCategories: builder.query({
            query: ({ search, sort, page, limit, category, minPrice, maxPrice }: Record<string, any> = {}) => {
                const params = new URLSearchParams();

                if (search) {
                    params.append("searchTerm", search);
                }
                if (category) {
                    params.append("category", category);
                }
                if (minPrice) {
                    params.append("minPrice", String(minPrice));
                }
                if (maxPrice) {
                    params.append("maxPrice", String(maxPrice));
                }
                if (sort) {
                    params.append("sort", sort);
                }
                if (page) {
                    params.append("page", page);
                }
                if (limit !== undefined && limit !== null) {
                    params.append("limit", String(limit));
                }

                return {
                    url: "/categories",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["category"],
            transformResponse: (response: any) => {
                return {
                    data: (Array.isArray(response?.data)
                        ? response?.data
                        : response?.data?.data || []) as TCategory[],
                    meta: response?.data?.meta || response?.meta,
                };
            },
        }),
        categoriesByDepartment: builder.query({
            query: (args: string | { id: string; limit?: number | string }) => {
                const id = typeof args === "string" ? args : args.id;
                const limit = typeof args === "object" ? args.limit : 100;
                const params = new URLSearchParams();
                if (limit !== undefined && limit !== null) {
                    params.append("limit", String(limit));
                }
                const queryString = params.toString();
                return {
                    url: `/categories/department/${id}${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: ["category"],
            transformResponse: (response: any) => {
                return {
                    data: (Array.isArray(response?.data)
                        ? response?.data
                        : response?.data?.data || []) as TCategory[],
                    meta: response?.data?.meta || response?.meta,
                };
            },
        }),
        createCategory: builder.mutation({
            query: (categoryInfo) => ({
                url: "/categories/create-category",
                method: "POST",
                body: categoryInfo,
            }),
            invalidatesTags: ["category"],
        }),
        updateCategory: builder.mutation({
            query: (args) => ({
                url: `/categories/update/${args?.id}`,
                method: "PATCH",
                body: args.data,
            }),
            invalidatesTags: ["category"],
        }),
    }),
});

export const {
    useAllCategoriesQuery,
    useCategoriesByDepartmentQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation
} = categoryApi;

