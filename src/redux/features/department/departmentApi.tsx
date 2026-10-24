import { TResponseRedux } from "@/types/global";
import { TDepartment } from "@/types/department";
import { baseApi } from "@/redux/api/baseApi";


const departmentApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allDepartments: builder.query({
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
        createDepartment: builder.mutation({
            query: (data) => ({
                url: "/departments/create-department",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["department"],
        }),
        updateDepartment: builder.mutation({
            query: (args) => ({
                url: `/departments/update/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["department"],
        }),
        deleteDepartment: builder.mutation({
            query: (id) => ({
                url: `/departments/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["department"],
        }),
    }),
});

export const {
    useAllDepartmentsQuery,
    useCreateDepartmentMutation,
    useUpdateDepartmentMutation,
    useDeleteDepartmentMutation
} = departmentApi;



