import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";
import { TVariantRanking } from "@/types/ranking";

const rankingApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getVariantRanking: builder.query<TResponseRedux<TVariantRanking>, string | undefined | void>({
      query: (id) => ({
        url: `/rankings/${id}`,
        method: "GET",
      }),
      providesTags: ["ranking"],
    }),
  }),
});

export const { useGetVariantRankingQuery } = rankingApi;
