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

// Firebase 초기화
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

// 백그라운드 메시지 수신
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  console.log(parseInt(payload.data.notificationId, 10))
  const redirectUrl = payload.data.url;
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "favicon.ico",
    data: {
      url: redirectUrl,
      notificationId: payload.data.notificationId  // 알림 ID 포함
    }
  };

  // 알림 표시
  self.registration.showNotification(notificationTitle, notificationOptions);
});

// 알림 클릭 시 리다이렉트 및 읽음 처리
self.addEventListener('notificationclick', async function(event) {
  const notificationId = event.notification.data ? event.notification.data.notificationId : null;
  const redirectUrl = event.notification.data ? event.notification.data.url : null;

  event.notification.close(); // 알림 닫기

  if (notificationId) {
    // String을 Long으로 변환
    const notificationIdAsLong = parseInt(notificationId, 10);

    try {
      // fetch를 사용해 알림을 읽음 처리하는 백엔드 API 호출
      const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/read/${notificationIdAsLong}`, {
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
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(windowClients => {
        // 현재 열린 클라이언트(탭) 확인
        const client = windowClients.find(wc => wc.focused || wc.visibilityState === 'visible');

        if (client) {
          // 현재 열린 탭에서 URL을 변경
          return client.navigate(redirectUrl).then(client => client.focus());
        } else {
          // 열려 있는 창이 없으면 새 창을 엶
          return clients.openWindow(redirectUrl);
        }
      })
    );
  }
});
