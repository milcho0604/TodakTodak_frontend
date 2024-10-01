<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="8">
        <v-card>
          <v-card-title class="text-h5 text-center">이메일 찾기</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="findEmail">
              <v-text-field
                label="이름"
                v-model="name"
                required
                prepend-icon="mdi-account"
              ></v-text-field>
              <v-text-field
                label="전화번호"
                v-model="phoneNumber"
                type="tel"
                required
                prepend-icon="mdi-phone"
              ></v-text-field>
              <v-btn block type="submit" color="primary">이메일 찾기</v-btn>
              <v-divider class="my-4"></v-divider>
              <v-btn block @click="$router.push('/login')">로그인 페이지로 돌아가기</v-btn>
            </v-form>
            <!-- 이메일 찾기 성공 시 메시지 -->
            <v-alert v-if="memberEmail" type="success" class="mt-4" border="left">
              찾으신 이메일 주소는: {{ memberEmail.result }}
            </v-alert>
            <!-- 에러 메시지 표시 -->
            <v-alert v-if="errorMessage" type="error" class="mt-4" border="left">
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FindIdPage',
  data() {
    return {
      name: '',
      phoneNumber: '',
      memberEmail: '', // 이메일 주소를 저장할 데이터
      errorMessage: '' // 에러 메시지 저장
    };
  },
  methods: {
    async findEmail() {
      try {
        const body = {
          name: this.name,
          phoneNumber: this.phoneNumber
        };
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/find/email`, body);

        // 서버 응답에서 이메일을 추출
        this.memberEmail = response.data; // 마스킹된 이메일을 저장
        this.errorMessage = ''; // 에러 메시지를 초기화
        alert('이메일 찾기 요청이 완료되었습니다. 결과를 확인해 주세요.');
        console.log(response.data);
      } catch (e) {
        // 서버에서 반환한 에러 메시지를 저장
        this.errorMessage = e.response?.data?.message || '존재하지 않는 사용자입니다.';
        this.memberEmail = ''; // 이메일 정보 초기화
        console.error('Error details:', e);
      }
    },
  }, 
};
</script>
