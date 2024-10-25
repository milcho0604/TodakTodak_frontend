<template>
    <v-container fluid class="custom-container">
        <!-- 고객센터 타이틀 -->
        <v-row justify="center">
            <v-col cols="12" sm="9" md="8" lg="7">
                <v-row class="profile-section" no-gutters>
                    <v-col cols="3">
                    </v-col>
                    <v-col cols="9">
                        <div class="reservation-text"><img src="@/assets/cs_center_image.png" alt="TodakTodak Logo"
                                class="logo-image" />고객센터</div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        
        <v-container class="total-container">
            <!-- 자식에서 이벤트 받기 -->
            <ChatListComponent
            style="width: 40%"
            
            />

            <!-- 선택된 채팅방 정보 전달 -->
            <CsChat 
            style="width: 60%"
            
            />
        </v-container>

    </v-container>
</template>
<script>
import ChatListComponent from './ChatListComponent.vue';
import CsChat from './CsChat.vue';

export default{
    data(){
        return{
            selectedChatRoom: '', // 선택된 채팅방 정보를 저장할 상태
        }

    },
    components:{
        ChatListComponent,
        CsChat
    },
    created(){

    },
    mounted(){

    },
    methods:{

    }
}
</script>
<style scoped>
.total-container{
    display: flex;
}
.logo-image {
    width: 70px;
    /* 원하는 고정 너비 */
    max-width: 100%;
    /* 부모 요소 너비를 넘지 않도록 설정 */
    height: auto;
    /* 높이는 비율에 맞춰 자동 조절 */
    object-fit: contain;
    /* 이미지가 고정된 크기 안에서 비율을 유지 */
    margin-right: 10px;
}
.profile-section {
    display: flex;
    margin-bottom: 20px;
}
.reservation-text {
    font-weight: 700;
    font-size: 30px;
    margin-left: -35px;
    color: #00499E;
}
</style>
