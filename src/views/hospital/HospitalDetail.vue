<template>
    <v-container fluid class="hospital-detail-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>

        <div class="image-wrapper">
            <v-img :src="hospital.hospitalImageUrl ? hospital.hospitalImageUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/no-image.png'" 
            class="hospital-image" />
        </div>

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <v-row>
            <h2 class="ml-5">{{ hospital.name }}</h2>
            <v-icon color="#0075FF" class="ml-2 mt-2" style="font-size:22px">mdi-star</v-icon>
            <v-text class="ml-1 mt-1 rating-text">
                {{ hospital.averageRating }} ({{ hospital.reviewCount }})
            </v-text>
            <v-chip color="#0066FF" size="default" class="ml-3 mt-1">
                <strong>대기 {{ waitingCount }}명</strong>
            </v-chip>
        </v-row>

        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-map-marker-outline</v-icon>
                {{ hospital.address }}
            </v-text>
            <v-chip class="ml-2 mt-1" size="small" style="font-weight: bold;">
                {{ hospital.distance }}
            </v-chip>
        </v-row>

        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-clock-time-four-outline</v-icon>
                {{ hospital.todaySchedule }} | 점심시간 {{ hospital.breakTime }}
            </v-text>
        </v-row>

        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-phone</v-icon>
                {{ hospital.phoneNumber }}
            </v-text>
        </v-row>

        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-tag-outline</v-icon>
            </v-text>
            <v-chip v-for="(keyword, index) in keywordList" :key="index" color="#0066FF" size="small" class="ml-2 mt-1" label>
                <strong>{{ keyword }} </strong>
            </v-chip>
        </v-row>

        <v-row class="my-7 ml-2">
            <v-btn size="large" class="schedule-button" rounded="lg" variant="flat" @click="scheduleReservation">스케쥴 예약</v-btn>
            <v-btn size="large" class="today-button ml-5" rounded="lg" variant="flat" @click="todayReservation">바로 대기</v-btn>
        </v-row>

        <v-tabs v-model="activeTab" align-tabs="center" style="color: #00499E;" @change="updateTab">
            <v-tab class="custom-tab">병원소개</v-tab>
            <v-tab class="custom-tab">진료정보</v-tab>
            <v-tab class="custom-tab">리뷰</v-tab>
        </v-tabs>

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <v-row justify="center" class="divider-row">
            <hr class="divider">
        </v-row>

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
            activeTab: 0,
            hospitalId: '',
            hospital: [],
            keywordList: [],
            latitude: '37.544444',
            longitude: '127.063087',
            waitingCount: 0
        };
    },
    created() {
        const route = useRoute();
        this.hospitalId = route.params.hospitalId;
        this.latitude = localStorage.getItem('latitude') || this.latitude;
        this.longitude = localStorage.getItem('longitude') || this.longitude;
    },
    async mounted() {
        await this.loadHospitalDetail();
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
            this.activeTab = tabIndex;
        },
        async loadHospitalDetail() {
            try {
                const params = { latitude: this.latitude, longitude: this.longitude };
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/detail/${this.hospitalId}`, { params });
                console.log("병원 정보:", response.data);

                this.hospital = response.data.result;

                if (response.data.result.keywords) {
                    this.keywordList = response.data.result.keywords.split(',').map(keyword => keyword.trim());
                }

                this.loadWaitingCount();
            } catch (error) {
                console.error("병원 상세 정보를 불러오는 중 오류 발생:", error);
            }
        },
        loadWaitingCount() {
            if (!this.hospital.name) {
                console.warn("병원 이름이 없어서 대기 카운트를 불러올 수 없습니다.");
                return;
            }
            console.log(this.hospital.name)

            const waitingRef = ref(this.firebaseDatabase, `todakpadak/${this.hospital.name}`);
            console.log("테스트" + waitingRef)
            onValue(waitingRef, (snapshot) => {
                const data = snapshot.val();
                let waiting = 0;

                if (data) {
                    Object.values(data).forEach(entry => {
                        waiting += Object.keys(entry).length;
                    });
                } else {
                    console.log("대기 데이터가 없습니다.");
                }

                this.waitingCount = waiting;
                console.log("대기 인원 수:", this.waitingCount);
            });
        },
        scheduleReservation() {
            this.$router.push({
                path: `/member/reservation/scheduled/${this.hospitalId}`,
                query: { hospitalName: this.hospital.name }
            });
        },
        todayReservation() {
            this.$router.push({
                path: `/member/reservation/immediate/${this.hospitalId}`,
                query: { hospitalName: this.hospital.name }
            });
        }
    }
};
</script>

<style scoped>
.hospital-detail-container {
    max-width: 700px !important;
    margin: 0 auto !important;
    width: 100% !important;
}

.image-wrapper {
    display: flex;
    justify-content: center;
}

.hospital-image {
    border-radius: 10px;
    max-width: 700px;
    width: 100%;
    height: auto;
    object-fit: cover;
}

.rating-text {
    font-weight: bold;
    font-size: 18px;
    color: #00499E;
}

.schedule-button {
    background-color: #0075FF;
    color: white;
    font-weight: bold;
    width: 300px;
}

.today-button {
    background-color: #ECF2FD;
    color: #00499E;
    font-weight: bold;
    width: 300px;
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
