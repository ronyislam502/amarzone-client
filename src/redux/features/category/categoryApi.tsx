import { TResponseRedux } from "@/types/global";
import { baseApi } from "../../api/baseApi";
import { TDepartment } from "@/types/department";

const categoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allCategories: builder.query({
            query: ({ search, sort, page, limit, category, minPrice, maxPrice }) => {
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
                if (limit) {
                    params.append("limit", limit);
                }

                return {
                    url: "/categories",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["category"],
            transformResponse: (response: TResponseRedux<TDepartment[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
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
    useCreateCategoryMutation,
    useUpdateCategoryMutation
} = categoryApi;
