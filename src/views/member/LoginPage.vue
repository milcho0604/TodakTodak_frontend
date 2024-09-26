<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" sm="6" md="8">
                <v-card>
                    <v-card-title class="text-h5 text-center">로그인</v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="doLogin">
                            <v-text-field
                                label="아이디(이메일)"
                                v-model="email"
                                type="email"
                                prepend-icon="mdi-email"
                                required
                            ></v-text-field>
                            <v-text-field
                                label="비밀번호"
                                v-model="password"
                                type="password"
                                prepend-icon="mdi-lock"
                                required
                            ></v-text-field>
                            <v-checkbox
                                v-model="rememberEmail"
                                label="ID 저장"
                            ></v-checkbox>
                            <v-checkbox
                                v-model="autoLogin"
                                label="자동로그인"
                            ></v-checkbox>
                            <v-btn block type="submit" color="primary">로그인</v-btn>
                            <v-divider class="my-4"></v-divider>
                            <div style="display: flex; justify-content: center; align-items: center; width: 100%; gap: 5px;">
                              <v-btn
                                  style="flex: 1; height: auto; padding: 0; border: none; display: flex; justify-content: center; align-items: center;"
                                  @click="kakaoLogin"
                              > 카카오 로그인
                              <v-icon size="large">mdi-kakao-talk</v-icon>
                              </v-btn>
                            </div>
  
                            <v-divider class="my-4"></v-divider>
                            <v-list>
                                <v-list-item @click="findId">
                                    <v-list-item-title>아이디 찾기</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="findPassword">
                                    <v-list-item-title>비밀번호 찾기</v-list-item-title>
                                </v-list-item>
                                <v-list-item @click="signUp">
                                    <v-list-item-title>회원가입</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';


export default {
    name: "LoginPage",
    data() {
        return {
            email: "",
            password: "",
            rememberEmail: false,
            autoLogin: false,
        };
    },
    mounted() {
        const savedEmail = localStorage.getItem('savedEmail');
        if (savedEmail) {
            this.email = savedEmail;
            this.rememberEmail = true;
        }
    },
    methods: {
        async doLogin() {
            try {
                const loginData = {
                    email: this.email,
                    password: this.password,
                    rememberEmail: this.rememberEmail,
                    autoLogin: this.autoLogin,
                };
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/login`, loginData);
            
                const token = response.data.result;
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;
                const memberId = decodedToken.memberId;

                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.setItem('memberId', memberId);  // member.id 저장
                localStorage.setItem('email', this.email);  // email 저장

                if (this.rememberEmail) {
                    localStorage.setItem('savedEmail', this.email);  // 이메일 저장
                } else {
                    localStorage.removeItem('savedEmail');  // 이메일 삭제
                }

                await this.fetchData(memberId);
                window.location.href = "/";
            } catch (e) {
                alert('로그인 실패');
                console.error(e);
                const error_message = e.response?.data?.status_message || "로그인에 실패했습니다.";
                alert(error_message);
            }
        },
        async fetchData(memberId) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/some-endpoint`, {
                    headers: {
                        'myId': memberId // myId 헤더에 사용자 ID 설정
                    }
                });
                console.log('데이터 가져오기 성공:', response.data);
            } catch (error) {
                console.error('데이터 가져오기 실패:', error);
            }
        },
        kakaoLogin() {
            window.location.href = 'http://localhost:8080/member-service/oauth2/authorization/kakao';
        },
    },
};
</script>
