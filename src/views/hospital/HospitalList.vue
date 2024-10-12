<template>
    <v-container fluid class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <!-- 주변소아과, gps -->
        <v-row>
            <v-col cols="4"
            class="ml-50 justify-end text-no-wrap"
            >
                <v-btn variant="flat" size="large" @click="openAddressSearch">
                    <h4> 
                        <!-- <v-icon> mdi-crosshairs-gps</v-icon> -->
                        📍 {{dong}}
                        <v-icon class="custom-width ml-n1"> mdi-chevron-down</v-icon>
                    </h4>
                </v-btn>
            </v-col>

            <v-col cols="4" 
            class="d-flex flex-row justify-center text-no-wrap"
            align="center"
            >
                <h2>👶🏻 주변 소아과</h2>
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
                <v-text-field
                v-model="search"
                label="병원검색"
                prepend-inner-icon="mdi-magnify"
                variant="underlined"
                type="text"
                clearable
                class="mt-n1"
              ></v-text-field>
            </v-col>
            <v-col cols="3" >
                <v-chip-group v-model="isOperating">
                    <!-- 진료중 여부 태그 -->
                    <v-chip variant="tonal" rounded="lg" size="large" color="#0066FF" value="operating" filter> <strong>진료 중</strong> </v-chip>
                </v-chip-group>
            </v-col>
        </v-row>

        <v-spacer></v-spacer>
        <v-row>
            <v-col cols="2">
            </v-col>

            <v-col cols="8">
                <!-- 정렬조건 태그 그룹 -->
                <v-chip-group
                v-model="sort"
                selected-class="text-primary"
                mandatory
                >
                    <v-chip value="거리 순" size="large" filter>거리 순</v-chip>
                    <v-chip value="별점 순" size="large" filter>별점 순</v-chip>
                    <v-chip value="리뷰 순" size="large" filter>리뷰 순</v-chip>

                </v-chip-group>
            </v-col>

            <v-col cols="2">
            </v-col>
        </v-row>
        <v-spacer></v-spacer>
        <v-container class="hospital-list-container d-flex justify-center align-center">
            <!-- 병원리스트 -->
            <v-row>
                <v-col cols="12" v-for="hospital in hospitalList" :key="hospital.id">
                    <v-card
                        style="width:800px !important;"
                        variant="outlined"
                        class="custom-card justify-center"
                        @click="goToDetail(hospital.id)"
                        clickable
                    >
                        <div class="d-flex flex-no-wrap">
                            <v-avatar
                                class="ma-5"
                                style="height:140px; width:180px; border-radius: 10px; object-fit:cover;"
                            >
                                <!-- 병원사진 -->
                                <v-img :src="hospital.hospitalImageUrl" />
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
                                        <v-icon color="#00499E">mdi-star</v-icon>
                                        {{ hospital.averageRating }} ({{ hospital.reviewCount }})
                                        </v-card-text>
                                    </div>
                        
                                    <!-- 대기 인원 (오른쪽 정렬) -->
                                    <v-chip color="#0066FF" size="large" class="ml-auto mr-10 mt-2">
                                        <strong>대기 {{ hospital.standby ?? 0 }}명</strong>
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
                                    <v-chip
                                        v-for="(keyword, index) in hospital.keywordList"
                                        :key="index"
                                        color="#00499E"
                                        size="default"
                                        class="mr-2 mt-2"
                                    >
                                        {{ keyword }} 
                                    </v-chip>
                                </div>
                            </div>
                        </div>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        <v-spacer :style="{ height: '50px' }"></v-spacer>
    </v-container>
</template>

<script>
import axios from 'axios';

export default{
    data() {
      return {
        dong:"성수동 2가",
        search:"", 
        sort:"거리 순", // 사용자가 선택한 정렬조건
        sortOptions: [
            { text: "거리 순", value: "distance" }, // 서버로 넘길 값: distance
            { text: "별점 순", value: "rating" },    // 서버로 넘길 값: rating
            { text: "리뷰 순", value: "review" }     // 서버로 넘길 값: review
        ], // 정렬 옵션
        selectedTag: "전체",
        latitude: '37.544444', // 사용자 현재 위도
        longitude: '127.063087', // 사용자 현재 경도
        hospitalList:[], // 병원리스트
        keywordList:[], // 키워드 리스트 (, 기준으로 split)
        isOperating: "operating"
      }
    },
    created() {

    },
    mounted(){
        this.loadHospitalList();
    },
    methods: {
        openAddressSearch() {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    // bname에서 동 이름을 추출하여 dong에 할당
                    this.dong = data.bname || "주소 선택 안됨";
                }
            }).open();
        },
        async loadHospitalList(){
            try {
                let params = {
                    dong: this.dong,
                    latitude: this.latitude,
                    longitude: this.longitude
            };
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/list`,{ params }
            );
                this.hospitalList = response.data.result.map(hospital => {
            return {
                    ...hospital,
                    keywordList: hospital.keywords ? hospital.keywords.split(",") : []
                };
            });
            }catch(error){
                console.log(error);
            }
        },
        goToDetail(hospitalId) {
            // 병원 상세 페이지로 이동
            this.$router.push({ path: `/hospital/detail/${hospitalId}` });
        }

    }
}
</script>

<style scoped>
.hospital-list-container{
    max-width:1000px !important;  /* 원하는 최대 폭 */
    margin: 0 auto !important;     /* 중앙 정렬 */
    width: 100% !important; /* 컨테이너의 폭을 100%로 설정 */
}
.custom-card {
    border: 2px solid #DBDBDB; /* 테두리 색상만 변경 */
    border-radius: 10px; /* 모서리 둥글기 */
    background-color: white !important; /* 카드 내부 배경색 고정 */
    width: 1000px !important;
    margin: 0 auto;
  }
/* v-avatar border-radius */
.custom-avatar {
    border-radius: 10px; /* Avatar에 10px 둥글기 적용 */
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
/* v-card-title 폰트 스타일 */
.custom-card-title {
    font-weight: bold; /* 글씨 굵게 */
    font-size: 22px; /* 원하는 폰트 크기 설정 */
}
.rating-text{
    font-weight: bold;
    color: #00499E;
}
.distance-text{
    font-weight: bold;
    color: #0066FF;
    font-size: 15px;
}

</style>
