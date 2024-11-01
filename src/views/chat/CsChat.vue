<template>
  <v-container  id="messageContainer">
    <!-- 채팅방 헤더 -->
    <v-app-bar app scroll-behavior="elevate">
      <!-- 로고 이미지 -->
      <img src="@/assets/todak-new-logo-removebg.png" alt="TodakTodak Logo" class="logo-image ml-3" />
      
      <!-- 버튼 그룹 -->
      <v-spacer></v-spacer> <!-- 좌우 정렬을 위한 공간 -->
      
      <!-- 뒤로가기 버튼 -->
      <v-btn icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
      </v-btn>

      <!-- 앞으로가기 버튼 -->
      <v-btn icon @click="goForward">
          <v-icon>mdi-arrow-right</v-icon>
      </v-btn>

      <!-- reload 버튼 -->
      <v-btn icon @click="reloadChatRooms">
          <v-icon :class="{ 'rotate': isReloading }">mdi-refresh</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- <h2>{{this.chatRoomId}}번 채팅방</h2> -->
    <div>
      <div class="chat-box" ref="chatBox" id="chat-box">
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="['message', { 'my-message': message.senderName === currentUserName, 'other-message': message.senderName !== currentUserName }]"
        >

          <!-- 메시지 발신자 이름 (외부 상단에 고정) -->
          <!-- <div class="message-sender mx-3">
            {{ message.senderName }}
          </div> -->
          <!-- 메시지 콘텐츠와 아바타 -->
          <div class="message-wrapper">
            <!-- 아바타 -->
            <v-avatar size="60" class="mx-2">
              <v-img :src="message.senderProfileImgUrl ? message.senderProfileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png'"
              ></v-img>
            </v-avatar>

            <!-- 메시지 콘텐츠 -->
            <div class="message-content mx-2">
              <!-- 메시지 본문 -->
                {{ message.contents }}
            </div>
          </div>
          <!-- 메시지 아래에 표시될 createdAt -->
          <div class="message-time mx-3">
            {{ formatDate(message.createdAt) }}
          </div>
        </div>
      </div>
      
      <div class="input-box">
        <input v-model="messageToSend" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
        <button @click="sendMessage">
          <v-icon style="color:#9A9A9A" class="mr-3">mdi-send</v-icon>
        </button>
      </div>
    </div>
  </v-container>
</template>

<script>
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from 'axios';

export default {
  data() {
    return {
      stompClient: null,
      subscription: null,
      isSubscribed: false,  // 구독 상태를 나타내는 변수
      messageToSend: '',
      messages: [],  // 수신된 메시지 저장
      chatRoomId: null,  // 채팅방 id
      memberEmail: '',
      isReloading: false,  // 로딩 상태
      memberInfo: [],  // 채팅참여자(상대방) 정보
      myId: '',  // 현재 접속자 id
      currentUserName: null,
    };
  },
  created() {
    this.chatRoomId = this.$route.params.chatRoomId;
    this.currentUserName = localStorage.getItem('name');
  },
  async mounted() {
    await this.initializeChat(); // 초기화 과정에서 connect와 메세지 로드 실행
    window.addEventListener('beforeunload', this.disconnect);
  },
  beforeUnmount() {
    this.disconnect();
    window.removeEventListener('beforeunload', this.disconnect);
  },
  watch: {
    '$route.params.chatRoomId': {
      immediate: true,
      handler(newValue) {
        if (newValue !== this.chatRoomId) {
          this.chatRoomId = newValue;
          this.initializeChat();  // 채팅방 ID가 변경될 때 새로 연결
        }
      }
    }
  },
  methods: {
    async initializeChat() {
      await this.disconnect(); // 기존 연결 해제
      this.messages = []; // 메시지 초기화
      this.connect(); // 새 연결 시작
      await this.loadChatMessages(); // 채팅 메시지 로드
      this.scrollToBottom(); // 스크롤을 하단으로 이동
    },
    connect() {
      if (this.isSubscribed) return;  // 이미 구독된 경우 실행하지 않음

      const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/member-service/ws/chat`);
      this.stompClient = Stomp.over(socket);

      const token = localStorage.getItem('token');
      this.stompClient.connect(
        { 'token': `Bearer ${token}` },
        frame => {
          console.log('Connected: ' + frame);

          // 구독 로직
          this.subscription = this.stompClient.subscribe(`/sub/${this.chatRoomId}`, message => {
            const receivedMessage = JSON.parse(message.body);
            this.messages.push(receivedMessage);
            this.scrollToBottom();
          });

          this.isSubscribed = true;  // 구독 완료 상태로 설정
        },
        error => {
          console.error('Connection error:', error);
          setTimeout(this.connect, 5000);  // 연결 실패 시 재시도
        }
      );
    },
    sendMessage() {
      if (this.messageToSend.trim() !== '') {
        if (this.stompClient && this.stompClient.connected) {
          const message = {
            chatRoomId: this.chatRoomId,
            contents: this.messageToSend,
            token: localStorage.getItem('token'),
          };

          this.stompClient.send(`/pub/${this.chatRoomId}`, {}, JSON.stringify(message));
          this.messageToSend = '';  // 입력 필드 초기화
          this.scrollToBottom();
        } else {
          console.error('STOMP client is not connected.');
          alert('채팅 서버에 연결되지 않았습니다.');
        }
      }
    },
    disconnect() {
      return new Promise((resolve, reject) => {
        if (this.stompClient && this.stompClient.connected) {
          if (this.subscription) {
            this.subscription.unsubscribe();
            this.isSubscribed = false;
          }
          try {
            this.stompClient.disconnect(() => {
              this.stompClient = null;
              resolve();
            });
          } catch (error) {
            reject(error);
          }
        } else {
          resolve();
        }
      });
    },
    async loadChatMessages() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/${this.chatRoomId}/messages`);
        this.messages = response.data.result;
      } catch (error) {
        console.log(error);
      }
    },
    scrollToBottom() {
      const chatBox = document.getElementById('chat-box');
      if (chatBox) {
        setTimeout(() => {
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 10);
      }
    },
  },
};
</script>



<style scoped>
.chat-box {
/* border: 1px solid #ccc; */
min-height: 600px;
overflow-y: auto;
margin-bottom: 40px; /* input-box의 높이만큼 여백 추가 */
width: 100%; /* 너비를 100%로 설정 */
}

.input-box {
display: flex;
gap: 10px;
position: fixed; /* 화면의 하단에 고정 */
bottom: 0; /* 하단에서 0px 떨어진 위치 */
background-color: white; /* 배경색을 흰색으로 설정 */
align-self: center;
width: 100%; /* 너비를 100%로 설정하여 부모 요소에 맞춤 */
padding: 10px; /* 내부 여백 */
z-index: 1000;

}

/* 아바타와 메시지를 감싸는 래퍼 */
.message-wrapper {
display: flex;
align-items: center;
margin-bottom: 10px;
}

.my-message .message-wrapper {
flex-direction: row-reverse; /* 내가 보낸 메시지일 때 콘텐츠와 아바타 순서 변경 */
}

.message-content {
max-width: 60%;
padding: 10px;
border-radius: 10px;
background-color: #f1f1f1;
}

/* 메시지 발신자 이름은 말풍선 위에 */
.message-sender {
font-weight: bold;
margin-bottom: 5px;
}

.my-message .message-sender {
text-align: right;
}

.other-message .message-sender {
text-align: left;
}

/* 메시지 본문은 중앙 */
.message-bodys {
padding: 5px 0;
}

/* 메시지 시간은 말풍선 아래에 */
.my-message .message-time {
font-size: 0.8em;
color: #888;
margin-top: 5px;
text-align: right;
margin-bottom: 5px;
}  

/* 메시지 시간은 말풍선 아래에 */
.other-message .message-time {
font-size: 0.8em;
color: #888888;
margin-top: 5px;
text-align: left;
margin-bottom: 5px;
}  

.my-message .message-content {
background-color: #007bff; /* 내가 보낸 메시지 색상 */
color: #FFFFFF;
text-align: left;
}

.other-message .message-content {
background-color: #EFEFEF; /* 상대방 메시지 색상 */
text-align: left;
}



input {
flex: 1;
padding: 5px;
}

button {
padding: 5px 10px;
}

.logo-image {
width: 150px; /* 원하는 고정 너비 */
max-width: 100%; /* 부모 요소 너비를 넘지 않도록 설정 */
height: auto; /* 높이는 비율에 맞춰 자동 조절 */
object-fit: contain; /* 이미지가 고정된 크기 안에서 비율을 유지 */
}

.rotate {
animation: rotate360 1s linear infinite;
}

@keyframes rotate360 {
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
}

</style>