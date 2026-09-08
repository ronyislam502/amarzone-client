import { baseApi } from "../../api/baseApi";
import { TResponseRedux } from "@/types/global";
import { TVendor } from "@/types/vendor";

const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allVendors: builder.query({
      query: (params) => {
        const urlParams = new URLSearchParams();
        if (params?.search) urlParams.append("searchTerm", params.search);
        if (params?.page) urlParams.append("page", String(params.page));
        if (params?.limit) urlParams.append("limit", String(params.limit));
        return { url: "/vendors", method: "GET", params: urlParams };
      },
      providesTags: ["vendor"],
      transformResponse: (response: TResponseRedux<TVendor[]>) => ({
        data: response?.data,
        meta: response?.meta,
      }),
    }),

    singleVendor: builder.query({
      query: (id: string) => ({
        url: `/vendors/single/${id}`,
        method: "GET",
      }),
      providesTags: ["vendor"],
    }),

    updateVendor: builder.mutation({
      query: ({ id, data }) => ({
        url: `/vendors/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["vendor"],
    }),

    deleteVendor: builder.mutation({
      query: (id: string) => ({
        url: `/vendors/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["vendor"],
    }),
  }),
});

export const {
  useAllVendorsQuery,
  useSingleVendorQuery,
  useUpdateVendorMutation,
  useDeleteVendorMutation,
} = vendorApi;

