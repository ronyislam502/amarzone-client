import { baseApi } from "@/redux/api/baseApi";
import {
    TDashboardInsightsInput,
    TDashboardInsightsOutput,
    TFraudAnalysisInput,
    TFraudAnalysisOutput,
    TProductContentInput,
    TProductContentOutput,
    TReviewModerationInput,
    TReviewModerationOutput,
    TShoppingAssistantInput,
    TShoppingAssistantOutput,
} from "@/types/artificial";


const artificialApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        generateProductContent: builder.mutation<
            { success: boolean; message: string; data: TProductContentOutput },
            TProductContentInput | FormData
        >({
            query: (payload) => ({
                url: "/artificial/product-content",
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
                url: "/artificial/shopping-assistant",
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
                url: "/artificial/dashboard-insights",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["ai"],
        }),

        moderateReview: builder.mutation<
            { success: boolean; message: string; data: TReviewModerationOutput },
            TReviewModerationInput
        >({
            query: (payload) => ({
                url: "/artificial/review-moderation",
                method: "POST",
                body: payload,
            }),
            invalidatesTags: ["ai"],
        }),

        analyzeFraudRisk: builder.mutation<
            { success: boolean; message: string; data: TFraudAnalysisOutput },
            TFraudAnalysisInput
        >({
            query: (payload) => ({
                url: "/artificial/fraud-analysis",
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
} = artificialApi;
