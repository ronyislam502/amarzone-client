import { baseApi } from "@/redux/api/baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allProducts: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));
        if (params?.category && params.category !== "all") queryParams.append("category", params.category);
        if (params?.department) queryParams.append("department", params.department);
        if (params?.brands && params.brands.length > 0) queryParams.append("brands", params.brands.join(","));
        if (params?.minRating) queryParams.append("minRating", params.minRating);
        if (params?.inStock) queryParams.append("inStock", "true");
        if (params?.minPrice) queryParams.append("minPrice", params.minPrice);
        if (params?.maxPrice) queryParams.append("maxPrice", params.maxPrice);
        if (params?.sort) queryParams.append("sort", params.sort);

        return {
          url: `/products?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["product"],
    }),

    singleProduct: builder.query({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
      providesTags: ["product"],
    }),
    myProducts: builder.query({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.append("searchTerm", params.search);
        if (params?.page) queryParams.append("page", String(params.page));
        if (params?.limit) queryParams.append("limit", String(params.limit));

        return {
          url: `/products/my-products?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["product"],
    }),

    productsByDepartment: builder.query({
      query: (params) => {
        const { id, ...rest } = params;
        const queryParams = new URLSearchParams();
        if (rest?.page) queryParams.append("page", String(rest.page));
        if (rest?.limit) queryParams.append("limit", String(rest.limit));
        if (rest?.category && rest.category !== "all") queryParams.append("category", rest.category);
        if (rest?.brands && rest.brands.length > 0) queryParams.append("brands", rest.brands.join(","));
        if (rest?.minRating) queryParams.append("minRating", rest.minRating);
        if (rest?.inStock) queryParams.append("inStock", "true");
        if (rest?.minPrice) queryParams.append("minPrice", rest.minPrice);
        if (rest?.maxPrice) queryParams.append("maxPrice", rest.maxPrice);
        if (rest?.sort) queryParams.append("sort", rest.sort);

        return {
          url: `/products/productsbydepartment/${id}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["product"],
    }),

    productsByCategory: builder.query({
      query: (params) => {
        const { id, ...rest } = params;
        const queryParams = new URLSearchParams();
        if (rest?.page) queryParams.append("page", String(rest.page));
        if (rest?.limit) queryParams.append("limit", String(rest.limit));
        if (rest?.brands && rest.brands.length > 0) queryParams.append("brands", rest.brands.join(","));
        if (rest?.minRating) queryParams.append("minRating", rest.minRating);
        if (rest?.inStock) queryParams.append("inStock", "true");
        if (rest?.minPrice) queryParams.append("minPrice", rest.minPrice);
        if (rest?.maxPrice) queryParams.append("maxPrice", rest.maxPrice);
        if (rest?.sort) queryParams.append("sort", rest.sort);

        return {
          url: `/products/productsbycategory/${id}?${queryParams.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["product"],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products/create-product",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["product"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `/products/update-product/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ["product", { type: "product", id }],
    }),

    createVariant: builder.mutation({
      query: (data) => ({
        url: "/variants/create-variant",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["product"],
    }),
  }),
});

export const {
  useAllProductsQuery,
  useSingleProductQuery,
  useMyProductsQuery,
  useProductsByDepartmentQuery,
  useProductsByCategoryQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useCreateVariantMutation,
} = productApi;

