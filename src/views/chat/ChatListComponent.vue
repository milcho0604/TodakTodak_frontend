<template>
    <v-container class="outer-box">
        <!-- 채팅방 리스트 -->
        <v-row>
          <v-col cols="12" v-for="chatRoom in chatRoomList" :key="chatRoom.chatRoomId">
            <!-- 채팅방 카드 -->
            <v-card class="list-card " variant="flat">
              <v-row>
                <!-- 프로필 이미지 -->
                <v-col cols="2" class="d-flex flex-row justify-start text-no-wrap">
                  <v-avatar size="60" class="sender-avatar mx-3 my-3">
                    <v-img :src="chatRoom.senderProfileImgUrl" alt="Profile Image" />
                  </v-avatar>
                </v-col>
    
                <!-- 채팅방 정보 -->
                <v-col cols="10" class="d-flex flex-column justify-start text-no-wrap">
                  <v-card-title class="d-flex justify-space-between mt-2">
                    <span>{{ chatRoom.senderName }}</span>
                    <span class="text-subtitle-2">{{ formatDate(chatRoom.recentChatTime) }}</span>
                  </v-card-title>
    
                  <v-card-subtitle class="mt-n1">
                    {{ chatRoom.lastMessage }}
                  </v-card-subtitle>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
</template>
<script>
import axios from 'axios'

export default{
    data(){
        return{
            chatRoomList:[],
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
            try{
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/list/member`);
                this.chatRoomList = response.data.result.content;
            }catch(error){
                console.log(error);
            }
        },
        // 날짜 포맷팅 함수
        formatDate(date) {
        return new Date(date).toLocaleString();
        },
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
    background-color:#D2D2D2;
    max-height: 25vh;
    max-width: 100%;
    margin-bottom: 1vh;
  
}
</style>
