import { TResponseRedux } from "@/types/global";
import { baseApi } from "../../api/baseApi";
import { TAdmin } from "@/types/user";

const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allAdmins: builder.query({
            query: (args?: { search?: string; sort?: string; page?: number; limit?: number }) => {
                const params = new URLSearchParams();

                if (args?.search) {
                    params.append("searchTerm", args.search);
                }
                if (args?.sort) {
                    params.append("sort", args.sort);
                }
                if (args?.page) {
                    params.append("page", String(args.page));
                }
                if (args?.limit) {
                    params.append("limit", String(args.limit));
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
        deleteAdmin: builder.mutation({
            query: (id: string) => ({
                url: `/admins/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["admin"],
        }),
        createAdmin: builder.mutation({
            query: (adminInfo) => ({
                url: "/users/create-admin",
                method: "POST",
                body: adminInfo,
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
    useDeleteAdminMutation,
    useCreateAdminMutation,
    useUpdateAdminMutation
} = adminApi;

