// main.js

import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router/index.js';
import vuetify from './plugins/vuetify';
import '@mdi/font/css/materialdesignicons.css';
import axios from 'axios';
import mitt from 'mitt';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import Vue3Lottie from 'vue3-lottie'

import { setupMessageListener, database } from './firebase'; // Import database instance

const app = createApp(App);

// Event Bus 설정
const emitter = mitt();
app.config.globalProperties.emitter = emitter;

// Provide database instance for global access
app.provide('firebaseDatabase', database);

// Register service worker for FCM
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error);
    });
}

// Request FCM token and set up foreground message listener on page load
document.addEventListener("DOMContentLoaded", async () => {
  await setupMessageListener();
});

// Notification permission request
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    console.log('Notification permission granted.');
  } else {
    console.warn('Notification permission denied.');
  }
});

// Axios 인터셉터 설정
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Axios request interceptor error:', error);
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => response,
  async error => {
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          localStorage.removeItem('token');
          const response = await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/member/refresh-token`,
            { refreshToken }
          );
          localStorage.setItem('token', response.data.result.token);
          window.location.reload();
        } catch (e) {
          console.error('Token refresh failed:', e);
          localStorage.clear();
          window.location.href = '/login';
        }
      } else {
        console.warn('No refresh token found, redirecting to login page.');
        localStorage.clear();
        window.location.href = '/login';
      }
    } else if (error.response && error.response.status === 403) {
      router.push({ name: 'HOME' });
    } else {
      console.error('Axios response error:', error);
    }
    return Promise.reject(error);
  }
);

// Vue app 마운트
app.use(Vue3Lottie)
app.use(router);
app.use(vuetify);
app.mount('#app');
