import { baseApi } from "../../api/baseApi";
import { TResponseRedux } from "@/types/global";
import { TVendor } from "@/types/vendor";

const vendorApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    allVendors: builder.query({
      query: (params) => {
        const urlParams = new URLSearchParams();

        if (params?.search) {
          urlParams.append("searchTerm", params.search);
        }
        if (params?.page) {
          urlParams.append("page", String(params.page));
        }
        if (params?.limit) {
          urlParams.append("limit", String(params.limit));
        }

        return {
          url: "/vendors",
          method: "GET",
          params: urlParams,
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
  }),
});

export const { useAllVendorsQuery } = vendorApi;
