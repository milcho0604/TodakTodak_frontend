<template>
    <v-container fluid class="hospital-detail-container">
        <!-- 여기에서는 700px로 맞춤 -->

        <v-spacer :style="{ height: '50px' }"></v-spacer>

        <div class="image-wrapper">
            <!-- 병원사진(없으면 no image 사진) -->
            <v-img :src="hospital.hospitalImageUrl ? hospital.hospitalImageUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/no-image.png'" 
            class="hospital-image" />
        </div>

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <!-- 병원이름, 별점, 대기인원 -->
        <v-row>
            <h2 class="ml-5">{{ hospital.name }}</h2>
            <v-icon color="#00499E" class="ml-2 mt-2" style="font-size:22px">mdi-star</v-icon>
            <v-text class="ml-1 mt-1 rating-text">
                {{ hospital.averageRating }} ({{ hospital.reviewCount }})
            </v-text>
            <v-chip color="#0066FF" size="default" class="ml-3 mt-1">
                <strong>대기 {{ waitingCount }}명</strong>
            </v-chip>
        </v-row>

        <!-- 병원주소 -->
        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-map-marker-outline</v-icon>
                {{ hospital.address }}
            </v-text>
            <v-chip class="ml-2 mt-1" size="small" style="font-weight: bold;">
                {{ hospital.distance }}
            </v-chip>
        </v-row>

        <!-- 병원 영업시간, 점심시간 -->
        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-clock-time-four-outline</v-icon>
                {{ hospital.todaySchedule }} | 점심시간 {{ hospital.breakTime }}
            </v-text>
        </v-row>

        <!-- 병원 전화번호 -->
        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-phone</v-icon>
                {{ hospital.phoneNumber }}
            </v-text>
        </v-row>

        <!-- 병원 keywords -->
        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-tag-outline</v-icon>
            </v-text>
            <v-chip v-for="(keyword, index) in keywordList" :key="index" color="#0066FF" size="small" class="ml-2 mt-1"
                label>
                <strong>{{ keyword }} </strong>
            </v-chip>
        </v-row>

        <!-- 오늘예약, 스케쥴예약 버튼 (click 이벤트 이후 추가예정) -->
        <v-row class="my-7 ml-2">
            <v-btn size="large" class="schedule-button" rounded="lg" variant="flat" @click="scheduleReservation">스케쥴
                예약</v-btn>
            <v-btn size="large" class="today-button ml-5" rounded="lg" variant="flat" @click="todayReservation">오늘
                예약</v-btn>
        </v-row>

        <!-- 병원소개, 진료정보, 리뷰 메뉴 tab -->
        <v-tabs v-model="activeTab" align-tabs="center" style="color: #00499E;" @change="updateTab">
            <v-tab class="custom-tab">병원소개</v-tab>
            <v-tab class="custom-tab">진료정보</v-tab>
            <v-tab class="custom-tab">리뷰</v-tab>
        </v-tabs>

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <!-- 경계선 -->
        <v-row justify="center" class="divider-row">
            <hr class="divider">
        </v-row>


        <!-- 탭에 따른 컴포넌트 렌더링 -->
        <component :is="currentComponent"></component>


        <v-spacer :style="{ height: '50px' }"></v-spacer>

    </v-container>
</template>

<script>
import HospitalIntro from './HospitalIntro.vue';
import HospitalMedicalInfo from './HospitalMedicalInfo.vue';
import HospitalReviews from './HospitalReviews.vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { ref, onValue } from 'firebase/database';

export default {
    inject: ['firebaseDatabase'],
    data() {
        return {
            activeTab: 0, // 선택된 탭을 저장
            hospitalId: '', // 병원 id
            hospital: [], // 병원정보
            keywordList: [], // 병원 키워드 리스트 
            latitude: '37.544444', // 사용자 현재 위도
            longitude: '127.063087', // 사용자 현재 경도
            waitingCount: 0
        }
    },
    created() {
        const route = useRoute();
        this.hospitalId = route.params.hospitalId;
        this.latitude = localStorage.getItem('latitude');
        this.longitude = localStorage.getItem('longitude');

    },
    async mounted() {
        // await this.getCurrentLocation(); // 사용자 위치 정보 가져온 후 병원 detail 조회 axios 요청
        this.loadHospitalDetail(); // 병원 디테일 조회
    },
    computed: {
        currentComponent() {
            if (this.activeTab == 0) {
                return HospitalIntro;
            } else if (this.activeTab == 1) {
                return HospitalMedicalInfo;
            } else {
                return HospitalReviews;
            }
        }
    },
    methods: {
        updateTab(tabIndex) {
            this.activeTab = tabIndex; // 선택된 탭의 인덱스를 업데이트
        },
        // async getCurrentLocation() {
        //      //사용자 현재위치 좌표조회
        //     return new Promise((resolve, reject) => {
        //         if (navigator.geolocation) {
        //             navigator.geolocation.getCurrentPosition(
        //                 async position => {
        //                     this.latitude = position.coords.latitude;
        //                     this.longitude = position.coords.longitude;
        //                     console.log("사용자 위도", this.latitude);
        //                     console.log("사용자 경도", this.longitude);

        //                     // 위치 정보를 가져온 후, 병원 디테일 조회
        //                     this.loadHospitalDetail(); // 병원 디테일 조회
        //                     resolve(); // 성공 시 resolve 호출
        //                 },
        //                 error => {
        //                     console.log("위치 정보를 가져오지 못했습니다.", error);
        //                     this.loadHospitalDetail(); // 초기값으로 병원 디테일 조회
        //                     reject(error); // 실패 시 reject 호출
        //                 }
        //             );
        //         } else {
        //             console.log("Geolocation을 지원하지 않는 브라우저입니다.");
        //             reject(new Error("Geolocation을 지원하지 않는 브라우저입니다."));
        //         }
        //     });
        // },
        async loadHospitalDetail() {
            try {
                let params = {
                    latitude: this.latitude,
                    longitude: this.longitude
                };
                // localhost:8080/reservation-service/hospital/detail/2?latitude=37.544444&longitude=127.063087
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/detail/${this.hospitalId}`, { params });
                console.log("병원", response.data);

                this.hospital = response.data.result;

                // keywords를 쉼표 기준으로 나누어 배열로 저장
                if(response.data.result.keywords){
                    this.keywordList = response.data.result.keywords.split(',').map(keyword => keyword.trim());
                }
                console.log("loadWaitingCount하려고...");
                this.loadWaitingCount();

            } catch (error) {
                console.log(error);
            }
        },
        loadWaitingCount() {
            console.log("loadWaitingCount 시작..");
            const waitingRef = ref(this.firebaseDatabase, `todakpadak/${this.hospital.name}`);
            onValue(waitingRef, (snapshot) => {
                const data = snapshot.val();
                let waiting = 0;
                if (data) {
                    Object.keys(data).forEach(key => {
                        waiting += Object.keys(data[key]).length;
                    });
                } else {
                    console.log('No waiting data found');  // 에러 처리
                }
                this.waitingCount = waiting;
            });
        },
        scheduleReservation() {
            // 스케쥴예약 페이지로 이동
            this.$router.push({
                path: `/reservation/scheduled/${this.hospitalId}`,
                query: { hospitalName: this.hospital.name }
            });
        },
        todayReservation() {
            // 스케쥴예약 페이지로 이동
            this.$router.push({
                path: `/reservation/immediate/${this.hospitalId}`,
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
</style>
