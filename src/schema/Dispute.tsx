import { z } from "zod";

export const disputeDecisionSchema = z.object({
  decision: z.enum(["REFUNDED", "REJECTED"], {
    message: "Arbitration decision is required",
  }),
  notes: z.string().min(5, "Arbitration notes must be at least 5 characters"),
});

export const updateDisputeStatusSchema = z.object({
  status: z.enum(["OPEN", "UNDER_REVIEW", "RESOLVED", "REJECTED"], {
    message: "Status is required",
  }),
});
