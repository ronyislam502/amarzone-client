import { TResponseRedux } from "@/types/global";
import { baseApi } from "../../api/baseApi";
import { TDepartment } from "@/types/department";

const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allAdmins: builder.query({
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
                    url: "/admins",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["admin"],
            transformResponse: (response: TResponseRedux<TDepartment[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        createAdmin: builder.mutation({
            query: (categoryInfo) => ({
                url: "/admins/create-admin",
                method: "POST",
                body: categoryInfo,
            }),
            invalidatesTags: ["admin"],
        }),
        updateAdmin: builder.mutation({
            query: (args) => ({
                url: `/admins/update/${args?.id}`,
                method: "PATCH",
                body: args.data,
            }),
            invalidatesTags: ["admin"],
        }),
    }),
});

export const {
    useAllAdminsQuery,
    useCreateAdminMutation,
    useUpdateAdminMutation
} = adminApi;
