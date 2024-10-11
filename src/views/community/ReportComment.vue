<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card class="pa-5">
      <v-card-title class="text-center" style="margin-top: 20px; margin-bottom: 10px"> 
        <span class="headline" style="font-size: 20px; color: #00499E; font-weight: bold;">해당 댓글을 신고하시겠습니까?</span>
      </v-card-title>
      <v-card-subtitle class="text-center" style="font-size: 15px; color: #676767; font-weight: bold;margin-bottom: 10px">🚨신고 사유를 입력해주세요</v-card-subtitle>
      <v-card-text style="margin-bottom: -30px;">
        <v-textarea
          v-model="reportContent"
          label="신고 사유를 상세히 입력해주세요"
          outlined
          required
          class="custom-textarea"
        ></v-textarea>
      </v-card-text>
      <v-card-actions class="d-flex justify-center" style="align-items: center;">
        <v-btn @click="close" class="cancel-button">취소</v-btn>
        <span style="margin: 0 10px;">|</span> 
        <v-btn @click="submitReport" class="report-button">신고하기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    postId: {
      type: Number,
      required: true,
    },
    commentId: {
      type: Number,
      required: true,
    },
    comments: {
      type: Array,
      required: true,
      default: () => [], // 기본값 추가
    },
  },
  data() {
    return {
      show: true,
      reportContent: '',
      fetchedComments: [],
    };
  },
  async mounted() {
     // 비동기적으로 댓글 데이터 로드
     try {
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/community-service/post/detail/${this.postId}`);
      console.log('Full Response:', response.data.result.comments); // 전체 응답 출력
      this.fetchedComments = response.data.result.comments; // result에 접근
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  },
  methods: {
    async submitReport() {
      if (!this.commentId) {
        console.error("댓글 데이터가 없습니다.");
        return;
      }

      if (!Array.isArray(this.comments)) {
        console.error("댓글 데이터가 배열이 아닙니다.");
        return;
      }
      
      const comment = this.fetchedComments.find(comment => comment.id === this.commentId);
      console.log(comment);
      if (!comment) {
        console.error("댓글을 찾을 수 없습니다.");
        return;
      }

      try {
        const reporterEmail = localStorage.getItem('email');
        const reportedEmail = comment.doctorEmail;

        const payload = {
          reporterEmail,
          reportedEmail,
          reason: this.reportContent,
          commentId: this.commentId,
          postIdL:this.postId
        };
        console.log(payload.reporterEmail, payload.reportedEmail, payload.reason, payload.commentId);
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/community-service/report/create`, payload);
        if (response.status === 201) {
          this.close();
          alert('신고가 접수되었습니다.');
        }
        
      } catch (error) {
        console.error("신고 중 오류가 발생했습니다.", error);
        alert('신고에 실패했습니다.');
      }
    },
    close() {
      this.$emit('close');
    },
  }
};
</script>

  
  <style scoped>
  .headline {
    font-size: 10px;
    color: #00499E;
    font-weight: bold; /* 굵게 설정 */
  }

  .custom-textarea .v-input__control {
    border: 1px solid #D0CCCC !important; /* 테두리 색상 적용 */
    border-radius: 20px !important; /* 전체 모서리에 radius 적용 */
    box-shadow: none !important; /* 기본 그림자 제거 */
  }
  
  .custom-textarea .v-input__slot {
    border: none !important; /* 기본 테두리 제거 */
    background-color: #FFFFFF !important; /* 배경색 흰색 */
    border-radius: 10px !important; /* 전체 모서리에 radius 적용 */
  }

  .cancel-button {
    background-color: #CACACA !important; /* 기본 배경색 */
    color: 717171 !important;/* 글자색 */
    border: none !important; /* 기본 테두리 제거 */
    border-radius: 20px !important; /* 모서리 둥글기 */
    min-width: 100px; /* 최소 너비 */
   }

    .report-button{
        background-color: #C2D7FF !important; /* 기본 배경색 */
        color: #00499E !important;/* 글자색 */
        border: none !important; /* 기본 테두리 제거 */
        border-radius: 20px !important; /* 모서리 둥글기 */
        min-width: 100px; /* 최소 너비 */
    }

  </style>