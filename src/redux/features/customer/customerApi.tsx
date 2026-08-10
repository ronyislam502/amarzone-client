import { TResponseRedux } from "@/types/global";
import { baseApi } from "../../api/baseApi";
import { TDepartment } from "@/types/department";

const customerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allCustomers: builder.query({
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
                    url: "/customers",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["customer"],
            transformResponse: (response: TResponseRedux<TDepartment[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        createCustomer: builder.mutation({
            query: (categoryInfo) => ({
                url: "/customers/create-customer",
                method: "POST",
                body: categoryInfo,
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
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
} = customerApi;
