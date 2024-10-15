<template>
    <v-container fluid class="hospital-detail-container">
        <v-row align="center" justify="start">
            <h3 style="font-weight: bold;">진료 리뷰</h3>
            <!-- 리뷰개수 chip -->
            <v-chip class="ml-3 mb-1 review-count" variant="flat">{{ reviewCount }}</v-chip>
        </v-row>
        <v-row align="center">
            <v-col cols="12">
              <v-card class="rating-card" variant="flat">
                <v-row>
                  <!-- 왼쪽: 평균 평점과 v-rating -->
                  <v-col cols="4" class="d-flex flex-column justify-center align-center my-7 mx-3">
                        <v-card-title style="font-weight:bold; font-size:30px;">
                            {{ reviewAvgList.averageRating }}
                        </v-card-title>
                        <v-rating
                            :length="5"
                            :model-value="reviewAvgList.averageRating"
                            :size="35"
                            color="#CACACA"
                            active-color="#0075FF"
                            half-increments
                            readonly
                        />
                    </v-col>
          
                    <!-- 경계선 -->
                    <v-col cols="1" class="d-flex align-center">
                        <v-divider vertical></v-divider>
                    </v-col>
          
                    <!-- 오른쪽: 각 평점과 progress-linear -->
                    <v-col cols="6" class="d-flex flex-column justify-start">
                        <!-- 매우 만족 -->
                        <div class="d-flex align-center rating-div mt-2">
                            <v-card-text style="font-weight: bold;">매우 만족</v-card-text>
                            <v-progress-linear
                                color="#0075FF"
                                :model-value="reviewAvgList.count5Stars"
                                :max="reviewCount"
                                rounded
                                style="flex: 1;"
                                class="rating-bar"
                            />
                        </div>
            
                        <!-- 만족 -->
                        <div class="d-flex align-center review-count-bar rating-div">
                            <v-card-text style="font-weight: bold;">만족</v-card-text>
                            <v-progress-linear
                                color="#0075FF"
                                :model-value="reviewAvgList.count4Stars"
                                :max="reviewCount"
                                rounded
                                style="flex: 1;"
                                class="rating-bar"
                            />
                        </div>
            
                        <!-- 보통 -->
                        <div class="d-flex align-center review-count-bar rating-div">
                        <v-card-text style="font-weight: bold;">보통</v-card-text>
                        <v-progress-linear
                            color="#0075FF"
                            :model-value="reviewAvgList.count3Stars"
                            :max="reviewCount"
                            rounded
                            style="flex: 1;"
                            class="rating-bar"
                        />
                        </div>
            
                        <!-- 별로 -->
                        <div class="d-flex align-center review-count-bar rating-div">
                        <v-card-text style="font-weight: bold;">별로</v-card-text>
                        <v-progress-linear
                            color="#0075FF"
                            :model-value="reviewAvgList.count2Stars"
                            :max="reviewCount"
                            rounded
                            style="flex: 1;"
                            class="rating-bar"
                        />
                        </div>
            
                        <!-- 매우 별로 -->
                        <div class="d-flex align-center review-count-bar rating-div mb-2">
                        <v-card-text style="font-weight: bold;">매우 별로</v-card-text>
                        <v-progress-linear
                            color="#0075FF"
                            :model-value="reviewAvgList.count1Star"
                            :max="reviewCount"
                            rounded
                            style="flex: 1;"
                            class="rating-bar"
                        />
                        </div>
                    </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          
          

        
    </v-container>
   
</template>
<script>
import { useRoute } from 'vue-router';
import axios from 'axios';

export default{
    data(){
        return{
            hospitalId: '',
            reviewList:[],
            reviewAvgList:[],
            reviewCount:'',

        }
    },
    created() {
        const route = useRoute();
        this.hospitalId = route.params.hospitalId; 
    },
    mounted(){
        this.loadReviewList();
        this.loadReviewAvgList();
    },
    methods:{
        // 리뷰리스트
        async loadReviewList(){
            try{
                // http://localhost:8080/reservation-service/review/list/2
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/list/${this.hospitalId}`);
                console.log(response.data);
                this.reviewList = response.data.result.content;

            } catch(error){
                console.log(error);
            }
        },
        // 리뷰 평균평점 리스트(평점, 각 점수별 리뷰개수)
        async loadReviewAvgList(){
            try{
                // http://localhost:8080/reservation-service/review/detail/2
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/detail/${this.hospitalId}`);
                this.reviewAvgList = response.data;
                // 리뷰 개수 계산
                this.reviewCount = this.reviewAvgList.count1Star 
                                + this.reviewAvgList.count2Stars
                                + this.reviewAvgList.count3Stars
                                + this.reviewAvgList.count4Stars
                                + this.reviewAvgList.count5Stars;
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
.review-count{
    background-color: #C2D7FF;
    color: #00499E;
    font-weight: bold;
    font-size: 25px;
}
.rating-card{
    background-color: #F3F3F3;
    border-radius: 10px; /* 모서리 둥글기 */
    width: 650px;
    margin: 0 auto; /* 중앙정렬 */
}
.review-count-bar{
    margin-top: -15px;
}
.rating-div{
    margin-left: -50px;
}
.rating-bar{
    min-width: 250px;
}
</style>
