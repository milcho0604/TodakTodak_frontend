<template>
    <v-container  id="messageContainer">
      <div>
        <div class="chat-box">
          <div 
            v-for="(message, index) in messages" 
            :key="index" 
            :class="['message', { 'my-message': message.senderName === currentUserName, 'other-message': message.senderName !== currentUserName }]"
          >
            <!-- 메시지 콘텐츠와 아바타 -->
            <div class="message-wrapper">
              <!-- 아바타 -->
              <v-avatar size="60" class="mx-2">
                <v-img :src="message.senderProfileImgUrl"></v-img>
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
        currentUserName: null,
      };
    },
    created(){
      // this.$route.params를 사용하여 채팅방 ID를 가져옴
      this.chatRoomId = this.$route.params.chatRoomId;
      this.currentUserName = localStorage.getItem('name'); 
      
    },
    async mounted() {
      this.connect(); // 웹소켓 connect
      await this.loadChatMessages(); // 채팅메시지 리스트 조회
      this.scrollToBottom(); // 스크롤 하단으로 이동

    },
    onBeforeUnmount() {
      this.disconnect(); // 컴포넌트 언마운트 시 웹소켓 연결 종료
    },
    updated() {
      this.scrollToBottom(); // 메시지가 업데이트될 때 스크롤 하단으로 이동
    },
    methods: {
      connect() {
        const socket = new SockJS(`${process.env.VUE_APP_API_BASE_URL}/member-service/ws/chat`); 
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
            senderId: receivedMessage.senderId,
            senderName: receivedMessage.senderName,
            contents: receivedMessage.contents,
            senderProfileImgUrl: receivedMessage.senderProfileImgUrl,
            createdAt: receivedMessage.createdAt
          });
          this.scrollToBottom(); // 새로운 메시지 수신 시 스크롤 하단으로 이동

          console.log("this.message",this.messages);
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
        this.scrollToBottom();

      } else {
        console.error('STOMP client is not connected.'); // 연결되지 않았을 때의 에러 처리
        alert('채팅 서버에 연결되지 않았습니다.'); // 사용자에게 알림
      }
    }
  },
  disconnect() {
    return new Promise((resolve, reject) => {  
        if (this.stompClient && this.stompClient.connected) {
            // 구독 해제
            if (this.subscription) {
                this.stompClient.unsubscribe(this.subscription);
            }
            try {
                this.stompClient.disconnect(() => {
                    this.isConnected = false; // 연결 상태 업데이트
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        } else {
            resolve(); // 이미 연결되지 않은 상태일 경우
        }
    });
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
  // 날짜 포맷팅 함수
  formatDate(date) {
    return new Date(date).toLocaleString();
  },
  isMyMessage(message) {
        // 보낸 사람이 나인지 확인 (senderId 또는 senderEmail 사용 가능)
        return message.senderId === this.myId;
  },
  scrollToBottom() {
    // 메시지 목록을 감싸는 컨테이너 찾기
    const container = document.getElementById('messageContainer');
    const inputBox = document.querySelector('.input-box'); // 입력 박스 선택
    const inputBoxHeight = inputBox ? inputBox.offsetHeight : 0; // 입력 박스의 높이 구하기
    
    if (container) {
        // 잠시 딜레이를 주고 스크롤을 최하단으로 이동
        setTimeout(() => {
            container.scrollTop = container.scrollHeight - inputBoxHeight; // 입력 박스 높이만큼 빼줌
        }, 100);
    }
  },
  scrollToRealBottom() {
    window.scrollTo({
        top: document.body.scrollHeight
    });
  }
}
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


</style>
