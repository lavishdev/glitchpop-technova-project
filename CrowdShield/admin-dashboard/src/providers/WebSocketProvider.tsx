'use client';

import { useWebSocket } from '@/services/ws/stompClient';

export default function WebSocketProvider({ children }: { children: React.ReactNode }) {
  // Initialize the WebSocket connection globally
  useWebSocket();
  return <>{children}</>;
}
