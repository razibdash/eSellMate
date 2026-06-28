import type { ID } from "./common";

export type ChatSenderType = "customer" | "seller";

export type ChatRoom = {
  id: ID;
  business_id: ID;
  order_id: ID;
  customer_id: ID;
  seller_id?: ID | null;
  customer_token?: string;
  status: "open" | "closed";
  created_at: string;
};

export type ChatMessage = {
  id: ID;
  room_id: ID;
  sender_id: ID;
  sender_type: ChatSenderType;
  message: string;
  read_at?: string | null;
  created_at: string;
};

export type GetOrCreateRoomPayload = {
  order_id?: ID;
  order_reference?: string;
};

export type GetOrCreateRoomResponse = {
  room: ChatRoom;
  customer_token: string;
};

export type SendMessagePayload = {
  roomId: ID;
  message: string;
  customerToken?: string | null;
};
