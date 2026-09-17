import { baseApi } from "../../api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: (params) => ({
        url: "/notifications",
        method: "GET",
        params,
      }),
      providesTags: ["notification"],
    }),
    markAsRead: builder.mutation({
      query: (id: string) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),
    markAllAsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/notifications/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["notification"],
    }),
    clearAllNotifications: builder.mutation<any, void>({
      query: () => ({
        url: "/notifications/clear-all",
        method: "DELETE",
      }),
      invalidatesTags: ["notification"],
    }),
    deleteNotification: builder.mutation({
      query: (id: string) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["notification"],
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useClearAllNotificationsMutation,
  useDeleteNotificationMutation,
} = notificationApi;

