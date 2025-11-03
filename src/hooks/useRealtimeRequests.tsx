import { useEffect, useCallback } from 'react';
import { useSignalR } from '@/contexts/SignalRContext';

interface UseRealtimeRequestsProps {
  onRequestCreated?: (data: any) => void;
  onRequestUpdated?: (data: any) => void;
  onRequestDeleted?: (data: any) => void;
  onResourcesAdded?: (data: any) => void;
}

export const useRealtimeRequests = ({
  onRequestCreated,
  onRequestUpdated,
  onRequestDeleted,
  onResourcesAdded,
}: UseRealtimeRequestsProps = {}) => {
  const { listen, isConnected } = useSignalR();

  useEffect(() => {
    const unsubscribers: Array<() => void> = [];

    if (onRequestCreated) {
      const unsubscribe = listen('RequestCreated', (data) => {
        console.log('[Realtime] Request created:', data);
        onRequestCreated(data);
      });
      unsubscribers.push(unsubscribe);
    }

    if (onRequestUpdated) {
      const unsubscribe = listen('RequestUpdated', (data) => {
        console.log('[Realtime] Request updated:', data);
        onRequestUpdated(data);
      });
      unsubscribers.push(unsubscribe);
    }

    if (onRequestDeleted) {
      const unsubscribe = listen('RequestDeleted', (data) => {
        console.log('[Realtime] Request deleted:', data);
        onRequestDeleted(data);
      });
      unsubscribers.push(unsubscribe);
    }

    if (onResourcesAdded) {
      const unsubscribe = listen('ResourcesAdded', (data) => {
        console.log('[Realtime] Resources added:', data);
        onResourcesAdded(data);
      });
      unsubscribers.push(unsubscribe);
    }

    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, [listen, onRequestCreated, onRequestUpdated, onRequestDeleted, onResourcesAdded]);

  return { isConnected };
};
