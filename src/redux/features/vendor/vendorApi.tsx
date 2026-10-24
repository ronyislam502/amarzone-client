import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";
import { TVendor } from "@/types/vendor";



const vendorApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allVendors: builder.query({
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
                    url: "/vendors",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["vendor"],
            transformResponse: (response: TResponseRedux<TVendor[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        singleVendor: builder.query({
            query: (id) => ({
                url: `/vendors/vendor/${id}`,
                method: "GET",
            }),
            providesTags: ["vendor"],
        }),
        deleteVendor: builder.mutation({
            query: (id) => ({
                url: `/vendors/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["vendor"],
        }),
        updateVendor: builder.mutation({
            query: (args) => ({
                url: `/vendors/update/${args?.id}`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["vendor", "user"],
        }),
    }),
});

export const {
    useAllVendorsQuery,
    useSingleVendorQuery,
    useUpdateVendorMutation,
    useDeleteVendorMutation,
} = vendorApi;



