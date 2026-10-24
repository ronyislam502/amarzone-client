import { TResponseRedux } from "@/types/global";
import { TVariant } from "@/types/variant";
import { baseApi } from "@/redux/api/baseApi";


const variantApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allVariantsByProduct: builder.query({
            query: (id) => ({
                url: `/variants/variant-product/${id}`,
                method: "GET",
            }),
            providesTags: ["variant"],
            transformResponse: (response: TResponseRedux<TVariant[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        createVariant: builder.mutation({
            query: (data) => ({
                url: "/variants/create-variant",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["variant", "product"],
        }),

    }),
});

export const {
    useAllVariantsByProductQuery,
    useCreateVariantMutation,
} = variantApi;
