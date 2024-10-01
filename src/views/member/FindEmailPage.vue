<template>
  <v-container class="background-container">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-5 find-email-card">
          <v-card-title class="text-h5 text-center white--text">이메일 찾기</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="findEmail">
              <v-text-field
                label="이름"
                v-model="name"
                prepend-icon="mdi-account"
                class="input-field"
                outlined
                dense
                required
              ></v-text-field>
              <v-text-field
                label="전화번호"
                v-model="phoneNumber"
                type="tel"
                prepend-icon="mdi-phone"
                class="input-field"
                outlined
                dense
                required
              ></v-text-field>
              <v-btn block type="submit" class="custom-btn">이메일 찾기</v-btn>
            </v-form>

            <v-divider class="my-4"></v-divider>

            <v-btn block @click="$router.push('/login')" class="custom-btn">로그인 페이지로 돌아가기</v-btn>
          </v-card-text>
        </v-card>

        <!-- 성공 모달 -->
        <v-dialog v-model="successDialog" max-width="400px">
          <v-card class="modal-card">
            <v-card-title class="modal-title">이메일 찾기 성공!</v-card-title>
            <v-card-text class="modal-text">
              찾으신 이메일 주소는: <strong>{{ memberEmail.result }}</strong>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="modal-btn" @click="successDialog = false">확인</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- 실패 모달 -->
        <v-dialog v-model="errorDialog" max-width="400px">
          <v-card class="modal-card">
            <v-card-title class="modal-title">이메일 찾기 실패</v-card-title>
            <v-card-text class="modal-text">
              {{ errorMessage }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="modal-btn" @click="errorDialog = false">확인</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "FindIdPage",
  data() {
    return {
      name: "",
      phoneNumber: "",
      memberEmail: "", // 이메일 주소를 저장할 데이터
      errorMessage: "", // 에러 메시지 저장
      successDialog: false, // 성공 모달 상태
      errorDialog: false, // 실패 모달 상태
    };
  },
  methods: {
    async findEmail() {
      try {
        const body = {
          name: this.name,
          phoneNumber: this.phoneNumber,
        };
        console.log(body)
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/member/find/email`,
          body
        );

        this.memberEmail = response.data;
        this.errorMessage = "";
        this.successDialog = true; // 성공 모달 열기
      } catch (e) {
        this.errorMessage =
          e.response?.data?.message || "존재하지 않는 사용자입니다.";
        this.memberEmail = "";
        this.errorDialog = true; // 실패 모달 열기
      }
    },
  },
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

.background-container {

  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.find-email-card {
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
