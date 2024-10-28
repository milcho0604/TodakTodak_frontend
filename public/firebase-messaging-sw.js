// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyBSH8wJ7aoblNAj8Kj7iNTfsJhlEL4KEcE",
  authDomain: "padak-todak.firebaseapp.com",
  projectId: "padak-todak",
  storageBucket: "padak-todak.appspot.com",
  messagingSenderId: "22351664979",
  appId: "1:22351664979:web:f8a3cc4b2f5e249d88b3a6"
};

// Firebase 초기화 중복 방지
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const messaging = firebase.messaging();

// 백그라운드 메시지 수신
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/favicon.ico",
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 시 리다이렉트 및 읽음 처리
self.addEventListener('notificationclick', async (event) => {
  const notificationId = event.notification.data ? event.notification.data.notificationId : null;
  const redirectUrl = event.notification.data ? event.notification.data.url : null;
  event.notification.close();

  if (notificationId) {
    try {
      const response = await fetch(`http://localhost:8080/member-service/fcm/read/${notificationId}`, {
        method: 'GET',
      });
      const data = await response.json();
      console.log('알림 읽음 처리 완료:', data);
    } catch (err) {
      console.error('알림 읽음 처리 중 오류 발생:', err);
    }
  }

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
