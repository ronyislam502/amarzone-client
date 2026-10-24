import { TResponseRedux } from "@/types/global";
import { TAdmin } from "@/types/admin";
import { baseApi } from "@/redux/api/baseApi";


const adminApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allAdmins: builder.query({
            query: ({ search, sort, page, limit, status, role }) => {
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
                if (status) {
                    params.append("status", status);
                }
                if (role) {
                    params.append("role", role);
                }

                return {
                    url: "/admins",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["admin"],
            transformResponse: (response: TResponseRedux<TAdmin[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        singleAdmin: builder.query({
            query: (id) => ({
                url: `/admins/admin/${id}`,
                method: "GET",
            }),
            providesTags: ["admin"],
        }),
        deleteAdmin: builder.mutation({
            query: (id) => ({
                url: `/admins/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["admin"],
        }),
        updateAdmin: builder.mutation({
            query: (args) => ({
                url: `/admins/update/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["admin", "user"],
        }),
    }),
});

export const {
    useAllAdminsQuery,
    useDeleteAdminMutation,
    useSingleAdminQuery,
    useUpdateAdminMutation
} = adminApi;



