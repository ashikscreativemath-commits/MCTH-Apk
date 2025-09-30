// Import the Firebase app and messaging modules using COMPAT libraries
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Your new project's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBE0xJ1nvqSj6a9bXtrtrNTDh0bu7PMLnw",
    authDomain: "math-creative-teaching-h-a86fd.firebaseapp.com",
    projectId: "math-creative-teaching-h-a86fd",
    storageBucket: "math-creative-teaching-h-a86fd.appspot.com",
    messagingSenderId: "547365102808",
    appId: "1:547365102808:web:45c46b74ffaaa945dda3ad"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background Message Handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message: ', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/images/image2.png', // Ensure this icon exists in your project
    data: {
        url: payload.data.click_action || '/'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click event listener
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification click Received.', event);
  event.notification.close();
  const targetUrl = event.notification.data.url;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});