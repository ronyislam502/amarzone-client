import { TResponseRedux } from "@/types/global";
import { TDispute, TDisputeDecision } from "@/types/dispute";
import { baseApi } from "@/redux/api/baseApi";


const disputeApi = baseApi?.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    allDisputes: builder.query({
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
          url: "/disputes",
          method: "GET",
          params: params,
        };
      },
      providesTags: ["dispute"],
      transformResponse: (response: TResponseRedux<TDispute[]>) => {
        return {
          data: response?.data,
          meta: response?.meta,
        };
      },
    }),
    singleDispute: builder.query({
      query: (id) => ({
        url: `/disputes/${id}`,
        method: "GET",
      }),
      providesTags: ["dispute"],
      transformResponse: (response: TResponseRedux<TDispute>) => {
        return {
          data: response?.data,
        };
      },
    }),
    createDispute: builder.mutation({
      query: (data) => ({
        url: "/disputes/create-dispute",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dispute", "order"],
    }),
    updateDisputeStatus: builder.mutation({
      query: (args) => ({
        url: `/disputes/${args?.id}/status`,
        method: "PATCH",
        body: args?.data,
      }),
      invalidatesTags: ["dispute"],
    }),
    createDisputeDecision: builder.mutation({
      query: (data) => ({
        url: "/dispute-decisions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["dispute", "disputeDecision"],
    }),
    getDecisionByDisputeId: builder.query({
      query: (disputeId) => ({
        url: `/dispute-decisions/${disputeId}`,
        method: "GET",
      }),
      providesTags: ["disputeDecision"],
      transformResponse: (response: TResponseRedux<TDisputeDecision>) => {
        return {
          data: response?.data,
        };
      },
    }),
  }),
});

export const {
  useAllDisputesQuery,
  useSingleDisputeQuery,
  useCreateDisputeMutation,
  useUpdateDisputeStatusMutation,
  useCreateDisputeDecisionMutation,
  useGetDecisionByDisputeIdQuery,
} = disputeApi;
