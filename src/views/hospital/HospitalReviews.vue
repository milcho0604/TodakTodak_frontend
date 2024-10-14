<template>
    <v-container fluid class="hospital-detail-container">
        <v-row>
            <v-col cols="12">
                <h3 style="font-weight: bold;">진료 리뷰</h3>
                <!-- 리뷰개수 chip -->
                <v-chip>{{this.reviewCount}}</v-chip>
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

</style>
