<template>
    <div class="chat-container">
      <h2>1:1 CS 채팅</h2>
      
      <div class="chat-box">
        <div v-for="(message, index) in messages" :key="index" class="message">
          <strong>{{ message.senderName }}:</strong> {{ message.content }}
        </div>
      </div>
      
      <div class="input-box">
        <input v-model="messageToSend" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
        <!-- <input v-model="memberEmail" placeholder="송신자 이메일"/> -->
        <button @click="sendMessage">전송</button>
      </div>
    </div>
    <MyPageSideBar/>  
  </template>
  
  <script>
    import { Stomp } from "@stomp/stompjs";
    import SockJS from "sockjs-client";
    import MyPageSideBar from "@/components/sidebar/MyPageSideBar.vue";
  
  export default {
    components:{
      MyPageSideBar
    },
    data() {
      return {
        stompClient: null,
        messageToSend: '',
        messages: [], // 수신된 메시지 저장
        chatRoomId: 1, // 테스트를 위한 chatRoomId 
        memberEmail: '',

      };
    },
    mounted() {
      this.connect();
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
  }
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
</style>
