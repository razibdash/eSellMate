"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useChat } from "./useChat";
import { ChatBox } from "./ChatBox";
import type { ID } from "@/types/common";

export function ChatLauncher({
  roomId,
  customerToken,
  viewerType,
  title = "Chat",
}: {
  roomId: ID | null;
  customerToken?: string | null;
  viewerType: "customer" | "seller";
  title?: string;
}) {
  const [open, setOpen] = useState(false);
  const { unreadFromOther } = useChat(roomId, { customerToken, viewerType });

  if (!roomId) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open ? (
        <div className="mb-3 w-[340px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl sm:w-[380px]">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-950 px-4 py-3 text-white">
            <p className="text-sm font-bold">{title}</p>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </button>
          </div>
          <ChatBox roomId={roomId} customerToken={customerToken} viewerType={viewerType} />
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Open chat"
        className="focus-ring relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-slate-950 text-white shadow-glow transition hover:-translate-y-0.5"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && unreadFromOther > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-rose-600 text-xs font-bold">
            {unreadFromOther > 9 ? "9+" : unreadFromOther}
          </span>
        ) : null}
      </button>
    </div>
  );
}
