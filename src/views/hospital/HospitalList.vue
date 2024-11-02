<template>
    <v-container fluid class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <!-- 검색창 -->
        <v-row >
            <v-col cols="2">
                
            </v-col>
            <v-col cols="1" class="mt-1" style="padding: 15px 0">
                <v-btn variant="flat" size="large" @click="locationModal = true">
                    <!-- <v-icon> mdi-crosshairs-gps</v-icon> -->
                    📍 {{dong}}
                    <v-icon class="custom-width ml-n1"> mdi-chevron-down</v-icon>
            </v-btn>
            </v-col>
            <v-col cols="6">
                <v-text-field v-model="search" label="병원검색" prepend-inner-icon="mdi-magnify" variant="underlined"
                    type="text" clearable class="mt-n1"></v-text-field>
            </v-col>
            <v-col cols="2">
                <!-- 진료중 여부 태그 -->
                <v-chip variant="tonal" rounded="lg" size="large" @click="toggleOperating"
                    :color="isOperating ? '#0066FF' : '#767676'" :class="{ active: isOperating }" filter> <strong>진료
                        중</strong>
                </v-chip>
            </v-col>
        </v-row>

        <v-spacer></v-spacer>
        <v-row>
            <v-col cols="2">
                <!-- 정렬맞춰주기 위한 빈cols -->
            </v-col>

            <v-col cols="8">
                <!-- 정렬조건 태그 그룹 -->
                <v-chip-group v-model="sort" selected-class="text-primary" mandatory>
                    <v-chip value="distance" size="large" filter>거리 순</v-chip>
                    <v-chip value="rating" size="large" filter>별점 순</v-chip>
                    <v-chip value="review" size="large" filter>리뷰 순</v-chip>

                </v-chip-group>
            </v-col>

            <v-col cols="2">
                <!-- 정렬 맞춰주기위한 빈 cols -->
            </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-container class="hospital-list-container d-flex justify-center align-center">
            <!-- 병원리스트 (데이터 로딩상태 아닐 때)-->
            <v-row v-if="!loading">
                <v-col cols="12" v-for="hospital in filteredHospitalList" :key="hospital.id" class=no-padding>
                    <v-card style="width:780px !important;" variant="text" class="custom-card justify-center"
                        @click="goToDetail(hospital.id)" clickable>
                        <div class="d-flex flex-no-wrap">
                            <v-avatar class="ma-5"
                                style="height:140px; width:180px; border-radius: 10px; object-fit:cover;">
                                <!-- 병원사진 -->
                                <v-img
                                    :src="hospital.hospitalImageUrl ? hospital.hospitalImageUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/no-image.png'" />
                            </v-avatar>

                            <div style="flex: 1;">
                                <div class="d-flex flex-row align-center justify-space-between">
                                    <!-- 병원 이름 -->
                                    <div class="d-flex flex-row align-center">
                                        <v-card-title class="mt-2 ml-n4 custom-card-title">
                                            {{ hospital.name }}
                                        </v-card-title>
                                        <!-- 병원 평균평점, 리뷰개수 -->
                                        <v-card-text class="rating-text mt-4 ml-n7">
                                            <v-icon color="#0075FF">mdi-star</v-icon>
                                            {{ hospital.averageRating }} ({{ hospital.reviewCount }})
                                        </v-card-text>
                                    </div>

                                    <!-- 대기 인원 (오른쪽 정렬) -->
                                    <v-chip color="#0066FF" size="large" class="ml-auto mr-10 mt-2">
                                        <strong>대기 {{ hospital.waitingCount ?? 0 }}명</strong>
                                    </v-chip>
                                </div>

                                <div class="d-flex flex-row align-center">
                                    <!-- 오늘 영업시간-->
                                    <v-text class="ml-1" style="font-size:15px">
                                        {{ hospital.todaySchedule }}
                                    </v-text>
                                    <!--  내위치 ~ 병원 거리  -->
                                    <v-text class="ml-3 distance-text" style="font-size:15px">
                                        {{ hospital.distance }}
                                    </v-text>
                                </div>
                                <!-- 병원 주소 -->
                                <div class="d-flex flex-row align-center mt-1">
                                    <v-text style="color:#888888; font-size:15px">
                                        <v-icon>mdi-map-marker-outline</v-icon>
                                        {{ hospital.address }}
                                    </v-text>
                                </div>
                                <!-- 병원 키워드 chip -->
                                <div class="d-flex flex-row align-center">
                                    <v-chip v-for="(keyword, index) in hospital.keywordList" :key="index"
                                        color="#0066FF" size="default" class="mr-2 mt-2">
                                        {{ keyword }}
                                    </v-chip>
                                </div>
                            </div>
                        </div>
                    </v-card>
                    <v-divider style="width: 750px; margin: 0 auto;"></v-divider>
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
                    @click="handleCurrentLocationClick">
                    현위치 병원 보기
                </v-btn>

            </v-card>
        </v-dialog>
        <!-- 데이터 로딩 중일때 띄워줄 모달 -->
        <v-dialog v-model="loading" max-width="500px">
            <v-card class="loading-modal">
                <!-- 로딩 진행 표시 (v-progress-linear) -->
                <v-progress-linear color="#0075FF" height="4" indeterminate></v-progress-linear>

                <v-card-title class="loading-title">
                    데이터 로딩중
                </v-card-title>
                <!-- <v-container class="text-center">
                    <v-progress-circular
                    :size="50"
                    color="primary"
                    indeterminate
                  ></v-progress-circular>
                </v-container> -->
                <v-card-text class="loading-text">
                    회원님의 현재 위치 정보를 기반으로 <br>병원 리스트를 불러오고 있습니다.
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios';
import { ref, onValue } from 'firebase/database';

const apiClient = axios.create({
    baseURL: 'https://dapi.kakao.com/v2/local',
    headers: {
        Authorization: `KakaoAK ${process.env.VUE_APP_KAKAO_API_KEY}`
    }
});

export default {
    inject: ['firebaseDatabase'],
    data() {
        return {
            dong: "신대방동",
            search: "",
            sort: "distance", // 사용자가 선택한 정렬조건
            selectedTag: "전체",
            latitude: '37.497203', // 사용자 현재 위도
            longitude: '126.927625', // 사용자 현재 경도
            hospitalList: [], // 병원리스트
            keywordList: [], // 키워드 리스트 (, 기준으로 split)
            isOperating: false,
            locationModal: false,
            loading: false, // 로딩상태변수 추가
            isLoading: false, // 모달 테스트
            hospital: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital-icon.png',
        }
    },
    created() {

    },
    async mounted() {
        await this.getCurrentLocation(); // 위치 정보를 가져온 후 병원리스트 axios 요청
    },
    watch: {
        // dong 값이 변경될 때마다 병원 리스트를 새로 로드
        dong(newDong) {
            if (newDong) {
                this.loadHospitalList();
            }
        },
        // this.sort가 바뀔 때마다 loadHospitalList 메소드를 호출
        sort(newSort) {
            if (newSort) {
                this.loadHospitalList();
            }
        },

    },
    // watch: {
    // // `dong` 값이 변경될 때마다 병원 리스트를 새로 로드
    // dong(newDong) {
    //     if (newDong && !this.isLoading) {
    //         this.loadHospitalList();
    //     }
    // },
    // // `sort` 값이 변경될 때마다 병원 리스트를 새로 로드
    // sort(newSort) {
    //     if (newSort && !this.isLoading) {
    //         this.loadHospitalList();
    //     }
    // }
    // },
    computed: {
        // 병원검색기능
        filteredHospitalList() {
            // search가 비어 있으면 전체 병원 목록을 반환하고, 그렇지 않으면 필터링합니다.
            if (!this.search) {
                return this.hospitalList;
            }

            const searchKeyword = this.search.toLowerCase();

            // 병원 목록에서 이름, 키워드, 주소에 search 키워드가 포함된 항목만 반환
            return this.hospitalList.filter(hospital => {
                const nameMatches = hospital.name.toLowerCase().includes(searchKeyword);
                const addressMatches = hospital.address.toLowerCase().includes(searchKeyword);
                const keywordMatches = (hospital.keywordList || []).some(keyword => keyword.toLowerCase().includes(searchKeyword));

                return nameMatches || addressMatches || keywordMatches;
            });
        }

    },
    methods: {
        openAddressSearch() {
            this.locationModal = false; // 위치 모달 먼저 닫음
            new window.daum.Postcode({
                oncomplete: (data) => {
                    // bname에서 동 이름을 추출하여 dong에 할당
                    this.dong = data.bname || "주소 선택 안됨";
                }
            }).open();
        },
        handleCurrentLocationClick() {
            this.locationModal = false; // 모달 창 닫기
            this.getCurrentLocation();  // 현재 위치로 병원 리스트 가져오기  
        },
        async getCurrentLocation() {
            this.loading = true; // 로딩 시작

            const storedLatitude = localStorage.getItem('latitude');
            const storedLongitude = localStorage.getItem('longitude');

            if (navigator.geolocation) {
                return new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(
                        async position => {
                            const newLatitude = position.coords.latitude;
                            const newLongitude = position.coords.longitude;

                            // 새로운 위치 정보가 로컬스토리지에 저장된 값과 다를 경우에만 동 정보 업데이트
                            if (newLatitude !== parseFloat(storedLatitude) || newLongitude !== parseFloat(storedLongitude)) {
                                this.latitude = newLatitude;
                                this.longitude = newLongitude;

                                // 로컬스토리지에 새로운 위치 정보 저장
                                localStorage.setItem('latitude', this.latitude);
                                localStorage.setItem('longitude', this.longitude);

                                // 동 정보 업데이트
                                await this.getDongFromCoordinates(this.latitude, this.longitude);
                            } else {
                                // 위치가 변하지 않았다면 저장된 동 정보로 병원 리스트 로드
                                this.latitude = storedLatitude;
                                this.longitude = storedLongitude;
                                await this.loadHospitalList();
                            }
                            this.loading = false; // 로딩 종료
                            resolve();
                        },
                        error => {
                            console.log("위치 정보를 가져오지 못했습니다.", error);
                            this.loading = false;
                            reject(error);
                        }
                    );
                });
            } else {
                console.log("Geolocation을 지원하지 않는 브라우저입니다.");
                this.loading = false;
            }
        },

        // 위도와 경도를 이용해 '동' 정보를 가져오는 메소드
        async getDongFromCoordinates(latitude, longitude) {
            try {

                const response = await apiClient.get(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json`, {
                    params: {
                        x: longitude, // 경도
                        y: latitude,  // 위도
                    }
                });

                // '동' 단위 행정구역 이름 찾기
                const regionInfo = response.data.documents;
                if (regionInfo.length > 0) {
                    const dongInfo = regionInfo.find(region => region.region_type === "B");
                    if (dongInfo) {
                        this.dong = dongInfo.region_3depth_name; // '동' 이름 저장
                        console.log("사용자의 동:", this.dong);
                        // 동 정보 업데이트 후 병원 리스트 로드
                        await this.loadHospitalList(); // 동 정보로 병원 리스트 로드
                    } else {
                        console.log("동 정보를 찾을 수 없습니다.");
                    }
                }
            } catch (error) {
                if (error.response) {
                    console.log("Error Status:", error.response.status);
                    console.log("Error Data:", error.response.data);
                } else {
                    console.log("주소 정보를 가져오는 데 실패했습니다.", error);
                }
            }
        },
        async loadHospitalList() {
            try {
                // this.dong에서 띄어쓰기 제거
                const formattedDong = this.dong.replace(/\s+/g, '');

                let params = {
                    dong: formattedDong, // 띄어쓰기 제거된 동 이름
                    latitude: this.latitude,
                    longitude: this.longitude,
                    sort: this.sort,
                    isOperating: this.isOperating
                };

                console.log("요청 파라미터:", params); // 요청 파라미터 로그
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/sorted/list`, { params }
                );
                this.hospitalList = response.data.result.map(hospital => {
                    return {
                        ...hospital,
                        keywordList: hospital.keywords ? hospital.keywords.split(",") : []
                    };
                });
                console.log(this.hospitalList);
                this.hospitalList = await Promise.all(
                    this.hospitalList.map(async (hospital) => {
                        const waitingRef = ref(this.firebaseDatabase, `todakpadak/${hospital.name}`);
                        return new Promise((resolve) => {
                            onValue(waitingRef, (snapshot) => {
                                const data = snapshot.val();
                                console.log(data);
                                let waiting = 0;
                                if (data) {
                                    Object.keys(data).forEach(key => {
                                        waiting += Object.keys(data[key]).length;
                                    });
                                }
                                console.log(waiting);
                                resolve({
                                    ...hospital,
                                    waitingCount: waiting
                                });
                            });
                        });
                    })
                );
            } catch (error) {
                console.log(error);
            }
        },
        goToDetail(hospitalId) {
            // 병원 상세 페이지로 이동
            this.$router.push({ path: `/all/hospital/detail/${hospitalId}` });
        },
        toggleOperating() {
            this.isOperating = !this.isOperating; // 선택 시 true, 선택 해제 시 false
            this.loadHospitalList(); // 상태 변경 시마다 병원 리스트 다시 로드
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
    color: #0075FF;
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

.loading-modal {
    width: 500px;
    height: 240px;
    background-color: #FFFFFF;
    border-radius: 20px;
    /* 모서리 둥글기 */
}

.loading-title {
    font-weight: bold;
    /* 글씨 굵게 */
    font-size: 30px;
    /* 원하는 폰트 크기 설정 */
    color: #00499E;
    text-align: center;
    margin-top: 20px;
}

.loading-text {
    font-size: 15px;
    text-align: center;
}

.no-padding {
    padding: 0 !important;
}
</style>