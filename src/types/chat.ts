export const CONVERSATION_TYPE = {
  NORMAL: "NORMAL",
  ORDER: "ORDER",
  DISPUTE: "DISPUTE",
  SUPPORT: "SUPPORT",
} as const;

export type TConversationType =
  (typeof CONVERSATION_TYPE)[keyof typeof CONVERSATION_TYPE];

export const MESSAGE_TYPE = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
  VIDEO: "VIDEO",
  FILE: "FILE",
} as const;

export type TMessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

export const MESSAGE_STATUS = {
  SENT: "SENT",
  DELIVERED: "DELIVERED",
  READ: "READ",
} as const;

export type TMessageStatus =
  (typeof MESSAGE_STATUS)[keyof typeof MESSAGE_STATUS];

export type TMessageAttachment = {
  url: string;
  type: string;
  fileName: string;
  size: number;
};

export type TParticipant = {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "ADMIN" | "SUPER_ADMIN" | "VENDOR" | "CUSTOMER" | string;
  status?: string;
};

export type TConversation = {
  _id: string;
  participants: TParticipant[];
  conversationType: TConversationType;
  order?: any;
  dispute?: any;
  lastMessage?: any;
  lastMessageSender?: TParticipant | string;
  lastMessageType?: TMessageType;
  lastMessageAt?: string;
  archivedBy?: string[];
  isDeleted?: boolean;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type TMessage = {
  _id: string;
  conversation: string | { _id: string };
  sender: TParticipant;
  message?: string;
  attachments?: TMessageAttachment[];
  messageType: TMessageType;
  status: TMessageStatus;
  readAt?: string;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TSendMessagePayload = {
  conversation: string;
  message?: string;
  messageType?: TMessageType;
  attachments?: TMessageAttachment[];
};

export type TCreateConversationPayload = {
  participants: string[];
  conversationType: TConversationType;
  order?: string;
  dispute?: string;
};

export type TTypingEventPayload = {
  conversationId: string;
  userId: string;
};

export type TMessagesReadEventPayload = {
  conversationId: string;
  readBy: string;
  readAt: string;
};

export type TMessageDeletedEventPayload = {
  messageId: string;
  conversationId?: string;
};
