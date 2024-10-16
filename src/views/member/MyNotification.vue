<template>
    <v-container>
      <v-row class="notice-header" justify="center" align="center">
        <v-col cols="auto" class="d-flex align-center">
          <!-- 이미지를 한 줄에 표시 -->
          <img src="@/assets/bell.png" width="35px" height="40px" class="mr-2 mb-2" />
          <!-- 알림 내역 텍스트를 이미지 옆에 배치 -->
          <div class="notice-title">알림 내역</div>
        </v-col>
      </v-row>
  
      <!-- 알림 리스트 -->
      <v-row v-for="(notification, index) in notifications" :key="index" class="notification-container">
        <v-col cols="12" md="8" offset-md="2">
          <v-card class="notification-box" variant="flat" @click="handleNotificationClick(notification)">
            <v-card-text>
              <div class="notification-content">
                <v-card-title class="notification-title">{{ notification.content }}</v-card-title>
                <p class="notification-info">
                  {{ formatDate(notification.createdAt) }} | {{ notification.read ? '읽음' : '읽지 않음' }}
                </p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        notifications: [],
      };
    },
    methods: {
      fetchNotifications() {
        axios
          .get("http://localhost:8080/member-service/fcm/list")
          .then((response) => {
            this.notifications = response.data.result.content;
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
                .get(`http://localhost:8080/member-service/fcm/read/${notification.id}`)
                .then(() => {
                    // 알림이 읽음으로 처리되면 상태를 업데이트
                    notification.read = true;

                    // 읽음 처리 후에 URL로 리다이렉트
                    if (notification.url) {
                        // Promise를 사용하여 리다이렉트를 확실히 처리
                        return new Promise((resolve) => {
                            setTimeout(() => {
                                window.location.href = notification.url;
                                resolve();
                            }, 100); // 읽음 처리 후 100ms 딜레이 후 리다이렉트
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
    padding: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    border: 1px solid #dbdbdb;
    height: 140px;
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
  }
  
  .notification-time {
    font-family: 'ABeeZee', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #888888;
    margin-top: 10px;
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
    margin-bottom: 10px;
  }
  
  .notification-info {
    display: inline-block;
    margin-right: 10px;
    margin-left: 18px;
    font-size: 14px;
    color: #555;
  }
  </style>
  