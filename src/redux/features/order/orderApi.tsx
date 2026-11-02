import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";


const orderApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allOrders: builder.query({
            query: ({ search, sort, page, limit, status }) => {
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

                return {
                    url: "/orders",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["order"],
            transformResponse: (response: TResponseRedux<any[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        /**
         * Create Order API — POST /orders/create-order
         *
         * Body shape (per vendor group):
         * {
         *   vendor: string,          // vendor user._id
         *   products: [
         *     { variant: string, quantity: number }
         *   ]
         * }
         *
         * The server validates stock, creates a Stripe PaymentIntent,
         * and returns { order, clientSecret }.
         *
         * NOTE: Multi-product carts with items from DIFFERENT vendors must
         * call this endpoint ONCE PER VENDOR GROUP. CartData.tsx handles
         * the grouping before calling this mutation.
         */
        createOrder: builder.mutation({
            query: (data) => ({
                url: "/orders/create-order",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["order"],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product"],
        }),
        updateOrder: builder.mutation({
            query: (args) => ({
                url: `/orders/update/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["order"],
        }),
        myOrders: builder.query({
            query: ({ search, sort, page, limit, status }) => {
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

                return {
                    url: "/orders/my-orders",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["order"],
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
    useAllOrdersQuery,
    useCreateOrderMutation,
    useUpdateOrderMutation,
    useMyOrdersQuery,
} = orderApi;
