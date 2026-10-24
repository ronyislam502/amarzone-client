import { TUser } from "./user";

export const FRAUD_STATUS = {
    SAFE: "SAFE",
    PENDING: "PENDING",
    INVESTIGATING: "INVESTIGATING",
    CONFIRMED: "CONFIRMED",
    CLEARED: "CLEARED",
} as const;

export type TFraudStatus = (typeof FRAUD_STATUS)[keyof typeof FRAUD_STATUS];

export type TFraud = {
    _id?: string;
    user: string | TUser;
    score: number;
    reasons: string[];
    status: TFraudStatus;
    reviewedBy?: string | TUser;
    notes?: string;
    isResolved: boolean;
    isDeleted?: boolean;
    createdAt?: string;
    updatedAt?: string;
};
