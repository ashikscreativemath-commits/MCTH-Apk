// Import the Firebase app and messaging modules.
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging.js');

// Initialize the Firebase app in the service worker
const firebaseConfig = {
    apiKey: "AIzaSyAnpbv9WhvOqV8nsbmVOQuBhKDF7D9-Ztc",
    authDomain: "miracle-math-online-software.firebaseapp.com",
    projectId: "miracle-math-online-software",
    storageBucket: "miracle-math-online-software.firebasestorage.app",
    messagingSenderId: "27829239296",
    appId: "1:27829239296:web:108d6b86969c95cea2a2e5",
    databaseURL: "https://miracle-math-online-software-default-rtdb.asia-southeast1.firebasedabase.app"
};

const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.getMessaging(app);

// Background Message Handler
// This handler is called when a push message is received and the app is not in the foreground.
firebase.onBackgroundMessage(messaging, (payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  // Extract notification data from the 'data' object of the payload
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/images/image2.png',
    data: { // Pass data to the notification for click events
        click_action: payload.data.click_action
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Add a click event listener for better user experience
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    const targetUrl = event.notification.data.click_action || '/';
  
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
    );
});