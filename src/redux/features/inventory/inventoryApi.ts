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
      query: (params?: { search?: string; sort?: string; page?: number | string; limit?: number | string }) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.sort) queryParams.append("sort", params.sort);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit !== undefined && params?.limit !== null) queryParams.append("limit", String(params.limit));

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
    getVendorInventory: builder.query({
      query: (args: string | { id: string; params?: { search?: string; searchTerm?: string; sort?: string; page?: number | string; limit?: number | string } }) => {
        const vendorId = typeof args === "string" ? args : args.id;
        const params = typeof args === "object" ? args.params : undefined;
        const queryParams = new URLSearchParams();
        if (params?.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        else if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.sort) queryParams.append("sort", params.sort);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit !== undefined && params?.limit !== null)
          queryParams.append("limit", String(params.limit));

        const qs = queryParams.toString();
        return {
          url: `/inventories/ven-inventory/${vendorId}${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["inventory"],
    }),
  }),
});

export const {
  useGetInventoryByAsinQuery,
  useGetMyInventoryQuery,
  useGetVendorInventoryQuery,
  useListInventoryProductMutation,
  useUpdateInventoryPriceMutation,
  useUpdateInventoryQuantityMutation,
} = inventoryApi;
