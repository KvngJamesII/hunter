import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';

interface Notification {
  id: number;
  userId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface UnreadCountResponse {
  count: number;
}

export function useNotifications(userId?: number) {
  const [unreadCount, setUnreadCount] = useState(0);

  // Query notifications
  const {
    data: notifications,
    isLoading: isLoadingNotifications,
    error: notificationsError,
    refetch: refetchNotifications
  } = useQuery<Notification[]>({
    queryKey: ['notifications', userId],
    queryFn: () => apiRequest(`/api/users/${userId}/notifications`),
    enabled: !!userId,
  });

  // Get unread count
  const {
    data: unreadData,
    refetch: refetchUnread
  } = useQuery<UnreadCountResponse>({
    queryKey: ['unreadNotifications', userId],
    queryFn: () => apiRequest(`/api/users/${userId}/unread-notifications`),
    enabled: !!userId,
  });

  // Mark a notification as read
  const { mutate: markAsRead } = useMutation({
    mutationFn: (notificationId: number) => 
      apiRequest(`/api/notifications/${notificationId}/read`, {
        method: 'POST',
        data: {}
      }),
    onSuccess: () => {
      refetchUnread();
      refetchNotifications();
    }
  });

  // Mark all notifications as read
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: () => 
      apiRequest(`/api/users/${userId}/read-all-notifications`, {
        method: 'POST',
        data: {}
      }),
    onSuccess: () => {
      refetchUnread();
      refetchNotifications();
      queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications', userId] });
    }
  });

  useEffect(() => {
    if (unreadData && unreadData.count !== undefined) {
      setUnreadCount(unreadData.count);
    }
  }, [unreadData]);

  return {
    notifications,
    isLoadingNotifications,
    notificationsError,
    refetchNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
}