// Import and configure the Firebase SDK
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
// "firebase-messaging-sw.js" must be in the root of your site
const firebaseConfig = {
    apiKey: "AIzaSyAnpbv9WhvOqV8nsbmVOQuBhKDF7D9-Ztc",
    authDomain: "miracle-math-online-software.firebaseapp.com",
    projectId: "miracle-math-online-software",
    storageBucket: "miracle-math-online-software.firebasestorage.app",
    messagingSenderId: "27829239296",
    appId: "1:27829239296:web:108d6b86969c95cea2a2e5",
    databaseURL: "https://miracle-math-online-software-default-rtdb.asia-southeast1.firebasedatabase.app"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background Message Handler
messaging.onBackgroundMessage((payload) => {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload,
  );
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // আইকন আপাতত সরানো হয়েছে সমস্যা সমাধানের জন্য
    // icon: '/images/image2.png' 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Optional: Add a click event listener for better user experience
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // click_action ডেটা থেকে URL নিন, না থাকলে সাইটের রুট খুলবে
  const targetUrl = event.notification.data.click_action || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // যদি সাইটটির কোনো ট্যাব আগে থেকেই খোলা থাকে, সেটিকে ফোকাস করুন
      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      // যদি কোনো ট্যাব খোলা না থাকে, তাহলে নতুন একটি ট্যাব খুলুন
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});