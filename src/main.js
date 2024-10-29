import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.js'
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';
import axios from 'axios';
// import '@/assets/css/font.css';
import mitt from 'mitt';
// main.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { initFirebase } from "@/firebase"; 
import { getDatabase } from 'firebase/database';
import { initializeApp } from 'firebase/app';


const app = createApp(App);
// mitt를 사용한 Event Bus 설정
const emitter = mitt();
app.config.globalProperties.emitter = emitter;

const firebaseConfig = {
  apiKey: "AIzaSyBSH8wJ7aoblNAj8Kj7iNTfsJhlEL4KEcE",
  authDomain: "padak-todak.firebaseapp.com",
  projectId: "padak-todak",
  storageBucket: "padak-todak.appspot.com",
  messagingSenderId: "22351664979",
  appId: "1:22351664979:web:f8a3cc4b2f5e249d88b3a6",
  databaseURL: "https://padak-todak-default-rtdb.asia-southeast1.firebasedatabase.app"

};

const firebaseApp = initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);

app.provide('firebaseDatabase', database);
app.provide('firebase', firebaseApp);


// Firebase와 Service Worker 초기화
initFirebase().then(() => {
  console.log("Firebase and Service Worker initialized.");

  app.use(router);
  app.use(vuetify);
  app.mount('#app');
}).catch((error) => {
  console.error("Firebase or Service Worker initialization failed:", error);
  // 초기화 실패해도 앱을 마운트
  // app.use(router);
  // app.use(vuetify);
  // app.mount('#app');
});

// 앱이 로드될 때 알림 권한 요청
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
      console.log('Notification permission granted.');
  } else {
      console.warn('Notification permission denied.');
  }
});

// axios 요청 인터셉터를 설정하여 모든 요청에 엑세스 토큰을 추가
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Axios 요청 인터셉터 오류:', error);
        return Promise.reject(error);
    }
);


// axios 응답 인터셉터를 설정하여 401 오류 처리 및 토큰 갱신
axios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    // 토큰 갱신 요청
                    localStorage.removeItem('token');
                    const response = await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/member/refresh-token`,
                        { refreshToken }
                    );
                    localStorage.setItem('token', response.data.result.token);
                    window.location.reload();
                } catch (e) {
                    console.error('토큰 갱신 실패:', e);
                    localStorage.clear();
                    window.location.href = '/login';
                }
            } else {
                // 리프레시 토큰이 없는 경우 로그인 페이지로 리다이렉트
                console.warn('리프레시 토큰이 없음, 로그인 페이지로 리다이렉트합니다.');
                localStorage.clear();
                window.location.href = '/login';
            }
        } else {
            console.error('Axios 응답 오류:', error);
        }
        return Promise.reject(error);
    }
);



axios.interceptors.response.use(
  (response) => {
    // 응답 성공 시 처리
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 403) {
      // 403 에러 시 홈으로 리다이렉트
      router.push({ name: 'HOME' }); // 'Home' 라우트 이름으로 리다이렉트
    }
    else if(error.response && error.response.status === 503){
      router.push({ name: 'HOME'});
    }
    return Promise.reject(error);
  }
);
