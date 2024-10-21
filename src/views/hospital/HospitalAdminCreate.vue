<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="6">
        <router-link to="/" class="logo">
            <img src="@/assets/logo.png" alt="TodakTodak Logo" class="logo-image" />
        </router-link>

              
          <h3 class="text-left mb-5 bold-text">가입 정보를 입력 후
            <br>
            가입 승인 요청을 해주세요.
          </h3>
          
  
          <v-form ref="form" v-model="formValid">
            
            <h5 class="text-left">기본 정보</h5>
            <!-- 관리자 이름 -->
            <h6 class="text-left">대표자(원장님)</h6>
            <v-text-field v-model="form.adminName" 
            variant="underlined"
            label="대표자(원장님) 이름을 입력해주세요." :rules="[rules.required]"></v-text-field>
            <!-- 관리자 전화번호 -->
            <h6 class="text-left">전화번호</h6>
            <v-text-field v-model="form.adminPhoneNumber"
            variant="underlined"
            label="대표자(원장님) 전화번호를 입력해주세요." :rules="[rules.required]"></v-text-field>

            <!-- 관리자 이메일 -->
            <h6 class="text-left">이메일</h6>
            <v-text-field v-model="form.adminEmail"
            variant="underlined"
            label="대표자(원장님) 이메일을 입력해주세요." :rules="[rules.required, rules.email]"></v-text-field>
    
            <!-- 관리자 비밀번호 -->
            <h6 class="text-left">비밀번호</h6>
            <v-text-field v-model="form.adminPassword"
            variant="underlined"
            label="비밀번호를 입력해주세요." :type="'password'" :rules="[rules.required]"></v-text-field>

            <h5 class="text-left">병원 정보</h5>

            <!-- 병원명 -->
            <h6 class="text-left">병원 이름(ex.연세소아과)</h6>
            <v-text-field v-model="form.hospitalName" 
            variant="underlined"
            label="병원명을 입력해주세요." :rules="[rules.required]"></v-text-field>
  
            <h6 class="text-left">주소</h6>
            <v-text-field
            v-model="combinedAddress"
            variant="underlined"
            label="주소를 검색하여 입력해주세요."
            readonly
            :rules="[rules.required]"
            >
            <template #append>
              <v-btn @click="openPostcode" small>주소 검색</v-btn>
            </template>
            </v-text-field>
            <!-- <v-text-field v-model="form.latitude" variant="underlined" label="위도" readonly></v-text-field>
            <v-text-field v-model="form.longitude" variant="underlined" label="경도" readonly></v-text-field> -->
  
            <!-- 병원 전화번호 -->
            <h6 class="text-left">병원 번호</h6>
            <v-text-field v-model="form.hospitalPhoneNumber" 
            variant="underlined"
            label="병원 전화번호를 입력해주세요." :rules="[rules.required]"></v-text-field>
  
            <!-- 사업자 등록번호 -->
            <h6 class="text-left">사업자 번호</h6>
            <v-text-field v-model="form.businessRegistrationInfo" 
            variant="underlined"
            label="사업자 등록번호를 입력해주세요." :rules="[rules.required]"></v-text-field>
            
            <v-row justify="center" class="button-row">
                <v-btn class="res-btn" @click="submitForm">가입 요청</v-btn>
            </v-row>

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
    computed: {
        combinedAddress() {
        // 주소와 동을 합쳐서 표시
        return `${this.form.address} ${this.form.dong}`;
        },
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
            }
        }).open(); // 기본 팝업 창을 사용
    },


      // 폼 제출
      submitForm() {
        if (this.$refs.form.validate()) {
          axios
            .post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/hospital-admin/register`, this.form)
            .then((response) => {
              alert('가입이 완료되었습니다.');
              console.log(response)
              this.$router.push('/');
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
  .logo {
    font-weight: bold;
    color: inherit;
    text-decoration: none;
  }
  
  .logo-image {
    width: 250px; /* 원하는 고정 너비 */
    max-width: 150%; /* 부모 요소 너비를 넘지 않도록 설정 */
    height: auto; /* 높이는 비율에 맞춰 자동 조절 */
    object-fit: contain; /* 이미지가 고정된 크기 안에서 비율을 유지 */
    margin-bottom: 20px;
  }
  .bold-text {
    font-weight: bold;
  }
  .res-btn {
    background-color: #C2D7FF !important;
    color: #00499e;
    border-radius: 20px;
    width: 130px;
    height: 44px;
    margin-bottom: 40px;
    margin-top: 10px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  