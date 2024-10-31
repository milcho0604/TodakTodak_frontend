<template>
  <v-container id="messageContainer">
    <!-- 채팅방 헤더 -->
    <v-app-bar app scroll-behavior="elevate">
      <img src="@/assets/todak-new-logo-removebg.png" alt="TodakTodak Logo" class="logo-image ml-3" />
      <v-spacer></v-spacer> <!-- 좌우 정렬을 위한 공간 -->
      <v-btn icon @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-btn icon @click="goForward">
          <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
      <v-btn icon @click="reloadChatRooms">
          <v-icon :class="{ 'rotate': isReloading }">mdi-refresh</v-icon>
      </v-btn>
    </v-app-bar>

    <div>
      <div class="chat-box" ref="chatBox" id="chat-box">
        <div 
          v-for="(message, index) in messages" 
          :key="index" 
          :class="['message', { 'my-message': message.senderName === currentUserName, 'other-message': message.senderName !== currentUserName }]"
        >
          <div class="message-wrapper">
            <v-avatar size="60" class="mx-2">
              <v-img :src="message.senderProfileImgUrl ? message.senderProfileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png'"></v-img>
            </v-avatar>
            <div class="message-content mx-2">
                {{ message.contents }}
            </div>
          </div>
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
      messageToSend: '',
      messages: [],
      chatRoomId: null,
      memberEmail: '',
      isReloading: false,
      memberInfo: [],
      myId: '',
      currentUserName: null,
      isSubscribed: false,
    };
  },
  created(){
    this.chatRoomId = this.$route.params.chatRoomId;
    this.currentUserName = localStorage.getItem('name'); 
  },
  async mounted() {
    this.connect();
    await this.loadChatMessages();
    this.scrollToBottom();
  },
  onBeforeUnmount() {
    this.disconnect();
  },
  updated() {
    this.scrollToBottom();
  },
  methods: {
    connect() {
      const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/member-service/ws/chat`); 
      this.stompClient = Stomp.over(socket);

      const token = localStorage.getItem('token');
      this.stompClient.connect(
        { 'token': `Bearer ${token}` },
        (frame) => {
          console.log('Connected: ' + frame);
          
          if (!this.isSubscribed) {
            this.subscription = this.stompClient.subscribe(
              `/sub/${this.chatRoomId}`,
              (message) => {
                const receivedMessage = JSON.parse(message.body);
                this.messages.push({
                  senderId: receivedMessage.senderId,
                  senderName: receivedMessage.senderName,
                  contents: receivedMessage.contents,
                  senderProfileImgUrl: receivedMessage.senderProfileImgUrl,
                  createdAt: receivedMessage.createdAt
                });
                this.scrollToBottom();
              }
            );
            this.isSubscribed = true;
          }
        },
        (error) => {
          console.error('Connection error:', error);
          setTimeout(() => {
            this.connect();
          }, 5000);
        }
      );
    },
    sendMessage() {
      if (this.messageToSend.trim() !== '') {
        if (this.stompClient && this.stompClient.connected) {
          const message = {
            chatRoomId: this.chatRoomId,
            contents: this.messageToSend,
            token: localStorage.getItem('token')             
          };

          this.stompClient.send(`/pub/${this.chatRoomId}`, {}, JSON.stringify(message));
          this.messageToSend = '';
          this.scrollToBottom();
        } else {
          console.error('STOMP client is not connected.');
          alert('채팅 서버에 연결되지 않았습니다.');
        }
      }
    },
    disconnect() {
      if (this.stompClient && this.stompClient.connected) {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
        this.stompClient.disconnect();
        this.isSubscribed = false;
        console.log("Disconnected from WebSocket");
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    goForward() {
      this.$router.go(1);
    },
    reloadChatRooms() {
      this.rotateAnimation();
      this.loadChatMessages();
    },
    rotateAnimation(){
      this.isReloading = true;
      setTimeout(() => {
          this.isReloading = false;
      }, 1000);
    },
    async loadChatMessages(){
      try{
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/${this.chatRoomId}/messages`);
        this.messages = response.data.result;
        console.log(response.data);
      }catch(error){
        console.log(error);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    scrollToBottom() {
      const chatBox = this.$refs.chatBox;
      if (chatBox) {
        setTimeout(() => {
          chatBox.scrollTop = chatBox.scrollHeight;
        }, 10);
      }
    },
  }
};
</script>

<style scoped>
.chat-box {
  min-height: 600px;
  overflow-y: auto;
  margin-bottom: 40px;
  width: 100%;
}

.input-box {
  display: flex;
  gap: 10px;
  position: fixed;
  bottom: 0;
  background-color: white;
  align-self: center;
  width: 100%;
  padding: 10px;
  z-index: 1000;
}

.message-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.my-message .message-wrapper {
  flex-direction: row-reverse;
}

.message-content {
  max-width: 60%;
  padding: 10px;
  border-radius: 10px;
  background-color: #f1f1f1;
}

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

.my-message .message-content {
  background-color: #007bff;
  color: #FFFFFF;
  text-align: left;
}

.other-message .message-content {
  background-color: #EFEFEF;
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
  width: 150px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
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
