import { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Bell, Check } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthContext } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ isOpen, onClose }: NotificationsModalProps) {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('all');
  const { 
    notifications,
    isLoadingNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications(user?.id);

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  const handleNotificationClick = (id: number) => {
    markAsRead(id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="h-[300px] overflow-y-auto">
            {isLoadingNotifications ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : notifications?.length > 0 ? (
              <div className="space-y-2 py-2">
                {notifications.map((notification: any) => (
                  <div 
                    key={notification.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${notification.isRead ? 'bg-muted' : 'bg-primary/10'}`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm">{notification.message}</p>
                      {!notification.isRead && (
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1"></span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No notifications yet</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="unread" className="h-[300px] overflow-y-auto">
            {isLoadingNotifications ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : notifications?.filter((n: any) => !n.isRead).length > 0 ? (
              <div className="space-y-2 py-2">
                {notifications
                  .filter((notification: any) => !notification.isRead)
                  .map((notification: any) => (
                    <div 
                      key={notification.id}
                      className="p-3 rounded-md cursor-pointer transition-colors bg-primary/10"
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm">{notification.message}</p>
                        <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1"></span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Check className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No unread notifications</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            disabled={notifications?.every((n: any) => n.isRead)}
          >
            Mark all as read
          </Button>
          <Button variant="default" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}