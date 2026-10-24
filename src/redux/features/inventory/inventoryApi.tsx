import { TResponseRedux } from "@/types/global";
import { TInventory, TVariantInventoryData } from "@/types/inventory";
import { baseApi } from "@/redux/api/baseApi";


const inventoryApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        myInventory: builder.query({
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
                    url: "/inventories/my-inventory",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["inventory"],
            transformResponse: (response: TResponseRedux<TInventory[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        getInventoryByVariant: builder.query({
            query: (asin) => ({
                url: `/inventories/variant/${asin}`,
                method: "GET",
            }),
            providesTags: ["inventory"],
            transformResponse: (response: TResponseRedux<TVariantInventoryData>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        listProduct: builder.mutation({
            query: (data) => ({
                url: "/inventories/list-product",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["inventory"],
        }),
        updatePrice: builder.mutation({
            query: (args) => ({
                url: `/inventories/update-price/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["inventory"],
        }),
        updateQuantity: builder.mutation({
            query: (args) => ({
                url: `/inventories/update-quantity/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["inventory"],
        }),
        vendorVariantProducts: builder.query({
            query: (id) => ({
                url: `/inventories/vendor-variant-products/${id}`,
                method: "GET",
            }),
            providesTags: ["inventory"],
            transformResponse: (response: TResponseRedux<any>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
    }),
});


export const {
    useMyInventoryQuery,
    useGetInventoryByVariantQuery,
    useListProductMutation,
    useUpdatePriceMutation,
    useUpdateQuantityMutation,
    useVendorVariantProductsQuery,
} = inventoryApi;
