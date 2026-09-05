import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";

const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInventoryByAsin: builder.query({
      query: (asin: string) => ({
        url: `/inventories/variant/${asin}`,
        method: "GET",
      }),
      providesTags: ["inventory"],
    }),
    getMyInventory: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));

        return {
          url: `/inventories/my-inventory?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["inventory"],
      transformResponse: (response: TResponseRedux<any[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    listInventoryProduct: builder.mutation({
      query: (data) => ({
        url: "/inventories/list",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["inventory"],
    }),
    updateInventoryPrice: builder.mutation({
      query: ({ id, data }) => ({
        url: `/inventories/update-price/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["inventory"],
    }),
    updateInventoryQuantity: builder.mutation({
      query: ({ id, data }) => ({
        url: `/inventories/update-quantity/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["inventory"],
    }),
  }),
});

export const {
  useGetInventoryByAsinQuery,
  useGetMyInventoryQuery,
  useListInventoryProductMutation,
  useUpdateInventoryPriceMutation,
  useUpdateInventoryQuantityMutation,
} = inventoryApi;
