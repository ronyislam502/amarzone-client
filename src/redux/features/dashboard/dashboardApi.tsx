import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";

const dashboardApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        dashboardStats: builder.query({
            query: ({ range, startDate, endDate }: any = {}) => {
                const params = new URLSearchParams();

                if (range) {
                    params.append("range", range);
                }
                if (startDate) {
                    params.append("startDate", startDate);
                }
                if (endDate) {
                    params.append("endDate", endDate);
                }

                return {
                    url: "/dashboard/stats",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["dashboard"],
            transformResponse: (response: TResponseRedux<any>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
    }),
});

export const { useDashboardStatsQuery } = dashboardApi;