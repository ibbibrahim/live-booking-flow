import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useSignalR } from '@/contexts/SignalRContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'RequestCreated' | 'RequestUpdated' | 'ResourcesAdded' | 'StatusChanged';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  requestId?: string;
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const { listen, isConnected } = useSignalR();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleRequestCreated = (data: any) => {
      const notification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'RequestCreated',
        title: 'New Request Created',
        message: `${data.title || 'Untitled'} - ${data.program_segment || 'N/A'}`,
        timestamp: new Date(),
        read: false,
        requestId: data.id,
      };

      setNotifications(prev => [notification, ...prev].slice(0, 50));
      
      toast.info('📡 New booking request received', {
        description: notification.message,
        duration: 4000,
      });
    };

    const handleRequestUpdated = (data: any) => {
      const notification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'RequestUpdated',
        title: 'Request Updated',
        message: `${data.title || 'Untitled'} - Status: ${data.state || 'N/A'}`,
        timestamp: new Date(),
        read: false,
        requestId: data.id,
      };

      setNotifications(prev => [notification, ...prev].slice(0, 50));
      
      if (data.state === 'Completed') {
        toast.success('✅ Request completed', {
          description: notification.message,
          duration: 4000,
        });
      } else {
        toast.info('🔔 Request updated', {
          description: notification.message,
          duration: 4000,
        });
      }
    };

    const handleResourcesAdded = (data: any) => {
      const notification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'ResourcesAdded',
        title: 'Resources Added',
        message: `Resources added to: ${data.requestTitle || 'Request'}`,
        timestamp: new Date(),
        read: false,
        requestId: data.requestId,
      };

      setNotifications(prev => [notification, ...prev].slice(0, 50));
      
      toast.success('📦 Resources allocated', {
        description: notification.message,
        duration: 4000,
      });
    };

    const handleStatusChanged = (data: any) => {
      const notification: Notification = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'StatusChanged',
        title: 'Status Changed',
        message: `${data.title || 'Request'} is now ${data.newState}`,
        timestamp: new Date(),
        read: false,
        requestId: data.id,
      };

      setNotifications(prev => [notification, ...prev].slice(0, 50));
      
      toast.info('🔄 Status updated', {
        description: notification.message,
        duration: 4000,
      });
    };

    const unsubscribeCreated = listen('RequestCreated', handleRequestCreated);
    const unsubscribeUpdated = listen('RequestUpdated', handleRequestUpdated);
    const unsubscribeResources = listen('ResourcesAdded', handleResourcesAdded);
    const unsubscribeStatus = listen('StatusChanged', handleStatusChanged);

    return () => {
      unsubscribeCreated();
      unsubscribeUpdated();
      unsubscribeResources();
      unsubscribeStatus();
    };
  }, [listen]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Notifications</h3>
            {!isConnected && (
              <Badge variant="outline" className="text-xs">Offline</Badge>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-7"
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs h-7"
              >
                Clear
              </Button>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-accent/50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-accent/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {notification.message}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {format(notification.timestamp, 'MMM d, h:mm a')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
