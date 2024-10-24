<template>
<v-container class="outer-box">
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
    <v-row>
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
                            <v-img :src="chatRoom.senderProfileImgUrl" alt="Profile Image" />
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
</style>
