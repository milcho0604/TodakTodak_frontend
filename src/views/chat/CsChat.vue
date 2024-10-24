<template>
    <v-container class="chat-container">
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
      </v-app-bar>

      <h2>{{this.chatRoomId}}번 채팅방</h2>
      
      <div class="chat-box">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <strong>{{ message.senderName }}:</strong> {{ message.content }}
        </div>
      </div>
      
      <div class="input-box">
        <input v-model="messageToSend" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
        <button @click="sendMessage">전송</button>
      </div>
    </v-container>
  </template>
  
  <script>
    import { Stomp } from "@stomp/stompjs";
    import SockJS from "sockjs-client";
    // import { useRoute } from 'vue-router';
    // import axios from 'axios';
  
  export default {
    props: {

    },
    components:{

    },
    data() {
      return {
        stompClient: null,
        messageToSend: '',
        messages: [], // 수신된 메시지 저장
        chatRoomId: null,  // 채팅방 id
        memberEmail: '',

      };
    },
    created(){
      // this.$route.params를 사용하여 채팅방 ID를 가져옴
      this.chatRoomId = this.$route.params.chatRoomId;
    },
    mounted() {
      this.connect();
    },
    watch: {
      '$route.params.chatRoomId': {
        immediate: true,
        handler(newValue) {
          this.chatRoomId = newValue;
        }
      }
    },
    methods: {
      connect() {
      const socket = new SockJS('http://localhost:8080/member-service/ws/chat'); 
      this.stompClient = Stomp.over(socket);

      // JWT 토큰을 localStorage에서 가져와 auth-token으로 설정
      const token = localStorage.getItem('token');
      this.stompClient.connect({
        'token': `Bearer ${token}`  // 토큰을 헤더로 전송
      }, frame => {
        console.log('Connected: ' + frame);

        this.stompClient.subscribe(`/sub/${this.chatRoomId}`, message => {
          console.log("구독시작");
          const receivedMessage = JSON.parse(message.body);
          this.messages.push({
            senderName: receivedMessage.senderName,
            content: receivedMessage.contents
          });
          console.log(this.messages);
          console.log("receivedMessage")
          console.log(receivedMessage)
        });
      }, error => {
        console.error('Connection error:', error);
        setTimeout(() => {
          this.connect(); // 연결 실패 시 재시도
        }, 5000);
      });
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
        this.messageToSend = ''; // 입력 필드 초기화
      } else {
        console.error('STOMP client is not connected.'); // 연결되지 않았을 때의 에러 처리
        alert('채팅 서버에 연결되지 않았습니다.'); // 사용자에게 알림
      }
    }
  // },
  // handleIncomingMessage(receivedMessage){
  //   // if(this.isChatPageActive){
  //     this.message.push(message);
  //       this.messages.push({
  //         senderName: receivedMessage.senderName,
  //         content: receivedMessage.contents
  //       });
  //       //페이지 비활성화 -> 알림
  //   if(!this.isChatPageActive){
  //     this.sendPushNotification(receivedMessage);
  //   }
  // },
  // sendPushNotification(message){
  //   //FCM 알림 전송 로직 추가
  //   console.log(`${message.senderName}: ${message.contents}`);
  //   //여기에 fcm 알림 보내는 코드 추가
    
  // },
  // setChatPageActive(isActive){
  //   this.isChatPageActive = isActive;
  },
  goBack() {
      this.$router.go(-1); // 뒤로가기 (히스토리에서 이전 페이지로 이동)
  },
  goForward() {
      this.$router.go(1); // 앞으로가기 (히스토리에서 다음 페이지로 이동)
  },
}
};
</script>

<style scoped>
.chat-container {
display: flex;
flex-direction: column;
width: 400px;
margin: 0 auto;
}

.chat-box {
border: 1px solid #ccc;
height: 300px;
overflow-y: auto;
padding: 10px;
margin-bottom: 10px;
}

.message {
margin-bottom: 10px;
}

.input-box {
display: flex;
gap: 10px;
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
</style>
