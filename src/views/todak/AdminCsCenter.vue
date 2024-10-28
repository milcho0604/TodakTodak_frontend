<template>
  <v-container class="custom1-container">
    <!-- 전체 대시보드 영억 -->
    <div class="dashboard-cards">

      <!-- 채팅리스트 영역 -->
      <div class="cslist-box">
        <!-- 채팅 리스트 -->
        <v-container class="wisdom-outer-box">
          <!-- 채팅방 리스트 -->
          <v-row class="wisdom-chat-list">
              <!-- 채팅방이 없는 경우 표시할 메시지 -->
              <v-col cols="12" v-if="chatRoomList.length === 0">
                  <p class="text-subtitle-1 mt-5 center-text">아직 참여 중인 채팅방이 없습니다.</p>
              </v-col>
              
              <v-col cols="12" >
                <!-- 채팅방 카드 -->
                <v-card 
                class="wisdom-list-card mb-3" 
                :class="{ 'wisdom-selected-card': chatRoom.chatRoomId === selectedChatRoomId }" 
                variant="flat"
                v-for="chatRoom in chatRoomList" 
                :key="chatRoom.chatRoomId"
                @click="selectChatRoom(chatRoom.chatRoomId)"
                >
                  <v-row>
                    <v-col cols=2>
                      <!-- 송신자 프로필 이미지 -->
                      <v-avatar size="40" class="wisdom-sender-avatar mx-3 my-3">
                          <v-img :src="chatRoom.senderProfileImgUrl ? chatRoom.senderProfileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png'"
                          alt="Profile Image" />
                      </v-avatar>
                    </v-col>
                    <v-col cols="10">
                        <v-row class="d-flex justify-space-between">
                          <!-- 송신자 이름 -->
                          <v-card-title class="mt-3 ml-3" style="font-weight:bold; font-size:15px;">
                              <span>{{ chatRoom.senderName }}</span>
                          </v-card-title>
                          
                          <!-- 채팅 보낸 시각 -->
                          <v-card-title class="mt-2 mr-3">
                          <span style="font-size: 10px; color:#9A9A9A;">{{ formatDate(chatRoom.recentChatTime) }}</span>
                          </v-card-title>
                        </v-row>
                        <v-row>
                          <!-- 마지막 채팅 메시지 -->
                          <v-card-subtitle class="ml-3 mt-n2" style="font-size:13px;">
                              {{ chatRoom.lastMessage }}
                          </v-card-subtitle>
                        </v-row>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
          </v-row>
        </v-container>
        
        <!-- 페이지 네이션 -->
      </div>

      <!-- 채팅창 영역 -->
      <div class="cschat-box">
        <!-- 채팅방 -->
        <v-container  id="messageContainer" class="messageContainer">
          <div>
            <div v-if="!selectedChatRoomId">
              <!-- 선택한 채팅방이 없을 경우 -->
              <p class="text-subtitle-1 mt-5 center-text">채팅방을 선택해주세요</p>
            </div>
            <div class="chat-box">
              <div 
                v-for="(message, index) in messages" 
                :key="index" 
                :class="['message', { 'my-message': message.senderName === currentUserName, 'other-message': message.senderName !== currentUserName }]"
              >
                <!-- 메시지 콘텐츠와 아바타 -->
                <div class="message-wrapper">
                  <!-- 아바타 -->
                  <v-avatar size="50" class="mx-2">
                    <v-img :src="message.senderProfileImgUrl ? message.senderProfileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png'"/>
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
          </div>
        </v-container>
        <!-- 채팅 전송창 -->
        <div class="input-box">
          <input v-model="messageToSend" @keyup.enter="sendMessage" placeholder="메시지를 입력하세요..." />
          <button @click="sendMessage">
            <v-icon style="color:#9A9A9A">mdi-send</v-icon>
          </button>
        </div>
      </div>

      <!-- CS 영역 -->
      <div class="list-box">
        <!-- 회원정보 영역 -->
        <div v-if="memberInfo" class="user-info">
          <v-avatar size="60" class="wisdom-sender-avatar mx-3">
            <v-img :src="memberInfo.profileImgUrl ? memberInfo.profileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png'"
            />
          </v-avatar>
          <div style="display: inline-block;">
            <p class="user-name">{{ memberInfo.name }}</p>
            <p class="user-type">{{ memberInfo.role }}</p>
          </div>
        </div>

        <div class="consultation-form">
          <div class="header">
            <p>상담내용</p>
            <div style="margin-top: -20px;">
              <!-- 상담내용 수정버튼 -->
              <button v-if="hasCsData" @click="isEditMode = true">✏️</button>
              <!-- 상담내용 삭제버튼 -->
              <button v-if="hasCsData">🗑️</button>
            </div>
          </div>
          <!-- 상담내용 입력 창 -->
          <textarea 
          v-model="csContents" 
          :readonly="!isEditMode"
          class="textarea"
          :class="{ 'readonly-textarea': !isEditMode }"
          ></textarea>
          <div class="footer">
            <div class="status-section">
              <p class="mt-3">처리상태</p>
              <select v-model="csStatus" class="status-select" style="height: 35px;" :disabled="!isEditMode">
                <option v-for="item in statusItems" :key="item.key" :value="item.value">
                  {{ item.value }}
                </option>
              </select>              
            </div>
            <!-- CS 데이터가 있고 수정 모드일 때: "수정완료" -->
            <button 
            v-if="hasCsData && isEditMode" 
            @click="updateConsultation" 
            class="save-btn"
            >
            수정완료
            </button>

            <!-- CS 데이터가 없고 수정 모드일 때: "저장" -->
            <button 
            v-if="!hasCsData && isEditMode" 
            @click="saveConsultation" 
            class="save-btn"
            >
            저장
            </button>

          </div>
        </div>
        <div class="cs-list">
          <AdminCsListForCsChat v-if="memberInfo" :member-id="memberInfo.memberId" ref="csChatList"/>
        </div>
      </div>
    </div>

    <!-- 상담내용 저장,수정,삭제 완료했다는 모달 -->
    <v-dialog
    v-model="csPostModal"
    width="auto"
  >
    <v-card
      max-width="400"
      :prepend-avatar="cs"
      :text="csPostModalContents"
      :title="csPostModalTitle"
      style="border-radius: 10px;"
    >
      <template v-slot:actions>
        <v-btn
          class="ms-auto"
          text="확인"
          @click="csPostModal = false"
        ></v-btn>
      </template>
    </v-card>
  </v-dialog>
  </v-container>
  <MyPageSideBar />
</template>

<script>
import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
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
      selectedChatRoomId: null, // 선택된 채팅방 ID를 저장할 변수
      stompClient: null,
      currentUserName: null, // 현재 접속한 user 이름
      messageToSend: '', // 보낼 메시지
      messages: [], // 수신된 메시지 저장
      chatRoomId: '',  // 채팅방 id
      memberEmail: '',
      chatRoomList: [],
      itemsPerPage: 10,
      csPage: 1,
      memberInfo: null, // 채팅 건 회원정보
      memberId: '', // 채팅 건 회원id
      csContents: '', // 상담내용
      csStatus: '',
      statusItems: [
        { key: 'INPROCESS', value: '처리중' },
        { key: 'COMPLETED', value: '처리완료' }
      ],
      cs: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/cs_center_image.png',
      csPostModal: false,
      csPostModalTitle : "",
      csPostModalContents: "",
      isEditMode: true, // 편집 모드 상태 추가
      hasCsData: false, // 해당 채팅방에 존재하는 CS 데이터가 있는지
    };
  },
  created() {
    this.loadMemberChatList(); // 채팅 리스트 load
    this.currentUserName = localStorage.getItem('name');  // 현재 접속한 user 이름
  },
  onBeforeUnmount() {
      this.disconnect(); // 컴포넌트 언마운트 시 웹소켓 연결 종료
  },
  updated() {
      this.scrollToBottom(); // 메시지가 업데이트될 때 스크롤 하단으로 이동
    },
  methods: {
    connect(id) {
      this.chatRoomId = id;
      const socket = new SockJS('http://localhost:8080/member-service/ws/chat');
      this.stompClient = Stomp.over(socket);

      // JWT 토큰을 localStorage에서 가져와 auth-token으로 설정
      const token = localStorage.getItem('token');
      this.stompClient.connect({
        'token': `Bearer ${token}`  // 토큰을 헤더로 전송
      }, frame => {
        console.log('Connected: ' + frame);

        this.stompClient.subscribe(`/sub/${id}`, message => {
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
    async selectChatRoom(id) {
      this.selectedChatRoomId = id; // 선택한 채팅방 id
      this.chatRoomId = id; // 채팅방 id
      this.loadCSbyChatRoomId(id); // 채팅방 id로 CS 조회
      this.scrollToBottom();
      try {
        this.messages = [];
        this.connect(id); // 해당 채팅방 id로 웹소켓 연결
        this.loadChatMessages(id); // 해당 채팅방 메시지리스트 조회
        const member = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/member/info/chatroom/${id}`); // 채팅 걸은 회원정보
        this.memberInfo = member.data.result;
      } catch (e) {
        console.error(e);
      }
    },
    // 채팅방 메시지 리스트 조회
    async loadChatMessages(id){
      try{
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/${id}/messages`);
        this.messages = response.data.result;
        console.log(response.data);
      }catch(error){
        console.log(error);
      }
    },
    // 채팅방 리스트 (admin입장 채팅방 리스트)
    async loadMemberChatList(){
      try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/list/admin`);
          this.chatRoomList = response.data.result.content;
      } catch (error) {
          console.log(error);
      }
    },
    // 채팅방 id로 CS 조회
    async loadCSbyChatRoomId(id){
      try{
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/cs/detail/chatroom-id/${id}`);
        if (response.data.result && response.data.result.length > 0) {
          this.csContents = response.data.result[0].csContents;
          this.csStatus = response.data.result[0].csStatus;
          this.isEditMode = false; // CS 데이터가 있을 경우 읽기 전용 모드로 설정
          this.hasCsData = true; // 해당 채팅방에 CS 데이터 있음 (수정, 삭제버튼 보임)
        }else {
          this.csContents = ''; // 데이터가 없을 경우 초기화
          this.csStatus = '';
          this.isEditMode = true; // CS 데이터가 없을 경우 편집 모드로 설정
          this.hasCsData = false;
        }
      }catch(error){
        console.log(error);
      }
    },
    // 상담내용 저장(create)
    async saveConsultation(){
      // selectedStatus 조건에 맞는 item 객체가 있다면 item.key 값을 갖고, 없다면 undefined
      const selectedStatus = this.statusItems.find(item => item.value === this.csStatus)?.key;
      
      const body = {
        chatRoomId: this.chatRoomId, // 채팅방 Id
        csContents: this.csContents, // 상담내용
        csStatus: selectedStatus // 변환된 key 값 사용
      };
      
      try{
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/cs/create`, body);
        console.log(response.data);
        this.csPostModal = true;
        this.csPostModalTitle = 'CS 상담내용 저장완료',
        this.csPostModalContents = 'CS 상담내용이 성공적으로 저장되었습니다!'
        this.$refs.csChatList.fetchCsList(); // fetchCsList 호출
      }catch(error){
        console.log(error);
      }
    },
    // 날짜 포맷팅 함수
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
    scrollToBottom() {
      const chatBox = document.querySelector('.cschat-box');
      if (chatBox) {
        chatBox.scrollTop = chatBox.scrollHeight; // 최하단으로 스크롤
      }
    },
  },
  computed: {

  }
};
</script>

<style scoped>
* {
  user-select: none;
}

.custom1-container {
  /* */
  width: 100%;
  max-width: 1600px; 
  max-height: 600px;
  margin: 0 auto;
}

.dashboard-cards {
  /* */
  display: flex;
}

.list-box {
  /* */
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
  /* 채팅방 리스트 영역 */
  background-color: #F7F7F7;
  margin: 10px 10px;
  min-height: 100%;
  border-radius: 10px;
  position: relative;
  padding-bottom: 90px;
  width: 450px;
}
.wisdom-outer-box {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0px !important;
}
.wisdom-sender-avatar{
  object-fit: cover;
  width: 100%;
  height: 100%;
}
.wisdom-list-card{
  background-color:#ffffff;
  border-radius: 10px;
}
.wisdom-selected-card {
  background-color: #C2D7FF !important; /* 선택된 카드의 배경색 */
}
.wisdom-chat-list {
  position: relative; /* 부모 요소를 relative로 설정 */
}

.cschat-box {
  /* 채팅방 영역 */
  background-color: #F7F7F7;
  margin: 10px 10px;
  min-height: 580px;
  border-radius: 10px;
  position: relative;
  width: 600px;
  overflow-y: hidden; /* 내부 요소의 스크롤을 위해 overflow-y를 hidden으로 설정 */
  display: flex;
  flex-direction: column;
}

.chat-box {
  flex: 1; /* 남은 공간을 차지하게 설정 */
  height: calc(580px - 35px) !important; /* .cschat-box 높이에서 padding-bottom을 뺀 값으로 설정 */
  overflow-y: auto; /* 스크롤 가능하게 설정 */
  width: 100%;
  margin: 0 auto !important;
}

.input-box {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #ff9e9e;
  border-top: 1px solid #ddd;
}
.messageContainer{
  min-height: 580px;
  background-color: #ffffff;
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
  font-size: 0.6em;
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

.cs-user {
  /* */
  background-color: white;
  border-radius: 10px;
  padding: 10px;
  height: 270px;
}

.cs-list {
  /* */
  background-color: white;
  margin-top: 20px;
  border-radius: 10px;
  min-height: 330px;
}

.subtitle {
  /* */
  text-align: center;
  font-size: 20px;
  color: #0066FF;
  margin: 10px 0;
}

.cs {
  /* */
  background-color: white;
  height: 80px;
}

.pagination {
  /* */
  margin-top: 20px;
  display: flex;
  margin-right: 40px;
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
}

.user-info {
  /* */
  display: flex;
  align-items: center;
  /* 이미지와 텍스트를 수직으로 중앙에 정렬 */
  border-bottom: 1px solid #bfbfbf;
  padding-bottom: 10px;
}

.user-name {
  /* 회원정보 - 이름*/
  font-weight: bold;
  font-size: 17px;
  margin-top: 5px;
}

.user-type {
  /* */
  margin-top: -15px;
  margin-left: 3px;
  color: #606060;
  font-size: 15px;
}

.cs-message {
  /* */
  font-family: 'Inter';
}

.consultation-form {
  /* */
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

.header {
  /* */
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -10px;
}

.textarea {
  /* CS상담내용 작성 텍스트필드 */
  width: 100%;
  height: 100px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.readonly-textarea {
  width: 100%;
  height: 80px;
  padding: 10px;
  background-color: #f5f5f5; /* 밝은 회색 배경 */
  color: #000000; 
}

.footer {
  /* */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-section {
  /* */
  display: flex;
  align-items: center;
  height: 10px;
}

.status-section p {
  /* */
  margin-right: 10px;
}

.status-select {
  /* */
  padding: 5px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.save-btn {
  padding: 8px 16px;
  background-color: #0075FF;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  height: 35px;
}


</style>
