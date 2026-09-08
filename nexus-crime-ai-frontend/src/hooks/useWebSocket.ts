import { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";
const WS_BASE_URL = API_BASE_URL.replace(/^http/, "ws");

type WebSocketEvent = Record<string, unknown>;

export function useWebSocket(channel = "events") {
  const socketRef = useRef<WebSocket | null>(null);
  const [lastEvent, setLastEvent] = useState<WebSocketEvent | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(`${WS_BASE_URL}/ws/${channel}`);
    socketRef.current = socket;
    socket.onopen = () => setConnected(true);
    socket.onmessage = (message) => {
      try { setLastEvent(JSON.parse(message.data) as WebSocketEvent); } catch { setLastEvent({ type: "message", data: message.data }); }
    };
    socket.onclose = () => setConnected(false);
    return () => { socket.close(); socketRef.current = null; };
  }, [channel]);

  return { connected, lastEvent, send: (event: WebSocketEvent) => socketRef.current?.send(JSON.stringify(event)) };
}
