export type TAccountHealthStatus = "HEALTHY" | "AT_RISK" | "CRITICAL" | "SUSPENDED";

export interface TAccountHealth {
  _id?: string;
  vendor: string;
  orderDefectRate: number;
  lateShipmentRate: number;
  cancellationRate: number;
  validTrackingRate: number;
  score: number;
  status: TAccountHealthStatus;
  calculatedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TSlaSeverity = "WARNING" | "SUSPENSION";

export interface TSlaViolation {
  _id?: string;
  vendor: string;
  metric: string;
  actualValue: number;
  severity: TSlaSeverity;
  isResolved: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TBuyBoxRequirement {
  id: string;
  name: string;
  current: number | string;
  target: string;
  isMet: boolean;
  unit?: string;
  description: string;
}
