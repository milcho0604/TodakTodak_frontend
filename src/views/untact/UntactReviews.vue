<template>
    <v-container fluid class="hospital-detail-container">
        <v-row align="center" justify="start">
            <h3 style="font-weight: bold;" class="ml-3">진료 리뷰</h3>
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
        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <!-- 리뷰 리스트 -->
        <v-container v-for="review in reviewList" :key="review.id">
            <v-divider style="width: 650px;"></v-divider>
            <v-spacer :style="{ height: '30px' }"></v-spacer>
            <v-row>
                <!-- 의사이름 -->
                <h4 style="font-weight: bold; font-size:20px;">
                    {{ review.doctorName }} 의사
                </h4>
                <!-- 병원 명 -->
                <v-text style="color:#898787" class="ml-2">
                    {{ review.hospitalName }}
                </v-text>
            </v-row> 
            <v-row>
                <!-- 별점 -->
                <v-rating 
                :model-value="review.rating"
                readonly
                :length="5"
                size="small"
                density="compact"
                color="#CACACA"
                active-color="#0075FF"
                />
            </v-row>
            <v-row>
                <v-text class="mt-2" :style="{ whiteSpace: 'pre-line' }">
                    {{ review.contents }}
                </v-text>
            </v-row>
            <v-row>
                <v-text class="mt-2 mr-3" style="color:#898787;">
                    {{ review.name }}
                </v-text>
                <v-text class="mt-2 mr-3" style="color:#898787;">
                    {{ review.createdAt.slice(0, 10) }}
                </v-text>
                <v-text style="color:#898787" class="mt-2" v-if="review.untact">
                    비대면 진료
                </v-text>
            </v-row>
        </v-container>

        <!-- 페이징 UI -->
        <v-pagination
        v-model="currentPage"
        :length="totalPages"
        @input="loadReviewList" 
        class="mt-4"
        ></v-pagination>
                
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

            currentPage: 1,  // 현재 페이지
            totalPages: 0,   // 총 페이지 수
            reviewCount: 0,  // 총 리뷰 수
            //예시데이터
            // review:[{
            //     id:'1',
            //     name: '정*기',
            //     hospitalName : "삼성드림소아청소년과의원",
            //     doctorName: "김창현",
            //     rating: '4',
            //     contents: "창창핑 원장님 새로오셨는데 진료 잘해주시네요! \n 하지만 4점입니다 \n 왜냐하면 병원원무과 선생님들이 조금 까칠하셨어요 \n 바쁘신건 알지만 조금 속상했네요^^ \n 다음엔 잘부탁드릴게요 병원시설은 좋습니다!",
            //     createdAt: "2024-10-11T14:18:45",
            //     untact : true
            // }],

        }
    },
    created() {
        const route = useRoute();
        this.doctorEmail = route.params.doctorEmail; 
    },
    mounted(){
        this.loadReviewList();
        this.loadReviewAvgList();
    },
    watch:{
        currentPage(newCurrnetPage){
            if(newCurrnetPage){
                this.loadReviewList();
            }
        }

    },
    methods:{
        // 리뷰리스트
        async loadReviewList(){
            console.log("currentPage",this.currentPage);
            try{
                let params = {
                    page: this.currentPage -1
                };
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/untact/true/${this.doctorEmail}`,{params});
                console.log(response.data.content);
                this.reviewList = response.data.content;
                this.totalPages = response.data.totalPages;  // 총 페이지 수 저장
                this.reviewCount = response.data.totalElements; // 총 리뷰 수
                console.log(this.reviewList);

            } catch(error){
                console.log(error);
            }
        },
        // 리뷰 평균평점 리스트(평점, 각 점수별 리뷰개수)
        async loadReviewAvgList(){
            try{
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/doctor/detail/${this.doctorEmail}`);
                console.log(response.data.content);
                this.reviewAvgList = response.data;
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
