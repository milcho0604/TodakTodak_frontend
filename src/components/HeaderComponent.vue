<template>
  <v-app-bar app>
    <v-container>
      <v-row align="center">
        <v-col>
          <v-toolbar-title>
            <router-link to="/" class="logo">
              <img :src="logo" alt="로고" class="logo-image" style="max-width:100%;" />
            </router-link>
          </v-toolbar-title>
        </v-col>
        <v-col class="text-right">
          <v-btn icon @click="handleAccountClick">
            <v-icon>mdi-account</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>

  <!-- 로그인 안내 스낵바 (중앙 모달 스타일) -->
  <v-snackbar color="white"
    v-model="loginSnackbar" 
    :timeout="3000"
    class="custom-snackbar"
    top
  >
    <div class="snackbar-content">
      로그인을 하셔야 해당 기능을 사용할 수 있습니다.
      <v-btn color="#6fc8b8" text @click="goToLoginPage">로그인</v-btn>
      <v-btn color="#6fc8b8" text @click="closeLoginSnackbar">닫기</v-btn>
    </div>
  </v-snackbar>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      logo: require('@/assets/logo.png'),
      isLogin: false,
      loginSnackbar: false, // 로그인 안내 스낵바 상태
    };
  },
  mounted() {
    const token = localStorage.getItem('token');
    this.isLogin = !!token;
  },
  methods: {
    handleAccountClick() {
      if (this.isLogin) {
        this.$emit('open-sidebar');
      } else {
        this.loginSnackbar = true; // 로그인 안내 스낵바 열기
      }
    },
    closeLoginSnackbar() {
      this.loginSnackbar = false;
    },
    goToLoginPage() {
      this.loginSnackbar = false;
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.logo {
  font-weight: bold;
  color: inherit;
  text-decoration: none;
}

.logo-image {
  height: 10%;
}

.custom-snackbar {
  color:#ffdb69 !important;
  margin: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
}

.v-snackbar--variant-elevated, 
.v-snackbar--variant-flat {
  background-color: white !important; /* 흰색 배경 */
}
</style>
