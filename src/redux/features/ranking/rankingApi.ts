import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";
import { TVariantRanking } from "@/types/ranking";

const rankingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getVariantRanking: builder.query<TResponseRedux<TVariantRanking>, string | undefined | void>({
      query: (id) => ({
        url: `/rankings/${id}`,
        method: "GET",
      }),
      providesTags: ["ranking"],
    }),
    getBestSellingProducts: builder.query<TResponseRedux<any[]>, { page?: number; limit?: number } | number | void>({
      query: (args) => {
        const params = new URLSearchParams();
        if (typeof args === "object" && args !== null) {
          if (args.page) params.append("page", String(args.page));
          if (args.limit) params.append("limit", String(args.limit));
        } else if (typeof args === "number") {
          params.append("limit", String(args));
        }
        return {
          url: "/rankings/best-selling-products",
          method: "GET",
          params,
        };
      },
      providesTags: ["ranking"],
    }),
    getBestSellingDepartmentProducts: builder.query<TResponseRedux<any[]>, { departmentId?: string; id?: string; page?: number; limit?: number } | string>({
      query: (args) => {
        const departmentId = typeof args === "string" ? args : args?.departmentId || args?.id;
        const params = new URLSearchParams();
        if (typeof args === "object" && args !== null) {
          if (args.page) params.append("page", String(args.page));
          if (args.limit) params.append("limit", String(args.limit));
        }
        return {
          url: `/rankings/best-selling-department/${departmentId}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["ranking"],
    }),
    getBestSellingCategoryProducts: builder.query<TResponseRedux<any[]>, { categoryId?: string; id?: string; page?: number; limit?: number } | string>({
      query: (args) => {
        const categoryId = typeof args === "string" ? args : args?.categoryId || args?.id;
        const params = new URLSearchParams();
        if (typeof args === "object" && args !== null) {
          if (args.page) params.append("page", String(args.page));
          if (args.limit) params.append("limit", String(args.limit));
        }
        return {
          url: `/rankings/best-selling-category/${categoryId}`,
          method: "GET",
          params,
        };
      },
      providesTags: ["ranking"],
    }),
  }),
});

export const {
  useGetVariantRankingQuery,
  useGetBestSellingProductsQuery,
  useGetBestSellingDepartmentProductsQuery,
  useGetBestSellingCategoryProductsQuery,
} = rankingApi;

