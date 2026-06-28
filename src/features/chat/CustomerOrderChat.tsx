"use client";

import { useEffect, useState } from "react";
import { setChatCustomerToken } from "@/lib/echo";
import { useGetOrCreateChatRoomMutation } from "@/store/api/chatApi";
import type { ID } from "@/types/common";
import { ChatLauncher } from "./ChatLauncher";

export function CustomerOrderChat({ orderReference }: { orderReference: string }) {
  const [getOrCreateRoom] = useGetOrCreateChatRoomMutation();
  const [roomId, setRoomId] = useState<ID | null>(null);
  const [customerToken, setCustomerToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getOrCreateRoom({ order_reference: orderReference })
      .unwrap()
      .then((response) => {
        if (!active) return;
        setRoomId(response.room.id);
        setCustomerToken(response.customer_token);
        setChatCustomerToken(response.room.id, response.customer_token);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [orderReference, getOrCreateRoom]);

  return (
    <ChatLauncher
      roomId={roomId}
      customerToken={customerToken}
      viewerType="customer"
      title="Chat with seller"
    />
  );
}
