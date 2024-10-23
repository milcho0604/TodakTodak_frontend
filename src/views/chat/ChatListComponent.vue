<template>
    <v-container class="outer-box">
        <!-- 채팅방 리스트 -->
        <v-row>
          <v-col cols="12" >
            <!-- 채팅방 카드 -->
            <v-card 
            class="list-card mb-3" 
            variant="flat"
            v-for="chatRoom in chatRoomList" 
            :key="chatRoom.chatRoomId"
            >
                <v-row>
                    <v-col cols=2>
                        <!-- 송신자 프로필 이미지 -->
                        <v-avatar size="60" class="sender-avatar mx-3 my-3">
                            <v-img :src="chatRoom.senderProfileImgUrl" alt="Profile Image" />
                        </v-avatar>
                    </v-col>
                    <v-col cols="10">
                        <v-row class="d-flex justify-space-between">
                            <!-- 송신자 이름 -->
                            <v-card-title class="mt-3 ml-3">
                                <span>{{ chatRoom.senderName }}</span>
                            </v-card-title>
                            
                            <!-- 채팅 보낸 시각 -->
                            <v-card-title class="mt-3 mr-3">
                            <span class="text-subtitle-2">{{ formatDate(chatRoom.recentChatTime) }}</span>
                            </v-card-title>
                        </v-row>
                        <v-row>
                            <!-- 마지막 채팅 메시지 -->
                            <v-card-subtitle class="ml-3">
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
}
</style>
