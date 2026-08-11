import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // TODO: [ASSUMED BACKEND] Re-enable and configure when real WebSocket topics are finalized.
    /*
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:8080/ws-crowdshield';
    
    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      setIsConnected(true);
      console.log('Connected to WebSockets: ' + frame);

      client.subscribe('/topic/alerts', (message) => {
        if (message.body) {
          queryClient.invalidateQueries({ queryKey: ['alerts'] });
        }
      });
      client.subscribe('/topic/incidents', (message) => {
        if (message.body) {
          queryClient.invalidateQueries({ queryKey: ['incidents'] });
        }
      });
      client.subscribe('/topic/dashboard', (message) => {
        if (message.body) {
          queryClient.invalidateQueries({ queryKey: ['stats'] });
          queryClient.invalidateQueries({ queryKey: ['zoneAnalytics'] });
        }
      });
    };

    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
    };

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
    */
  }, [queryClient]);

  return { isConnected };
};
