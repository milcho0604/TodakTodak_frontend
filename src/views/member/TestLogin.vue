<template>
    <v-container class="main-content">
      <div class="signup-title-container">
        <div class="signup-title">이메일 로그인</div>
      </div>
      <br />
      <v-row justify="center">
        <v-col cols="12" sm="6" md="8">
          <v-card class="login-card">
            <v-card-title class="text-h5 text-center">로그인</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="doLogin">
                <!-- 이메일 필드 -->
                <v-text-field
                  label="아이디(이메일)"
                  v-model="memberEmail"
                  type="email"
                  prepend-icon="mdi-email"
                  required
                  class="underline-input-field"
                  solo-inverted
                  hide-details
                ></v-text-field>
                <br>
                <!-- 비밀번호 필드 -->
                <v-text-field
                  label="비밀번호"
                  v-model="password"
                  type="password"
                  prepend-icon="mdi-lock"
                  required
                  class="underline-input-field"
                  solo-inverted
                  hide-details
                ></v-text-field>
                <!-- 체크박스 필드 -->
                <v-row class="checkbox-row" dense>
                  <v-col cols="4">
                    <v-checkbox
                      v-model="rememberEmail"
                      label="ID 저장"
                      class="custom-checkbox"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="6" class="text-right">
                    <v-checkbox
                      v-model="autoLogin"
                      label="자동로그인"
                      class="custom-checkbox"
                    ></v-checkbox>
                  </v-col>
                </v-row>
                <!-- 로그인 버튼 -->
                <v-row justify="center" >
                  <v-btn type="submit" class="login-btn">로그인</v-btn>
                </v-row>
  
                <br>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  import { jwtDecode } from "jwt-decode";
  import { requestFcmToken } from "@/firebase";
  import { removeFcmToken } from "@/firebase";
  
  
  export default {
    name: "LoginPage",
    data() {
      return {
        memberEmail: "",
        password: "",
        rememberEmail: false,
        autoLogin: false,
      };
    },
    mounted() {
      const savedEmail = localStorage.getItem('savedEmail');
      if (savedEmail) {
        this.memberEmail = savedEmail;
        this.rememberEmail = true;
      }
    },
    methods: {
      async doLogin() {
        try {
          await removeFcmToken();
          // Step 1: FCM 토큰 요청
          const fcmToken = await requestFcmToken(true);
          console.log('FCM Token for login:', fcmToken);
  
          // Step 2: 로그인 데이터 준비
          const loginData = {
            memberEmail: this.memberEmail,
            password: this.password,
            fcmToken: fcmToken,
            rememberEmail: this.rememberEmail,
            autoLogin: this.autoLogin,
          };
  
          // Step 3: FCM 토큰을 포함하여 로그인 요청 전송
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/test/login`, loginData);
  
          // Step 4: 로그인 성공 시 토큰과 사용자 정보 로컬에 저장
          const token = response.data.result;
          const decodedToken = jwtDecode(token);
          const role = decodedToken.role;
          const memberId = decodedToken.memberId;
          
  
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('memberId', memberId);
          localStorage.setItem('email', this.memberEmail);
          localStorage.setItem('fcmToken', fcmToken);
  
  
          if (this.rememberEmail) {
            localStorage.setItem('savedEmail', this.memberEmail);
          } else {
            localStorage.removeItem('savedEmail');
          }
          window.location.href = "/";
        } catch (e) {
          if (e.response?.status === 422) {
            alert('잘못된 이메일/비밀번호입니다.');
          } else if (e.response?.status === 403) {
            alert('토닥 관계자만 로그인이 가능합니다');
            window.location.href = "/";
          } else if (e.response?.status === 423) {
            alert('정지된 계정입니다.');
            window.location.href = "/";
          } else if (e.response?.status === 401) {
            alert('이메일 인증이 필요합니다.');
            window.location.href = "/all/authentication";
          } else {
            const error_message = e.response?.data?.status_message || "로그인에 실패했습니다.";
            console.error("Login request failed:", e);
            alert(error_message);
          }
        }
      },
    },
  };
  </script>
  
  
  <style scoped>
  .v-container {
    max-width: 850px;
    margin: auto;
    padding: 40px;
  }
  
  .login-card {
    padding: 30px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* 밑줄이 있는 텍스트 필드 */
  .underline-input-field .v-input__control {
    border-bottom: 2px solid #00499e !important;
    box-shadow: none !important;
    background-color: white !important;
    margin-bottom: 10px;
  }
  
  .underline-input-field .v-input__control:hover {
    border-bottom-color: #003c8f !important;
  }
  
  .underline-input-field .v-input__control input {
    padding-left: 0 !important;
  }
  
  /* 체크박스 간격 좁히기 */
  .checkbox-row {
    margin-top: -5px !important; /* 간격 좁힘 */
    margin-bottom: -5px !important; /* 간격 좁힘 */
  }
  .custom-checkbox {
    color: #00499e;
    font-size: 14px;
    margin-left: 30px;
  }
  
  /* 로그인 버튼 크기 조정 및 중앙 정렬 */
  .login-btn {
    background-color: #c2d7ff !important;
    color: #00499e !important;
    border-radius: 25px !important;
    padding: 8px 40px !important;
    font-family: 'Inter' !important;
    font-weight: 700 !important;
    font-size: 16px !important;
    text-transform: none !important;
    width: 150px;
  }
  
  .link-text {
    color: #00499e;
    font-weight: 500;
    cursor: pointer;
    text-align: center;
  }
  
  .link-text:hover {
    text-decoration: underline;
  }
  
  .signup-title {
    font-size: 28px;
    font-weight: 700;
    color: #00499e;
    text-align: center;
    margin-bottom: 20px;
  }
  
  .signup-title-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  }
  
  .custom-list {
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 8px;
  }
  </style>
  