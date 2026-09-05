/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseApi } from "@/redux/api/baseApi";

export interface TProductContentInput {
  title: string;
  category: string;
  brand: string;
  features: string[] | string;
  specifications?: Record<string, any> | Array<{ key: string; value: string }>;
  targetAudience?: string;
  tone?: string;
  keywords?: string[];
}

export interface TProductContentOutput {
  seoTitle: string;
  seoDescription: string;
  shortDescription: string;
  longDescription: string;
  bulletFeatures: string[];
  keywords: string[];
  tags: string[];
}

export interface TShoppingAssistantInput {
  message: string;
  chatHistory?: Array<{ role: "system" | "user" | "assistant"; content: string }>;
  context?: {
    category?: string;
    budget?: number;
    currency?: string;
    preferredBrands?: string[];
    userPreferences?: Record<string, any>;
    currentProductId?: string;
  };
  filters?: {
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    category?: string;
    rating?: number;
  };
}

export interface TShoppingAssistantOutput {
  reply: string;
  intent: "search" | "comparison" | "recommendation" | "general_inquiry" | "support";
  extractedCriteria?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
    brand?: string;
    keywords?: string[];
    keyAttributes?: Record<string, string>;
  };
  suggestions: string[];
  comparisons?: Array<{
    item: string;
    pros: string[];
    cons: string[];
    verdict: string;
  }>;
  recommendedCategories?: string[];
}

export interface TDashboardInsightsInput {
  stats: Record<string, any>;
  timeframe?: "daily" | "weekly" | "monthly" | "yearly" | "custom";
  focusArea?: "all" | "revenue" | "operations" | "vendor_performance" | "customer_satisfaction";
  comparisonTimeframe?: string;
}

export interface TDashboardInsightsOutput {
  executiveSummary: string;
  businessInsights: Array<{ category: string; observation: string; impact: string } | string>;
  recommendations: Array<{
    title: string;
    action: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    expectedImpact: string;
  }>;
  warnings: Array<{
    alert: string;
    severity: "CRITICAL" | "WARNING" | "INFO";
    metricTrigger: string;
    suggestedRemediation: string;
  }>;
  growthOpportunities: Array<{
    opportunity: string;
    estimatedPotential: string;
    actionableNextStep: string;
  }>;
  naturalLanguageReport: string;
}

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateProductContent: builder.mutation<
      { success: boolean; message: string; data: TProductContentOutput },
      TProductContentInput
    >({
      query: (payload) => ({
        url: "/ai/product-content",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ai"],
    }),

    chatShoppingAssistant: builder.mutation<
      { success: boolean; message: string; data: TShoppingAssistantOutput },
      TShoppingAssistantInput
    >({
      query: (payload) => ({
        url: "/ai/shopping-assistant",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ai"],
    }),

    getDashboardInsights: builder.mutation<
      { success: boolean; message: string; data: TDashboardInsightsOutput },
      TDashboardInsightsInput
    >({
      query: (payload) => ({
        url: "/ai/dashboard-insights",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ai"],
    }),

    moderateReview: builder.mutation<
      { success: boolean; message: string; data: any },
      { reviewText: string; rating: number; productTitle?: string }
    >({
      query: (payload) => ({
        url: "/ai/review-moderation",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ai"],
    }),

    analyzeFraudRisk: builder.mutation<
      { success: boolean; message: string; data: any },
      any
    >({
      query: (payload) => ({
        url: "/ai/fraud-analysis",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ai"],
    }),
  }),
});

export const {
  useGenerateProductContentMutation,
  useChatShoppingAssistantMutation,
  useGetDashboardInsightsMutation,
  useModerateReviewMutation,
  useAnalyzeFraudRiskMutation,
} = aiApi;
