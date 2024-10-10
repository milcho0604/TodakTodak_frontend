<template>
    <v-container fluid class="hospital-detail-container">
        <!-- 병원소개 -->
        <h3 >병원소개</h3>
        <v-card class="notice-card mt-3" variant="flat">
            <v-card-title style="font-size: 15px; font-weight: bold;">
                {{ hospitalDescriptionFirstLine }}
            </v-card-title>

            <v-card-text :style="{ whiteSpace: 'pre-line' }">
                {{ hospitalDescriptionRest }}
            </v-card-text>
        </v-card>

        <!-- 병원공지 -->
        <h3 class="mt-5">병원공지</h3>
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
        <h3 >진료시간</h3>
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

        }
    },
    created() {
        const route = useRoute();
        this.hospitalId = route.params.hospitalId; 
    },
    mounted(){
        this.loadHospitalDetail();
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

                // description을 줄바꿈(\n) 기준으로 나눔
                let descriptionLines = response.data.result.description.split('\n');
                this.hospitalDescriptionFirstLine = descriptionLines[0]; // 첫 번째 줄 (h3 태그로 강조)
                this.hospitalDescriptionRest = descriptionLines.slice(1).join('\n'); // 나머지 줄들

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
