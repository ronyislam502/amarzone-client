import { baseApi } from "../../api/baseApi";
import { TResponseRedux } from "@/types/global";
import { TAccountHealth, TSlaViolation } from "@/src/types/health";

const healthApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyHealth: builder.query<TResponseRedux<TAccountHealth>, void>({
      query: () => ({
        url: "/health/my-health",
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
