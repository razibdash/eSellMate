"use client";

import { useEffect, useState } from "react";
import { useGetOrCreateChatRoomMutation } from "@/store/api/chatApi";
import type { ID } from "@/types/common";
import { ChatLauncher } from "./ChatLauncher";

export function SellerOrderChat({ orderId }: { orderId: ID }) {
  const [getOrCreateRoom] = useGetOrCreateChatRoomMutation();
  const [roomId, setRoomId] = useState<ID | null>(null);

  useEffect(() => {
    let active = true;
    getOrCreateRoom({ order_id: orderId })
      .unwrap()
      .then((response) => {
        if (active) setRoomId(response.room.id);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [orderId, getOrCreateRoom]);

  return <ChatLauncher roomId={roomId} viewerType="seller" title="Chat with customer" />;
}
