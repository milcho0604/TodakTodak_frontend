<template>
<v-container class="outer-box">
    <!-- 채팅 리스트 헤더 -->
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

    <!-- 채팅방 리스트 -->
    <v-row class="chat-list">
        <!-- 채팅방이 없는 경우 표시할 메시지 -->
        <v-col cols="12" v-if="chatRoomList.length === 0">
            <p class="text-center text-subtitle-1 mt-5">아직 참여 중인 채팅방이 없습니다.</p>
        </v-col>
        
        <v-col cols="12" >
            <!-- 채팅방 카드 -->
            <v-card 
            class="list-card mb-3" 
            variant="flat"
            v-for="chatRoom in chatRoomList" 
            :key="chatRoom.chatRoomId"
            @click="toChatRoom(chatRoom.chatRoomId)"
            >
                <v-row>
                    <v-col cols=2>
                        <!-- 송신자 프로필 이미지 -->
                        <v-avatar size="70" class="sender-avatar mx-3 my-3">
                            <v-img :src="chatRoom.senderProfileImgUrl ? chatRoom.senderProfileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png'" 
                            alt="Profile Image" />
                        </v-avatar>
                    </v-col>
                    <v-col cols="10">
                        <v-row class="d-flex justify-space-between">
                            <!-- 송신자 이름 -->
                            <v-card-title class="mt-3 ml-3" style="font-weight:bold; font-size:20px;">
                                <span>{{ chatRoom.senderName }}</span>
                            </v-card-title>
                            
                            <!-- 채팅 보낸 시각 -->
                            <v-card-title class="mt-3 mr-3">
                            <span class="text-subtitle-1">{{ formatDate(chatRoom.recentChatTime) }}</span>
                            </v-card-title>
                        </v-row>
                        <v-row>
                            <!-- 마지막 채팅 메시지 -->
                            <v-card-subtitle class="ml-3" style="font-size:16px;">
                                {{ chatRoom.lastMessage }}
                            </v-card-subtitle>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>
    </v-row>
    <!-- 새로운 채팅방 만들기 버튼 -->
    <v-btn 
      class="create-chat-btn" 
      @click="createNewChatRoom"
      fab
      dark
      variant="flat"
      elevation="2"
    >
        <img src="@/assets/cs_center_image.png" alt="TodakTodak Logo" class="cs-image" />
    </v-btn>

</v-container>
</template>
<script>
import axios from 'axios'
// import { useRouter } from 'vue-router'

export default{
    data(){
        return{
            chatRoomList:[],
            selectedChatRoomId: '',
            isReloading: false, // 로딩 상태
            createdChatRoomId: '' // 채팅방 생성후 return 된 채팅방id
        }

    },
    components:{

    },
    created(){

    },
    mounted(){
        this.loadMemberChatList();
    },
    methods:{
        // 회원이 속한 채팅방 리스트 (회원입장 채팅방 리스트)
        async loadMemberChatList(){
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/list/member`);
                this.chatRoomList = response.data.result.content;
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        },
        // 날짜 포맷팅 함수
        formatDate(date) {
        return new Date(date).toLocaleString();
        },
        toChatRoom(chatRoomId){
            this.$router.push(`/chat/${chatRoomId}`); // 선택한 채팅방으로 경로 이동
        },
        async createNewChatRoom() {
            try{
                // http://localhost:8080/member-service/chat/chatroom/create
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/create`);
                this.createdChatRoomId = response.data.result;
                this.$router.push(`/chat/${this.createdChatRoomId}`); // 생성된 채팅방으로 이동
            }catch(error){
                console.log(error);
            }
        },
        goBack() {
            this.$router.go(-1); // 뒤로가기 (히스토리에서 이전 페이지로 이동)
        },
        goForward() {
            this.$router.go(1); // 앞으로가기 (히스토리에서 다음 페이지로 이동)
        },
        // 새로고침 아이콘 클릭 시 호출되는 함수
        reloadChatRooms() {
            this.rotateAnimation(); // 애니메이션 시작
            this.loadMemberChatList(); // 채팅방 리스트 다시 불러오기
        },
        rotateAnimation(){
            this.isReloading = true;
    
            // 1초 후에 애니메이션 종료
            setTimeout(() => {
                this.isReloading = false;
            }, 1000);
        }
    }
}
</script>
<style scoped>
.outer-box {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0px !important;
    min-width: 350px;
    border: 2px solid #DBDBDB; /* 테두리 색상만 변경 */
}
.text-center {
    text-align: center;
}  
.sender-avatar{
    object-fit: cover;
    width: 100%;
    height: 100%;
}
.list-card{
    background-color:#f7f7f7;
    border-radius: 10px;
}
.selected-card {
    background-color: #C2D7FF !important; /* 선택된 카드의 배경색 */
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
.chat-list {
    position: relative; /* 부모 요소를 relative로 설정 */
  }
  
.create-chat-btn {
    width: 80px; /* 버튼의 폭 */
    min-height: 80px; /* 버튼의 높이 */
    position: fixed; /* 화면에 고정 */
    bottom: 50px; /* 아래에서의 거리 */
    right: 30px; /* 오른쪽에서의 거리 */
    z-index: 1000; /* 다른 요소들 위에 나타나도록 설정 */
    border-radius: 100px; /* 동그라미 모양 */
    overflow: hidden; /* 자식 요소가 버튼을 넘치지 않도록 설정 */
    display: flex; /* 버튼의 자식 요소를 중앙 정렬 */
    align-items: center; /* 수직 중앙 정렬 */
    justify-content: center; /* 수평 중앙 정렬 */
}
.cs-image{
    width: 80px; 
    height: 100%; 
    object-fit: contain; /* 이미지 비율 유지 */
    box-sizing: border-box; /* padding과 border를 포함한 크기 계산 */
}
</style>
