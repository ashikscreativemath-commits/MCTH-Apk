// This file must be named firebase-messaging-sw.js and be in the root of your site.

// Import the Firebase app and messaging modules using the COMPAT libraries,
// as your main app uses them.
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAnpbv9WhvOqV8nsbmVOQuBhKDF7D9-Ztc",
    authDomain: "miracle-math-online-software.firebaseapp.com",
    projectId: "miracle-math-online-software",
    storageBucket: "miracle-math-online-software.firebasestorage.app",
    messagingSenderId: "27829239296",
    appId: "1:27829239296:web:108d6b86969c95cea2a2e5"
    // databaseURL is not needed in the service worker for messaging
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

// This is the magic handler that will receive messages when the app is in the background or closed.
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  // Customize the notification here
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/images/image2.png',
    data: { // This data is passed to the notification click event
        url: payload.data.click_action || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Listener for when a user clicks on the notification.
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event);

  event.notification.close();

  const targetUrl = event.notification.data.url;

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {
      // If a window for the app is already open, focus it.
      for (const client of clientList) {
        // You might need to adjust the URL check to be more flexible
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window.
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});