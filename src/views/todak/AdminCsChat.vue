<template>
  <v-container class="custom1-container">
    <v-row justify="center">
      <v-col cols="12" sm="9" md="8" lg="7">
        <!-- 프로필 섹션 -->
        <v-row>
          <v-col cols="3">
          </v-col>
          <v-col cols="9">
            <div class="cs-text"><img src="@/assets/myreserve.png" alt="TodakTodak Logo" class="logo-image" />고객 센터
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <div class="dashboard-cards">
      <div class="cslist-box">
        <div class="subtitle inter-bold">나문희 내역</div>
        <div v-for="cs in paginatedCsList" :key="cs.id">
          <div class="reservation" @click="savedMessage(cs.chatRoom)">
            <div>
              <div class="cs">
                <span>{{ cs.senderName }} </span> <span>{{ cs.date }}</span><br>
                {{ cs.lastMessage }}
              </div>
            </div>
          </div>
        </div>
        <!-- Pagination -->
        <v-pagination v-model="csPage" :length="csTotalPages" :total-visible="2" class="pagination"
          color="primary"></v-pagination>
      </div>
      <div class="cschat-box">
        <div class="chat-box">
          <div v-for="(message, index) in messages" :key="index"
            :class="['message', { 'my-message': message.senderName === currentUserName, 'other-message': message.senderName !== currentUserName }]">
            <strong>{{ message.senderName }}:</strong> {{ message.content }}
          </div>
        </div>

        <div class="input-box">
          <input v-model="messageToSend" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
          <button @click="sendMessage">전송</button>
        </div>
      </div>
      <div class="list-box">
        <div v-if="memberInfo" style="border-bottom: 1px solid" class="user-info">
          <img :src='memberInfo.profileImgUrl' class="profile-img" />
          <div style="display: inline-block;">
            <p class="user-name">{{ memberInfo.name }}</p>
            <p class="user-type">{{ role }}</p>
          </div>
        </div>
        <div class="consultation-form">
          <div class="header">
            <p>상담내용</p>
            <div style="margin-top: -20px;">
              <span>✏️</span>
              <span>🗑️</span>
            </div>
          </div>
          <textarea v-model="consultationContent" class="textarea"></textarea>
          <div class="footer">
            <div class="status-section">
              <p>처리상태</p>
              <select v-model="status" class="status-select">
                <option v-for="item in statusItems" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>
            <button @click="saveConsultation" class="save-btn">저장</button>
          </div>
        </div>
        <div class="cs-list">
          <AdminCsListForCsChat v-if="memberInfo" :member-id="memberInfo.id"/>
        </div>
      </div>
    </div>
  </v-container>
  <MyPageSideBar />
</template>

<script>
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useRoute } from 'vue-router';
import MyPageSideBar from "@/components/sidebar/MyPageSideBar.vue";
import AdminCsListForCsChat from "./AdminCsListForCsChat.vue";
import axios from "axios";

export default {
  components: {
    MyPageSideBar,
    AdminCsListForCsChat,
  },
  data() {
    return {
      stompClient: null,
      currentUserName: null,
      messageToSend: '',
      messages: [], // 수신된 메시지 저장
      chatRoomId: '',  // 채팅방 id
      memberEmail: '',
      chatRoomList: [],
      itemsPerPage: 10,
      csPage: 1,
      memberInfo: null,
      role: null,
      consultationContent: '',
      status: '처리중',
      statusItems: ['처리중', '완료', '보류'],
    };
  },
  created() {
    const route = useRoute();
    this.chatRoomId = route.params.chatRoomId;
    this.listChatRoom();
  },
  methods: {
    connect(id) {
      this.chatRoomId = id;
      const socket = new SockJS('http://localhost:8080/member-service/ws/chat');
      this.stompClient = Stomp.over(socket);

      // JWT 토큰을 localStorage에서 가져와 auth-token으로 설정
      const token = localStorage.getItem('token');
      this.currentUserName = localStorage.getItem('name');
      this.stompClient.connect({
        'token': `Bearer ${token}`  // 토큰을 헤더로 전송
      }, frame => {
        console.log('Connected: ' + frame);

        this.stompClient.subscribe(`/sub/${id}`, message => {
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
    async savedMessage(id) {
      try {
        this.messages = [];
        this.connect(id);
        const member = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/member/info/${id}`);
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/${id}/messages`);
        response.data.result.forEach(message => {
          this.messages.push({
            senderName: message.senderName,
            content: message.contents,
          })
        });
        this.memberInfo = member.data;
        if (this.memberInfo.role == 'Member') {
          this.role = '일반회원'
        }
        else if (this.memberInfo.role == 'Doctor') {
          this.role = '의사회원'
        } else if (this.memberInfo.role == 'HospitalAdmin') {
          this.role = '병원관리자회원'
        }

      } catch (e) {
        console.error(e);
      }
    },
    async listChatRoom() {
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/list/admin`);
      response.data.result.forEach(list => {
        this.chatRoomList.push({
          chatRoom: list.chatRoomId,
          senderName: list.senderName,
          lastMessage: list.lastMessage,
          date: this.formatDate(list.recentChatTime.split('T')[0])
        })
      })
    },
    formatDate(data) {
      return data.replaceAll("-", ". ")
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
  },
  computed: {
    csTotalPages() {
      return Math.ceil(this.chatRoomList.length / this.itemsPerPage);
    },
    paginatedCsList() {
      const start = (this.csPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.chatRoomList.slice(start, end);
    },
  }
};
</script>

<style scoped>
* {
  user-select: none;
}

.custom1-container {
  width: 1300px;
}

.cs-text {
  font-weight: 700;
  font-size: 30px;
  margin-left: -35px;
  color: #00499E;
}

.logo-image {
  width: 50px;
  max-width: 100%;
  height: auto;
  object-fit: contain;
  margin-right: 10px;
}

.chat-box {
  height: 500px;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 10px;
  background-color: white;
}

.dashboard-cards {
  display: flex;
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

/* 로그인한 사용자의 메시지 (오른쪽 정렬) */
.my-message {
  align-self: flex-end;
  text-align: right;
}

/* 상대방의 메시지 (왼쪽 정렬) */
.other-message {
  align-self: flex-start;
  text-align: left;
}

.list-box {
  background-color: #F7F7F7;
  padding: 10px;
  margin: 10px 10px;
  min-height: 580px;
  width: 500px;
  border-radius: 10px;
  position: relative;
  padding-bottom: 90px;
}

.cslist-box {
  background-color: #F7F7F7;
  margin: 10px 10px;
  min-height: 580px;
  border-radius: 10px;
  position: relative;
  padding-bottom: 90px;
  width: 250px;
}

.cschat-box {
  background-color: #F7F7F7;
  margin: 10px 10px;
  min-height: 580px;
  border-radius: 10px;
  position: relative;
  padding-bottom: 90px;
  width: 500px;
}

.cs-user {
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  height: 270px;
}

.cs-list {
  background-color: white;
  margin-top: 20px;
  border-radius: 10px;
  min-height: 330px;
}

.subtitle {
  text-align: center;
  font-size: 20px;
  color: #0066FF;
  margin: 10px 0;
}

.cs {
  background-color: white;
  height: 80px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  margin-right: 40px;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
}

.profile-img {
  margin-top: -20px;
  height: 50px;
  width: 50px;
  border-radius: 50px;
  margin-right: 15px;
  background-color: #00499E;
}

.user-info {
  display: flex;
  align-items: center;
  /* 이미지와 텍스트를 수직으로 중앙에 정렬 */
  border-bottom: 1px solid #B3B3B3;
  padding-bottom: 10px;
}

.user-name {
  font-weight: bold;
}

.user-type {
  margin-top: -15px;
  color: #606060;
  font-size: 13px;
}

.cs-message {
  font-family: 'Inter';
}

.consultation-form {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
}

.textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-section {
  display: flex;
  align-items: center;
}

.status-section p {
  margin-right: 10px;
}

.status-select {
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.save-btn {
  padding: 8px 16px;
  background-color: #90CAF9;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
