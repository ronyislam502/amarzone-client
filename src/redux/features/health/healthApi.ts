
import { baseApi } from "@/redux/api/baseApi";
import { TResponseRedux } from "@/types/global";
import { TAccountHealth, TSlaViolation } from "@/types/health";

const healthApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getMyHealth: builder.query<TResponseRedux<TAccountHealth>, void>({
      query: () => ({
        url: "/healths/my-health",
        method: "GET",
      }),
      providesTags: ["health"],
    }),

    getMyViolations: builder.query<TResponseRedux<TSlaViolation[]>, void>({
      query: () => ({
        url: "/violations/my-violations",
        method: "GET",
      }),
      providesTags: ["violation"],
    }),

  }),
});

export const {
  useGetMyHealthQuery,
  useGetMyViolationsQuery,
} = healthApi;
