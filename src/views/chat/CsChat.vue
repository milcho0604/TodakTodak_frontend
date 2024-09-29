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
        <input v-model="memberEmail" placeholder="송신자 이메일"/>
        <button @click="sendMessage">전송</button>
      </div>
    </div>
  </template>
  
  <script>
    import { Stomp } from "@stomp/stompjs";
    import SockJS from "sockjs-client";
  
  export default {
    data() {
      return {
        stompClient: null,
        messageToSend: '',
        messages: [], // 수신된 메시지 저장
        chatRoomId: 1, // 테스트를 위한 chatRoomId 
        memberEmail: ''
      };
    },
    mounted() {
      this.connect();
    },
    methods: {
        connect() {
        const socket = new SockJS('http://localhost:8080/member-service/ws/chat'); 
        this.stompClient = Stomp.over(socket);

        this.stompClient.connect({}, frame => {
            console.log('Connected: ' + frame);

            this.stompClient.subscribe(`/sub/${this.chatRoomId}`, message => {
            console.log("line43 : 구독시작")
            const receivedMessage = JSON.parse(message.body);
            this.messages.push({
                senderName: receivedMessage.senderName,
                content: receivedMessage.contents
            });
            console.log(this.messages);
            console.log(this.receivedMessage);
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
                memberEmail: this.memberEmail,
                contents: this.messageToSend
            };
            
            this.stompClient.send(`/pub/${this.chatRoomId}`, {}, JSON.stringify(message));
            this.messageToSend = ''; // 입력 필드 초기화
            } else {
            console.error('STOMP client is not connected.'); // 연결되지 않았을 때의 에러 처리
            alert('채팅 서버에 연결되지 않았습니다.'); // 사용자에게 알림
            }
        }
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
  