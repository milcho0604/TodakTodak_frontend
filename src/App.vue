<template>
  <v-app v-if="role" class="app global_bg">
    <div v-if="role == 'HOSPITAL'"> 
      <HospitalHeaderComponent v-if="showHeaderFooter"/>
    </div>
    <div v-else-if="role == 'ADMIN'"> 
      <AdminHeaderComponent v-if="showHeaderFooter"/>
    </div>
    <div v-else-if="role == 'DOCTOR'"> 
      <DoctorHeaderComponent v-if="showHeaderFooter"/>
    </div>
    <div v-else>
      <MemberHeaderComponent v-if="showHeaderFooter"/>
    </div>

    <v-main class="main-content">
      <router-view/>
    </v-main>
    <FooterComponent v-if="showHeaderFooter"/>
  </v-app>
</template>

<script>
// import axios from 'axios';
import FooterComponent from './components/footer/FooterComponent.vue';
import MemberHeaderComponent from './components/header/MemberHeaderComponent.vue';

// import { initFirebase } from "@/firebase";

import HospitalHeaderComponent from './components/header/HospitalHeaderComponent.vue';
import AdminHeaderComponent from './components/header/AdminHeaderComponent.vue';
import DoctorHeaderComponent from './components/header/DoctorHeaderComponent.vue';


export default {
  // inject: ['firebase'],
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
    }
  },
  async mounted() {
    // await initFirebase(); // 앱이 로드될 때 Firebase 초기화 및 Service Worker 등록

    // await this.initializeFCM();
    this.role = localStorage.getItem('role');

  },
  
  computed: {
    showHeaderFooter() {
      // 특정 라우트에서만 헤더와 푸터를 숨김
      return !this.$route.path.startsWith('/chat');
    }
  },
  methods: {
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
