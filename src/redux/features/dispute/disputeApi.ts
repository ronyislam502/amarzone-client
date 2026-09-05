import { baseApi } from "@/redux/api/baseApi";

export const disputeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDisputes: builder.query({
            query: (params) => ({
                url: "/disputes",
                method: "GET",
                params,
            }),
            providesTags: ["Disputes"],
        }),

        getSingleDispute: builder.query({
            query: (id: string) => ({
                url: `/disputes/${id}`,
                method: "GET",
            }),
            providesTags: ["Disputes"],
        }),

        updateDisputeStatus: builder.mutation({
            query: ({ id, data }) => ({
                url: `/disputes/${id}/status`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Disputes", "dashboard"],
        }),

        createDisputeDecision: builder.mutation({
            query: (data) => ({
                url: "/dispute-decisions",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Disputes", "dashboard"],
        }),

        getDisputeDecision: builder.query({
            query: (disputeId: string) => ({
                url: `/dispute-decisions/${disputeId}`,
                method: "GET",
            }),
            providesTags: ["Disputes"],
        }),
    }),
});

export const {
    useGetAllDisputesQuery,
    useGetSingleDisputeQuery,
    useUpdateDisputeStatusMutation,
    useCreateDisputeDecisionMutation,
    useGetDisputeDecisionQuery,
} = disputeApi;
