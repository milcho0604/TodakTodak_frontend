<template>
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
            variant="flat"
            v-for="chatRoom in chatRoomList" 
            :key="chatRoom.chatRoomId"
            @click="toChatRoom(chatRoom.chatRoomId)"
            >
                <v-row>
                    <v-col cols=2>
                        <!-- 송신자 프로필 이미지 -->
                        <v-avatar size="70" class="wisdom-sender-avatar mx-3 my-3">
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
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/chat/chatroom/list/admin`);
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
    }
}
</script>
<style scoped>
.wisdom-outer-box {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 0px !important;
    min-width: 350px;
}
.wisdom-text-center {
    text-align: center;
}  
.wisdom-sender-avatar{
    object-fit: cover;
    width: 100%;
    height: 100%;
}
.wisdom-list-card{
    background-color:#f7f7f7;
    border-radius: 10px;
}
.wisdom-selected-card {
    background-color: #C2D7FF !important; /* 선택된 카드의 배경색 */
}
.wisdom-chat-list {
    position: relative; /* 부모 요소를 relative로 설정 */
}

</style>
