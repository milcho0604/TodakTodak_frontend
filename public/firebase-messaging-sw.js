importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js');

const firebaseConfig ={
    apiKey: "AIzaSyBSH8wJ7aoblNAj8Kj7iNTfsJhlEL4KEcE",
    authDomain: "padak-todak.firebaseapp.com",
    projectId: "padak-todak",
    storageBucket: "padak-todak.appspot.com",
    messagingSenderId: "22351664979",
    appId: "1:22351664979:web:f8a3cc4b2f5e249d88b3a6"
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {   
      console.log(
        '[firebase-messaging-sw.js] Received background message ', payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "favicon.ico"
      };
      self.registration.showNotification(notificationTitle, notificationOptions);
    });