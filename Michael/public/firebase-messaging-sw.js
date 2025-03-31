// Basic Service Worker for QuicReF

// Cache name
const CACHE_NAME = 'quicref-cache-v1';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/main.css',
  '/main.js',
  '/icon-192x192.png',
  '/badge-96x96.png'
];

// Install service worker and cache the static assets
self.addEventListener('install', (event) => {
  // Skip the 'waiting' lifecycle phase, forcing the service worker to
  // become the active service worker right away
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification click: ', event);
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Get the notification data to determine which page to open
  const data = clickedNotification.data || {};
  let urlToOpen = '/';

  if (data.taskId) {
    urlToOpen = `/task-detail/${data.taskId}`;
  } else if (data.notificationType === 'referral') {
    urlToOpen = '/profile';
  } else if (data.notificationType === 'wallet') {
    urlToOpen = '/wallet';
  } else if (data.notificationType === 'submissions') {
    urlToOpen = '/my-tasks';
  }

  // Open or focus on the specific page
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});