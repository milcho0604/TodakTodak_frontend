<template>
    <v-container fluid class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <!-- 주변소아과, gps -->
        <v-row>
            <v-col cols="4">
                <!-- 공간 맞추기위한 빈 col -->
            </v-col>
            <v-col cols="4" class="d-flex flex-row justify-center text-no-wrap" align="center">
                <!-- <h2>비대면 진료</h2> -->
            </v-col>

            <v-col cols="4">
                <!-- 공간 맞추기위한 빈 col -->
            </v-col>
        </v-row>

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <!-- 검색창 -->
        <v-row>
            <v-col cols="2">

            </v-col>
            <v-col cols="7">
                <v-text-field v-model="search" label="병원검색" prepend-inner-icon="mdi-magnify" variant="underlined"
                    type="text" clearable class="mt-n1" @input="onSearchInput"></v-text-field>
            </v-col>
            <v-col cols="3">
                <v-chip-group v-model="isOperating">
                    <!-- 진료중 여부 태그 -->
                    <v-chip variant="tonal" rounded="lg" size="large" color="#0066FF" value="operating" filter
                        @click="loadDoctorList">
                        <strong>진료 중</strong> </v-chip>
                </v-chip-group>
            </v-col>
        </v-row>

        <v-spacer></v-spacer>
        <v-row>
            <v-col cols="2">
            </v-col>

            <v-col cols="8">
                <!-- 정렬조건 태그 그룹 -->
                <v-chip-group v-model="sort" selected-class="text-primary" mandatory @click="loadDoctorList">
                    <v-chip value="reviewRate" size="large" filter>별점 순</v-chip>
                    <v-chip value="reviewCount" size="large" filter>리뷰 순</v-chip>

                </v-chip-group>
            </v-col>

            <v-col cols="2">
            </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-container class="hospital-list-container d-flex justify-center align-center">
            <!-- 의사리스트 -->
            <v-row>
                <v-col cols="12" v-for="doctor in doctorList" :key="doctor.doctorId">
                    <v-card style="width:800px !important;" variant="text" class="custom-card justify-center"
                        @click="goToDetail(doctor.memberEmail)" clickable>
                        <div class="d-flex flex-no-wrap">
                            <v-avatar size="80" class="ma-5">
                                <v-img
                                    :src="doctor.profileImg ? doctor.profileImg : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png'" />
                            </v-avatar>

                            <div style="flex: 1;">
                                <div class="d-flex align-center justify-space-between">
                                    <!-- 의사 이름 -->
                                    <div class="d-flex align-center">
                                        <div class="mt-2 custom-card-title">
                                            {{ doctor.doctorName }}
                                        </div>
                                    </div>
                                    <!-- 대기 인원 (오른쪽 정렬) -->
                                    <v-chip color="#0066FF" size="large" class="ml-auto mr-10 mt-2">
                                        <strong>대기 {{ doctor.waitingCount }}명</strong>
                                    </v-chip>
                                </div>
                                <div>
                                    <v-text style="color:#888888; font-size:15px">
                                        {{ doctor.hospitalName }}
                                    </v-text>
                                </div>
                                <!-- 병원 평균평점, 리뷰개수 -->
                                <div>
                                    <v-icon color="#0075FF">mdi-star</v-icon>
                                    <v-text style="color:#0075FF; font-weight:bold;">{{ doctor.reviewPoint }} ({{ doctor.reviewCount }})</v-text>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <v-dialog v-model="locationModal" max-width="500">
            <v-card rounded="lg" class="location-modal">
                <v-card-title class="modal-title d-flex align-center">
                    <v-spacer></v-spacer> <!-- 좌측 공간 확보 -->
                    <div class="ml-10" style="color: #00499E">
                        주소설정
                    </div>
                    <v-spacer></v-spacer> <!-- 우측 공간 확보 -->

                    <v-btn icon="mdi-close" variant="text" class="modal-close" @click="locationModal = false"></v-btn>
                </v-card-title>

                <v-card class="modal-input-box d-flex align-center" style="margin-left: auto; margin-right: auto;"
                    variant="flat" @click="openAddressSearch">
                    <v-card-title style="color:#676767; font-size:17px;">
                        <v-icon style="color: #676767">mdi-magnify</v-icon>
                        지역, 도로명 또는 건물명으로 검색
                    </v-card-title>
                </v-card>
                <v-btn prepend-icon="mdi-crosshairs-gps" class="location-button" variant="text"
                    @click="getCurrentLocation">
                    현위치 병원 보기
                </v-btn>

            </v-card>
        </v-dialog>


    </v-container>
</template>

<script>
import axios from 'axios';
import { ref, onValue } from 'firebase/database';
export default {
    inject: ['firebaseDatabase'],
    data() {
        return {
            search: null,
            sort: "거리 순", // 사용자가 선택한 정렬조건
            selectedTag: "전체",
            doctorList: [], // 병원리스트
            keywordList: [], // 키워드 리스트 (, 기준으로 split)
            isOperating: "operating",
        }
    },
    created() {
        this.loadDoctorList();
    },
    methods: {
        async loadDoctorList() {
            try {
                const params = {
                    search: this.search,
                    sortBy: this.sort
                };
                // 의사 정보를 가져옴
                const today = this.getToday();
                const reservationResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/untact/list/${today}`, { params });
                let reservationData = reservationResponse.data.result;

                // 필터링: 진료 중 여부에 따른 필터링 적용
                if (this.isOperating) {
                    const now = new Date();

                    reservationData = reservationData.filter(doctor => {
                        const operatingHours = doctor.operatingHours; // doctor의 운영 시간
                        const openTime = new Date(`${now.toDateString()} ${operatingHours.openTime}`);
                        const closeTime = new Date(`${now.toDateString()} ${operatingHours.closeTime}`);
                        // 현재 시간이 openTime과 closeTime 사이에 있는지 확인
                        return now >= openTime && now <= closeTime;
                    });
                }
                console.log("reservationData ", reservationData);

                // 실시간 대기인원 삽입 - 비동기 작업을 모두 완료한 후 결과 처리
                this.doctorList = await Promise.all(
                    reservationData.map(async (doctor) => {
                        const waitingRef = ref(this.firebaseDatabase, `todakpadak/${doctor.hospitalName}/${doctor.doctorId}`);
                        return new Promise((resolve) => {
                            onValue(waitingRef, (snapshot) => {
                                const data = snapshot.val();
                                let waiting = 0;
                                if (data) {
                                    waiting = Object.keys(data).length;
                                }
                                resolve({
                                    ...doctor,
                                    waitingCount: waiting
                                });
                            });
                        });
                    })
                );

                console.log("Updated Doctor List:", this.doctorList);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        getToday() {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const date = new Date();
            return days[date.getDay()]; // 현재 요일 반환
        },
        goToDetail(doctorEmail) {
            // 병원 상세 페이지로 이동
            this.$router.push({ path: `/all/untact/detail/${doctorEmail}` });
        },
        // 검색어 입력 시 호출되는 메서드
        onSearchInput() {
            this.loadDoctorList(); // 검색어에 맞는 목록 가져오기
        },

    }
}
</script>

<style scoped>
.hospital-list-container {
    max-width: 1000px !important;
    /* 원하는 최대 폭 */
    margin: 0 auto !important;
    /* 중앙 정렬 */
    width: 100% !important;
    /* 컨테이너의 폭을 100%로 설정 */
}

.custom-card {
    width: 1000px !important;
    margin: 0 auto;
    padding: 10px 0;
}

/* v-avatar border-radius */
.custom-avatar {
    border-radius: 10px;
    /* Avatar에 10px 둥글기 적용 */
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* v-card-title 폰트 스타일 */
.custom-card-title {
    font-weight: bold;
    /* 글씨 굵게 */
    font-size: 22px;
    /* 원하는 폰트 크기 설정 */
}

.rating-text {
    font-weight: bold;
    color: #00499E;
}

.distance-text {
    font-weight: bold;
    color: #0066FF;
    font-size: 15px;
}

.location-modal {
    width: 500px;
    height: 240px;
    background-color: #FFFFFF;
}

.modal-title {
    margin-top: 10px;
    font-size: 25px;
    font-weight: bold;
}

.modal-close {
    font-size: 25px;
    font-weight: bold;
    color: #606060;
}

.modal-input-box {
    margin-top: 20px;
    width: 400px;
    background-color: #F3F3F3;
    border-radius: 10px;
}

.location-button {
    margin-top: 30px;
    font-size: 17px;
    font-weight: bold;
    /* 폰트 굵게 설정 */
    color: #00499E;
    background-color: #ECF2FD;
    border-radius: 20px;
    margin-left: auto;
    margin-right: auto;
    /* 버튼을 수평 중앙에 정렬 */
}
</style>
