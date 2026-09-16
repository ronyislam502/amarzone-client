import { TResponseRedux } from "@/types/global";
import { baseApi } from "../../api/baseApi";
import { TOrder } from "@/src/types/order";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allOrders: builder.query({
      query: ({ search, page, limit }) => {
        const params = new URLSearchParams();

        if (search) {
          params.append("searchTerm", search);
        }
        if (page) {
          params.append("page", page);
        }
        if (limit) {
          params.append("limit", limit);
        }

        return {
          url: `/orders`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["order"],
      transformResponse: (response: TResponseRedux<TOrder[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    createOrder: builder.mutation({
      query: (categoryInfo) => ({
        url: "/orders/create-order",
        method: "POST",
        body: categoryInfo,
      }),
    }),
    myOrders: builder.query({
      query: ({ email, page, limit }) => {
        const params = new URLSearchParams();

        if (page) {
          params.append("page", page);
        }
        if (limit) {
          params.append("limit", limit);
        }

        return {
          url: `/orders/my-orders/${email}`,
          method: "GET",
          params: params,
        };
      },
      providesTags: ["order"],
      transformResponse: (response: TResponseRedux<TOrder[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    updateOrder: builder.mutation({
      query: (args) => ({
        url: `/orders/update/${args.id}`,
        method: "PATCH",
        body: args.data,
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
    pendingOrders: builder.query({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        if (page) {
          params.append("page", page.toString());
        }
        if (limit) {
          params.append("limit", limit.toString());
        }
        return {
          url: `/orders/pending`,
          method: "GET",
          params,
        };
      },
      providesTags: ["order"],
      transformResponse: (response: TResponseRedux<TOrder[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    unshippedOrders: builder.query({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        if (page) {
          params.append("page", page.toString());
        }
        if (limit) {
          params.append("limit", limit.toString());
        }
        return {
          url: `/orders/unshipped`,
          method: "GET",
          params,
        };
      },
      providesTags: ["order"],
      transformResponse: (response: TResponseRedux<TOrder[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    shippedOrders: builder.query({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        if (page) {
          params.append("page", page.toString());
        }
        if (limit) {
          params.append("limit", limit.toString());
        }
        return {
          url: `/orders/shipped`,
          method: "GET",
          params,
        };
      },
      providesTags: ["order"],
      transformResponse: (response: TResponseRedux<TOrder[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    cancelOrders: builder.query({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        if (page) {
          params.append("page", page.toString());
        }
        if (limit) {
          params.append("limit", limit.toString());
        }
        return {
          url: `/orders/cancel`,
          method: "GET",
          params,
        };
      },
      providesTags: ["order"],
      transformResponse: (response: TResponseRedux<TOrder[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    deliveredOrders: builder.query({
      query: ({ page, limit }) => {
        const params = new URLSearchParams();
        if (page) {
          params.append("page", page.toString());
        }
        if (limit) {
          params.append("limit", limit.toString());
        }
        return {
          url: `/orders/delivered`,
          method: "GET",
          params,
        };
      },
      providesTags: ["order"],
      transformResponse: (response: TResponseRedux<TOrder[]>) => {
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
  useMyOrdersQuery,
  useUpdateOrderMutation,
  useSingleOrderQuery,
  usePendingOrdersQuery,
  useUnshippedOrdersQuery,
  useShippedOrdersQuery,
  useCancelOrdersQuery,
  useDeliveredOrdersQuery,
} = orderApi;

export const useUpdateOrderShippingMutation = useUpdateOrderMutation;
export const useUpdateOrderTrackingMutation = useUpdateOrderMutation;
