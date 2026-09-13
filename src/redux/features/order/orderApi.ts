import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";

const orderApi = baseApi.injectEndpoints({
  overrideExisting: true,
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
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.status) queryParams.append("status", params.status);

        return {
          url: `/orders?${queryParams.toString()}`,
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
    myOrders: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.status) queryParams.append("status", params.status);
        if (params?.sort) queryParams.append("sort", params.sort);

        const queryString = queryParams.toString();
        return {
          url: `/orders/my-orders${queryString ? `?${queryString}` : ""}`,
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
    // allOrdersByVendor: builder.query({
    //   query: (params) => {
    //     const queryParams = new URLSearchParams();
    //     if (params?.search) queryParams.append("searchTerm", params.search);
    //     if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
    //     if (params?.page) queryParams.append("page", String(params.page));
    //     if (params?.limit) queryParams.append("limit", String(params.limit));
    //     if (params?.status) queryParams.append("status", params.status);
    //     if (params?.sort) queryParams.append("sort", params.sort);

    //     const queryString = queryParams.toString();
    //     return {
    //       url: `/orders/my-orders${queryString ? `?${queryString}` : ""}`,
    //       method: "GET",
    //     };
    //   },
    //   providesTags: ["order"],
    //   transformResponse: (response: TResponseRedux<any[]>) => {
    //     return {
    //       data: response?.data,
    //       meta: response?.meta,
    //     };
    //   },
    // }),
    // allOrdersByCustomer: builder.query({
    //   query: (params) => {
    //     const queryParams = new URLSearchParams();
    //     if (params?.search) queryParams.append("searchTerm", params.search);
    //     if (params?.page) queryParams.append("page", String(params.page));
    //     if (params?.limit) queryParams.append("limit", String(params.limit));

    //     return {
    //       url: `/orders/customer?${queryParams.toString()}`,
    //       method: "GET",
    //     };
    //   },
    //   providesTags: ["order"],
    //   transformResponse: (response: TResponseRedux<any[]>) => {
    //     return {
    //       data: response?.data,
    //       meta: response?.meta,
    //     };
    //   },
    // }),
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
  useMyOrdersQuery,
  useUpdateOrderTrackingMutation,
  useUpdateOrderShippingMutation,
} = orderApi;
