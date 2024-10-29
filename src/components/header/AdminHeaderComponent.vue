<template>
  <v-app-bar app scroll-behavior="elevate" style="background-color: #1F1F1F;">
    <v-container fluid class="custom-container">
      <v-row align="center">
        <v-col cols="2" class="justify-start text-no-wrap">
          <v-toolbar-title>
            <router-link to="/" class="logo">              
              <img src="@/assets/graymode-todak-logo.png" alt="TodakTodak Logo" class="logo-image" />
            </router-link>
          </v-toolbar-title>
        </v-col>

        <v-col class="d-flex flex-row justify-start text-no-wrap" cols="6">
          <!-- 왼쪽 정렬 -->
          <v-btn class="custom-button" @click="$router.push('/all/hospital/list')"> 
              주변소아과
          </v-btn>

          <v-btn class="custom-button" @click="$router.push('/all/untact/list')">
            비대면진료
          </v-btn>

          <v-btn to="/community/list" class="custom-button">
            의사 Q&A
          </v-btn>
        </v-col>

        <v-col cols="4" class="d-flex align-end justify-end text-no-wrap">
          <!-- 오른쪽 정렬 -->
          <v-menu v-if="isLogin" open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn text v-bind="props" height="60">
                <v-avatar size="40" style="background-color: white;">
                  <v-img :src=profileImgUrl alt="profileImgUrl"></v-img>
                </v-avatar>
                <span class="ml-2" style="font-size: 17px; color: white">{{ name }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="toDashBoard">
                <v-list-item-title>대시보드</v-list-item-title>
              </v-list-item>

              <v-list-item @click="toCsChat">
                <v-list-item-title>고객상담 채팅</v-list-item-title>
              </v-list-item>

              <v-list-item @click="toMemberList">
                <v-list-item-title>회원 리스트</v-list-item-title>
              </v-list-item>

              <v-list-item  @click="toPaymentList">
                <v-list-item-title>결제 리스트</v-list-item-title>
              </v-list-item>

              <v-list-item  @click="toHospitalList">
                <v-list-item-title>병원 리스트</v-list-item-title>
              </v-list-item>

              <v-list-item @click="logout">
                <v-list-item-title>로그아웃</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          
          <v-btn v-if="!isLogin" @click="kakaoLogin">
            <img src="@/assets/kakao_login_small.png" alt="카카오로그인 버튼">
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      isLogin: false, // 로그인 상태 확인 변수
      name: "김파닥",
      profileImgUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png',
      memberId:'',
      role:'',
      email:'',
    };
  },
  created(){

    this.memberId = localStorage.getItem("memberId")
    this.email = localStorage.getItem("email")
    const token = localStorage.getItem("token")
    if(token){
      // localStorage에 token 있으면 로그인된 상태
      this.isLogin = true;
      this.loadUserProfile();
    }

  },
  mounted() {

  },
  methods: {
    async loadUserProfile(){
      try{
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/id/${this.memberId}`);
        console.log(response.data);
        this.name = response.data.result.name;
        this.role = response.data.result.role;
        // 프로필 이미지가 null이면 기본 이미지 경로로 설정
        this.profileImgUrl = response.data.result.profileImgUrl 
            ? response.data.result.profileImgUrl
            : "https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png";
        localStorage.setItem('name', this.name);
        localStorage.setItem('profileImgUrl', this.profileImgUrl);

      }catch(error){
        console.error("사용자 프로필 loading error : ",error);
      }
    },
    kakaoLogin() {
      window.location.href = 'http://localhost:8080/member-service/oauth2/authorization/kakao';
    },
    logout() {
      localStorage.removeItem('token'); // 토큰 제거
      localStorage.removeItem('fcmToken') // fcm 토큰 제거
      this.isLogin = false; // 로그아웃 후 로그인 상태 업데이트
      this.$router.push('/'); // 로그아웃 후 메인 페이지로 이동
    },
    toMemberList() {
            this.$router.push('/admin/member/list');
        },
    toCsChat() {
        this.$router.push('/admin/cs/center');
    },
    toCsList(){
        this.$router.push('/admin/cs/list')
    },
    toReportList() {
        this.$router.push('/admin/todak/report');
    },
    toPaymentList() {
        this.$router.push('/admin/payment/list');
    },
    toHospitalList() {
        this.$router.push('/admin/hospital/list');
    },
    toDashBoard() {
        this.$router.push('/admin/todak/statistics');
    },

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
  width: 150px; /* 원하는 고정 너비 */
  max-width: 100%; /* 부모 요소 너비를 넘지 않도록 설정 */
  height: auto; /* 높이는 비율에 맞춰 자동 조절 */
  object-fit: contain; /* 이미지가 고정된 크기 안에서 비율을 유지 */
}

/* 버튼 커스텀 */
.custom-button {
  font-size: 18px !important; /* 글씨 크기 */
  text-transform: none !important; /* 대문자 변환 방지 */
  background-color: transparent !important;  /* 배경을 투명하게 만듦 */
  color: white;
  box-shadow: none !important; /* 그림자 제거 */
  border: none !important; /* 버튼 테두리 제거 */
  outline: none !important; /* 버튼 outline 제거 */
  box-shadow: none !important; /* 그림자 제거 */
}

.v-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>