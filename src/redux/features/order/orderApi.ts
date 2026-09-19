import { TResponseRedux } from "@/types/global";
import { baseApi } from "../../api/baseApi";
import { TOrder } from "@/src/types/order";

const orderApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allOrders: builder.query({
      query: (args?: {
        search?: string;
        page?: number | string;
        limit?: number | string;
        status?: string;
        paymentStatus?: string;
        sort?: string;
      }) => {
        const params = new URLSearchParams();

        if (args?.search) {
          params.append("searchTerm", args.search);
        }
        if (args?.status && args.status !== "ALL") {
          params.append("status", args.status);
        }
        if (args?.paymentStatus && args.paymentStatus !== "ALL") {
          params.append("paymentStatus", args.paymentStatus);
        }
        if (args?.sort) {
          params.append("sort", args.sort);
        }
        if (args?.page) {
          params.append("page", String(args.page));
        }
        if (args?.limit !== undefined && args?.limit !== null) {
          params.append("limit", String(args.limit));
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
      query: (args?: {
        page?: number | string;
        limit?: number | string;
        status?: string;
        paymentStatus?: string;
        searchTerm?: string;
        search?: string;
        sort?: string;
        email?: string;
      }) => {
        const params = new URLSearchParams();

        if (args?.page) {
          params.append("page", String(args.page));
        }
        if (args?.limit !== undefined && args?.limit !== null) {
          params.append("limit", String(args.limit));
        }
        if (args?.status && args.status !== "ALL") {
          params.append("status", args.status);
        }
        if (args?.paymentStatus && args.paymentStatus !== "ALL") {
          params.append("paymentStatus", args.paymentStatus);
        }
        if (args?.search || args?.searchTerm) {
          params.append("searchTerm", args.search || args.searchTerm || "");
        }
        if (args?.sort) {
          params.append("sort", args.sort);
        }

        return {
          url: `/orders/my-orders`,
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
        url: `/orders/${id}`,
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
