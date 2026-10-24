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
        singleOrder: builder.query({
            query: (id) => ({
                url: `/orders/order/${id}`,
                method: "GET",
            }),
            providesTags: ["order"],
        }),
        myOrders: builder.query<any, void | { search?: string; sort?: string; page?: string | number; limit?: string | number; status?: string }>({
            query: (args = {}) => {
                const { search, sort, page, limit, status } = (args || {}) as any;
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
    useUpdateOrderMutation,
    useSingleOrderQuery,
    useMyOrdersQuery
} = orderApi;



