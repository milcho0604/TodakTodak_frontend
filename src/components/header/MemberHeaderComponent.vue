<template>
  <v-app-bar app scroll-behavior="elevate">
    <v-container fluid class="custom-container">
      <v-row align="center">
        <v-col cols="2" class="justify-start text-no-wrap">
          <v-toolbar-title>
            <router-link to="/" class="logo">
              <img src="@/assets/todak-new-logo-removebg.png" alt="TodakTodak Logo" class="logo-image" />
            </router-link>
          </v-toolbar-title>
        </v-col>

        <v-col class="d-flex flex-row justify-start text-no-wrap" cols="6">
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
          <!-- <v-switch
          v-model="isDarkMode"
          inset
          label="Dark Mode"
          @change="toggleDarkMode"
        ></v-switch> -->


          <!-- 알림 드롭다운 아이콘 -->
          <v-menu v-model="notificationMenu" offset-y attach="body"
            :style="{ position: 'fixed', left: '75%', zIndex: '9999', top: '60px', }" :close-on-content-click="false"
            class="fixed-menu-size">

            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="toggleNotificationMenu" class="mb-1">
                <div v-if="unreadCount > 0">
                  <v-icon>mdi-bell</v-icon>
                  <v-badge color="red" :content="unreadCount" overlap></v-badge> <!-- 읽지 않은 알림 수 표시 -->
                </div>
                <div v-else><v-icon>mdi-bell-outline</v-icon></div>
              </v-btn>
            </template>

            <!-- 알림 목록 -->
            <v-list style="background-color: transparent; backdrop-filter: blur(1px); box-shadow: none !important;">
              <!-- 필터링 버튼 -->
              <v-row justify="end" class="my-2 mr-1">
                <v-chip v-for="option in filterOptions" :key="option.value" @click="setFilter(option.value)"
                  :class="{ 'v-chip--active': filter === option.value }" class="my-2 mr-2" outlined>
                  {{ option.text }}
                </v-chip>
              </v-row>

              <!-- 필터링된 알림이 있을 때 -->
              <template v-if="filteredNotifications.length > 0">
                <v-list-item v-for="(notification, index) in filteredNotifications" :key="index"
                  @click="handleNotificationClick(notification)" :class="{ 'read-notification': notification.read }"
                  class="fixed-list-size">
                  <v-card class="notification-card d-flex align-center">
                    <!-- 알림 타입에 따른 이미지 표시 -->
                    <v-img
                      v-if="notification.type === 'RESERVATION_NOTIFICATION' || notification.type === 'RESERVATION_WAITING'"
                      src="https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital-icon.png"
                      width="24" height="24" class="mr-2 fixed-img" />
                    <v-img v-else-if="notification.type === 'POST' || notification.type === 'COMMENT'"
                      src="@/assets/community.png" width="24" height="24" class="mr-2 fixed-img" />
                    <v-img v-else-if="notification.type === 'PAYMENT'"
                      src="https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/pay-removebg-preview.png"
                      width="24" height="24" class="mr-2 fixed-img" />
                    <v-img v-else-if="notification.type === 'CHILD'"
                      src="https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/baby-removebg-preview.png"
                      width="24" height="24" class="mr-2 fixed-img" />
                    <v-img v-else-if="notification.type === 'CHAT'" src="@/assets/cs_center_image.png" width="24"
                      height="24" class="mr-2 fixed-img" />

                    <!-- 알림 제목과 내용 -->
                    <v-list-item-content>
                      <v-list-item-title style="font-weight: 600" class="mt-1">{{ notification.title
                        }}</v-list-item-title>
                      <v-list-item-title class="small-font ">{{ notification.content }}</v-list-item-title>
                      <v-list-item-subtitle class="small-font mb-1">
                        {{ formatDate(notification.createdAt) }}
                        <span v-if="notification.read"> | 읽음</span>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-card>
                </v-list-item>
              </template>

              <!-- 필터링된 알림이 없을 때 -->
              <template v-else>
                <v-list-item class="fixed-list-size">
                  <v-card class="notification-card">
                    <v-list-item-title> 알림이 존재하지 않습니다.</v-list-item-title>
                  </v-card>
                </v-list-item>
              </template>
              <v-list-item @click="$router.push('/member/notification/list')">
                <v-card class="notification-card-to-all">
                  <v-list-item-title>모든 알림 보기</v-list-item-title>
                </v-card>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- 로그인 여부에 따라 메뉴를 표시 -->
          <v-menu v-if="isLogin" open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn text v-bind="props" height="60">
                <v-avatar size="40">
                  <v-img :src="profileImgUrl" alt="profileImgUrl"></v-img>
                </v-avatar>
                <span class="ml-2" style="font-size: 17px;">{{ name }}</span>
              </v-btn>
            </template>
            <v-list>
              <v-list-item :href="`/member/mypage/reservation`">
                <v-list-item-title>나의 예약내역</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ path: '/member/mypage' }">
                <v-list-item-title>마이 페이지</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ path: '/member/child' }">
                <v-list-item-title>자녀 관리</v-list-item-title>
              </v-list-item>
              <v-list-item @click="toChatList">
                <v-list-item-title>내 채팅</v-list-item-title>
              </v-list-item>
              <v-list-item :to="{ path: '/member/mychild-cal' }">
                <v-list-item-title>우리아이 캘린더</v-list-item-title>
              </v-list-item>
              <v-list-item @click="logout">
                <v-list-item-title>로그아웃</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn v-if="!isLogin" @click="kakaoLogin" class="mb-2">
            <img src="@/assets/kakao_login_small.png" alt="카카오로그인 버튼" class="mb-1">
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>


<script>
// import { initFirebase } from "@/firebase";
import axios from 'axios'
import { removeFcmToken } from "@/firebase";

export default {
  data() {
    return {
      isLogin: false,
      name: "김파닥",
      profileImgUrl: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png',
      memberId: '',
      role: '',
      email: '',
      notifications: [], // 알림 목록
      unreadCount: 0, // 읽지 않은 알림 수
      notificationMenu: false, // 알림 메뉴 열림 여부
      filter: 'all', // 필터 상태: 'all', 'unread', 'read', 'today'
      filterOptions: [
        { value: 'all', text: '전체' },
        { value: 'unread', text: '읽지 않은 알림' },
        { value: 'read', text: '읽은 알림' },
        { value: 'today', text: '오늘 알림' }
      ],
      filteredNotifications: [],
      isDarkMode: false
    };
  },
  watch: {
    notificationMenu(val) {
      console.log("바ㄱ귐");
      if (val) {
        // 팝업이 열릴 때 필터링된 알림 목록 새로 설정
        this.applyFilter();
      }
    },
    filter() {
      // 필터가 변경될 때 필터링된 알림 목록 새로 설정
      this.applyFilter();
    }
  },
  created(){
    // initFirebase();
    this.memberId = localStorage.getItem("memberId");
    this.email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    if (token) {
      this.isLogin = true;
      this.loadUserProfile();
      this.fetchNotifications();
    }
    const theme = localStorage.getItem("theme");
    this.isDarkMode = theme === "dark";
    this.$vuetify.theme.global.name = this.isDarkMode ? "dark" : "light";
  },
  methods: {
    async loadUserProfile() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/id/${this.memberId}`);
        this.name = response.data.result.name;
        this.role = response.data.result.role;
        this.profileImgUrl = response.data.result.profileImgUrl
          ? response.data.result.profileImgUrl
          : "https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png";
        localStorage.setItem('name', this.name);
        localStorage.setItem('profileImgUrl', this.profileImgUrl);
      } catch (error) {
        console.error("사용자 프로필 loading error : ", error);
      }
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      this.$vuetify.theme.global.name = this.isDarkMode ? "dark" : "light";
      localStorage.setItem("theme", this.isDarkMode ? "dark" : "light");
    },
    async fetchNotifications() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/list`);
        this.notifications = response.data.result.content;
        console.log(this.notifications)
        this.updateUnreadCount(); // 읽지 않은 알림 수 업데이트
        this.applyFilter();
      } catch (error) {
        console.error("알림 데이터를 불러오는 중 오류 발생:", error);
      }
    },
    updateUnreadCount() {
      this.unreadCount = this.notifications.filter(notification => !notification.read).length;
    },
    applyFilter() {
      if (this.filter === 'unread') {
        this.filteredNotifications = this.notifications.filter(notification => !notification.read);
      } else if (this.filter === 'read') {
        this.filteredNotifications = this.notifications.filter(notification => notification.read);
      } else if (this.filter === 'today') {
        const today = new Date().toISOString().split('T')[0];
        this.filteredNotifications = this.notifications.filter(notification => notification.createdAt.startsWith(today));
      } else {
        this.filteredNotifications = this.notifications;
      }
      console.log(this.filteredNotifications);
    },
    async handleNotificationClick(notification) {
      if (!notification.read) {
        try {
          await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/read/${notification.id}`);
          notification.read = true;
          this.updateUnreadCount();
        } catch (error) {
          console.error("알림 읽음 처리 중 오류 발생:", error);
        }
      }
      window.location.href = notification.url || '/';
    },
    toggleNotificationMenu() {
      this.notificationMenu = !this.notificationMenu;
    },
    setFilter(filter) {
      this.filter = filter;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    },
    kakaoLogin() {
      window.location.href = `${process.env.VUE_APP_API_BASE_URL}/member-service/oauth2/authorization/kakao`;
    },
    async logout() {
  console.log("Logout function called"); // 호출 여부 확인
  
  // 현재 사용자의 이메일 가져오기
  const memberEmail = localStorage.getItem('email');
  console.log("Retrieved email from localStorage:", memberEmail);
  
  try {
    // 로그아웃 API 호출
    const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/logout`, {
      memberEmail: memberEmail
    });
    
    console.log(response.data); // 로그아웃 성공 메시지 출력

    // 로컬 저장소에서 사용자 데이터 제거
    await removeFcmToken(); // Firebase FCM 토큰 삭제 (removeFcmToken이 비동기 함수라면)
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('profileImgUrl');
    localStorage.removeItem('name');
    console.log("After removal:", localStorage); // 삭제 후 localStorage 상태 확인

    this.isLogin = false;
    window.location.href = "/";
  } catch (error) {
    console.error("로그아웃에 실패했습니다:", error); // 로그아웃 실패 메시지
  }
},

    toChatList() {
        const chatWindow = window.open(
        '/chat/my-chat/list',  // ChatListComponent가 렌더링될 URL
        '_blank',  // 새로운 창을 열기 위한 옵션
        'width=600,height=800'  // 창의 크기를 지정
      );

      if (!chatWindow) {
        alert('팝업이 차단되었습니다. 팝업 차단 설정을 해제해주세요.');
      }
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
  width: 150px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.custom-button {
  font-size: 18px !important;
  text-transform: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
  outline: none !important;
}

.v-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 알림 카드의 투명도 적용 */
.notification-card {
  background-color: rgba(244, 242, 242, 0.9) !important;
  color: black !important;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 1px;
}

.notification-card-to-all {
  background-color: rgba(244, 242, 242, 0.9) !important;
  color: rgb(65, 65, 65) !important;
  width: 160px;
  font-size: 14px;
  border-radius: 20px;
  padding: 6px;
  text-align: center;
  margin: 2px auto;
}

/* 읽은 알림 배경색 */
.read-notification {
  color: #676767 !important;
}

.v-chip--active {
  background-color: #C2D7FF;
  color: #00499E;
  font-weight: bold;
}

.fixed-menu-size {
  width: 450px;
  /* 너비 고정 */
  max-height: 460px;
  /* 최대 높이 고정 */
  overflow-y: auto;
  /* 스크롤 가능하게 설정 */
}

.fixed-list-size {
  width: 350px !important;
  /* 너비 고정 */
  max-height: 500px;
  /* 최대 높이 고정 */
  overflow-y: auto;
  /* 스크롤 가능하게 설정 */
}

.small-font {
  font-size: 13px;
  /* 원하는 크기로 설정 */
}

.fixed-img {
  width: 24px !important;
  height: 24px !important;
  object-fit: contain !important;
  /* 이미지가 지정된 크기 안에서 잘리더라도 꽉 차도록 */
  max-width: 24px;
  max-height: 24px;
}

.v-img__img--contain {
  width: 24px !important;
  height: 24px !important;
  object-fit: contain !important;
}
</style>
