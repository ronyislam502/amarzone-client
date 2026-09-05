import { baseApi } from "@/redux/api/baseApi";

export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST /chats (Create Conversation)
        createConversation: builder.mutation({
            query: (data: {
                participants: string[];
                conversationType: 'CUSTOMER_VENDOR' | 'CUSTOMER_SUPPORT' | 'VENDOR_SUPPORT';
                order?: string;
                dispute?: string;
            }) => ({
                url: "/chats",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["chats"],
        }),

        // GET /chats (Get User Conversations)
        getUserConversations: builder.query({
            query: (params) => ({
                url: "/chats",
                method: "GET",
                params,
            }),
            providesTags: ["chats"],
        }),

        // GET /chats/:conversationId/messages
        getConversationMessages: builder.query({
            query: ({ conversationId, ...params }) => ({
                url: `/chats/${conversationId}/messages`,
                method: "GET",
                params,
            }),
            providesTags: ["chats"],
        }),

        // POST /chats/messages (Send Message)
        sendMessage: builder.mutation({
            query: (data) => ({
                url: "/chats/messages",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["chats"],
        }),

        // PATCH /chats/:conversationId/read
        markMessagesAsRead: builder.mutation({
            query: (conversationId: string) => ({
                url: `/chats/${conversationId}/read`,
                method: "PATCH",
            }),
            invalidatesTags: ["chats"],
        }),

        // PATCH /chats/:conversationId/archive
        archiveConversation: builder.mutation({
            query: (conversationId: string) => ({
                url: `/chats/${conversationId}/archive`,
                method: "PATCH",
            }),
            invalidatesTags: ["chats"],
        }),

        // DELETE /chats/messages/:messageId
        deleteMessage: builder.mutation({
            query: (messageId: string) => ({
                url: `/chats/messages/${messageId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["chats"],
        }),
    }),
});

export const {
    useCreateConversationMutation,
    useGetUserConversationsQuery,
    useGetConversationMessagesQuery,
    useSendMessageMutation,
    useMarkMessagesAsReadMutation,
    useArchiveConversationMutation,
    useDeleteMessageMutation,
} = chatApi;
