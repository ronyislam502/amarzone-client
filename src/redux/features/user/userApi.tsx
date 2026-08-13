import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createCustomer: builder.mutation({
      query: (data) => ({
        url: "/users/create-customer",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user", "customer"],
    }),
    createVendor: builder.mutation({
      query: (data) => ({
        url: "/users/create-vendor",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user", "vendor"],
    }),
    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/users/create-admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["user", "admin"],
    }),
    myProfile: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
      }),
      providesTags: ["user"],
    })
  }),
});

export const {
  useCreateCustomerMutation,
  useCreateVendorMutation,
  useCreateAdminMutation,
  useMyProfileQuery
} = userApi;
