<template>
    <v-container fluid class="hospital-detail-container">
        <!-- 여기에서는 700px로 맞춤 -->

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <div class="image-wrapper">
            <v-img :src="hospital.hospitalImageUrl" class="hospital-image" />
        </div>

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <!-- 의사 간단 프로필 -->
        <v-row class="mt-6" style="display: flex; align-items: center;">
            <v-col class="text-center" cols="2">
                <v-avatar size="80">
                    <v-img
                        :src="doctor.doctorImageUrl ? doctor.doctorImageUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png'" />
                </v-avatar>
            </v-col>
            <v-col class="text-center" cols="7">
                <v-row class="inter-bold big-font">{{ doctor.doctorName }} 의사</v-row>
                <v-row class="inter-bold small-font">{{ doctor.hospitalName }}</v-row>
                <v-row class="inter-normal" style="font-size: 12px;">
                    <v-icon class="star-icon">mdi-star</v-icon>
                    {{ doctor.reviewPoint }} ({{ doctor.reviewCount }})
                </v-row>
            </v-col>
            <v-col class="text-center" cols="3">
                <div class="button inter-bold" @click="$router.push(`/member/untact/${doctorEmail}/form`)">비대면 진료 신청</div>
            </v-col>
        </v-row>


        <!-- 의사소개, 리뷰 메뉴 tab -->
        <v-tabs v-model="activeTab" align-tabs="center" style="color: #00499E;" @change="updateTab">
            <v-tab class="custom-tab">의사소개</v-tab>
            <v-tab class="custom-tab">리뷰</v-tab>
        </v-tabs>

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <!-- 경계선 -->
        <v-row justify="center" class="divider-row">
            <hr class="divider">
        </v-row>


        <!-- 탭에 따른 컴포넌트 렌더링 -->
        <component :is="currentComponent" ></component>


        <v-spacer :style="{ height: '50px' }"></v-spacer>

    </v-container>
</template>

<script>
import DoctorInfo from './DoctorInfo.vue';
import UntactReviews from './UntactReviews.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
    data() {
        return {
            doctor: {
                imageUrl: "https://todak-file.s3.amazonaws.com/9227db48-1e3a-4559-9ff9-fad2db9cd68b_스크린샷 2024-10-08 오후 2.08.28.png",
                doctorName: "김천재",
                hospitalName: "아이조은성모병원",
                reviewPoint: "4.5",
                reviewCount: "22",
            },
            activeTab: 0, // 선택된 탭을 저장
            hospitalId: '', // 병원 id
            hospital: [], // 병원정보
            keywordList: [], // 병원 키워드 리스트 
            latitude: '37.544444', // 사용자 현재 위도
            longitude: '127.063087', // 사용자 현재 경도
        }
    },
    created() {
        const route = useRoute();
        this.doctorEmail = route.params.doctorEmail;
        this.latitude = localStorage.getItem('latitude');
        this.longitude = localStorage.getItem('longitude');

    },
    async mounted() {
        this.loadDoctorDetail(); // 병원 디테일 조회
    },
    computed: {
        currentComponent() {
            if (this.activeTab == 0) {
                return DoctorInfo;
            } else {
                return UntactReviews;
            }
        }
    },
    methods: {
        updateTab(tabIndex) {
            this.activeTab = tabIndex; // 선택된 탭의 인덱스를 업데이트
        },

        async loadDoctorDetail() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctor/detail/${this.doctorEmail}`);
                console.log(response.data.result);
                this.doctor = response.data.result;
            } catch (error) {
                console.log(error);
            }
        },
        scheduleReservation() {
            // 스케쥴예약 페이지로 이동
            this.$router.push({
                path: `/member/reservation/scheduled/${this.hospitalId}`,
                query: { hospitalName: this.hospital.name }
            });
        },
        todayReservation() {
            // 스케쥴예약 페이지로 이동
            this.$router.push({
                path: `/member/reservation/immediate/${this.hospitalId}`,
                query: { hospitalName: this.hospital.name }
            });
        }
    }
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

.image-wrapper {
    display: flex;
    justify-content: center;
    /* 수평 중앙 정렬 */
}

.hospital-image {
    border-radius: 10px;
    /* Avatar에 10px 둥글기 적용 */
    max-width: 700px;
    width: 100%;
    height: auto;
    /* 이미지의 비율을 유지하면서 높이를 자동으로 조절 */
    object-fit: cover;
    justify-content: center;
    /* 수평 중앙 정렬 */
}

.rating-text {
    font-weight: bold;
    font-size: 18px;
    color: #00499E
}

.schedule-button {
    background-color: #0075FF;
    color: white;
    font-weight: bold;
    width: 300px
}

.today-button {
    background-color: #ECF2FD;
    color: #00499E;
    font-weight: bold;
    width: 300px
}

.custom-tab {
    font-size: 22px;
    font-weight: bold;
    margin-right: 30px;
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
.big-font {
    font-size: 18px;
}
.small-font {
    font-size: 14px;
    color: #888888;
}
.button {
    background-color: #C2D7FF;
    border-radius: 10px;
    padding: 10px 15px;
    margin-right: 10px;
    font-size: 15px;
    color: #010565;
    cursor: pointer;
}
</style>
