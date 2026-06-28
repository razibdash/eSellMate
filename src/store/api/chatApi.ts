import type {
  ChatMessage,
  GetOrCreateRoomPayload,
  GetOrCreateRoomResponse,
  SendMessagePayload,
} from "@/types/chat";
import type { ID } from "@/types/common";
import { baseApi } from "./baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrCreateChatRoom: builder.mutation<GetOrCreateRoomResponse, GetOrCreateRoomPayload>({
      query: (body) => ({ url: "/chat/rooms", method: "POST", body }),
    }),
    getChatMessages: builder.query<ChatMessage[], { roomId: ID; customerToken?: string | null }>({
      query: ({ roomId, customerToken }) => ({
        url: `/chat/rooms/${roomId}/messages`,
        params: customerToken ? { customer_token: customerToken } : undefined,
      }),
      providesTags: (_result, _error, arg) => [{ type: "Chat", id: arg.roomId }],
    }),
    sendChatMessage: builder.mutation<ChatMessage, SendMessagePayload>({
      query: ({ roomId, message, customerToken }) => ({
        url: `/chat/rooms/${roomId}/messages`,
        method: "POST",
        body: { message, customer_token: customerToken || undefined },
      }),
    }),
    markChatRead: builder.mutation<null, { roomId: ID; customerToken?: string | null }>({
      query: ({ roomId, customerToken }) => ({
        url: `/chat/rooms/${roomId}/read`,
        method: "PATCH",
        body: { customer_token: customerToken || undefined },
      }),
    }),
  }),
});

export const {
  useGetOrCreateChatRoomMutation,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useMarkChatReadMutation,
} = chatApi;
