import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews/create-review",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["review", "product"],
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
  }),
});

export const {
  useCreateReviewMutation,
  useAllReviewsQuery,
  useProductReviewsQuery,
  useMyReviewsQuery,
  useVendorReviewsQuery,
} = reviewApi;
