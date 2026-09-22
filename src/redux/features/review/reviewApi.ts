import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createProductReview: builder.mutation<
      any,
      { product: string; order: string; rating: number; title?: string; review: string }
    >({
      query: (reviewData) => ({
        url: "/product-reviews/create-review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["review", "product", "order"],
    }),
    createServiceReview: builder.mutation<
      any,
      { customer: string; vendor: string; order: string; rating: number; title?: string; review: string }
    >({
      query: (reviewData) => ({
        url: "/service-reviews/create-service-review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["review", "order"],
    }),
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "/product-reviews/create-review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["review", "product", "order"],
    }),
    allReviews: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));

        return {
          url: `/reviews?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["review"],
      transformResponse: (response: TResponseRedux<any[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    productReviews: builder.query({
      query: (productId: string) => ({
        url: `/product-reviews/${productId}`,
        method: "GET",
      }),
      providesTags: ["review"],
    }),
    myReviews: builder.query({
      query: () => ({
        url: "/reviews/my-reviews",
        method: "GET",
      }),
      providesTags: ["review"],
      transformResponse: (response: TResponseRedux<any[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    vendorReviews: builder.query({
      query: (vendorId: string) => ({
        url: `/reviews/vendor/${vendorId}`,
        method: "GET",
      }),
      providesTags: ["review"],
    }),
    variantReviews: builder.query({
      query: ({ variantId, params }: { variantId: string; params?: Record<string, any> }) => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        const qs = queryParams.toString();
        return {
          url: `/product-reviews/variant-reviews/${variantId}${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["review"],
    }),
  }),
});

export const {
  useCreateProductReviewMutation,
  useCreateServiceReviewMutation,
  useCreateReviewMutation,
  useAllReviewsQuery,
  useProductReviewsQuery,
  useVariantReviewsQuery,
  useMyReviewsQuery,
  useVendorReviewsQuery,
} = reviewApi;
