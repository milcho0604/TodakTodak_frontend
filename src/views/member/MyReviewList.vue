<template>
    <v-container>
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
            <v-card-title class="review-hospital">
              {{ review.hospitalName }} 리뷰
            </v-card-title>
            <v-card-subtitle v-if="review.doctorName" class="review-doctor">
              {{ review.doctorName }} 의사
              <!-- 수정 아이콘 -->
              <v-icon small @click="openEditModal(review)" class="edit-icon">mdi-pencil</v-icon>
            </v-card-subtitle>
  
            <v-card-text>
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
                <span class="rating-text">{{ review.rating.toFixed(1) }}</span>
              </div>
              <div>{{ review.contents }}</div>
              <div class="review-date">
                {{ formatDate(review.createdAt) }} - {{ maskName(review.name) }}
              </div>
            </v-card-text>
            <!-- 삭제 아이콘 -->
            <v-icon small @click="openDeleteModal(review.id)" class="delete-icon">mdi-delete</v-icon>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 리뷰 수정 모달 -->
      <v-dialog v-model="isEditModalOpen" width="500" persistent> <!-- 수정 모달 크기 줄이기 -->
        <v-card class="review-edit-modal">
          <v-btn icon @click="closeEditModal" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
  
          <v-card-text>
            <div class="modal-hospital">{{ selectedReview.hospitalName }}</div>
            <div class="modal-doctor">{{ selectedReview.doctorName }} 원장</div>
  
            <!-- 평점 입력 -->
            <div class="rating-label">진료 만족도를 남겨주세요!</div>
            <v-rating
              v-model="editedRating"
              length="5"
              color="#0094FF"
              background-color="#E7EEF0"
              class="modal-rating"
              justify="center"
            ></v-rating>
  
            <!-- 텍스트 박스 -->
            <v-textarea
              v-model="editedContent"
              label="진료 경험에 대해서 상세하게 알려주세요."
              outlined
              :counter="500"
              rows="5"
              class="modal-textarea"
            ></v-textarea>
          </v-card-text>
  
          <v-card-actions class="edit-modal-actions">
            <v-btn class="submit-btn">리뷰수정완료</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- 리뷰 삭제 모달 -->
      <v-dialog v-model="isDeleteModalOpen" width="630" persistent>
        <v-card class="review-delete-modal">
          <v-card-title class="delete-modal-title">리뷰 삭제</v-card-title>
          <v-card-text class="delete-modal-text">
            이 리뷰를 정말 삭제하시겠습니까?
          </v-card-text>
          <v-card-actions class="delete-modal-actions">
            <v-btn @click="closeDeleteModal" class="cancel-btn">취소</v-btn>
            <v-btn @click="confirmDeleteReview" class="delete-btn">삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        reviews: [],
        isEditModalOpen: false,
        isDeleteModalOpen: false,  // 삭제 모달 상태
        selectedReview: null,       // 선택한 리뷰
        editedRating: 0,
        editedContent: "",
        reviewToDeleteId: null,     // 삭제할 리뷰 ID
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
          console.error("리뷰 데이터를 가져오는 중 오류 발생:", error);
        }
      },
      formatDate(date) {
        const options = { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" };
        return new Date(date).toLocaleDateString("ko-KR", options);
      },
      maskName(name) {
        if (name.length === 3) {
          return name[0] + "*" + name[2];
        }
        return name;
      },
      // 리뷰 수정 모달 오픈
      openEditModal(review) {
        this.selectedReview = review;
        this.editedRating = review.rating;
        this.editedContent = review.contents;
        this.isEditModalOpen = true;
      },
      closeEditModal() {
        this.isEditModalOpen = false;
      },
      async submitReviewUpdate() {
        try {
          await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/update/${this.selectedReview.id}`, {
            rating: this.editedRating,
            contents: this.editedContent
          });
          this.fetchReviews();  // 리뷰 수정 후 목록 새로고침
          this.closeEditModal();  // 수정 후 모달 닫기
        } catch (error) {
          console.error("리뷰 수정 중 오류 발생:", error);
        }
      },
      // 리뷰 삭제 모달 오픈
      openDeleteModal(reviewId) {
        this.reviewToDeleteId = reviewId;
        this.isDeleteModalOpen = true;
      },
      closeDeleteModal() {
        this.isDeleteModalOpen = false;
      },
      // 리뷰 삭제 확인
      async confirmDeleteReview() {
        try {
          await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/delete/${this.reviewToDeleteId}`);
          this.fetchReviews();  // 삭제 후 목록 새로고침
          this.closeDeleteModal();  // 삭제 후 모달 닫기
        } catch (error) {
          console.error("리뷰 삭제 중 오류 발생:", error);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .review-header {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .review-title {
    font-family: 'Inter';
    font-weight: 700;
    font-size: 35px;
    color: #00499E;
    text-align: center;
    margin-bottom: 10px;
  }
  
  .review-underline {
    width: 1000px;
    height: 0px;
    left: 471px;
    top: 323px;
    
    border: 1px solid #C5C5C5;
    background-color: #C5C5C5;
    margin: 0 auto; /* 가운데 정렬 */
    
  }
  
  .pencil-icon {
    width: 55px;
    height: 55px;
    transform: rotate(7.97deg);
  }
  
  .review-list {
    margin-top: 20px;
  }
  
  .review-group {
    margin-bottom: 30px;
    display: flex;
    justify-content: center;
  }
  
  .review-card {
    width: 963px;
    height: auto; /* 높이 자동 조정 */
    border: 1px solid #C5C5C5;
    padding: 20px; /* 패딩을 줄여서 텍스트가 잘리지 않도록 */
    background-color: #F8F8F8;
    max-width: 900px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    top: -10px; /* 리뷰 요소들 위로 올리기 */
  }
  
  .review-hospital {
    font-family: 'Inter';
    font-weight: 400;
    font-size: 14px;
    color: #767676;
  }
  
  .review-doctor {
    font-family: 'Inter';
    font-weight: 700;
    font-size: 18px;
    color: #000000;
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
  
  .rating-container {
    display: flex;
    align-items: center;
    margin-bottom: 5px; /* 여백을 줄여서 공간 확보 */
  }
  
  .small-rating .v-rating .v-icon {
    font-size: 16px;
    color: #00499E !important;
  }
  
  .rating-text {
    margin-left: 5px;
    font-size: 14px;
    color: #00499E;
  }
  
  .review-date {
    font-size: 14px;
    color: #606060;
    margin-top: 5px; /* 마진 조정 */
  }
  
  /* 수정 및 삭제 아이콘 스타일 */
  .edit-icon {
    margin-left: 10px;
  }
  
  .delete-icon {
    position: absolute;
    right: 10px;
    top: 15px;
  }
  
  /* 모달 스타일 */
  .review-edit-modal {
    width: 500px; /* 모달 크기 줄이기 */
    height: 520px;
    background-color: #FFFFFF;
    border-radius: 20px;
    position: relative;
  }
  
  /* X 버튼 */
  .close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
  }
  
  /* 병원 및 의사 정보 스타일 */
  .modal-hospital {
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 25px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 10px;
  }
  
  .modal-doctor {
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: #555555;
  }
  
  /* 평점 입력 스타일 */
  .rating-label {
    text-align: center;
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #0066FF;
    margin-top: 20px;
  }
  
  .modal-rating {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }
  
  /* 텍스트 박스 스타일 */
  .modal-textarea {
    width: 422px;
    height: 160.89px;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    margin: 20px auto;
  }
  
  /* 리뷰 수정 완료 버튼 */
  .edit-modal-actions {
    display: flex;
    justify-content: center;   /* 가운데 정렬 */
    align-items: center;       /* 세로 가운데 정렬 */
    margin: 0;                 /* 불필요한 마진 제거 */
    padding: 10px 0;           /* 위아래 패딩을 약간 추가 */
}

.submit-btn {
    background-color: #C2D7FF;
    color: #00499E;
    border-radius: 40px;
    width: 118px;
    height: 40px;              /* 버튼 높이 약간 증가 */
    display: flex;
    justify-content: center;   /* 버튼 텍스트가 중앙에 위치하게 설정 */
    align-items: center;       /* 버튼 텍스트가 중앙에 위치하게 설정 */
    margin: 0 auto;            /* 버튼을 자동으로 가운데 배치 */
}

  
  /* 리뷰 삭제 모달 스타일 */
  .review-delete-modal {
    width: 630px;
    height: 221px;
    background-color: #FFFFFF;
    border-radius: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .delete-modal-title {
    font-family: 'Inter', sans-serif;
    font-weight: 700;
    font-size: 30px;
    text-align: center;
    color: #676767;
    margin-top: 0px; /* 가운데 정렬을 위해 제거 */
  }
  
  .delete-modal-actions {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    gap: 15px;
  }
  
  .cancel-btn {
    background-color: #D8D8D8;
    color: #676767;
    border-radius: 40px;
    width: 117px;
    height: 40px;
  }
  
  .delete-btn {
    background-color: #C2D7FF;
    color: #00499E;
    border-radius: 40px;
    width: 117px;
    height: 40px;
  }
  </style>
