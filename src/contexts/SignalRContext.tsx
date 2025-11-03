import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';
import { toast } from 'sonner';

interface SignalRContextType {
  invoke: (eventName: string, payload?: any) => Promise<void>;
  listen: (eventName: string, handler: (data: any) => void) => () => void;
  connectionState: signalR.HubConnectionState;
  isConnected: boolean;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

interface SignalRProviderProps {
  children: React.ReactNode;
  hubUrl?: string;
}

export const SignalRProvider: React.FC<SignalRProviderProps> = ({ 
  children, 
  hubUrl = '/api/workflow-hub' 
}) => {
  const [connectionState, setConnectionState] = useState<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected
  );
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const listenersRef = useRef<Map<string, Set<(data: any) => void>>>(new Map());

  const initializeConnection = useCallback(() => {
    if (connectionRef.current) return;

    console.log('[SignalR] Initializing connection to:', hubUrl);

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 10000;
          } else {
            return null;
          }
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.onclose((error) => {
      console.log('[SignalR] Connection closed', error);
      setConnectionState(signalR.HubConnectionState.Disconnected);
    });

    connection.onreconnecting((error) => {
      console.log('[SignalR] Reconnecting...', error);
      setConnectionState(signalR.HubConnectionState.Reconnecting);
    });

    connection.onreconnected((connectionId) => {
      console.log('[SignalR] Reconnected with ID:', connectionId);
      setConnectionState(signalR.HubConnectionState.Connected);
      toast.success('Connection restored');
    });

    connectionRef.current = connection;
  }, [hubUrl]);

  const startConnection = useCallback(async () => {
    if (!connectionRef.current) return;

    try {
      if (connectionRef.current.state === signalR.HubConnectionState.Disconnected) {
        console.log('[SignalR] Starting connection...');
        await connectionRef.current.start();
        setConnectionState(connectionRef.current.state);
        console.log('[SignalR] Connected successfully');
      }
    } catch (error) {
      console.error('[SignalR] Connection failed:', error);
      setConnectionState(signalR.HubConnectionState.Disconnected);
      setTimeout(startConnection, 5000);
    }
  }, []);

  useEffect(() => {
    initializeConnection();
    startConnection();

    return () => {
      if (connectionRef.current) {
        console.log('[SignalR] Stopping connection...');
        connectionRef.current.stop();
        connectionRef.current = null;
      }
    };
  }, [initializeConnection, startConnection]);

  const invoke = useCallback(async (eventName: string, payload?: any) => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      console.warn('[SignalR] Cannot invoke - not connected');
      throw new Error('SignalR connection is not established');
    }

    try {
      console.log(`[SignalR] Invoking: ${eventName}`, payload);
      await connectionRef.current.invoke(eventName, payload);
    } catch (error) {
      console.error(`[SignalR] Error invoking ${eventName}:`, error);
      throw error;
    }
  }, []);

  const listen = useCallback((eventName: string, handler: (data: any) => void) => {
    if (!connectionRef.current) {
      console.warn('[SignalR] Cannot listen - connection not initialized');
      return () => {};
    }

    console.log(`[SignalR] Adding listener for: ${eventName}`);

    if (!listenersRef.current.has(eventName)) {
      listenersRef.current.set(eventName, new Set());
      
      connectionRef.current.on(eventName, (data: any) => {
        console.log(`[SignalR] Event received: ${eventName}`, data);
        const handlers = listenersRef.current.get(eventName);
        handlers?.forEach(h => h(data));
      });
    }

    listenersRef.current.get(eventName)?.add(handler);

    return () => {
      console.log(`[SignalR] Removing listener for: ${eventName}`);
      const handlers = listenersRef.current.get(eventName);
      handlers?.delete(handler);
      
      if (handlers?.size === 0 && connectionRef.current) {
        connectionRef.current.off(eventName);
        listenersRef.current.delete(eventName);
      }
    };
  }, []);

  const isConnected = connectionState === signalR.HubConnectionState.Connected;

  return (
    <SignalRContext.Provider value={{ invoke, listen, connectionState, isConnected }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = (): SignalRContextType => {
  const context = useContext(SignalRContext);
  if (!context) {
    throw new Error('useSignalR must be used within SignalRProvider');
  }
  return context;
};
