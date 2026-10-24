import { TResponseRedux } from "@/types/global";
import { TFraud } from "@/types/fraud";
import { baseApi } from "@/redux/api/baseApi";


const fraudApi = baseApi?.injectEndpoints({
    overrideExisting: true,
    endpoints: (builder) => ({
        allFraudAlerts: builder.query({
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
                if (status) {
                    params.append("status", status);
                }


                return {
                    url: "/frauds",
                    method: "GET",
                    params: params,
                };
            },
            providesTags: ["fraud"],
            transformResponse: (response: TResponseRedux<TFraud[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        fraudAlertsByUser: builder.query({
            query: (userId) => ({
                url: `/frauds/user/${userId}`,
                method: "GET",
            }),
            providesTags: ["fraud"],
            transformResponse: (response: TResponseRedux<TFraud[]>) => {
                return {
                    data: response?.data,
                    meta: response?.meta,
                };
            },
        }),
        updateFraudStatus: builder.mutation({
            query: (args) => ({
                url: `/frauds/${args?.id}/status`,
                method: "PATCH",
                body: args?.data,
            }),
            invalidatesTags: ["fraud"],
        }),
        evaluateFraudRisk: builder.mutation({
            query: (data) => ({
                url: "/frauds/evaluate",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["fraud"],
        }),
    }),
});

export const {
    useAllFraudAlertsQuery,
    useFraudAlertsByUserQuery,
    useUpdateFraudStatusMutation,
    useEvaluateFraudRiskMutation,
} = fraudApi;
