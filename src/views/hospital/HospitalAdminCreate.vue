<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <h2 class="text-center mb-5">병원 가입</h2>
  
          <v-form ref="form" v-model="formValid">
            <!-- 병원명 -->
            <v-text-field v-model="form.hospitalName" label="병원명" :rules="[rules.required]"></v-text-field>
  
            <!-- 주소 입력 버튼 -->
            <v-btn @click="openPostcode">주소 검색</v-btn>
  
            <!-- 주소 정보 -->
            <v-text-field v-model="form.address" label="주소" readonly :rules="[rules.required]"></v-text-field>
            <v-text-field v-model="form.dong" label="동" readonly></v-text-field>
            <v-text-field v-model="form.latitude" label="위도" readonly></v-text-field>
            <v-text-field v-model="form.longitude" label="경도" readonly></v-text-field>
  
            <!-- 병원 전화번호 -->
            <v-text-field v-model="form.hospitalPhoneNumber" label="병원 전화번호" :rules="[rules.required]"></v-text-field>
  
            <!-- 사업자 등록번호 -->
            <v-text-field v-model="form.businessRegistrationInfo" label="사업자 등록번호" :rules="[rules.required]"></v-text-field>
  
            <!-- 관리자 이름 -->
            <v-text-field v-model="form.adminName" label="관리자 이름" :rules="[rules.required]"></v-text-field>
  
            <!-- 관리자 이메일 -->
            <v-text-field v-model="form.adminEmail" label="관리자 이메일" :rules="[rules.required, rules.email]"></v-text-field>
  
            <!-- 관리자 비밀번호 -->
            <v-text-field v-model="form.adminPassword" label="비밀번호" :type="'password'" :rules="[rules.required]"></v-text-field>
  
            <!-- 관리자 전화번호 -->
            <v-text-field v-model="form.adminPhoneNumber" label="관리자 전화번호" :rules="[rules.required]"></v-text-field>
  
            <v-btn @click="submitForm">가입하기</v-btn>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  /* global kakao, daum */

  export default {
    data() {
      return {
        formValid: false,
        form: {
          hospitalName: '',
          address: '',
          dong: '',
          latitude: '',
          longitude: '',
          hospitalPhoneNumber: '',
          businessRegistrationInfo: '',
          adminName: '',
          adminEmail: '',
          adminPassword: '',
          adminPhoneNumber: '',
        },
        rules: {
          required: (value) => !!value || '필수 입력 항목입니다.',
          email: (value) => /.+@.+\..+/.test(value) || '유효한 이메일을 입력하세요.',
        },
        geocoder: null, // Geocoder 객체
      };
    },
    mounted() {
      this.loadKakaoMapScript();
    },
    methods: {
      // 카카오맵 스크립트를 로드하는 함수
      loadKakaoMapScript() {
        const kakaoScriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VUE_APP_KAKAO_MAP_JS_APP_KEY}&libraries=services&autoload=false`;
        this.loadScript(kakaoScriptUrl, this.initializeKakaoMaps);
      },
      // 외부 스크립트 로드 함수
      loadScript(src, callback) {
        const existingScript = document.querySelector(`script[src="${src}"]`);
        if (!existingScript) {
          const script = document.createElement('script');
          script.src = src;
          script.onload = callback.bind(this); // 스크립트가 로드된 후 콜백 실행
          script.onerror = (e) => {
            console.error('스크립트 로드 오류: ', e);
          };
          document.head.appendChild(script);
        } else {
          callback();
        }
      },
      // 카카오 맵 초기화 함수
      initializeKakaoMaps() {
        if (typeof kakao !== 'undefined') {
          kakao.maps.load(() => {
            this.geocoder = new kakao.maps.services.Geocoder(); // Geocoder 객체 초기화
            this.loadDaumPostcodeScript(); // 우편번호 스크립트 로드
          });
        } else {
          console.error('카카오 맵 스크립트가 로드되지 않았습니다.');
        }
      },
      // 다음 우편번호 스크립트 로드 함수
      loadDaumPostcodeScript() {
        const daumScriptUrl = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
        this.loadScript(daumScriptUrl, () => {
          console.log('다음 우편번호 스크립트 로드 완료.');
        });
      },
      // 주소 검색 팝업 열기
      openPostcode() {
        const element_wrap = document.createElement('div');
        element_wrap.style =
          'position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); border: 1px solid; width: 500px; height: 400px; background-color: white; z-index: 1000;';
        document.body.appendChild(element_wrap);
  
        new daum.Postcode({
          oncomplete: (data) => {
            this.form.address = data.roadAddress;
            this.form.dong = data.bname;
            if (this.geocoder) {
              this.geocoder.addressSearch(data.roadAddress, (results, status) => {
                if (status === kakao.maps.services.Status.OK) {
                  this.form.latitude = results[0].y;
                  this.form.longitude = results[0].x;
                } else {
                  console.error('주소 검색 실패: ', status);
                }
              });
            }
            document.body.removeChild(element_wrap);
          },
          width: '100%',
          height: '100%',
        }).embed(element_wrap);
      },
      // 폼 제출
      submitForm() {
        if (this.$refs.form.validate()) {
          axios
            .post('/api/hospital/register', this.form)
            .then((response) => {
              alert('가입이 완료되었습니다.');
              console.log(response)
            })
            .catch((error) => {
              console.error('가입 오류:', error);
              alert('가입 중 오류가 발생했습니다.');
            });
        } else {
          alert('입력된 정보를 확인하세요.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .hospital-container {
    max-width: 700px;
    margin: 0 auto;
  }
  </style>
  