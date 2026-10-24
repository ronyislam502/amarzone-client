import { baseApi } from "@/redux/api/baseApi";
import { TCustomer } from "@/types/customer";
import { TResponseRedux } from "@/types/global";


const customerApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allCustomers: builder.query({
            query: ({ search, sort, page, limit }) => {
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
        singleCustomer: builder.query({
            query: (id) => ({
                url: `/customers/single/${id}`,
                method: "GET",
            }),
            providesTags: ["customer"],
        }),
        updateCustomer: builder.mutation({
            query: (args) => ({
                url: `/customers/update/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["customer", "user"],
        }),
        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `/customers/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["customer"],
        }),
    }),
});

export const {
    useAllCustomersQuery,
    useSingleCustomerQuery,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customerApi;
