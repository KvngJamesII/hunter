// Basic notification service for browser notifications
export type NotificationPermission = 'granted' | 'denied' | 'default' | null;

// Check if notifications are supported
export const areNotificationsSupported = (): boolean => {
  return 'Notification' in window;
};

// Get the current permission status
export const getNotificationPermission = (): NotificationPermission => {
  if (!areNotificationsSupported()) {
    return null;
  }
  return Notification.permission as NotificationPermission;
};

// Request permission to send notifications
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  try {
    if (!areNotificationsSupported()) {
      console.log('This browser does not support desktop notification');
      return null;
    }

    const permission = await Notification.requestPermission();
    return permission as NotificationPermission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return null;
  }
};

// Show a browser notification
export const showNotification = (title: string, options?: NotificationOptions): Notification | null => {
  if (!areNotificationsSupported() || Notification.permission !== 'granted') {
    return null;
  }
  
  try {
    return new Notification(title, options);
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};