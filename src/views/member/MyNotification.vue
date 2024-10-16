<template>
    <v-container>
      <!-- 알림 헤더 -->
      <v-row class="notice-header" justify="center" align="center">
        <v-col cols="auto" class="d-flex align-center">
          <img src="@/assets/bell.png" width="35px" height="40px" class="mr-2 mb-2" />
          <div class="notice-title mr-2 mb-2">알림 내역</div>
        </v-col>
      </v-row>
  
      <!-- 알림 리스트 -->
      <v-row v-for="(notification, index) in notifications" :key="index" class="notification-container">
        <v-col cols="12" md="8" offset-md="2">
          <v-card class="notification-box" variant="flat" @click="handleNotificationClick(notification)">
            <v-card-text class="notification-text">
              <div class="notification-content">
                <v-card-title class="notification-title">{{ notification.title }}</v-card-title>
                <p class="notification-content">{{ notification.content }}</p>
                <p class="notification-info">
                  {{ formatDate(notification.createdAt) }} | {{ notification.read ? '읽음' : '읽지 않음' }}
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 페이지 네이션 -->
      <v-row justify="center" class="mt-4">
        <v-pagination
        v-model="page"
        :length="totalPages"
        :total-visible="totalPages"
      ></v-pagination>      
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        notifications: [],
        page: 1, // 현재 페이지
        totalPages: 1, // 전체 페이지 수
      };
    },
    methods: {
      fetchNotifications() {
        // 페이지에 해당하는 알림 데이터를 가져옵니다 (10개씩)
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/list`, {
            params: {
              page: this.page - 1, // Spring의 페이지는 0부터 시작
              size: 10, // 한 페이지에 보여줄 알림 수
            },
          })
          .then((response) => {
            this.notifications = response.data.result.content;
            this.totalPages = response.data.result.totalPages; // 전체 페이지 수 설정
            console.log("Fetched notifications:", this.notifications); // 데이터 확인을 위한 로그
          })
          .catch((error) => {
            console.error("Error fetching notifications:", error);
          });
      },
      formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
  
        return `${year}-${month}-${day} ${hours}:${minutes}`;
      },
      handleNotificationClick(notification) {
        if (notification.read) {
          // 이미 읽은 알림인 경우, 요청 없이 바로 리다이렉트
          if (notification.url) {
            window.location.href = notification.url;
          } else {
            console.log("URL이 없는 알림입니다.");
          }
        } else {
          // 읽지 않은 알림인 경우, 읽음 처리 API 호출 후 리다이렉트
          axios
            .get(`${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/read/${notification.id}`)
            .then(() => {
              notification.read = true;
              if (notification.url) {
                return new Promise((resolve) => {
                  setTimeout(() => {
                    window.location.href = notification.url;
                    resolve();
                  }, 100);
                });
              } else {
                console.log("URL이 없는 알림입니다.");
              }
            })
            .catch((error) => {
              console.error("Error marking notification as read:", error);
            });
        }
      },
    },
    watch: {
        page(newPage) {
        console.log("Page changed to:", newPage);
        this.fetchNotifications(); // 페이지가 변경될 때 알림 목록을 다시 로드
        },
    },
    mounted() {
      this.fetchNotifications();
    },
  };
  </script>
  
  <style scoped>
  .notification-container {
    margin-bottom: 20px;
  }
  
  .notification-box {
    border-radius: 10px;
    background-color: #ffffff;
    border: 1px solid #dbdbdb;
    cursor: pointer;
  }
  
  .notification-box:hover {
    background-color: #f9f9f9;
  }
  
  .notification-title {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #000000;
    margin-top: 10px;
  }
  
  .notification-content {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 400;
    color: #000000;
    white-space: pre-wrap; /* 줄바꿈을 보존하기 위해 사용 */
    margin-left: 18px;
    margin-bottom: -5px;
  }
  
  .notification-time {
    font-family: 'ABeeZee', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #888888;
    margin-top: 10px;
    padding: none;
  }
  
  .notice-header {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .notice-title {
    font: bold;
    font-family: 'Inter';
    font-weight: 700;
    font-size: 30px;
    color: #000000;
    text-align: center;
    margin-bottom: -50px;
  }
  
  .notification-info {
    display: inline-block;
    margin-right: 10px;
    margin-left: 18px;
    font-size: 14px;
    color: #555;
    margin-top: -50px;
  }
  .v-card-text {
    flex: 1 1 auto;
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0.0178571429em;
    opacity: var(--v-card-text-opacity, 1);
    padding: 0px 0px;
    text-transform: none;
}
  </style>
  