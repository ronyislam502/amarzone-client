import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";



const productApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allProducts: builder.query({
            query: ({ search, sort, page, limit, status, department }) => {
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
                if (department) {
                    params.append("department", department);
                }


                return {
                    url: "/products",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["product"],
            transformResponse: (response: TResponseRedux<any[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        allVariantProducts: builder.query({
            query: ({ search, sort, page, limit, status }) => {
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
                    url: "/products/all-variant-products",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["product"],
            transformResponse: (response: TResponseRedux<any[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/products/create-product",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["product"],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["product"],
        }),
        updateProduct: builder.mutation({
            query: (args) => ({
                url: `/products/update-product/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["product"],
        }),
        allProductsByDepartment: builder.query({
            query: (id) => ({
                url: `/products/department/${id}`,
                method: "GET",
            }),
            providesTags: ["product", "department"],
            transformResponse: (response: TResponseRedux<any[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        allProductsByCategory: builder.query({
            query: (id) => ({
                url: `/products/category/${id}`,
                method: "GET",
            }),
            providesTags: ["product", "category"],
            transformResponse: (response: TResponseRedux<any[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        singleProduct: builder.query({
            query: (id) => ({
                url: `/products/${id}`,
                method: "GET",
            }),
            providesTags: ["product"],
            transformResponse: (response: TResponseRedux<any>) => {
                return {
                    data: response?.data,
                };
            },
        }),
    }),
});

export const {
    useAllProductsQuery,
    useAllVariantProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useUpdateProductMutation,
    useAllProductsByDepartmentQuery,
    useAllProductsByCategoryQuery,
    useSingleProductQuery,
} = productApi;




