"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useEffect, useMemo, useRef, useState } from "react";
import { getEcho } from "@/lib/echo";
import {
  useGetChatMessagesQuery,
  useMarkChatReadMutation,
  useSendChatMessageMutation,
} from "@/store/api/chatApi";
import type { ChatMessage } from "@/types/chat";
import type { ID } from "@/types/common";

type PusherLikeChannel = {
  listen: (event: string, callback: (data: unknown) => void) => PusherLikeChannel;
  listenForWhisper: (event: string, callback: (data: unknown) => void) => PusherLikeChannel;
  whisper: (event: string, data: Record<string, unknown>) => PusherLikeChannel;
  stopListening: (event: string) => PusherLikeChannel;
};

type UseChatOptions = {
  customerToken?: string | null;
  viewerType?: "customer" | "seller";
};

export function useChat(roomId: ID | null, { customerToken, viewerType }: UseChatOptions = {}) {
  const { data: history = [], isLoading } = useGetChatMessagesQuery(
    roomId ? { roomId, customerToken } : skipToken,
  );
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [sendChatMessage, { isLoading: isSending }] = useSendChatMessageMutation();
  const [markChatRead] = useMarkChatReadMutation();
  const channelRef = useRef<PusherLikeChannel | null>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLiveMessages([]);
  }, [roomId]);

  useEffect(() => {
    if (!roomId) return;
    const echo = getEcho();
    if (!echo) return;

    const channel = echo.private(`chat.${roomId}`) as unknown as PusherLikeChannel;
    channelRef.current = channel;

    channel.listen(".message.sent", (event) => {
      setLiveMessages((current) => [...current, event as ChatMessage]);
    });

    channel.listenForWhisper("typing", () => {
      setIsOtherTyping(true);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setIsOtherTyping(false), 2500);
    });

    return () => {
      channel.stopListening(".message.sent");
      channel.stopListening("typing");
      echo.leave(`chat.${roomId}`);
      channelRef.current = null;
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [roomId]);

  const messages = useMemo(() => {
    const seen = new Set<string>();
    return [...history, ...liveMessages]
      .filter((message) => {
        const key = String(message.id);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [history, liveMessages]);

  const unreadFromOther = useMemo(
    () =>
      messages.filter((message) => message.sender_type !== viewerType && !message.read_at).length,
    [messages, viewerType],
  );

  async function sendMessage(message: string) {
    if (!roomId || !message.trim()) return;
    const created = await sendChatMessage({
      roomId,
      message: message.trim(),
      customerToken,
    }).unwrap();
    setLiveMessages((current) => [...current, created]);
  }

  function notifyTyping() {
    channelRef.current?.whisper("typing", {});
  }

  async function markRead() {
    if (!roomId) return;
    await markChatRead({ roomId, customerToken }).unwrap();
  }

  return {
    messages,
    isLoading,
    isSending,
    isOtherTyping,
    unreadFromOther,
    sendMessage,
    notifyTyping,
    markRead,
  };
}
