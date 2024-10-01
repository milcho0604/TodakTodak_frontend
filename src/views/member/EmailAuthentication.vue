<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card elevation="10">
          <v-card-title class="text-h5 text-center">이메일 인증</v-card-title>
          <v-card-text>
            <v-form v-if="!isVerified" @submit.prevent="sendVerificationEmail">
              <!-- 이메일 입력 -->
              <v-text-field
                v-model="memberEmail"
                label="이메일"
                prepend-icon="mdi-email"
                :rules="[rules.required, rules.email]"
                required
              ></v-text-field>
              <!-- 인증 코드 입력 -->
              <v-text-field
                v-model="verificationCode"
                label="인증 코드"
                prepend-icon="mdi-key"
                :rules="[rules.required]"
                v-if="verificationSent"
                required
              ></v-text-field>
              
              <v-row justify="center">
                <v-col cols="auto">
                  <v-btn color="primary" type="submit" class="custom-btn btn-narrow">
                    {{ verificationSent ? '인증 코드 확인' : '인증 코드 발송' }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
  
            <!-- 인증 완료 메시지 -->
            <div v-else class="text-center my-4">
              <v-icon color="green" large>mdi-check-circle</v-icon>
              <h3>이메일 인증이 완료되었습니다.</h3>
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
      memberEmail: '',
      verificationCode: '',
      verificationSent: false,
      isVerified: false, // 인증 성공 여부
      rules: {
        required: value => !!value || '필수 입력 항목입니다.',
        email: value => {
          const pattern = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
          return pattern.test(value) || '유효한 이메일을 입력하세요.';
        }
      }
    };
  },
  methods: {
    // 이메일 인증 코드 발송
    async sendVerificationEmail() {
      if (!this.verificationSent) {
        try {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/send-verification-code`, {
            memberEmail: this.memberEmail
          });
          if (response.status === 200) {
            this.verificationSent = true;
            alert('인증 코드가 이메일로 발송되었습니다.');
          }
        } catch (error) {
          alert(error.response?.data?.message || '이메일 인증 코드 발송에 실패했습니다.');
        }
      } else {
        // 인증 코드 확인
        this.checkVerificationCode();
      }
    },

    // 인증 코드 확인
    async checkVerificationCode() {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/verify-email`, {
          memberEmail: this.memberEmail,
          code: this.verificationCode // 서버 측에서 사용하는 변수명에 맞춰 변경
        });
        if (response.status === 200) {
          this.isVerified = true;
          alert('이메일 인증이 성공적으로 완료되었습니다.');
        }
      } catch (error) {
        alert(error.response?.data?.message || '인증 코드 확인에 실패했습니다.');
      }
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
}

.v-container {
  max-width: 600px;
  margin: 0 auto;
  padding-top: 50px;
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
  max-width: 200px; /* 버튼의 너비를 줄임 */
  margin: 0 auto;
}

.v-btn.custom-btn:hover {
  background-color: #80b1ff !important;
}
</style>
