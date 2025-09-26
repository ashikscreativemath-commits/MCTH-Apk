// Import the Firebase app and messaging modules using the COMPAT libraries
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
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// THIS IS THE NEW PART: Directly listen for 'push' events.
// This is the most reliable way to handle incoming push messages.
self.addEventListener('push', (event) => {
    console.log('[firebase-messaging-sw.js] Push event received.', event);
    
    let payload;
    try {
        payload = event.data.json();
    } catch (e) {
        console.error('Could not parse push data as JSON.', e);
        // If data is not JSON, we cannot proceed.
        return;
    }

    const notificationTitle = payload.data.title || 'New Notification';
    const notificationOptions = {
        body: payload.data.body || 'You have a new message.',
        icon: '/images/image2.png',
        data: {
            url: payload.data.click_action || '/'
        }
    };

    event.waitUntil(
        self.registration.showNotification(notificationTitle, notificationOptions)
    );
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

// The onBackgroundMessage is a Firebase helper, but we are now using the standard 'push' event.
// We can keep it for logging purposes if needed, but the 'push' event listener is the primary handler.
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] onBackgroundMessage was also triggered (this is for info only).', payload);
});
