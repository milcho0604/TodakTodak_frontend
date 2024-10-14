<template>
    <v-container fluid class="hospital-detail-container">
        <!-- 병원소개 -->
        <h3 style="font-weight: bold;">병원소개</h3>
        <v-card class="notice-card mt-3" variant="flat">
            <v-card-title style="font-size: 15px; font-weight: bold;">
                {{ hospitalDescriptionFirstLine }}
            </v-card-title>

            <v-card-text :style="{ whiteSpace: 'pre-line' }">
                {{ hospitalDescriptionRest }}
            </v-card-text>
        </v-card>

        <!-- 병원공지 -->
        <h3 class="mt-5" style="font-weight: bold;">병원공지</h3>
        <v-card class="notice-card mt-3" variant="flat">
            <v-card-text :style="{ whiteSpace: 'pre-line' }">
                {{ hospital.notice }}
            </v-card-text>
        </v-card>

        <v-spacer :style="{ height: '30px' }"></v-spacer>
        <!-- 경계선 -->
        <v-row justify="center" class="divider-row">
            <hr class="divider">
        </v-row>
        <v-spacer :style="{ height: '20px' }"></v-spacer>

        <!-- 진료시간 -->
        <h3 style="font-weight: bold;">진료시간</h3>
        <v-card class="notice-card mt-3" variant="flat">
            <v-row align="center">
              <!-- 왼쪽: '점심시간' -->
              <v-col class="text-center" cols="6">
                <v-card-title class="text-subtitle-1 font-weight-bold">점심시간</v-card-title>
              </v-col>
          
              <!-- 오른쪽: hospital.breakTime -->
              <v-col class="text-center" cols="6">
                <v-card-title style="font-size:17px; font-weight:bold">{{ hospital.breakTime }}</v-card-title>
              </v-col>
            </v-row>
        </v-card>

        <!-- 월 ~ 금 영업시간 -->
        <v-spacer :style="{ height: '10px' }"></v-spacer>
        <v-card class="notice-card mt-3" variant="flat">
            <v-row align="center">
              <v-col class="text-center" cols="6">
                <v-card-title class="text-subtitle-1 font-weight-bold">월요일</v-card-title>
              </v-col>
          
              <v-col class="text-center" cols="6">
                <v-card-title style="font-size:17px; font-weight:bold">{{ hospital.monday }}</v-card-title>
              </v-col>
            </v-row>

            <v-row align="center" class="mt-n7">
                <v-col class="text-center" cols="6">
                  <v-card-title class="text-subtitle-1 font-weight-bold">화요일</v-card-title>
                </v-col>
            
                <v-col class="text-center" cols="6">
                  <v-card-title style="font-size:17px; font-weight:bold">{{ hospital.tuesday }}</v-card-title>
                </v-col>
            </v-row>
            
            <v-row align="center" class="mt-n7">
                <v-col class="text-center" cols="6">
                  <v-card-title class="text-subtitle-1 font-weight-bold">수요일</v-card-title>
                </v-col>
            
                <v-col class="text-center" cols="6">
                  <v-card-title style="font-size:17px; font-weight:bold">{{ hospital.wednesday }}</v-card-title>
                </v-col>
            </v-row> 

            <v-row align="center" class="mt-n7">
                <v-col class="text-center" cols="6">
                  <v-card-title class="text-subtitle-1 font-weight-bold">목요일</v-card-title>
                </v-col>
            
                <v-col class="text-center" cols="6">
                  <v-card-title style="font-size:17px; font-weight:bold">{{ hospital.thursday }}</v-card-title>
                </v-col>
            </v-row> 

            <v-row align="center" class="mt-n7">
                <v-col class="text-center" cols="6">
                  <v-card-title class="text-subtitle-1 font-weight-bold">금요일</v-card-title>
                </v-col>
            
                <v-col class="text-center" cols="6">
                  <v-card-title style="font-size:17px; font-weight:bold">{{ hospital.friday }}</v-card-title>
                </v-col>
            </v-row> 

            <v-row align="center" class="mt-n7">
                <v-col class="text-center" cols="6">
                  <v-card-title class="text-subtitle-1 font-weight-bold">토요일</v-card-title>
                </v-col>
            
                <v-col class="text-center" cols="6">
                  <v-card-title style="font-size:17px; font-weight:bold">{{ hospital.saturday }}</v-card-title>
                </v-col>
            </v-row> 
            
            <v-row align="center" class="mt-n7">
                <v-col class="text-center" cols="6">
                  <v-card-title class="text-subtitle-1 font-weight-bold">일요일</v-card-title>
                </v-col>
            
                <v-col class="text-center" cols="6">
                  <v-card-title style="font-size:17px; font-weight:bold">{{ hospital.sunday }}</v-card-title>
                </v-col>
            </v-row>  
        </v-card>

        <v-spacer :style="{ height: '30px' }"></v-spacer>
        <!-- 경계선 -->
        <v-row justify="center" class="divider-row">
            <hr class="divider">
        </v-row>
        <v-spacer :style="{ height: '20px' }"></v-spacer>

        <h3 style="font-weight: bold;">병원위치</h3>
        <h4 style="font-size: 17px">{{hospital.address}}</h4>
        <v-spacer :style="{ height: '20px' }"></v-spacer>

        <div id="map" style="width:600px; height:400px;"></div>


    </v-container>
   
</template>
<script>
import { useRoute } from 'vue-router';
import axios from 'axios';

export default{
    data(){
        return{
            hospital:[],
            latitude: '37.544444', // 사용자 현재 위도
            longitude: '127.063087', // 사용자 현재 경도
            hospitalId: '', // 병원 id
            hospitalDescriptionFirstLine: '', // 병원소개 첫째 줄
            hospitalDescriptionRest: '', // 병원소개 나머지 글
            kakaoMap: null,
            hospitalLatitude:'', // 병원 위도
            hospitalLongitude:'', // 병원 경도
        }
    },
    created() {
        const route = useRoute();
        this.hospitalId = route.params.hospitalId; 
    },
    async mounted(){
        try {
            await this.loadHospitalDetail();  // 병원 상세 정보를 먼저 불러옴
            await this.loadKakaoMapScript();  // 병원 정보가 로드된 후에 KakaoMap Script를 로드
        } catch (error) {
        console.log(error);
        }
    },
    methods:{
        async loadHospitalDetail(){
            try{
                let params = {
                    latitude: this.latitude, 
                    longitude: this.longitude
                };
                // localhost:8080/reservation-service/hospital/detail/2?latitude=37.544444&longitude=127.063087
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/detail/${this.hospitalId}`, {params});
                console.log(response.data);

                this.hospital = response.data.result;
                this.hospitalLatitude = response.data.result.latitude;
                this.hospitalLongitude = response.data.result.longitude;

                // description을 줄바꿈(\n) 기준으로 나눔
                let descriptionLines = response.data.result.description.split('\n');
                this.hospitalDescriptionFirstLine = descriptionLines[0]; // 첫 번째 줄 (h3 태그로 강조)
                this.hospitalDescriptionRest = descriptionLines.slice(1).join('\n'); // 나머지 줄들

            }catch(error){
                console.log(error);
            }
        },
        // 카카오맵 스크립트를 동적으로 로드하는 함수
        loadKakaoMapScript() {
            const script = document.createElement('script');
            script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VUE_APP_KAKAO_MAP_JS_APP_KEY}&autoload=false`;
            script.onload = () => {
                console.log("Kakao map script loaded successfully");
                this.initMap(); // 스크립트 로드 후 지도 초기화
            };
            script.onerror = () => {
                console.error("Failed to load Kakao map script");
            };
            document.head.appendChild(script);
        },

        initMap() {
            window.kakao.maps.load(() => {
                console.log("Kakao map API loaded");
                const container = document.getElementById('map');
                console.log("Map container:", container);

                const options = {
                    center: new window.kakao.maps.LatLng(this.hospitalLatitude, this.hospitalLongitude),
                    level: 3,
                };
                this.kakaoMap = new window.kakao.maps.Map(container, options);

                const markerPosition = new window.kakao.maps.LatLng(this.hospitalLatitude, this.hospitalLongitude);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                });
                marker.setMap(this.kakaoMap);
            });
        },


    },
    
}

</script>
<style scoped>
    .hospital-detail-container{
        max-width: 700px !important; /* 원하는 최대 폭 */
        margin: 0 auto !important;    /* 중앙 정렬 */
        width: 100% !important; /* 컨테이너의 폭을 100%로 설정 */
    }
    .notice-card{
        width: 630px;
        background-color: #F3F3F3;
        border-radius: 10px; /* 모서리 둥글기 */
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
