import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (orderData) => ({
        url: "/orders/create-order",
        method: "POST",
        body: orderData,
      }),
      invalidatesTags: ["order", "inventory"],
    }),
    allOrders: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.status) queryParams.append("status", params.status);

        return {
          url: `/orders`,
          method: "GET",
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
    allOrdersByVendor: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));

        return {
          url: `/orders/vendor?${queryParams.toString()}`,
          method: "GET",
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
    allOrdersByCustomer: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));

        return {
          url: `/orders/customer`,
          method: "GET",
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
    updateOrderTracking: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/update-tracking/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),
    updateOrderShipping: builder.mutation({
      query: ({ id, data }) => ({
        url: `/orders/${id}/shipping`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["order"],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useAllOrdersQuery,
  useAllOrdersByVendorQuery,
  useAllOrdersByCustomerQuery,
  useUpdateOrderTrackingMutation,
  useUpdateOrderShippingMutation,
} = orderApi;
