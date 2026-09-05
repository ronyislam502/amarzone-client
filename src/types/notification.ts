export type TNotificationType =
  | "NEW_ACCOUNT"
  | "NEW_ORDER"
  | "ORDER_DELIVERED"
  | "ORDER_SHIPPED"
  | "payment_success"
  | "payment_failed"
  | "payment_refunded"
  | "fraud_alert"
  | "general"
  | string;

export type TNotification = {
  id: string;
  _id?: string;
  notificationId?: string;
  type: TNotificationType;
  title?: string;
  message: string;
  isRead: boolean;
  relatedId?: string;
  recipientRole?: string;
  recipientId?: string;
  createdAt: string;
};

export type TSocketConnectionStatus =
  | "connected"
  | "connecting"
  | "disconnected"
  | "error";
