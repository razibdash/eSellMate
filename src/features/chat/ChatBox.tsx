"use client";

import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatDateTime } from "@/lib/formatters";
import { useChat } from "./useChat";
import type { ID } from "@/types/common";

export function ChatBox({
  roomId,
  customerToken,
  viewerType,
}: {
  roomId: ID;
  customerToken?: string | null;
  viewerType: "customer" | "seller";
}) {
  const { messages, isLoading, isSending, isOtherTyping, sendMessage, notifyTyping, markRead } =
    useChat(roomId, { customerToken, viewerType });
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingThrottleRef = useRef<number>(0);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isOtherTyping]);

  useEffect(() => {
    markRead();
  }, [roomId]);

  function handleDraftChange(value: string) {
    setDraft(value);
    const now = Date.now();
    if (now - typingThrottleRef.current > 1500) {
      typingThrottleRef.current = now;
      notifyTyping();
    }
  }

  async function handleSend() {
    if (!draft.trim()) return;
    const message = draft;
    setDraft("");
    await sendMessage(message);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex h-[520px] flex-col rounded-3xl border border-slate-200 bg-white">
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400">Loading conversation...</p>
        ) : messages.length ? (
          messages.map((message) => {
            const isOwn = message.sender_type === viewerType;
            return (
              <div key={String(message.id)} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                    isOwn
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-900"
                  }`}
                >
                  <p className="leading-relaxed">{message.message}</p>
                  <p className={`mt-1 text-[11px] ${isOwn ? "text-slate-300" : "text-slate-400"}`}>
                    {formatDateTime(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-sm text-slate-400">
            No messages yet. Say hello to start the conversation.
          </p>
        )}
        {isOtherTyping ? (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm text-slate-500">
              Typing...
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <Input
          value={draft}
          onChange={(e) => handleDraftChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isSending}
        />
        <Button onClick={handleSend} disabled={isSending || !draft.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
