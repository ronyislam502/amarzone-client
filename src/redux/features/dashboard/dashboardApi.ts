import { baseApi } from "../../api/baseApi";


const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    dashboardStats: builder.query({
      query: (params?: { range?: string; startDate?: string; endDate?: string }) => {
        const queryParams = new URLSearchParams();
        if (params?.range) queryParams.append("range", params.range);
        if (params?.startDate) queryParams.append("startDate", params.startDate);
        if (params?.endDate) queryParams.append("endDate", params.endDate);

        const queryString = queryParams.toString();
        return {
          url: queryString ? `/dashboard/stats?${queryString}` : "/dashboard/stats",
          method: "GET",
        };
      },
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useDashboardStatsQuery } = dashboardApi;
