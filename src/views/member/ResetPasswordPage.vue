<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-5" color="#ff7e5f" dark>
          <v-card-title class="text-h5 text-center white--text">비밀번호 재설정</v-card-title>
          <v-card-text>
            <!-- 에러 메시지 및 성공 메시지 표시 -->
            <v-alert v-if="errorMessage" type="error" class="mt-3">{{ errorMessage }}</v-alert>
            <v-alert v-if="successMessage" type="success" class="mt-3">{{ successMessage }}</v-alert>
            <v-form @submit.prevent="resetPassword">
              <v-text-field
                label="새 비밀번호"
                v-model="newPassword"
                type="password"
                prepend-icon="mdi-lock"
                required
              ></v-text-field>
              <v-text-field
                label="비밀번호 확인"
                v-model="confirmPassword"
                type="password"
                prepend-icon="mdi-lock-check"
                required
              ></v-text-field>
              <v-btn block type="submit" color="primary">비밀번호 재설정</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: "ResetPasswordPage",
  data() {
    return {
      newPassword: "",
      confirmPassword: "",
      errorMessage: "",
      successMessage: ""
    };
  },
  methods: {
    async resetPassword() {
      // 비밀번호 검증 로직
      if (this.newPassword.length <= 7) {
        this.errorMessage = '비밀번호는 8자 이상이어야 합니다.';
        return;
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errorMessage = '비밀번호가 일치하지 않습니다.';
        return;
      }

      try {
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/member/reset/password`,
          {
            token: this.$route.query.token,  // URL에서 token 가져오기
            newPassword: this.newPassword,
            confirmPassword: this.confirmPassword
          }
        );

        if (response.status === 200) {
          this.successMessage = '비밀번호가 재설정되었습니다.';
          setTimeout(() => {
            this.$router.push('/login');  // 3초 후 로그인 페이지로 이동
          }, 3000);
        } else {
          this.errorMessage = response.data?.message || '비밀번호 재설정에 실패했습니다.';
        }
      } catch (e) {
        this.errorMessage = e.response?.data?.message || '비밀번호 재설정에 실패했습니다.';
      }
    }
  }
};
</script>

<style scoped>
body {
  background: linear-gradient(to right, #ff7e5f, #feb47b);
  height: 100vh;
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  font-family: Arial, sans-serif;
}

.v-card {
  background-color: rgba(0, 0, 0, 0.7);
}

.v-btn {
  background-color: #c2d7ff !important;
}

.white--text {
  color: white !important;
}
</style>
