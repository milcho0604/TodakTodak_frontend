<template>
    <v-container fluid class="hospital-detail-container">
    <h3>의사정보</h3>
    <v-spacer :style="{ height: '10px' }"></v-spacer>
    <v-row>
        <v-col cols="12" v-for="doctor in doctorList" :key="doctor.id">
            <!-- 의사 리스트 v-card -->
            <v-card
            variant="flat"
            class="doctor-card justify-start"
            >
                <div class="d-flex flex-no-wrap">
                    <!-- 의사 프로필 사진 -->
                    <v-avatar class="ma-5 doctor-image" size="70">
                        <v-img :src="doctor.profileImgUrl ? doctor.profileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png'" />
                    </v-avatar>
                    
                    <div style="flex: 1;">
                        <div class="d-flex flex-row align-center justify-space-between">
                            <!-- 의사이름 -->
                            <v-card-title class="custom-card-title">
                                {{ doctor.name }} 의사
                            </v-card-title>
                            <!-- TODO: 대기인원 이후 실시간 데이터베이스 연결 -->
                            <v-chip color="#0066FF" >
                                <strong>대기 0명</strong>
                            </v-chip>
                        </div>
                        <!-- 자세히보기 버튼 -->
                        <v-btn rounded="lg" variant="flat" @click="doctorDetail = true">
                            <strong>자세히보기</strong>
                        </v-btn>
                    </div>
                </div>
            </v-card>
        </v-col>
    </v-row>

    <v-dialog v-model="doctorDetail">

    </v-dialog>

    </v-container>
   
</template>
<script>
import { useRoute } from 'vue-router';
import axios from 'axios';

export default{
    data(){
        return{
            hospitalId:'',
            doctorList: [],
            doctorDetail: false,


        }
    },
    created(){
        const route = useRoute();
        this.hospitalId = route.params.hospitalId; 
    },
    mounted(){
        this.loadDoctorList(); // 병원 별 의사리스트 조회

    },
    methods:{
        async loadDoctorList(){
            try{
                // http://localhost:8080/member-service/member/doctorList/2
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctorList/${this.hospitalId}`);
                console.log(response.data);
                this.doctorList = response.data.result.content; // 의사 + 근무시간리스트
            


            }catch(error){
                console.log(error);
            }
        }
    }
}
</script>
<style scoped>
.hospital-detail-container{
    max-width: 700px !important; /* 원하는 최대 폭 */
    margin: 0 auto !important;    /* 중앙 정렬 */
    width: 100% !important; /* 컨테이너의 폭을 100%로 설정 */
}
.doctor-card{
    width: 630px;
    background-color: #F3F3F3;
    border-radius: 10px; /* 모서리 둥글기 */
}
.doctor-image{
    width: 100%;
    height: 100%;
    object-fit: cover;
}
/* v-card-title 폰트 스타일 */
.custom-card-title {
    font-weight: bold; /* 글씨 굵게 */
    font-size: 23px; /* 원하는 폰트 크기 설정 */
}

</style>
