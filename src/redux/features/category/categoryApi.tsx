import { baseApi } from "@/redux/api/baseApi";
import { TCategory } from "@/types/category";
import { TResponseRedux } from "@/types/global";

const categoryApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allCategories: builder.query({
            query: ({ search, sort, page, limit, department, status }) => {
                const params = new URLSearchParams();

                if (search) {
                    params.append("searchTerm", search);
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
                if (department) {
                    params.append("department", department);
                }

                return {
                    url: "/categories",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["category"],
            transformResponse: (response: TResponseRedux<TCategory[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        createCategory: builder.mutation({
            query: (data) => ({
                url: "/categories/create-category",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["category"],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["category"],
        }),
        updateCategory: builder.mutation({
            query: (args) => ({
                url: `/categories/update/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["category"],
        }),
        allCategoryByDepartment: builder.query({
            query: (id) => ({
                url: `/categories/department/${id}`,
                method: "GET",
            }),
            providesTags: ["category"],
        }),
    }),
});

export const {
    useAllCategoriesQuery,
    useCreateCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation,
    useAllCategoryByDepartmentQuery
} = categoryApi;