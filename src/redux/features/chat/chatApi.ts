import { baseApi } from "@/redux/api/baseApi";
import { emitSocketWithAck, getSocket } from "@/src/lib/socket";
import {
  TConversation,
  TMessage,
  TSendMessagePayload,
  TCreateConversationPayload,
} from "@/src/types/chat";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // CREATE CONVERSATION
    createConversation: builder.mutation<
      { data: TConversation },
      TCreateConversationPayload
    >({
      queryFn: async (payload) => {
        try {
          const res = await emitSocketWithAck<TConversation>(
            "createConversation",
            payload
          );
          if (res?.success) {
            return { data: { data: res.data as TConversation } };
          }
          return {
            error: {
              status: res?.statusCode || 400,
              data: res?.message || "Failed to create conversation",
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: err?.message || "Error creating conversation",
            },
          };
        }
      },
      invalidatesTags: ["chats"],
    }),

    // GET USER CONVERSATIONS
    getUserConversations: builder.query<
      { data: TConversation[] },
      Record<string, any> | void
    >({
      queryFn: async (params) => {
        try {
          const res = await emitSocketWithAck<TConversation[]>(
            "getUserConversations",
            params || {}
          );
          if (res?.success) {
            return { data: { data: res.data || [] } };
          }
          return {
            error: {
              status: res?.statusCode || 400,
              data: res?.message || "Failed to retrieve conversations",
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: err?.message || "Error retrieving conversations",
            },
          };
        }
      },
      providesTags: ["chats"],
      async onCacheEntryAdded(
        _,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          const socket = getSocket();

          const handleNewMessage = (newMsg: TMessage) => {
            updateCachedData((draft) => {
              if (!draft?.data) return;
              const convId =
                typeof newMsg.conversation === "string"
                  ? newMsg.conversation
                  : (newMsg.conversation as any)?._id;

              const convIndex = draft.data.findIndex((c) => c._id === convId);
              if (convIndex !== -1) {
                const conv = draft.data[convIndex];
                conv.lastMessage = newMsg._id as any;
                conv.lastMessageSender = newMsg.sender as any;
                conv.lastMessageType = newMsg.messageType;
                conv.lastMessageAt = newMsg.createdAt;
                // Move updated conversation to the top
                draft.data.splice(convIndex, 1);
                draft.data.unshift(conv);
              }
            });
          };

          const handleNewConversation = (newConv: TConversation) => {
            updateCachedData((draft) => {
              if (!draft?.data) return;
              if (!draft.data.some((c) => c._id === newConv._id)) {
                draft.data.unshift(newConv);
              }
            });
          };

          socket.on("new_message", handleNewMessage);
          socket.on("newMessage", handleNewMessage);
          socket.on("new_conversation", handleNewConversation);
          socket.on("newConversation", handleNewConversation);

          await cacheEntryRemoved;

          socket.off("new_message", handleNewMessage);
          socket.off("newMessage", handleNewMessage);
          socket.off("new_conversation", handleNewConversation);
          socket.off("newConversation", handleNewConversation);
        } catch {
          // Socket lifecycle completed
        }
      },
    }),

    // GET CONVERSATION MESSAGES
    getConversationMessages: builder.query<
      { data: TMessage[]; meta?: any },
      {
        conversationId: string;
        page?: number | string;
        limit?: number | string;
        [key: string]: any;
      }
    >({
      queryFn: async ({ conversationId, ...params }) => {
        try {
          const res = await emitSocketWithAck<TMessage[]>(
            "getConversationMessages",
            {
              conversationId,
              query: params,
            }
          );
          if (res?.success) {
            return {
              data: {
                data: res.data || [],
                meta: res.meta,
              },
            };
          }
          return {
            error: {
              status: res?.statusCode || 400,
              data: res?.message || "Failed to retrieve messages",
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: err?.message || "Error retrieving messages",
            },
          };
        }
      },
      providesTags: ["chats"],
      async onCacheEntryAdded(
        { conversationId },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        try {
          await cacheDataLoaded;
          const socket = getSocket();

          const handleNewMessage = (newMsg: TMessage) => {
            const msgConvId =
              typeof newMsg.conversation === "string"
                ? newMsg.conversation
                : (newMsg.conversation as any)?._id;

            if (msgConvId === conversationId) {
              updateCachedData((draft) => {
                if (
                  draft?.data &&
                  !draft.data.some((m) => m._id === newMsg._id)
                ) {
                  draft.data.push(newMsg);
                  if (draft.meta)
                    draft.meta.total = (draft.meta.total || 0) + 1;
                }
              });
            }
          };

          const handleMessagesRead = (payload: {
            conversationId: string;
            readBy: string;
            readAt: string;
          }) => {
            if (payload.conversationId === conversationId) {
              updateCachedData((draft) => {
                if (draft?.data) {
                  draft.data.forEach((m) => {
                    if (m.status !== "READ") {
                      m.status = "READ";
                      m.readAt = payload.readAt;
                    }
                  });
                }
              });
            }
          };

          const handleMessageDeleted = (payload: {
            messageId: string;
            conversationId?: string;
          }) => {
            if (
              !payload.conversationId ||
              payload.conversationId === conversationId
            ) {
              updateCachedData((draft) => {
                if (draft?.data) {
                  const idx = draft.data.findIndex(
                    (m) => m._id === payload.messageId
                  );
                  if (idx !== -1) {
                    draft.data.splice(idx, 1);
                    if (draft.meta && draft.meta.total) draft.meta.total -= 1;
                  }
                }
              });
            }
          };

          socket.on("new_message", handleNewMessage);
          socket.on("newMessage", handleNewMessage);
          socket.on("messages_read", handleMessagesRead);
          socket.on("messagesRead", handleMessagesRead);
          socket.on("message_deleted", handleMessageDeleted);
          socket.on("messageDeleted", handleMessageDeleted);

          await cacheEntryRemoved;

          socket.off("new_message", handleNewMessage);
          socket.off("newMessage", handleNewMessage);
          socket.off("messages_read", handleMessagesRead);
          socket.off("messagesRead", handleMessagesRead);
          socket.off("message_deleted", handleMessageDeleted);
          socket.off("messageDeleted", handleMessageDeleted);
        } catch {
          // Socket lifecycle completed
        }
      },
    }),

    // SEND MESSAGE
    sendMessage: builder.mutation<
      { data: TMessage },
      TSendMessagePayload
    >({
      queryFn: async (payload) => {
        try {
          const res = await emitSocketWithAck<TMessage>("sendMessage", payload);
          if (res?.success) {
            return { data: { data: res.data as TMessage } };
          }
          return {
            error: {
              status: res?.statusCode || 400,
              data: res?.message || "Failed to send message",
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: err?.message || "Error sending message",
            },
          };
        }
      },
      invalidatesTags: ["chats"],
    }),

    // MARK MESSAGES AS READ
    markMessagesAsRead: builder.mutation<
      { data: any },
      string
    >({
      queryFn: async (conversationId: string) => {
        try {
          const res = await emitSocketWithAck("markMessagesAsRead", {
            conversationId,
          });
          if (res?.success) {
            return { data: { data: res.data } };
          }
          return {
            error: {
              status: res?.statusCode || 400,
              data: res?.message || "Failed to mark messages as read",
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: err?.message || "Error marking messages as read",
            },
          };
        }
      },
      invalidatesTags: ["chats"],
    }),

    // ARCHIVE CONVERSATION
    archiveConversation: builder.mutation<
      { data: any },
      string
    >({
      queryFn: async (conversationId: string) => {
        try {
          const res = await emitSocketWithAck("archiveConversation", {
            conversationId,
          });
          if (res?.success) {
            return { data: { data: res.data } };
          }
          return {
            error: {
              status: res?.statusCode || 400,
              data: res?.message || "Failed to archive conversation",
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: err?.message || "Error archiving conversation",
            },
          };
        }
      },
      invalidatesTags: ["chats"],
    }),

    // DELETE MESSAGE
    deleteMessage: builder.mutation<
      { data: any },
      string | { messageId: string; conversationId?: string }
    >({
      queryFn: async (arg) => {
        try {
          const payload =
            typeof arg === "string" ? { messageId: arg } : arg;
          const res = await emitSocketWithAck("deleteMessage", payload);
          if (res?.success) {
            return { data: { data: res.data } };
          }
          return {
            error: {
              status: res?.statusCode || 400,
              data: res?.message || "Failed to delete message",
            },
          };
        } catch (err: any) {
          return {
            error: {
              status: "CUSTOM_ERROR",
              data: err?.message || "Error deleting message",
            },
          };
        }
      },
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
