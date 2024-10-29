<template>
  <v-app class="app global_bg">
    <div v-if="role === 'HOSPITAL'">
      <HospitalHeaderComponent v-if="showHeaderFooter" />
    </div>
    <div v-else-if="role === 'ADMIN'">
      <AdminHeaderComponent v-if="showHeaderFooter" />
    </div>
    <div v-else-if="role === 'DOCTOR'">
      <DoctorHeaderComponent v-if="showHeaderFooter" />
    </div>
    <div v-else>
      <MemberHeaderComponent v-if="showHeaderFooter" />
    </div>

    <v-main class="main-content">
      <router-view />
    </v-main>
    
    <FooterComponent v-if="showHeaderFooter" />
  </v-app>
</template>

<script>
import FooterComponent from './components/footer/FooterComponent.vue';
import MemberHeaderComponent from './components/header/MemberHeaderComponent.vue';
import HospitalHeaderComponent from './components/header/HospitalHeaderComponent.vue';
import AdminHeaderComponent from './components/header/AdminHeaderComponent.vue';
import DoctorHeaderComponent from './components/header/DoctorHeaderComponent.vue';
// import { getMessaging } from 'firebase/messaging';

export default {
  inject: ['firebase'],
  name: 'App',
  components: {
    FooterComponent,
    MemberHeaderComponent,
    HospitalHeaderComponent,
    AdminHeaderComponent,
    DoctorHeaderComponent,
  },
  data() {
    return {
      role: null,
    };
  },
  async mounted() {
    await this.initializeFCM();
    this.role = localStorage.getItem('role');
  },
  computed: {
    showHeaderFooter() {
      return !this.$route.path.startsWith('/chat');
    },
  },
  methods: {
    async initializeFCM() {
      // const messaging = getMessaging(this.firebase);

      try {
        await navigator.serviceWorker.ready;
        // 여기에 FCM 초기화 코드 추가
      } catch (err) {
        console.error('Failed to get FCM token', err);
      }
    },

    toggleSidebar() {
      this.$refs.sidebar.toggleSidebar();
    },
  },
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

.inter-bold {
  font-family: "Inter", sans-serif;
  font-weight: 800;
}

.inter-normal {
  font-family: "Inter", sans-serif;
  font-weight: 700;
}

.inter-light {
  font-family: "Inter", sans-serif;
  font-weight: 500;
}

.custom-container {
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
