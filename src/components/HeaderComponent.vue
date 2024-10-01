<template>
  <v-app-bar app>
    <v-container>
      <v-row align="center">
        <v-col>
          <v-toolbar-title>
            <router-link to="/" class="logo">
              <img src="@/assets/logo.png" alt="TodakTodak Logo" class="logo-image" />
            </router-link>
          </v-toolbar-title>
        </v-col>
        <v-col class="text-right">
          <!-- 로그인 상태에 따라 카카오 로그인 버튼 또는 리스트를 보여줌 -->
          <v-btn v-if="!isLogin" icon @click="kakaoLogin">
            <v-icon>mdi-account</v-icon>
          </v-btn>

          <v-btn v-else icon @click="menuVisible = !menuVisible">
            <v-icon>mdi-menu</v-icon>
          </v-btn>

          <!-- 작은 리스트를 보여주는 v-list -->
          <v-list v-if="menuVisible && isLogin" class="custom-list">
            <v-list-item @click="navigateTo('/')" class="custom-list-item">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>마이페이지</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="navigateTo('/')" class="custom-list-item">
              <v-list-item-icon>
                <v-icon>mdi-account-child</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>자녀설정</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="navigateTo('/')" class="custom-list-item">
              <v-list-item-icon>
                <v-icon>mdi-calendar-check</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>나의 예약내역</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="navigateTo('/')" class="custom-list-item">
              <v-list-item-icon>
                <v-icon>mdi-calendar-month</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>우리아이 캘린더</v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item @click="navigateTo('/')" class="custom-list-item">
              <v-list-item-icon>
                <v-icon>mdi-headset</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>내 채팅</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <div class="signup-underline"></div>
            <v-list-item @click="logout" class="custom-list-item">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>로그아웃</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      menuVisible: false, // 메뉴 보이기 상태
      isLogin: false, // 로그인 상태 확인 변수
    };
  },
  mounted() {
    this.checkLoginStatus(); // 컴포넌트가 마운트될 때 로그인 상태 확인
  },
  methods: {
    checkLoginStatus() {
      const token = localStorage.getItem('token');
      this.isLogin = !!token; // 토큰이 있으면 로그인 상태로 간주
    },
    kakaoLogin() {
      window.location.href = 'http://localhost:8080/member-service/oauth2/authorization/kakao';
    },
    logout() {
      localStorage.removeItem('token'); // 토큰 제거
      this.isLogin = false; // 로그아웃 후 로그인 상태 업데이트
      this.$router.push('/'); // 로그아웃 후 메인 페이지로 이동
    },
    navigateTo(route) {
      this.$router.push(route); // 해당 경로로 이동
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
  max-width: 150px;
  width: 100%;
  height: auto;
}

.text-right {
  text-align: right;
}

/* v-list가 다른 요소보다 우선 표시되고 헤더와 무관하게 잘리지 않도록 설정 */
.custom-list {
  background-color: #f5f5f5;
  border-radius: 10px;
  position: fixed; /* position을 fixed로 변경하여 화면 어디서나 표시 */
  right: 20px;
  top: 70px; /* 헤더 아래에 위치하도록 조정 */
  width: 200px;
  z-index: 1000; /* z-index를 높여 다른 요소 위로 표시 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 리스트 요소를 왼쪽 정렬 */
.custom-list-item {
  display: flex;
  justify-content: flex-start; /* 아이템을 왼쪽으로 정렬 */
  padding-left: 0px; /* 좌측 패딩 제거 */
  text-align: left; /* 텍스트를 왼쪽 정렬 */
}

.custom-list-item .v-list-item-content {
  margin-left: 8px; /* 아이콘과 텍스트 간의 간격 설정 */
  text-align: left; /* 리스트 내용도 왼쪽 정렬 */
}
.signup-underline {
  width: 100%; /* 선을 페이지 너비만큼 길게 */
  max-width: 1000px; /* 최대 길이 제한 */
  height: 1px;
  background-color: #E3E3E3; /* 마크다운의 ---과 같은 얇은 선 */
  margin-top: 10px; /* 글자와 선 사이 여백 */
}
</style>
