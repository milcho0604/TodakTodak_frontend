// firebase.js

import { initializeApp, getApps, getApp } from "firebase/app";
import { getMessaging, getToken, onMessage, deleteToken } from "firebase/messaging";
import axios from 'axios';

const firebaseConfig = {
  apiKey: "AIzaSyBSH8wJ7aoblNAj8Kj7iNTfsJhlEL4KEcE",
  authDomain: "padak-todak.firebaseapp.com",
  projectId: "padak-todak",
  storageBucket: "padak-todak.appspot.com",
  messagingSenderId: "22351664979",
  appId: "1:22351664979:web:f8a3cc4b2f5e249d88b3a6"
};

let messaging;

export const initFirebase = () => {
  return new Promise((resolve, reject) => {
    if (!getApps().length) {
      const firebaseApp = initializeApp(firebaseConfig);
      messaging = getMessaging(firebaseApp);
      console.log("Firebase initialized and Messaging instance created.");
    } else {
      const existingApp = getApp();
      messaging = getMessaging(existingApp);
      console.log("Using existing Firebase instance.");
    }

    // Service Worker 등록
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
          resolve(); // 성공 시 Promise 해제
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
          reject(error); // 실패 시 Promise 거부
        });
    } else {
      console.error('실패 실패 실패');
      resolve(); // 서비스 워커가 지원되지 않는 경우에도 성공으로 간주
    }
  });
};

// FCM 토큰 요청 함수
export const requestFcmToken = async () => {
  if (!messaging) {
      initFirebase();
  }
  await waitForServiceWorkerActivation();  // Service Worker가 준비될 때까지 대기

  try {
      const vapidKey = process.env.VUE_APP_FIREBASE_VAP_ID;
      const currentStoredToken = localStorage.getItem("fcmToken");

      // 새로운 FCM 토큰 요청
      let newToken = await getToken(messaging, { vapidKey });
      console.log("Requested FCM Token:", newToken);

      // 기존 토큰과 비교하여 동일한 경우 강제로 새로운 토큰 발급 시도
      if (newToken === currentStoredToken) {
          console.log("Existing FCM token matches the new request. Attempting forced reissue...");

          // 기존 토큰을 무효화하고 새 토큰 발급
          await removeFcmToken();

          // // 서비스 워커 캐시 무효화
          // await unregisterServiceWorkerAndClearCache();

          // 강제로 새 토큰 발급
          newToken = await getToken(messaging, { vapidKey });
          console.log("Forced reissue of FCM token:", newToken);
      }

      // 로컬에 새로운 토큰 저장
      localStorage.setItem("fcmToken", newToken);
      console.log("New FCM token issued and stored:", newToken);
      return newToken;
  } catch (error) {
      console.error("Failed to get FCM token:", error);
      return null;
  }
};


// FCM 토큰 삭제 함수
export const removeFcmToken = async () => {
  console.log("Attempting to delete FCM token...");
  await waitForServiceWorkerActivation();

  try {
      const currentToken = await getToken(messaging, { vapidKey: process.env.VUE_APP_FIREBASE_VAP_ID });
      if (currentToken) {
          const isDeleted = await deleteToken(messaging);
          if (isDeleted) {
              console.log("FCM Token deleted successfully.");
              localStorage.removeItem("fcmToken");
          } else {
              console.warn("Failed to delete FCM token from Firebase.");
          }
      } else {
          console.warn("No FCM token found to delete.");
      }
  } catch (error) {
      console.error("Failed to delete FCM token:", error);
  }
};


// 메시지 수신 설정
export const setupMessageListener = async () => {
  console.log("Setting up message listener..."); // 리스너 설정 시작 확인
  
  if (!messaging) initFirebase();
  
  onMessage(messaging, (payload) => {
    console.log('Received message: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "favicon.ico",
      data: payload.data // URL과 알림 ID를 포함하는 data 필드
    };
    
    console.log("Notification Title:", notificationTitle);
    console.log("Notification Body:", notificationOptions.body);
    
    if (Notification.permission === 'granted') {
      const notification = new Notification(notificationTitle, notificationOptions);
      console.log("Notification displayed:", notification); // 알림이 표시되었는지 확인

      notification.onclick = async (event) => {
        event.preventDefault();
        const notificationId = payload.data.notificationId;
        const url = payload.data.url;

        if (notificationId) {
          console.log("id는" + notificationId)
          try {
            await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/read/${notificationId}`);
            notification.close();
          } catch (err) {
            console.error("Error marking notification as read:", err);
          }
        }
        if (url) {
          window.open(url, "_self");
        }
      };
    }
  });
};


// fcmToken이 localStorage에 생길 때까지 대기하는 함수
export const waitForToken = () => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('fcmToken');
      if (token) {
        clearInterval(interval);
        resolve();
      }
    }, 100); // 100ms마다 확인
  });
};

export const waitForServiceWorkerActivation = async () => {
  return new Promise((resolve) => {
    if (navigator.serviceWorker.controller) {
      resolve();
    } else {
      navigator.serviceWorker.ready.then(() => {
        resolve();
      });
    }
  });
};