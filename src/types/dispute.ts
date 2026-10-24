import { TOrder } from "./order";
import { TUser } from "./user";

export const DISPUTE_STATUS = {
  OPEN: "OPEN",
  UNDER_REVIEW: "UNDER_REVIEW",
  RESOLVED: "RESOLVED",
  REJECTED: "REJECTED",
} as const;

export type TDisputeStatus = (typeof DISPUTE_STATUS)[keyof typeof DISPUTE_STATUS];

export const DECISION_TYPE = {
  REFUNDED: "REFUNDED",
  REJECTED: "REJECTED",
} as const;

export type TDecisionType = (typeof DECISION_TYPE)[keyof typeof DECISION_TYPE];

export interface TDisputeUser {
  _id: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface TDispute {
  _id: string;
  order: string | TOrder;
  customer: string | TDisputeUser | TUser;
  vendor: string | TDisputeUser | TUser;
  reason: string;
  details: string;
  evidenceUrls?: string[];
  status: TDisputeStatus;
  resolvedBy?: string | TDisputeUser | TUser;
  createdAt?: string;
  updatedAt?: string;
}

export interface TDisputeDecision {
  _id: string;
  dispute: string | TDispute;
  resolvedBy: string | TDisputeUser | TUser;
  decision: TDecisionType;
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TCreateDisputePayload {
  order: string;
  reason: string;
  details: string;
  evidenceUrls?: string[];
}

export interface TUpdateDisputeStatusArgs {
  id: string;
  data: {
    status?: TDisputeStatus;
    resolvedBy?: string;
  };
}

export interface TCreateDisputeDecisionPayload {
  dispute: string;
  decision: TDecisionType;
  notes: string;
}

export interface TDisputeQueryParams {
  search?: string;
  searchTerm?: string;
  sort?: string;
  page?: string | number;
  limit?: string | number;
  status?: TDisputeStatus | string;
  [key: string]: string | number | boolean | undefined;
}
