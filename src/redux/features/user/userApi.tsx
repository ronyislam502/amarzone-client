import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation({
      query: (data) => ({
        url: "/user/create-customer",
        method: "POST",
        body: data,
      }),
    }),
    createVendor: builder.mutation({
      query: (data) => ({
        url: "/user/create-vendor",
        method: "POST",
        body: data,
      }),
    }),
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/user/create-admin",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useCreateVendorMutation,
  useCreateAdminMutation,
} = userApi;
