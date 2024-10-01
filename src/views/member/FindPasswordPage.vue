<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-5 reset-password-card">
          <v-card-title class="text-h5 text-center white--text">비밀번호 찾기</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="sendResetLink">
              <v-text-field
                label="이메일"
                v-model="memberEmail"
                type="email"
                prepend-icon="mdi-email"
                class="input-field"
                required
              ></v-text-field>
              <v-row justify="center">
                <v-col cols="auto">
                  <v-btn type="submit" class="custom-btn btn-narrow">비밀번호 재설정 링크 전송</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 성공 모달 -->
    <v-dialog v-model="successDialog" max-width="400px">
      <v-card class="modal-card">
        <v-card-title class="modal-title">성공</v-card-title>
        <v-card-text class="modal-text">
          비밀번호 재설정 링크가 이메일로 발송되었습니다.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="modal-btn" @click="closeSuccessModal">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 실패 모달 -->
    <v-dialog v-model="errorDialog" max-width="400px">
      <v-card class="modal-card">
        <v-card-title class="modal-title">오류</v-card-title>
        <v-card-text class="modal-text">
          {{ errorMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="modal-btn" @click="closeErrorModal">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "PasswordResetPage",
  data() {
    return {
      memberEmail: "",
      errorMessage: "",
      successDialog: false, // 성공 모달 상태
      errorDialog: false,   // 실패 모달 상태
    };
  },
  methods: {
    async sendResetLink() {
      if (!this.memberEmail) {
        this.errorMessage = "이메일을 입력해주세요.";
        this.errorDialog = true;
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/member/find/password`,
          {
            memberEmail: this.memberEmail
          }
        );
        console.log(response);

        this.successDialog = true; // 성공 모달 열기
      } catch (e) {
        const errorMessage = e.response?.data?.status_message || '알 수 없는 오류가 발생했습니다.';
        this.errorMessage = errorMessage;
        this.errorDialog = true; // 실패 모달 열기
      }
    },
    closeSuccessModal() {
      this.successDialog = false;
      this.$router.push("/login"); // 성공 후 로그인 페이지로 이동
    },
    closeErrorModal() {
      this.errorDialog = false;
    }
  }
};
</script>

<style scoped>
body {
  background: linear-gradient(to right, #d0e8ff, #c2d7ff);
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Noto Sans KR", sans-serif;
}

.reset-password-card {
  background-color: #f0f8ff !important;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-btn.custom-btn {
  background-color: #a2c3ff !important;
  color: white !important;
  font-weight: bold;
  border-radius: 20px;
  max-width: 200px; /* 버튼 너비 조정 */
  width: 100%; /* 버튼을 전체 너비로 설정 */
}

.btn-narrow {
  max-width: 200px;
  margin: 0 auto;
}

.v-card-title {
  font-weight: 700;
  font-size: 24px;
  margin-bottom: 20px;
}

.input-field .v-input__control {
  background-color: white;
  border-radius: 10px;
}

/* 모달 스타일 */
.modal-card {
  background-color: #f0f8ff;
  border-radius: 20px;
  padding: 20px;
}

.modal-title {
  font-weight: 700;
  font-size: 22px;
  color: #00499e;
}

.modal-text {
  font-size: 18px;
  color: #606060;
}

.modal-btn {
  background-color: #a2c3ff !important;
  color: white !important;
  font-weight: bold;
  border-radius: 20px;
}

.modal-btn:hover {
  background-color: #80b1ff !important;
}

.v-btn.custom-btn:hover {
  background-color: #80b1ff !important;
}

.white--text {
  color: #00499e !important;
}
</style>
