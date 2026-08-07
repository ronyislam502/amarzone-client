import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    logIn: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    changePassword: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/change-password",
        method: "POST",
        body: userInfo,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (args: { data?: any; email?: string; newPassword?: string; token?: string } | any) => {
        const body = args.data ? args.data : { email: args.email, newPassword: args.newPassword };
        const token = args.token;
        return {
          url: "/auth/reset-password",
          method: "POST",
          body,
          headers: token ? { authorization: token } : undefined,
        };
      },
    }),
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
  }),
});

export const {
  useLogInMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useCreateCustomerMutation,
  useCreateVendorMutation,
} = authApi;

