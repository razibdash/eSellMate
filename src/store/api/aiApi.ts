import type { AiGeneration, AiInsight, AiOutput, CaptionPayload, ReplyPayload } from "@/types/ai";
import { baseApi } from "./baseApi";

export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateCaption: builder.mutation<AiOutput, CaptionPayload>({ query: (body) => ({ url: "/ai/caption", method: "POST", body }), invalidatesTags: ["AI"] }),
    generateReply: builder.mutation<AiOutput, ReplyPayload>({ query: (body) => ({ url: "/ai/reply", method: "POST", body }), invalidatesTags: ["AI"] }),
    getAiInsights: builder.query<AiInsight[], void>({ query: () => "/ai/insights", providesTags: ["AI"] }),
    generateAiInsights: builder.mutation<AiInsight[], void>({ query: () => ({ url: "/ai/insights/generate", method: "POST" }), invalidatesTags: ["AI", "Report"] }),
    getAiHistory: builder.query<AiGeneration[], void>({ query: () => "/ai/history", providesTags: ["AI"] })
  })
});

export const { useGenerateCaptionMutation, useGenerateReplyMutation, useGetAiInsightsQuery, useGenerateAiInsightsMutation, useGetAiHistoryQuery } = aiApi;
