<template>
  <v-app-bar app>
    <v-container fluid class="custom-container">
      <v-row align="center">
        <v-col>
          <v-toolbar-title>
            <router-link to="/" class="logo">
              <img src="@/assets/logo.png" alt="TodakTodak Logo" class="logo-image" />
            </router-link>
          </v-toolbar-title>
        </v-col>

        <v-col class="d-flex flex-row justify-center text-no-wrap" cols="auto">
          <!-- 왼쪽 정렬 -->
          <v-btn class="custom-button transparent-button" text :to="{path: '/'}">
              <!-- <v-icon left class="mr-1">mdi-hospital-marker</v-icon> -->
              🏥 주변소아과
          </v-btn>

          <v-btn class="custom-button transparent-button" text :to="{path: '/'}">
            🏠 비대면진료
          </v-btn>

          <v-btn class="custom-button transparent-button" text :to="{path: '/'}">
            💬 의사 Q&A
          </v-btn>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="auto" md="auto" class="d-flex align-center justify-end text-no-wrap">
          <!-- 오른쪽 정렬 -->
          <v-menu v-if="!isLogin" open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn text v-bind="props" height="60">
                <v-avatar size="40">
                  <!-- <v-img :src=profileImgUrl alt="profileImgUrl"></v-img> -->
                   <img src="@/assets/default_profile_image.png"
                    alt="기본이미지"
                    style="object-fit: cover; width: 100%; height: 100%;"
                    />
                </v-avatar>
                <span class="ml-2">{{ nickname }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :href="`/mypage/${id}`">
                <v-list-item-title>나의 예약내역</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ path: '/member/mypage'}">
                <v-list-item-title>우리아이 캘린더                                                                             </v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ path: '/member/my-projects'}">
                <v-list-item-title>프로젝트 관리</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ path: '/member/chatting-list'}">
                <v-list-item-title>내 채팅</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-title>로그아웃</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
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
      nickname: "김파닥",
      profileImgUrl: '@/assets/default_profile_image.png'
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

/* 버튼 커스텀 */
.custom-button {
  font-weight: bold !important; /* 글씨를 bold로 */
  font-size: 17px !important; /* 글씨 크기 */
  text-transform: none !important; /* 대문자 변환 방지 */
  background-color: transparent !important;  /* 배경을 투명하게 만듦 */
  color: inherit !important; /* 글자 색상은 상위 요소에서 상속받음 */
  box-shadow: none !important; /* 그림자 제거 */
  border: none !important; /* 버튼 테두리 제거 */
  outline: none !important; /* 버튼 outline 제거 */
}

/* Hover 시 살짝 강조 */
.custom-button:hover {
  background-color: rgba(0, 0, 0, 0.05) !important; /* 살짝 강조되는 hover 효과 */
}

.v-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>