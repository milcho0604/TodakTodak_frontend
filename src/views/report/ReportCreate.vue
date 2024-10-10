<template>
  <div>
    <div v-if="isVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">신고하기</h5>
          <button class="close-button" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitReport">
            <div class="mb-3">
              <label for="reportReason" class="form-label">신고 내용</label>
              <textarea v-model="reportReason" class="form-control" id="reportReason" rows="3" required></textarea>
            </div>
            <input type="hidden" v-model="postId" />
            <input type="hidden" v-model="commentId" />
            <button type="submit" class="btn btn-primary">신고</button>
          </form>
          <div v-if="successMessage" class="alert alert-success mt-2">{{ successMessage }}</div>
          <div v-if="errorMessage" class="alert alert-danger mt-2">{{ errorMessage }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isVisible: false,
      postId: null,
      commentId: null,
      reportReason: '',
      successMessage: '',
      errorMessage: ''
    };
  },
  methods: {
    openModal(postId, commentId) {
      this.postId = postId;
      this.commentId = commentId;
      this.reportReason = '';
      this.successMessage = '';
      this.errorMessage = '';
      this.isVisible = true;
    },
    closeModal() {
      this.isVisible = false;
    },
    async submitReport() {
      try {
        await this.$axios.post('/api/report', {
          postId: this.postId,
          commentId: this.commentId,
          reason: this.reportReason
        });
        this.successMessage = '신고가 완료되었습니다.';
        this.reportReason = ''; // Clear the textarea
        this.closeModal(); // Close modal
      } catch (error) {
        this.errorMessage = '신고에 실패했습니다.';
        console.error('신고 실패:', error);
      }
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 5px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5em;
  cursor: pointer;
}

.btn {
  padding: 10px 15px;
}
</style>
