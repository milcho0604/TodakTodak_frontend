<!-- App.vue -->
<template>
  <v-app class="app global_bg">
    <HeaderComponent @open-sidebar="toggleSidebar" />
    <AppSidebar ref="sidebar" />
    <v-main class="main-content">
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue';
//FCM
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export default {
  name: 'App',
  components: {
    HeaderComponent
  },
  async mounted() {
    
    await this.initializeFCM();
  
    //this.updateLayout(this.$route)

     // 서비스 워커 등록
    //  if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker.register('/firebase-messaging-sw.js')
    //     .then((registration) => {
    //       console.log('Service Worker registered with scope:', registration.scope);
    //     }).catch((error) => {
    //       console.error('Service Worker registration failed:', error);
    //     });
    // }

  },
  methods: {
    async initializeFCM(){
      const firebaseConfig = {
        apiKey: "AIzaSyBSH8wJ7aoblNAj8Kj7iNTfsJhlEL4KEcE",
        authDomain: "padak-todak.firebaseapp.com",
        projectId: "padak-todak",
        storageBucket: "padak-todak.appspot.com",
        messagingSenderId: "22351664979",
        appId: "1:22351664979:web:f8a3cc4b2f5e249d88b3a6",
        databaseURL: "https://padak-todak-default-rtdb.asia-southeast1.firebasedatabase.app"
      };
      const firebase = initializeApp(firebaseConfig);
      const messaging = getMessaging(firebase);
      
      // 서비스 워커가 준비된 후 FCM 토큰 요청
      await navigator.serviceWorker.ready;
      console.log('Service Worker is ready', navigator.serviceWorker.controller);
      //알림 수신을 위한 사용자 권한 요청
      const permission = await Notification.requestPermission();
      console.log('permission : ', permission);
      if(permission !== 'granted'){
          alert('알림을 허용해주세요!');
          return;
      }
      
      
        try {
          console.log('토큰 요청 한다!!!!!')
          //FCM 토큰 요청
          const token = await getToken(messaging,{
            vapidKey: `${process.env.VUE_APP_FIREBASE_VAP_ID}`
          });

          if(token){
            console.log('토큰 이따!!!!')
            localStorage.setItem("fcmToken", token);
            console.log("FCM Token: ", token);
          }
        }catch(err){
          console.error('Failed to get FCM token', err);
        }
          // const access_token = localStorage.getItem('access_token');
        //   // const headers = access_token ? { Authorization: `Bearer ${access_token}` } : {};

        //   // // FCM 토큰을 서버에 전송
          // await axios.post(`${process.env.VUE_APP_API_BASE_URL}/user/pushToken`, {
          //   pushToken: token,
          // }, { headers });

        //   // localStorage.setItem("fcmToken", token);
        //   // console.log('fcmToken: ', token);
        // } catch (err) {
        //   console.error(err);
        // }
        
        // await navigator.serviceWorker.ready
          // // FCM 토큰 요청
          //const token = await getToken(messaging, {
          //   vapidKey: 'BHg-Nt-RVggJCTjYQlB-5hThEnYJwUb5SAyjtyaXaFPI4k5JURI0hXSsXGD0IRFr8lSWX8JJY7kyLpGQlylXQw4'
          // });
          
      
      
    onMessage(messaging, (payload) => {
      console.log("Recived message ", payload);
      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "favicon.ico"
      };
      if(Notification.permission === "granted"){
        new Notification(notificationTitle, notificationOptions);
      }
    });
    },
    toggleSidebar() {
      this.$refs.sidebar.toggleSidebar();
    }
  }
}
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 
  면 높이의 100%를 차지하도록 설정 */
}
.main-content {
  flex: 1; /* 콘텐츠가 footer 위에 표시되도록 설정 */
}
</style>
