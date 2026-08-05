import { TResponseRedux } from "@/types/global";
import { baseApi } from "../../api/baseApi";
import { TDepartment } from "@/types/department";

const departmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        allDepartments: builder.query({
            query: ({ search, sort, page, limit, category, minPrice, maxPrice }) => {
                const params = new URLSearchParams();

                if (search) {
                    params.append("searchTerm", search);
                }
                if (category) {
                    params.append("category", category);
                }
                if (minPrice) {
                    params.append("minPrice", String(minPrice));
                }
                if (maxPrice) {
                    params.append("maxPrice", String(maxPrice));
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
                    url: "/departments",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["department"],
            transformResponse: (response: TResponseRedux<TDepartment[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        createFood: builder.mutation({
            query: (departmentInfo) => ({
                url: "/departments/create-department",
                method: "POST",
                body: departmentInfo,
            }),
            invalidatesTags: ["department"],
        }),
        updateFood: builder.mutation({
            query: (args) => ({
                url: `/departments/update/${args?.id}`,
                method: "PATCH",
                body: args.data,
            }),
            invalidatesTags: ["department"],
        }),
    }),
});

export const {
    useAllDepartmentsQuery,
    useCreateFoodMutation,
    useUpdateFoodMutation,
} = departmentApi;
