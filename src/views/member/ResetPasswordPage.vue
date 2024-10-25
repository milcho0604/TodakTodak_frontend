<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-5 reset-password-card">
          <v-card-title class="text-h5 text-center white--text">비밀번호 재설정</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="resetPassword">
              <v-text-field
                label="새 비밀번호"
                v-model="newPassword"
                type="password"
                prepend-icon="mdi-lock"
                class="input-field"
                required
              ></v-text-field>
              <v-text-field
                label="비밀번호 확인"
                v-model="confirmPassword"
                type="password"
                prepend-icon="mdi-lock-check"
                class="input-field"
                required
              ></v-text-field>
              
              <!-- 버튼을 중앙에 정렬하고 너비 줄임 -->
              <v-row justify="center">
                <v-col cols="auto">
                  <v-btn block type="submit" class="custom-btn btn-narrow">비밀번호 재설정</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 성공 모달 -->
    <v-dialog v-model="successModal" max-width="400px">
      <v-card class="modal-card">
        <v-card-title class="modal-title">성공</v-card-title>
        <v-card-text class="modal-text">
          비밀번호가 재설정되었습니다.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="modal-btn" @click="closeSuccessModal">확인</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 실패 모달 -->
    <v-dialog v-model="errorModal" max-width="400px">
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
import axios from "axios";

export default {
  name: "ResetPasswordPage",
  props: ["token"],
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      errorMessage: "",
      successModal: false, // 성공 모달 상태
      errorModal: false,   // 실패 모달 상태
    };
  },
  methods: {
    async resetPassword() {
      if (this.newPassword.length <= 7) {
        this.errorMessage = "비밀번호는 8자 이상이어야 합니다.";
        this.errorModal = true;
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = "비밀번호가 일치하지 않습니다.";
        this.errorModal = true;
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/member/reset/password`,
          {
            token: this.token,
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword
          }
        );

        if (response.status === 200) {
          this.successModal = true;
        } else {
          this.errorMessage = response.data?.message || "비밀번호 재설정에 실패했습니다.";
          this.errorModal = true;
        }
      } catch (e) {
        this.errorMessage = e.response?.data?.message || "비밀번호 재설정에 실패했습니다.";
        this.errorModal = true;
      }
    },
    closeSuccessModal() {
      this.successModal = false;
      this.$router.push("/all/hospitallogin"); // 성공 후 로그인 페이지로 이동
    },
    closeErrorModal() {
      this.errorModal = false;
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
}

.btn-narrow {
  max-width: 200px; /* 버튼의 너비를 줄임 */
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
