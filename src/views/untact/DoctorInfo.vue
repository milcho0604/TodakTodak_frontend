<template>
    <v-container fluid class="hospital-detail-container">
        <!-- 의사약력 -->
        <h3 style="font-weight: bold;">의사약력</h3>
        <v-card class="notice-card mt-3" variant="flat">
            <v-card-text style="white-space: pre-line;">
                {{ doctor.bio }}
            </v-card-text>
        </v-card>

        <!-- 소속 병원 -->
        <h3 class="mt-5" style="font-weight: bold;">소속 병원</h3>
        <v-card class="notice-card mt-3" variant="flat">
            <v-card-text :style="{ whiteSpace: 'pre-line' }">
                <v-row style="display: flex; align-items: center;">
                    <v-col cols="2">
                        <v-avatar style="height:80px; width:80px; border-radius: 10px; object-fit:cover;">
                            <!-- 병원사진 -->
                            <v-img :src="doctor.hospitalImageUrl" />
                        </v-avatar>
                    </v-col>
                    <v-col>
                        <div class="inter-bold big-font">{{ doctor.hospitalName }}</div>
                        <div class="small-font">{{ doctor.hospitalAddress }}</div>
                    </v-col>
                </v-row>


            </v-card-text>
        </v-card>

        <v-spacer :style="{ height: '30px' }"></v-spacer>
        <!-- 경계선 -->
        <v-row justify="center" class="divider-row">
            <hr class="divider">
        </v-row>
        <v-spacer :style="{ height: '20px' }"></v-spacer>

        <!-- 비대면 진료 운영시간 -->
        <h3 style="font-weight: bold;">비대면 진료 운영시간</h3>
        <v-card class="notice-card mt-3" variant="flat">
            <!-- 비대면 요일과 시간을 리스트로 출력 -->
            <v-row v-for="hours in this.untactOperatingHours" :key="hours.id">
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



    </v-container>

</template>
<script>
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
    data() {
        return {
            doctorEmail: null,
            doctor: {},
            hospital: [],
            latitude: '37.544444', // 사용자 현재 위도
            longitude: '127.063087', // 사용자 현재 경도
            hospitalId: '', // 병원 id
            untactOperatingHours: [],
            dayOfWeekMap: {
                Monday: '월요일',
                Tuesday: '화요일',
                Wednesday: '수요일',
                Thursday: '목요일',
                Friday: '금요일',
                Saturday: '토요일',
                Sunday: '일요일',
            },
        }
    },
    created() {
        const route = useRoute();
        this.doctorEmail = route.params.doctorEmail;
        console.log("이거거거거ㅓㄱ", this.doctorEmail);
    },
    async mounted() {
        try {
            await this.loadHospitalDetail();  // 병원 상세 정보를 먼저 불러옴
            await this.loadKakaoMapScript();  // 병원 정보가 로드된 후에 KakaoMap Script를 로드
        } catch (error) {
            console.log(error);
        }
    },
    methods: {
        async loadHospitalDetail() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctor/detail/${this.doctorEmail}`);
                console.log("doctor", response.data.result);
                this.doctor = response.data.result;
                // untact인 항목을 필터링하고 요일을 한국어로 변환하여 배열로 저장
                this.untactOperatingHours = this.doctor.operatingHours
                    .filter(item => item.untact) // untact인 항목만 필터링
                    .map(item => ({
                        ...item,
                        dayOfWeek: this.dayOfWeekMap[item.dayOfWeek], // 요일을 한국어로 변환
                    }));
                console.log("untactOperatingHours", this.untactOperatingHours);
            } catch (error) {
                console.log(error);
            }
        },
        // 모든 요일 리스트 (월요일부터 일요일까지)
        dayOfWeekList() {
            return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        },
    },

}

</script>
<style scoped>
.hospital-detail-container {
    max-width: 700px !important;
    /* 원하는 최대 폭 */
    margin: 0 auto !important;
    /* 중앙 정렬 */
    width: 100% !important;
    /* 컨테이너의 폭을 100%로 설정 */
}

.notice-card {
    width: 630px;
    background-color: #F3F3F3;
    border-radius: 10px;
    /* 모서리 둥글기 */
}

.divider-row {
    width: 100%;
    justify-content: center;
}

.divider {
    width: 100%;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 20px 0;
}

.small-font {
    font-size: 12px;
    color: #888888;
}

.big-font {
    font-size: 20px;
}
</style>
