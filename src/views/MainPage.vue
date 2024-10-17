<template>
  <v-app>
    <v-container class="custom-container">
      <v-spacer :style="{ height: '50px' }"></v-spacer>
      
      <!-- TODO: cycle 옵션 붙여야됨 -->
       <!-- 배너 carousel -->
      <v-carousel
        class="custom-carousel"
        show-arrows="hover"
        
        hide-delimiter-background
      >
        <v-carousel-item
          v-for="(slide, i) in slides" :key="i"
        >
          <v-img :src="slide"></v-img>
        </v-carousel-item>
      </v-carousel>
      
      <v-spacer></v-spacer>

      <v-row justify="center" align="center">
        <h2 style="font-weight: bold;">🏥 우리동네 인기 소아과</h2>
      </v-row>

      <v-spacer :style="{ height: '50px' }"></v-spacer>

      <v-container style="background-color: #F3F3F3; border-radius:15px; max-width: 1200px;">
        <!-- 인기소아과 window -->
        <v-row justify="center">
          <HospitalCarousel 
          :windowCount="2" 
          :hospitalList="hospitalList"
          />
        </v-row>

        <v-row justify="center" style="margin-top: -20px;">
          <v-btn
              class="custom-button"
              style="background-color: #E6E6E6;"
              text :to="{path:'/hospital/list'}"
          >주변소아과 더보기</v-btn>
        </v-row> 

         <v-spacer :style="{height: '30px'}"></v-spacer>
      </v-container>

      <v-spacer :style="{height: '50px'}"></v-spacer>

      <v-row justify="center" align="center">
        <h2 style="font-weight: bold;">🏠 비대면 진료</h2>
      </v-row>

      <v-row justify="center" align="center">
        <h5 style="text-align: center; color: #828282;">
            집에서도 편하게 비대면진료 받으세요!
        </h5>
      </v-row>

      <!-- <v-container>
        
         <v-row>
          <DoctorCarousel
          :windowCount="2"
          :doctorList="doctorList"
          />
         </v-row>

      </v-container>
       -->
    </v-container>
  </v-app> 
</template>

<script>
import HospitalCarousel from '@/components/carousel/HospitalCarousel.vue';
// import DoctorCarousel from '@/components/carousel/DoctorCarousel.vue';

export default {
  components: { 
    HospitalCarousel,
    // DoctorCarousel,
   },
  name: "App",
  data(){
    return{
      banner1: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/%E1%84%87%E1%85%A2%E1%84%82%E1%85%A51+Group+989000.png',
      banner2: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/padak-banner.png',
      banner3: '',
      slides: [
        'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/%E1%84%87%E1%85%A2%E1%84%82%E1%85%A51+Group+989000.png',
        'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/padak-banner.png',
      ],
      // 인기소아과 데이터 
      keywordList: ['주차장', '전문의', '예방접종'],
      hospitalList:[
        {id:'1', hospitalImageUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital-example-image.png', name: '삼성화곡소아청소년과', averageRating:'4.5', reviewCount:'32', address: '서울 강남구 삼성로14 (개포자이 프레지던스) 자이스퀘어 상가 216호', keywords: '예방접종, 주차장, 전문의'},
        {id:'2', hospitalImageUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital1.jpeg', name: '연세드림소아청소년과', averageRating:'4.5', reviewCount:'32', address: '서울 강남구 삼성로14 (개포자이 프레지던스) 자이스퀘어 상가 216호', keywords: '예방접종, 주차장, 전문의'},
        {id:'3', hospitalImageUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital2.png', name: '아이조은청소년과', averageRating:'4.5', reviewCount:'32', address: '서울 강남구 삼성로14 (개포자이 프레지던스) 자이스퀘어 상가 216호', keywords: '예방접종, 주차장, 전문의'},
        {id:'4', hospitalImageUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital1.jpeg', name: '방은지소아청소년과', averageRating:'4.5', reviewCount:'32', address: '서울 강남구 삼성로14 (개포자이 프레지던스) 자이스퀘어 상가 216호', keywords: '예방접종, 주차장, 전문의'},
        {id:'5', hospitalImageUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital1.jpeg', name: '김창현소아청소년과', averageRating:'4.5', reviewCount:'32', address: '서울 강남구 삼성로14 (개포자이 프레지던스) 자이스퀘어 상가 216호', keywords: '예방접종, 주차장, 전문의'},
        {id:'6', hospitalImageUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital1.jpeg', name: '무무소아청소년과', averageRating:'4.5', reviewCount:'32', address: '서울 강남구 삼성로14 (개포자이 프레지던스) 자이스퀘어 상가 216호', keywords: '예방접종, 주차장, 전문의'},
      ],
      doctorList:[
        {id:'1', profileImg:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/male-doctor.png', doctorName:'신현도', hospitalName:'아이조은청소년과', reviewPoint:'4.5', reviewCount:'32' },
        {id:'2', profileImg:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/female-doctor.png', doctorName:'김현지', hospitalName:'삼성화곡청소년과', reviewPoint:'4.5', reviewCount:'32' },
        {id:'3', profileImg:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/male_doctor.png', doctorName:'박연세', hospitalName:'연세아이청소년과', reviewPoint:'4.5', reviewCount:'32' },
        {id:'4', profileImg:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/female_doctor.png', doctorName:'방박사', hospitalName:'아이조은청소년과', reviewPoint:'4.5', reviewCount:'32' },
        {id:'5', profileImg:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/male_doctor.png', doctorName:'최무무', hospitalName:'연세드림청소년과', reviewPoint:'4.5', reviewCount:'32' },
        {id:'6', profileImg:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/female_doctor.png', doctorName:'창창핑', hospitalName:'티니핑청소년과', reviewPoint:'4.5', reviewCount:'32' },
        {id:'7', profileImg:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/female-doctor.png', doctorName:'껄무새', hospitalName:'할껄말껄청소년과', reviewPoint:'4.5', reviewCount:'32' },
        {id:'8', profileImg:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/male-doctor.png', doctorName:'우하하', hospitalName:'아이조은청소년과', reviewPoint:'4.5', reviewCount:'32' },
      ],
      communityList: [
        {id:'1', title: '예방접종 후 목욕', content:'A형간염이랑 Dtap 4차를 접종했는데 당일 저녁에 목욕해도되나요?', postImgUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/moruncar.jpg', likeCount:'21', comments:'13', viewCount:'212', createdTimeAt:"2024-10-11T14:21:14" },
        {id:'1', title: '예방접종 후 목욕', content:'A형간염이랑 Dtap 4차를 접종했는데 당일 저녁에 목욕해도되나요?', postImgUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/moruncar.jpg', likeCount:'21', comments:'13', viewCount:'212', createdTimeAt:"2024-10-11T14:21:14" },
        {id:'1', title: '예방접종 후 목욕', content:'A형간염이랑 Dtap 4차를 접종했는데 당일 저녁에 목욕해도되나요?', postImgUrl:'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/moruncar.jpg', likeCount:'21', comments:'13', viewCount:'212', createdTimeAt:"2024-10-11T14:21:14" },
      ],
    };
  },
  mounted() {
    // mounted 후에 slides 배열에 배너를 추가
    // this.slides = [this.banner1, this.banner2];
  }
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

.v-application {
  background-color: #f5f5f5;
}
.custom-carousel{
  width: 1100px;
  height: 450px;
}
</style>
