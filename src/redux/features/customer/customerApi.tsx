import { TResponseRedux } from "@/types/global";
import { baseApi } from "../../api/baseApi";
import { TCustomer } from "@/types/user";

const customerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allCustomers: builder.query({
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
                    url: "/customers",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["customer"],
            transformResponse: (response: TResponseRedux<TCustomer[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        deleteCustomer: builder.mutation({
            query: (id: string) => ({
                url: `/customers/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["customer"],
        }),
        createCustomer: builder.mutation({
            query: (customerInfo) => ({
                url: "/customers/create-customer",
                method: "POST",
                body: customerInfo,
            }),
            invalidatesTags: ["customer"],
        }),
        updateCustomer: builder.mutation({
            query: (args) => ({
                url: `/customers/update/${args?.id}`,
                method: "PATCH",
                body: args.data,
            }),
            invalidatesTags: ["customer"],
        }),
    }),
});

export const {
    useAllCustomersQuery,
    useDeleteCustomerMutation,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
} = customerApi;

