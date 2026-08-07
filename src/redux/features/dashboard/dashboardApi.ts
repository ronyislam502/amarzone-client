import { baseApi } from "../../api/baseApi";


const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    dashboardStats: builder.query({
      query: () => ({
        url: "/dashboard/stats",
        method: "GET",
      }),
      providesTags: ["dashboard"],
    }),
  }),
});

export const { useDashboardStatsQuery } = dashboardApi;
