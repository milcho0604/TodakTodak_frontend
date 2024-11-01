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

          <!-- 알림 드롭다운 아이콘 -->
          <v-menu v-model="notificationMenu" offset-y attach="body"
            :style="{ position: 'fixed', left: '75%', zIndex: '9999', top: '60px', }" :close-on-content-click="false"
            class="fixed-menu-size">

            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="toggleNotificationMenu" class="mb-1">
                <div v-if="unreadCount > 0">
                  <v-icon style="color: white">mdi-bell</v-icon>
                  <v-badge color="red" :content="unreadCount" overlap></v-badge> <!-- 읽지 않은 알림 수 표시 -->
                </div>
                <div v-else><v-icon style="color: white">mdi-bell-outline</v-icon></div>
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
                  <v-card class="no-notification-card">
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
          
          <v-btn v-if="!isLogin" @click="kakaoLogin" class="mb-2">
            <img src="@/assets/kakao_login_small.png" alt="카카오로그인 버튼" class="mb-1">
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-app-bar>
</template>

<script>
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
// import AdminCsListForCsChat from "./AdminCsListForCsChat.vue";
// import PadakAdminSideBar from "@/components/sidebar/PadakAdminSideBar.vue";
import axios from "axios";

export default {
  components: {
    // AdminCsListForCsChat,
    // PadakAdminSideBar
  },
  data() {
    return {
      selectedChatRoomId: null,  // 선택된 채팅방 ID를 저장할 변수
      stompClient: null,
      subscription: null,  // 구독 객체
      isSubscribed: false,  // 구독 상태
      currentUserName: null,  // 현재 접속한 user 이름
      messageToSend: '',  // 보낼 메시지
      messages: [],  // 수신된 메시지 저장
      chatRoomId: '',  // 채팅방 ID
      memberEmail: '',
      chatRoomList: [],
      itemsPerPage: 10,
      csPage: 1,
      memberInfo: null,  // 채팅 건 회원정보
      memberId: '',  // 채팅 건 회원 ID
      csContents: '',  // 상담 내용
      csStatus: '',  // CS 처리 상태 (처리 중, 처리 완료)
      csId: '',  // CS ID
      statusItems: [
        { key: 'INPROCESS', value: '처리중' },
        { key: 'COMPLETED', value: '처리완료' }
      ],
      cs: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/cs_center_image.png',
      csPostModal: false,
      csPostModalTitle : "",
      csPostModalContents: "",
      isEditMode: true,  // 편집 모드 상태
      hasCsData: false,  // 해당 채팅방에 CS 데이터가 있는지
      currentPage: 1,  // 현재 페이지
      totalPages: 0,  // 총 페이지 수
    };
  },
  created() {
    this.loadAdminChatList();  // 채팅 리스트 로드
    this.currentUserName = localStorage.getItem('name');  // 현재 접속한 user 이름

    // 새로고침 또는 탭 닫기 시 WebSocket 연결 해제
    window.addEventListener('beforeunload', this.disconnect);
  },
  beforeUnmount() {
    this.disconnect();  // 컴포넌트 언마운트 시 웹소켓 연결 종료
    window.removeEventListener('beforeunload', this.disconnect);  // 이벤트 리스너 제거
  },
  updated() {
    this.scrollToBottom();  // 메시지가 업데이트될 때 스크롤 하단으로 이동
  },
  watch: {
    currentPage(newCurrentPage) {
      if (newCurrentPage) {
        this.loadAdminChatList();
      }
    }
  },
  methods: {
    connect(id) {
      if (this.isSubscribed) return;  // 이미 구독된 경우 실행하지 않음

      this.chatRoomId = id;
      const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/member-service/ws/chat`);
      this.stompClient = Stomp.over(socket);

      const token = localStorage.getItem('token');
      this.stompClient.connect(
        { 'token': `Bearer ${token}` }, 
        frame => {
          console.log('Connected: ' + frame);

          // 구독 로직
          this.subscription = this.stompClient.subscribe(`/sub/${id}`, message => {
            console.log("구독 시작");
            const receivedMessage = JSON.parse(message.body);
            this.messages.push({
              senderId: receivedMessage.senderId,
              senderName: receivedMessage.senderName,
              contents: receivedMessage.contents,
              senderProfileImgUrl: receivedMessage.senderProfileImgUrl,
              createdAt: receivedMessage.createdAt
            });
            this.scrollToBottom();  // 새로운 메시지 수신 시 스크롤 하단으로 이동
          });

          this.isSubscribed = true;  // 구독 완료 상태 설정
        },
        error => {
          console.error('Connection error:', error);
          setTimeout(() => this.connect(id), 5000);  // 연결 실패 시 재시도
        }
      );
    },
    async sendMessage() {
      if (this.messageToSend.trim() !== '') {
        if (this.stompClient && this.stompClient.connected) {
          const message = {
            chatRoomId: this.chatRoomId,
            contents: this.messageToSend,
            token: localStorage.getItem('token')             
          };

          this.stompClient.send(`/pub/${this.chatRoomId}`, {}, JSON.stringify(message));
          this.messageToSend = '';  // 입력 필드 초기화
          this.scrollToBottom();
        } else {
          console.error('STOMP client is not connected.');  // 연결되지 않았을 때의 에러 처리
          alert('채팅 서버에 연결되지 않았습니다.');  // 사용자에게 알림
        }
      }
    },
    disconnect() {
      return new Promise((resolve, reject) => {  
        if (this.stompClient && this.stompClient.connected) {
          // 구독 해제
          if (this.subscription) {
            this.subscription.unsubscribe();  // 구독 해제
            this.isSubscribed = false;  // 구독 상태 초기화
          }
          try {
            this.stompClient.disconnect(() => {
              this.stompClient = null;  // stompClient 초기화
              resolve();
            });
          } catch (error) {
            reject(error);
          }
        } else {
          resolve();  // 이미 연결되지 않은 상태일 경우
        }
      });
    },
    async selectChatRoom(id) {
      this.selectedChatRoomId = id;  // 선택한 채팅방 ID
      this.chatRoomId = id;  // 채팅방 ID
      this.loadCSbyChatRoomId(id);  // 채팅방 ID로 CS 조회
      this.scrollToBottom();
      try {
        this.messages = [];
        await this.disconnect();  // 기존 연결 해제
        await this.connect(id);  // 해당 채팅방 ID로 웹소켓 연결
        await this.loadChatMessages(id);  // 해당 채팅방 메시지 리스트 조회

        const member = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/member/info/chatroom/${id}`);
        this.memberInfo = member.data.result;
        this.$nextTick(() => {
          this.$refs.csChatList.fetchCsList();  // memberInfo가 설정된 후 호출
        });

      } catch (e) {
        console.error(e);
      }
    },
    async loadChatMessages(id) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/${id}/messages`);
        this.messages = response.data.result;
      } catch (error) {
        console.error(error);
      }
    },
    async loadAdminChatList() {
      try {
        const params = { page: this.currentPage - 1 };
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/list/admin`, { params });
        this.chatRoomList = response.data.result.content;
        this.totalPages = response.data.result.totalPages;
      } catch (error) {
        console.error(error);
      }
    },
    async loadCSbyChatRoomId(id) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/cs/detail/chatroom-id/${id}`);
        const result = response.data.result;
        if (result && result.length > 0) {
          this.csContents = result[0].csContents;
          this.csStatus = result[0].csStatus;
          this.csId = result[0].id;
          this.isEditMode = false;
          this.hasCsData = true;
        } else {
          this.csContents = '';
          this.csStatus = '';
          this.isEditMode = true;
          this.hasCsData = false;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async saveConsultation() {
      const selectedStatus = this.statusItems.find(item => item.value === this.csStatus)?.key;
      const body = {
        chatRoomId: this.chatRoomId,
        csContents: this.csContents,
        csStatus: selectedStatus
      };
      
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/cs/create`, body);
        console.log(response)
        this.csPostModal = true;
        this.csPostModalTitle = 'CS 상담내용 저장 완료';
        this.csPostModalContents = 'CS 상담 내용이 성공적으로 저장되었습니다!';
        this.$refs.csChatList.fetchCsList();
        this.isEditMode = false;
        this.loadCSbyChatRoomId(this.chatRoomId);
      } catch (error) {
        console.error(error);
      }
    },
    async updateConsultation() {
      const selectedStatus = this.statusItems.find(item => item.value === this.csStatus)?.key;
      const body = {
        id: this.csId,
        chatRoomId: this.chatRoomId,
        csContents: this.csContents,
        csStatus: selectedStatus
      };
      
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/cs/update`, body);
        console.log(response)
        this.csPostModal = true;
        this.csPostModalTitle = 'CS 상담내용 수정 완료';
        this.csPostModalContents = 'CS 상담 내용이 성공적으로 수정되었습니다!';
        this.$refs.csChatList.fetchCsList();
        this.isEditMode = false;
        this.loadCSbyChatRoomId(this.chatRoomId);
      } catch (error) {
        console.error(error);
      }
    },
    async deleteCsData() {
      try {
        const response = await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/member-service/cs/delete/${this.csId}`);
        console.log(response)
        this.csPostModal = true;
        this.csPostModalTitle = 'CS 상담내용 삭제 완료';
        this.csPostModalContents = 'CS 상담 내용이 성공적으로 삭제되었습니다!';
        this.$refs.csChatList.fetchCsList();
        this.isEditMode = false;
        this.loadCSbyChatRoomId(this.chatRoomId);
      } catch (error) {
        console.error(error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    scrollToBottom() {
      const chatBox = document.querySelector('.chat-box');
      if (chatBox) {
        setTimeout(() => {
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
      }
    },
    toggleEditMode() {
      this.isEditMode = !this.isEditMode;
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
/* 알림 카드의 투명도 적용 */
.notification-card {
  background-color: rgba(244, 242, 242, 0.9) !important;
  color: black !important;
  border-radius: 20px;
  padding: 10px;
  margin-bottom: 1px;
}
/* 알림 카드의 투명도 적용 */
.no-notification-card {
  background-color: rgba(244, 242, 242, 0.5) !important;
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