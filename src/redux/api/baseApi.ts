/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BaseQueryApi,
  BaseQueryFn,
  FetchArgs,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { logout, setUser } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { RootState } from "../store";


export const url = process.env.NEXT_PUBLIC_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${url}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    if (token) {
      headers.set("authorization", `${token}`);
    }

    return headers;
  },
});

const baseQueryWithRefreshToken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  // Global error handled removed to allow component-level handling
  if (result?.error?.status === 404) {
    toast.error((result.error.data as { message: string }).message);
  }
  if (result?.error?.status === 403) {
    toast.error((result.error.data as { message: string }).message);
  }

  if (result?.error?.status === 401) {

    const res = await fetch(`${url}/api/v1/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();

    if (data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;

      api.dispatch(
        setUser({
          user,
          token: data?.data?.accessToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshToken,
  tagTypes: [
    "department",
    "category",
    "user",
    "admin",
    "customer",
    "order",
    "dashboard",
    "review",
    "productReview",
    "serviceReview",
    "vendor",
    "product", "variant",
    "inventory",
    "Disputes",
    "dispute",
    "disputeDecision",
    "chats",
    "ai",
    "notification",
    "health",
    "violation",
    "fraud",
  ],
  endpoints: () => ({}),
});
