<template>
  <v-container>
    <!-- 리뷰 관리 제목과 연필 아이콘 -->
    <v-row class="review-header" justify="center" align="center">
      <v-col cols="auto" class="d-flex flex-column align-center">
        <div class="review-title">✏️리뷰관리</div>
        <div class="review-underline"></div>
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
                color="#0094FF"
                background-color="#C5C5C5"
                dense
                readonly
                size="20px"
                style="margin-top: -20px;"
                class="small-rating"
              ></v-rating>
              <span class="rating-text">{{ review.rating.toFixed(1) }}</span>
            </div>
            <div style="margin-top: 10px;">{{ review.contents }}</div>
            <div class="review-date">
              {{ formatDate(review.createdAt) }} - {{ review.name }}
            </div>
          </v-card-text>
          <!-- 삭제 아이콘 -->
          <v-icon small @click="openDeleteModal(review.id)" class="delete-icon">mdi-trash-can-outline</v-icon>
        </v-card>
      </v-col>
    </v-row>

    <!-- 리뷰 수정 모달 -->
    <v-dialog v-model="isEditModalOpen" width="500" persistent>
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
          <v-btn class="submit-btn" @click="submitReviewUpdate">리뷰 수정 완료</v-btn>
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
    openDeleteModal(reviewId) {
      this.reviewToDeleteId = reviewId;
      this.isDeleteModalOpen = true;
    },
    closeDeleteModal() {
      this.isDeleteModalOpen = false;
    },
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
  font-size: 30px;
  color: #00499E;
  text-align: center;
  margin-bottom: 10px;
}

.review-underline {
  width: 1000px;
  max-width: 1000px;
  height: 1px;
  background-color: #C5C5C5;
  margin-top: 10px;
  margin-left: auto; /* 왼쪽 여백 자동 */
  margin-right: auto; /* 오른쪽 여백 자동 */
}

.review-list {
  margin-top: 20px;
  width: 1000px;
  margin-left: auto; /* 왼쪽 여백 자동 */
  margin-right: auto; /* 오른쪽 여백 자동 */
}

.review-group {
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}

.review-card {
  width: 100%;
  max-width: 800px;
  height: auto;

  padding: 20px;
  background-color: #F8F8F8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px; /* 리뷰 카드에 round 10 적용 */
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
  font-size: 25px;
  color: #000000;
  margin-top: -10px;
  display: flex;
  align-items: center;
}

.rating-container {
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 별을 왼쪽으로 정렬 */
}

.small-rating .v-rating .v-icon {
  font-size: 10px;
  color: #0094FF !important;
  margin-top: -30px;
}

.rating-text {
  margin-left: 5px;
  font-size: 14px;
  color: #0094FF;
  margin-top: -16px;
}

.review-date {
  font-size: 14px;
  color: #606060;
  margin-top: 5px;
}

.edit-icon {
  margin-left: 10px;
  font-size: 25px;
}

.delete-icon {
  position: absolute;
  right: 10px;
  top: 15px;
  color: #676767;
}

.review-edit-modal {
  width: 500px;
  background-color: #FFFFFF;
  border-radius: 20px;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
}

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

.modal-textarea {
  width: 422px;
  height: 160px;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  margin: 20px auto;
}

.edit-modal-actions {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.submit-btn {
  background-color: #C2D7FF;
  color: #00499E;
  border-radius: 40px;
  width: 118px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.review-delete-modal {
  width: 630px;
  height: 221px;
  background-color: #FFFFFF;
  border-radius: 20px;
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
