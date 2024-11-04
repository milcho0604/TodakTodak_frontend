// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, deleteToken, onMessage } from "firebase/messaging";
import { getDatabase } from "firebase/database"; // Firebase Realtime Database

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
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);
const database = getDatabase(app); // Initialize Realtime Database

// Export the database instance
export { database };

// Request FCM token
export const requestFcmToken = async () => {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    console.log("Notification permissions not granted.");
    return null;
  }

  try {
    const vapidKey = process.env.VUE_APP_FIREBASE_VAP_ID;
    const currentToken = await getToken(messaging, { vapidKey });

    if (currentToken) {
      console.log("FCM Token retrieved:", currentToken);
      localStorage.setItem("fcmToken", currentToken);
      return currentToken;
    } else {
      console.log("No FCM token available.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving FCM token:", error);
    return null;
  }
};

// Delete FCM token
export const removeFcmToken = async () => {
  const currentToken = localStorage.getItem("fcmToken");
  if (currentToken) {
    try {
      const deleted = await deleteToken(messaging);
      if (deleted) {
        console.log("FCM Token deleted successfully.");
        localStorage.removeItem("fcmToken");
      } else {
        localStorage.removeItem("fcmToken");
        console.warn("Failed to delete FCM token.");
      }
    } catch (error) {
      console.error("Failed to delete FCM token:", error);
    }
  } else {
    console.warn("No FCM token found to delete.");
  }
};

let onMessageListenerInitialized = false;
// Foreground message listener
// export const setupMessageListener = () => {
//   if (!onMessageListenerInitialized) {
//     onMessage(messaging, (payload) => {
//       console.log("Message received in foreground:", payload);
      
//       const notificationTitle = payload.notification.title;
//       const notificationOptions = {
//         body: payload.notification.body,
//         icon: "todak-heart.png",
//         data: payload.data
//       };

//       if (Notification.permission === 'granted' && document.visibilityState === 'visible') {
//         const notification = new Notification(notificationTitle, notificationOptions);
//         notification.onclick = (event) => {
//           event.preventDefault();
//           const redirectUrl = payload.data.url;
//           if (redirectUrl) window.open(redirectUrl, "_self");
//           notification.close();
//         };
//       }
//     });
//     onMessageListenerInitialized = true;
//   }
// };
export const setupMessageListener = () => {
  if (!onMessageListenerInitialized) {
    onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);

      // Extract notification details from data
      const notificationTitle = payload.data.title;
      const notificationOptions = {
        body: payload.data.body,
        icon: require("@/assets/todak-new-icon.png"),
        data: payload.data
      };

      if (Notification.permission === 'granted' && document.visibilityState === 'visible') {
        const notification = new Notification(notificationTitle, notificationOptions);
        notification.onclick = (event) => {
          event.preventDefault();
          const redirectUrl = payload.data.url;
          if (redirectUrl) window.open(redirectUrl, "_self");
          notification.close();
        };
      }
    });
    onMessageListenerInitialized = true;
  }
};
