<template>
    <v-container fluid class="hospital-detail-container">
        <h3 style="font-weight: bold;">의사정보</h3>
        <v-spacer :style="{ height: '10px' }"></v-spacer>
        <v-row>
            <v-col cols="12" v-for="doctor in doctorList" :key="doctor.id">
                <!-- 의사 리스트 v-card -->
                <v-card
                variant="flat"
                class="doctor-card justify-start"
                >
                    <div class="d-flex align-center">
                        <!-- 의사 프로필 사진 -->
                        <v-avatar class="ma-5 doctor-image" size="70">
                            <v-img :src="doctor.profileImgUrl ? doctor.profileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png'" />
                        </v-avatar>
                        
                        <div style="flex: 1;">
                            <div class="d-flex align-center justify-space-between">
                                <!-- 의사 이름과 대기인원 왼쪽 정렬 -->
                                <div class="d-flex align-center">
                                    <v-card-title class="custom-card-title">
                                        {{ doctor.name }} 의사
                                    </v-card-title>
                                    <v-chip color="#0066FF" class="ml-3">
                                        <strong>대기 0명</strong>
                                    </v-chip>
                                </div>
        
                                <!-- 자세히보기 버튼 오른쪽 정렬 -->
                                <v-btn 
                                rounded="lg" 
                                variant="flat" 
                                class="mr-6 doctor-detail-button" 
                                @click="openDoctorDetail(doctor)"
                                >
                                    <strong>자세히보기</strong>
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </v-card>
            </v-col>
        </v-row>
        
        
        <!-- 의사 정보 자세히 보기 모달 -->
        <v-dialog v-if="selectedDoctor" v-model="doctorDetail" max-width="500">
            <v-card rounded="lg" class="doctor-modal-card">
                <v-row class="ma-5">
                    <v-col cols="3">
                        <!-- 의사 프로필 사진 -->
                        <v-avatar class="ma-5 doctor-image" size="70">
                            <v-img :src="selectedDoctor.profileImgUrl ? selectedDoctor.profileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png'" />
                        </v-avatar>
                    </v-col>
                    <v-col cols="9" class="d-flex flex-column justify-start mt-2">
                        <v-card-title style="font-size:25px; font-weight:bold;">
                        {{ this.selectedDoctor.name }} 의사
                        </v-card-title>
                
                        <v-card-subtitle class="mt-n2">
                        소아청소년과 전문의
                        </v-card-subtitle>
                        <v-divider :thickness="1"></v-divider>
                    </v-col>
                </v-row>
                <!-- 의사 정보 bio 카드 -->
                <v-row class="mt-n13">
                    <v-col cols="12" >
                    <!-- 의사약력 -->
                    <v-card-title class="ml-4" style="font-weight:bold;">
                        의사 약력
                    </v-card-title>    
                    <v-card class="doctor-bio-card mx-4" variant="flat">
                        <v-card-text :style="{ whiteSpace: 'pre-line' }">
                        {{ this.selectedDoctor.bio }}
                        </v-card-text>
                    </v-card>
                    </v-col>
                </v-row>

                <!-- 의사 비대면 근무시간 -->
                <!-- v-if로 untact 진료 시간이 있는지 체크 -->
                <v-row v-if="hasUntactHours" class="mt-n1">
                    <v-col cols="12">
                    <v-card-title class="ml-4" style="font-weight:bold;">
                        비대면 진료
                    </v-card-title>

                    <v-card class="doctor-bio-card mx-4" variant="flat">
                        <!-- 비대면 요일과 시간을 리스트로 출력 -->
                        <v-row v-for="hours in untactOperatingHours" :key="hours.id">
                            <v-col cols="6" class="text-center">
                                <v-card-title class="text-subtitle-1 font-weight-bold">
                                <!-- 비대면 진료 요일 -->
                                {{ hours.dayOfWeek }}
                                </v-card-title>
                            </v-col>
                            <v-col cols="6" class="text-center">
                                <v-card-title class="text-subtitle-1 font-weight-bold">
                                    <!-- 비대면 진료 시간 -->
                                {{ hours.openTime.slice(0, 5) }} ~ {{ hours.closeTime.slice(0, 5) }}
                                </v-card-title>
                            </v-col>
                        </v-row>
                    </v-card>
                    </v-col>
                </v-row>

                <v-row class="mt-n1">
                    <v-col cols="12">
                        <v-card-title class="ml-4" style="font-weight:bold;">
                            <!-- 대면진료시간 -->
                            진료시간
                        </v-card-title>
                        <v-card class="doctor-bio-card mx-4" variant="flat">
                            <v-row v-for="(day, index) in dayOfWeekList" :key="index" class="mb-n4">
                                <v-col cols="6" class="text-center">
                                    <v-card-title class="text-subtitle-1 font-weight-bold" style="margin-bottom: 0;">
                                        <!-- 대면 진료 요일 -->
                                        {{ dayOfWeekMap[day] }}
                                    </v-card-title>
                                </v-col>
                                <v-col cols="6" class="text-center">
                                    <v-card-title class="text-subtitle-1 font-weight-bold" style="margin-bottom: 0;">
                                        <template v-if="nonUntactOperatingHours[day]">
                                            <!-- 대면 진료시간 -->
                                            {{ nonUntactOperatingHours[day].openTime.slice(0, 5) }} ~ {{ nonUntactOperatingHours[day].closeTime.slice(0, 5) }}
                                        </template>
                                        <template v-else>
                                            <!-- 해당 요일에 진료시간 없으면 휴무처리 -->
                                            휴무
                                        </template>
                                    </v-card-title>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                    <v-spacer :style="{ height: '10px' }"></v-spacer>
                </v-row>
                <v-row align="center" class="d-flex justify-center">
                    <v-col cols="12" class="d-flex justify-center">
                        <v-btn variant="text" class="close-button" @click="doctorDetail=false">
                            닫기
                        </v-btn>
                    </v-col>
                    <v-spacer :style="{ height: '20px' }"></v-spacer>
                </v-row>                
            </v-card>
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
            doctorDetail: false, // 의사 detail 모달 상태
            // 요일 매핑 테이블
            dayOfWeekMap: {
                Monday: '월요일',
                Tuesday: '화요일',
                Wednesday: '수요일',
                Thursday: '목요일',
                Friday: '금요일',
                Saturday: '토요일',
                Sunday: '일요일',
            },
            selectedDoctor: null, // 선택된 의사 정보
        }
    },
    created(){
        const route = useRoute();
        this.hospitalId = route.params.hospitalId; 
    },
    mounted(){
        this.loadDoctorList(); // 병원 별 의사리스트 조회

    },
    computed: {
        // 비대면 진료 시간이 있는지 확인하는 메서드
        hasUntactHours() {
            return this.selectedDoctor.operatingHours.some(item => item.untact);
        },
        // 비대면 진료 시간 정보를 변환하는 메서드
        untactOperatingHours() {
            return this.selectedDoctor.operatingHours
                .filter(item => item.untact)
                .map(item => {
                return {
                    ...item,
                    dayOfWeek: this.dayOfWeekMap[item.dayOfWeek], // 요일을 한국어로 변환
                };
            });
        },
        // 모든 요일 리스트 (월요일부터 일요일까지)
        dayOfWeekList() {
            return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        },
        // 비대면 진료가 아닌 시간을 필터링하고 요일별로 매핑
        nonUntactOperatingHours() {
            const result = {};
            this.selectedDoctor.operatingHours
                .filter(item => !item.untact) // untact가 false인 것만 필터링
                .forEach(item => {
                    result[item.dayOfWeek] = item; // 요일별로 데이터를 저장
                });
            return result;
            }   
    },
    methods:{
        async loadDoctorList(){
            try{
                // http://localhost:8080/member-service/member/doctorList/2
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctorList/${this.hospitalId}`);
                console.log(response.data);
                this.doctorList = response.data.result.content; // 의사 + 근무시간리스트
                console.log(this.doctorList);


            }catch(error){
                console.log(error);
            }
        },
        openDoctorDetail(doctor) {
            this.selectedDoctor = doctor; // 선택된 의사 정보 설정
            this.doctorDetail = true; // 모달 열기
        },
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
.doctor-detail-button{
    background-color: #D9D9D9;
    color: #606060;
}
.doctor-modal-card{
    width: 500px;
    background-color: #FFFFFF;
}
.divider-row {
    width: 100%;
    justify-content: center;
}

.divider {
    width: 85%;
    border: 0;
    border-top: 1px solid #1E1E1E;
    margin: 20px 0;
    justify-content: center;
}
.doctor-bio-card{
    width: 450px;
    background-color: #F3F3F3;
    border-radius: 10px; /* 모서리 둥글기 */
}
.close-button{
    background-color: #ECF2FD;
    color: #00499E;
    border-radius: 10px; /* 모서리 둥글기 */
    font-weight: bold;
}

</style>
