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
import axios from 'axios';
import HeaderComponent from './components/HeaderComponent.vue';
//FCM
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { resolve } from 'core-js/fn/promise';
// import member from './store/member';

export default {
  name: 'App',
  components: {
    HeaderComponent
  },
  async mounted() {
    await this.initializeFCM();
  },
  methods: {
    async initializeFCM(){
      const firebaseConfig = {
        apiKey: "AIzaSyBSH8wJ7aoblNAj8Kj7iNTfsJhlEL4KEcE",
        authDomain: "padak-todak.firebaseapp.com",
        projectId: "padak-todak",
        storageBucket: "padak-todak.appspot.com",
        messagingSenderId: "22351664979",
        appId: "1:22351664979:web:536ae135a5a43c0f88b3a6",
        databaseURL: "https://padak-todak-default-rtdb.asia-southeast1.firebasedatabase.app"
      };
      const firebase = initializeApp(firebaseConfig);
      const messaging = getMessaging(firebase);
      
      // 서비스 워커가 준비된 후 FCM 토큰 요청
      await navigator.serviceWorker.ready;
      
      //console.log('Service Worker is ready', navigator.serviceWorker.controller);
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
            const memberId = localStorage.getItem('memberId');
            const BearerToken = localStorage.getItem('token');
            //localStoragedp fcmToken이 생길때까지 대기
            await this.waitForToken();

            //FCM 토큰 서버에 전송
            const access_token = localStorage.getItem('fcmToken');
            // http://localhost:8080/member-service/fcm/token
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/token`,{fcmToken: access_token},{headers:{Authorization: `Bearer ${BearerToken}`, memberId: memberId}});
          }
        }catch(err){
          console.error('Failed to get FCM token', err);
        }
          

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
    //fcmToken이 localStorage에 생길때까지 대기
    waitForToken(){
      return new Promise((resolve)=>{
        const interval = setInterval(() => {
          const token = localStorage.getItem('fcmToken');
          if(token){
            clearInterval(interval);
            resolve();
          }
        }, 100); //100ms마다확인
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
