import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

const AUTH_STORAGE_KEY = "shopbot_auth";
const CHAT_TOKEN_PREFIX = "shopbot_chat_token:";

function apiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { token?: string };
    return parsed.token || null;
  } catch {
    return null;
  }
}

export function getChatCustomerToken(roomId: string | number): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(`${CHAT_TOKEN_PREFIX}${roomId}`);
}

export function setChatCustomerToken(roomId: string | number, token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`${CHAT_TOKEN_PREFIX}${roomId}`, token);
}

let echoInstance: Echo<"reverb"> | null = null;

export function getEcho(): Echo<"reverb"> | null {
  if (typeof window === "undefined") return null;
  if (echoInstance) return echoInstance;

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "",
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "localhost",
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080),
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080),
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || "http") === "https",
    enabledTransports: ["ws", "wss"],
    cluster: "",
    authorizer: (channel: { name: string }) => ({
      authorize(
        socketId: string,
        callback: (error: Error | null, data: { auth: string } | null) => void,
      ) {
        const roomId = channel.name.replace("private-chat.", "");
        const token = getAuthToken();
        const customerToken = getChatCustomerToken(roomId);

        fetch(`${apiBaseUrl()}/chat/broadcasting/auth`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            socket_id: socketId,
            channel_name: channel.name,
            customer_token: customerToken || undefined,
          }),
        })
          .then((response) => {
            if (!response.ok) throw new Error("Chat channel authorization failed");
            return response.json();
          })
          .then((data: { auth: string }) => callback(null, data))
          .catch((error) => callback(error as Error, null));
      },
    }),
  });

  return echoInstance;
}

export function disconnectEcho(): void {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
