import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  overrideExisting: true,
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
        url: "/users/my-profile",
        method: "GET",
      }),
      providesTags: ["user"],
    }),
    updateVendorProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/vendors/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["user", "vendor"],
    }),
    updateCustomerProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/customers/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["user", "customer"],
    }),
    updateAdminProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admins/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["user", "admin"],
    }),
  }),
});

export const {
  useCreateCustomerMutation,
  useCreateVendorMutation,
  useCreateAdminMutation,
  useMyProfileQuery,
  useUpdateVendorProfileMutation,
  useUpdateCustomerProfileMutation,
  useUpdateAdminProfileMutation,
} = userApi;
