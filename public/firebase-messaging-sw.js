// firebase-messaging-sw.js

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyByoMzqxbfXuHca-m6gEOBBnTVjJj-fTv4",
  authDomain: "todak-1f8d0.firebaseapp.com",
  projectId: "todak-1f8d0",
  storageBucket: "todak-1f8d0.appspot.com",
  messagingSenderId: "167301418487",
  appId: "1:167301418487:web:8eaa552ab9a39e306ff2f2",
  measurementId: "G-P904DPFNZQ",
  databaseURL: "https://todak-1f8d0-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// // Handle background messages
// messaging.onBackgroundMessage((payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message', payload);

//   // Extract notification details
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: "/todak-heart.png",
//     data: {
//       url: payload.data.url,
//       notificationId: payload.data.notificationId
//     }
//   };

//   // Display notification
//   self.registration.showNotification(notificationTitle, notificationOptions);
// });

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);

  // Extract notification details from data
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: "/todak-heart.png",
    data: {
      url: payload.data.url,
      notificationId: payload.data.notificationId
    }
  };

  // Show notification
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click event
self.addEventListener('notificationclick', async (event) => {
  event.notification.close(); // Close notification

  const notificationId = event.notification.data?.notificationId;
  const redirectUrl = event.notification.data?.url;
  // const url = event.notification.data.url;
  // Mark notification as read (optional)
  if (notificationId) {
    try {
      await fetch(`/member-service/fcm/read/${notificationId}`, { method: 'GET' });
      console.log(`Notification ${notificationId} marked as read.`);
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  }

  // Redirect to URL if provided
  if (redirectUrl) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
        const client = windowClients.find((wc) => wc.focused || wc.visibilityState === 'visible');
        if (client) {
          return client.navigate(redirectUrl).then((client) => client.focus());
        } else {
          return clients.openWindow(redirectUrl);
        }
      })
    );
  }
});
