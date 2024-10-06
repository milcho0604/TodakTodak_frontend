<template>
    <v-container class="d-flex flex-column align-center" style="background-color: white;">
      <!-- 리뷰 관리 제목과 연필 아이콘 -->
      <v-row class="review-header" justify="center" align="center">
        <v-col cols="auto" class="d-flex flex-column align-center">
          <div class="review-title">리뷰관리</div>
          <div class="review-underline"></div>
        </v-col>
        <v-col cols="auto">
          <v-img src="@/assets/pencil.png" class="pencil-icon" />
        </v-col>
      </v-row>
  
      <!-- 리뷰 리스트 -->
      <v-row justify="center" class="review-list">
        <v-col cols="12" md="10" lg="8" v-for="(review, index) in reviews" :key="index" class="review-group">
          <v-card class="review-card">
            <v-card-title class="review-hospital">{{ review.hospitalName }} 리뷰</v-card-title>
            <v-card-subtitle v-if="review.doctorName" class="review-doctor">의사: {{ review.doctorName }}</v-card-subtitle>
            <v-card-text>
              <!-- 평점 영역 -->
              <div class="rating-container">
                <v-rating
                  v-model="review.rating"
                  length="5"
                  color="#00499E"
                  background-color="#C5C5C5"
                  dense
                  readonly
                  class="small-rating"
                ></v-rating>
                <span class="rating-text">{{ review.rating.toFixed(1) }}</span> <!-- 평점 숫자 표시 -->
              </div>
              <div>{{ review.contents }}</div>
              <div class="review-date">
                {{ formatDate(review.createdAt) }} - {{ maskName(review.name) }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        reviews: []
      };
    },
    created() {
      this.fetchReviews();
    },
    methods: {
      async fetchReviews() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/my/list`);
          if (response.status === 200) {
            this.reviews = response.data.content;
          }
        } catch (error) {
          console.error('리뷰 데이터를 가져오는 중 오류 발생:', error);
        }
      },
      formatDate(date) {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(date).toLocaleDateString('ko-KR', options);
      },
      maskName(name) {
        // 이름이 3글자일 경우 가운데 글자를 마스킹 처리
        if (name.length === 3) {
          return name[0] + '*' + name[2];
        }
        return name;
      }
    }
  };
  </script>
  
  <style scoped>
  /* 리뷰 관리 제목과 연필 아이콘 영역 */
  .review-header {
    width: 100%;
    margin-top: 20px;
  }
  
  .review-title {
    font-family: 'Inter';
    font-weight: 700;
    font-size: 35px;
    color: #00499E;
    text-align: center;
  }
  
  .review-underline {
    width: 100px;
    height: 1px;
    background-color: #C5C5C5;
    margin-top: 10px;
  }
  
  .pencil-icon {
    width: 55px;
    height: 55px;
    transform: rotate(7.97deg);
  }
  
  /* 리뷰 리스트 영역 */
  .review-list {
    margin-top: 20px;
  }
  
  .review-group {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
  }
  
  .review-card {
    border: 1px solid #C5C5C5;
    padding: 30px;
    background-color: #F8F8F8;
    width: 100%;
    max-width: 900px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .review-hospital {
    font-size: 26px;
    font-weight: bold;
  }
  
  .review-doctor {
    margin-top: 10px;
    font-size: 18px;
    color: #333;
  }
  
  .review-date {
    font-size: 14px;
    color: #606060;
    margin-top: 10px;
  }
  
  /* 평점 영역 스타일 */
  .rating-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .small-rating .v-rating .v-icon {
    font-size: 16px; /* 별 크기를 16px로 설정 */
    color: #00499E !important; /* 별의 색상을 #00499E로 설정 */
  }
  
  .rating-text {
    margin-left: 5px;
    font-size: 14px;
    color: #00499E; /* 별점 숫자의 색상을 #00499E로 설정 */
  }
  
  /* 배경 색 설정 */
  .v-container {
    background-color: white;
    min-height: 100vh;
    padding: 20px;
  }
  </style>
  