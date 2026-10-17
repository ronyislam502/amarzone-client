import { baseApi } from "@/redux/api/baseApi";
import { TVariant } from "@/types/product";

export const variantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. router.get("/variant-product/:id", VariantControllers.allVariantsByProduct)
    allVariantsByProduct: builder.query<
      any,
      string | { id: string; params?: Record<string, any> }
    >({
      query: (args) => {
        const id = typeof args === "string" ? args : args.id;
        const params = typeof args === "object" ? args.params : undefined;
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit !== undefined) {
          queryParams.append("limit", String(params.limit));
        } else {
          queryParams.append("limit", "100");
        }
        if (params?.sort) queryParams.append("sort", params.sort);
        const qs = queryParams.toString();

        return {
          url: `/variants/variant-product/${id}${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: ["product"],
    }),
  }),
});

export const {
  useAllVariantsByProductQuery,
  useLazyAllVariantsByProductQuery,
} = variantApi;
