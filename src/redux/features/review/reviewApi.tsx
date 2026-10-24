import { TResponseRedux } from "@/types/global";
import { TProductReview, TServiceReview } from "@/types/review";
import { baseApi } from "@/redux/api/baseApi";


const reviewApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allReviewsByProduct: builder.query({
            query: (id) => ({
                url: `/product-reviews/variant-reviews/${id}`,
                method: "GET",
            }),
            providesTags: ["review"],
            transformResponse: (response: TResponseRedux<TProductReview[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        createProductReview: builder.mutation({
            query: (data) => ({
                url: "/product-reviews/create-review",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["review"],
        }),
        updateProductReview: builder.mutation({
            query: (args) => ({
                url: `/product-reviews/update/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["review"],
        }),
        deleteProductReview: builder.mutation({
            query: (id) => ({
                url: `/product-reviews/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["review"],
        }),
        allServiceReviewsByVendor: builder.query({
            query: (id) => ({
                url: `/service-reviews/vendor/${id}`,
                method: "GET",
            }),
            providesTags: ["review"],
            transformResponse: (response: TResponseRedux<TServiceReview[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        createServiceReview: builder.mutation({
            query: (data) => ({
                url: "/service-reviews/create-service-review",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["review"],
        }),
    }),
});

export const {
    useAllReviewsByProductQuery,
    useCreateProductReviewMutation,
    useUpdateProductReviewMutation,
    useDeleteProductReviewMutation,
    useAllServiceReviewsByVendorQuery,
    useCreateServiceReviewMutation,
} = reviewApi;
