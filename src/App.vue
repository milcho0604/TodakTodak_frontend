<template>
  <v-app class="app global_bg">
     <MemberHeaderComponent/>
    <AppSidebar ref="sidebar" />
    
    <v-main class="main-content">
      <router-view/>
    </v-main>
    <FooterComponent/>
  </v-app>
</template>

<script>
import axios from 'axios';
import FooterComponent from './components/footer/FooterComponent.vue';
import MemberHeaderComponent from './components/header/MemberHeaderComponent.vue';

// FCM 관련 Firebase SDK
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

export default {
  inject: ['firebase'],
  name: 'App',
  components: {
    // HeaderComponent,
    FooterComponent,
    MemberHeaderComponent,
  },
  async mounted() {
    await this.initializeFCM();
  },
  methods: {
    // FCM 초기화 및 알림 권한 요청
    async initializeFCM() {
      const messaging = getMessaging(this.firebase);

      // 서비스 워커가 준비될 때까지 대기
      await navigator.serviceWorker.ready;

      // 알림 권한 요청
      const permission = await Notification.requestPermission();
      console.log('Permission: ', permission);
      if (permission !== 'granted') {
        alert('알림을 허용해주세요!');
        return;
      }

      try {
        // FCM 토큰 요청
        const token = await getToken(messaging, {
          vapidKey: process.env.VUE_APP_FIREBASE_VAP_ID
        });

        if (token) {
          console.log('FCM Token: ', token);
          localStorage.setItem('fcmToken', token);

          // 이메일과 토큰 헤더 정보
          const memberEmail = localStorage.getItem('email');
          const BearerToken = localStorage.getItem('token');
          
          // FCM 토큰 서버로 전송
          await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/token`, { fcmToken: token }, {
            headers: { Authorization: `Bearer ${BearerToken}`, memberEmail: memberEmail }
          });
        }
      } catch (err) {
        console.error('Failed to get FCM token', err);
      }

      // 메시지 수신 시 로직 처리
      onMessage(messaging, (payload) => {
        console.log('Received message: ', payload);
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
          body: payload.notification.body,
          icon: "favicon.ico",
          data: payload.data // URL과 알림 ID를 포함하는 data 필드
        };

        if (Notification.permission === 'granted') {
          const notification = new Notification(notificationTitle, notificationOptions);

          // 알림 클릭 시 동작
          notification.onclick = async (event) => {
            event.preventDefault();
            const notificationId = payload.data.notificationId; // 알림 ID 추출
            const url = payload.data.url; // data에서 URL 추출

            // 알림 읽음 처리 API 호출
            if (notificationId) {
              try {
                const notificationIdAsLong = parseInt(notificationId, 10);
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/read/${notificationIdAsLong}`);
                console.log('알림 읽음 처리 완료:', response.data);

                // 읽은 알림 사라지게 처리 (해당 로직 필요 시 추가)
                notification.close();
              } catch (err) {
                console.error('알림 읽음 처리 중 오류 발생:', err);
              }
            }

            // URL로 이동
            if (url) {
              window.open(url, '_self'); // 현재 창에서 리다이렉트
            }
          };
        }
      });
    },

    // fcmToken이 localStorage에 생길 때까지 대기
    waitForToken() {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const token = localStorage.getItem('fcmToken');
          if (token) {
            clearInterval(interval);
            resolve();
          }
        }, 100); // 100ms마다 확인
      });
    },

    toggleSidebar() {
      this.$refs.sidebar.toggleSidebar();
    }
  }
}
</script>

<style>
/* 기존 스타일 유지 */
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
.inter-bold {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 800;
  font-style: normal;
}
.inter-normal {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}
.inter-light {
  font-family: "Inter", sans-serif;
  font-optical-sizing: auto;
  font-weight: 500;
  font-style: normal;
}
.custom-container{
  max-width: 1200px !important;
  margin: 0 auto !important;
  width: 100% !important;
}
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main-content {
  flex: 1;
}
</style>
