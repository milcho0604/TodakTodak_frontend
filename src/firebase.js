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

// Firebase 초기화 함수
export const initFirebase = () => {
  if (!getApps().length) {
    const firebaseApp = initializeApp(firebaseConfig);
    messaging = getMessaging(firebaseApp);
    console.log("Firebase initialized and Messaging instance created.");
  } else {
    const existingApp = getApp();
    messaging = getMessaging(existingApp);
    console.log("Using existing Firebase instance.");
  }
};

// FCM 토큰 요청 함수
export const requestFcmToken = async () => {
  // Firebase 초기화 상태 확인
  if (!messaging) {
    initFirebase();
  }

  try {
    const vapidKey = process.env.VUE_APP_FIREBASE_VAP_ID;
    console.log("VAPID Key:", vapidKey);  // VAPID 키 확인 로그 추가

    if (!vapidKey) {
      throw new Error("VAPID key is missing in environment variables.");
    }

    const token = await getToken(messaging, { vapidKey });
    console.log("FCM Token retrieved:", token);
    localStorage.setItem("fcmToken", token);
    return token;
  } catch (error) {
    console.error("Failed to retrieve FCM token:", error);
  }
};
// FCM 토큰 삭제 함수
export const removeFcmToken = async () => {
  console.log("FCM 토큰 삭제 함수");

  // Firebase 초기화 확인
  if (!messaging) {
    console.log("Initializing Firebase for token removal...");
    initFirebase();
  }

  try {
    if (!messaging) {
      console.warn("Messaging not initialized after initFirebase call.");
      return;
    }
    
    console.log("Attempting to retrieve the current FCM token...");
    const currentToken = await getToken(messaging, { vapidKey: process.env.VUE_APP_FIREBASE_VAP_ID });

    if (currentToken) {
      console.log("Current FCM Token found:", currentToken);
      const isDeleted = await deleteToken(messaging);
      if (isDeleted) {
        console.log("FCM Token deleted successfully from the client.");
        localStorage.removeItem('fcmToken'); // 로컬 스토리지에서 토큰 제거
      } else {
        console.warn("Failed to delete FCM token from the client.");
      }
    } else {
      console.warn("No FCM token to delete.");
    }
  } catch (error) {
    console.error("Failed to delete FCM token:", error);
  }
};



// 메시지 수신 설정
export const setupMessageListener = () => {
  if (!messaging) initFirebase();

  onMessage(messaging, (payload) => {
    console.log("Received message:", payload);  // 메시지 수신 로그 추가
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/favicon.ico",
      data: payload.data,
    };

    if (Notification.permission === "granted") {
      const notification = new Notification(notificationTitle, notificationOptions);
      notification.onclick = async (event) => {
        event.preventDefault();
        const notificationId = payload.data.notificationId;
        const url = payload.data.url;

        if (notificationId) {
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