<template>
  <v-container class="main-content">
    <!-- 회원가입 제목 및 강조 라인 -->
    <div class="signup-title-container">
      <div class="signup-title" >회원가입</div>
      <div class="signup-underline"></div>
    </div>
    <div class="logo-container">
      <img src="@/assets/logo.png" alt="TodakTodak Logo" class="logo-image" />
    </div>
    <div class="signup-title-container">
      <div class="signup-title">내 정보 추가하기</div>
    </div>
    <v-row justify="center">
      <v-col cols="12" sm="9" md="8" lg="7">
        <v-card class="position-relative custom-card">
          <v-card-title class="text-h5 text-center"></v-card-title>
          <v-card-text class="custom-card-text">
            <!-- 이름 입력 -->
            <v-text-field
              label="이름"
              v-model="memberEditInfo.name"
              required
              class="custom-input-field"
              persistent-hint="false"
              hide-details="auto"
              style="background-color: white;"
            ></v-text-field>

            <!-- 이메일 입력 (수정 불가) -->
            <v-text-field
              label="이메일"
              v-model="memberEditInfo.memberEmail"
              class="custom-input-field"
              disabled
              persistent-hint="false"
              hide-details="auto"
            ></v-text-field>

            <!-- 핸드폰 번호 입력 -->
            <v-text-field
              label="핸드폰 번호"
              v-model="memberEditInfo.phoneNumber"
              required
              class="custom-input-field"
              persistent-hint="false"
              hide-details="auto"
            ></v-text-field>

            <!-- 도로명 주소 검색 버튼 -->
            <v-text-field
            label="주소"
            v-model="memberEditInfo.address.city"
            required
            readonly
            class="custom-input-field custom-icon-field"
            persistent-hint="false"
            hide-details="auto"
          >
          <template #append-inner>
            <v-icon class="right-align-icon" @click="openAddressSearch">
              mdi-magnify
            </v-icon>
          </template>
            </v-text-field>

            <!-- 상세 주소 입력 -->
            <v-text-field
              label="상세주소"
              v-model="memberEditInfo.address.street"
              required
              class="custom-input-field"
              persistent-hint="false"
              hide-details="auto"
            ></v-text-field>

            <!-- 우편번호 입력 -->
            <v-text-field
              label="우편번호"
              v-model="memberEditInfo.address.zipcode"
              required
              class="custom-input-field"
              persistent-hint="false"
              hide-details="auto"
            ></v-text-field>

            <!-- 프로필 이미지 선택 -->
            <v-img
              v-if="memberEditInfo.profileImgUrl"
              :src="memberEditInfo.profileImgUrl"
              alt="프로필 이미지"
              max-height="200"
              max-width="200"
              class="mt-3"
            ></v-img>
            <v-file-input
              label="프로필 이미지 변경"
              v-model="memberEditReq.profileImage"
              accept="image/*"
              class="custom-input-field"
              persistent-hint="false"
              hide-details="auto"
            ></v-file-input>

            <!-- 비밀번호 및 확인 -->
            <v-divider class="my-4"></v-divider>
            <v-text-field
              label="비밀번호"
              v-model="memberEditReq.password"
              type="password"
              class="custom-input-field white-input"
              persistent-hint="false"
              hide-details="auto"
            ></v-text-field>
            <v-text-field
              label="비밀번호 확인"
              v-model="memberEditReq.confirmPassword"
              type="password"
              class="custom-input-field white-input"
              persistent-hint="false"
              hide-details="auto"
            ></v-text-field>

            <!-- 회원 가입 버튼 -->
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn class="custom-btn" @click.prevent="submitForm">
                  회원 가입 완료
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>


    <!-- 회원가입/에러 모달 -->
    <v-dialog v-model="completeModal" max-width="500px">
      <v-card class="custom-modal">
        <v-card-title class="text-h5 text-center">{{ isSuccess ? '회원가입 완료' : '회원 정보 수정 실패' }}</v-card-title>
        <v-card-text>
          <p class="text-center">{{ isSuccess ? '회원가입이 완료되었습니다! 자녀정보를 바로 등록하시겠습니까?' : '회원 정보 수정에 실패했습니다. 정보를 변경해주세요.' }}</p>
          <v-row justify="center" class="mt-4">
            <v-btn v-if="isSuccess" class="custom-modal-btn" @click="goToChildRegistration">
              자녀정보 등록하기
            </v-btn>
            <v-btn class="custom-modal-btn" @click="isSuccess ? skipToMain() : closeModal()">
              {{ isSuccess ? '건너뛰기' : '확인' }}
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MemberEditPage',
  data() {
    return {
      dialog: false,
      completeModal: false,
      isSuccess: false,  // 회원가입 성공 여부 상태
      memberEditInfo: {
        name: '',
        memberEmail: '',
        phoneNumber: '',
        address: {
          city: '',
          street: '',
          zipcode: ''
        },
        profileImgUrl: ''
      },
      memberEditReq: {
        password: '',
        confirmPassword: '',
        profileImage: null
      },
      originalMemberEditInfo: null
    };
  },
  created() {
    this.fetchMemberInfo();
  },
  methods: {
    async fetchMemberInfo() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/edit-info`);
        if (response.status === 200 && response.data.result) {
          this.memberEditInfo = response.data.result;
          this.originalMemberEditInfo = { ...response.data.result };
        } else {
          alert('회원 정보 조회에 실패했습니다.');
        }
      } catch (e) {
        alert(e.response?.data?.status_message || '회원 정보 조회 중 오류가 발생했습니다.');
      }
    },
    async submitForm() {
      if (this.memberEditReq.password !== this.memberEditReq.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('name', this.memberEditInfo.name || this.originalMemberEditInfo.name);

        // 핸드폰 번호가 없을 때 빈 문자열로 처리
        const phoneNumber = this.memberEditInfo.phoneNumber || '전화번호를 입력해주세요';
        formData.append('phoneNumber', phoneNumber);

        const address = {
          city: this.memberEditInfo.address.city || this.originalMemberEditInfo.address.city,
          street: this.memberEditInfo.address.street || this.originalMemberEditInfo.address.street,
          zipcode: this.memberEditInfo.address.zipcode || this.originalMemberEditInfo.address.zipcode
        };
        formData.append('address', JSON.stringify(address));

        if (this.memberEditReq.profileImage) {
          formData.append('profileImage', this.memberEditReq.profileImage);
        }

        if (this.memberEditReq.password) {
          formData.append('password', this.memberEditReq.password);
          formData.append('confirmPassword', this.memberEditReq.confirmPassword);
        }

        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/edit-info`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        this.isSuccess = response.status === 200;  // 성공 여부 상태 설정
      } catch (e) {
        this.isSuccess = false;
      } finally {
        this.completeModal = true;  // 모달 표시
      }
    },
    goToChildRegistration() {
      this.$router.push('/child-registration'); // 자녀 등록 페이지로 이동
    },
    skipToMain() {
      this.$router.push('/'); // 메인 페이지로 이동
    },
    closeModal() {
      this.completeModal = false; // 모달 닫기, 현재 페이지 유지
    },
    openAddressSearch() {
      this.dialog = true;
      new window.daum.Postcode({
        oncomplete: (data) => {
          const fullAddress = data.roadAddress;
          const addressParts = fullAddress.split(' ');

          // 시/도, 구/군, 도로명, 상세주소 분리
          const city = addressParts[0] + ' ' + addressParts[1];
          const street = addressParts.slice(2).join(' ');

          this.memberEditInfo.address.city = city;  // 시/도, 구/군
          this.memberEditInfo.address.street = street;  // 도로명 및 상세주소
          this.memberEditInfo.address.zipcode = data.zonecode;  // 우편번호
          this.dialog = false;
        }
      }).open({
        popupName: 'postcodePopup'  // 팝업 이름 지정
      });
    }
  }
};
</script>

<style scoped>
.v-container {
  max-width: 75%;
  margin: auto;
  padding: 20px;
}

.custom-card {
  width: 509px;
  background-color: #F3F3F3;
  border-radius: 10px;
  position: absolute;
  left: 58px;
  top: 61px;
}
.large-card {
  width: 800px; /* v-card 너비 조정 */
  height: auto; /* 필요한 만큼 높이가 조정되도록 설정 */
}
.custom-btn {
  font-weight: bold;
  background-color: #C2D7FF;
  color: #00499E;
  border-radius: 20px;
}

.custom-input-field {
  width: 100%;
  background-color: #FFFFFF;  /* 모든 입력 필드에 흰색 배경 적용 */
  border: 1px solid #E7E7E7;
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: none;
}

.custom-modal {
  position: absolute;
  width: 500px; /* 모달 크기 조정 */
  height: auto;
  background: #FFFFFF;
  border-radius: 20px;
}

.custom-modal-btn {
  background-color: #C2D7FF;
  color: #00499E;
  border-radius: 20px;
}
.signup-title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.signup-title {
  font-family: 'Inter';
  font-weight: 700;
  font-size: 25px;
  color: #00499E; /* 하늘색 */
  text-align: center; /* 가운데 정렬 */
}

.signup-underline {
  width: 100%; /* 선을 페이지 너비만큼 길게 */
  max-width: 1000px; /* 최대 길이 제한 */
  height: 1px;
  background-color: #E3E3E3; /* 마크다운의 ---과 같은 얇은 선 */
  margin-top: 10px; /* 글자와 선 사이 여백 */
}
/* 로고 이미지 중앙 배치 */
.logo-container {
  display: flex;
  justify-content: center; /* 이미지 중앙 정렬 */
  margin: 20px 0;
}

.logo-image {
  max-width: 150px; /* 로고 이미지 크기 */
  width: 100%;
  height: auto;
}
.right-align-icon {
  display: flex;
  justify-content: flex-end; /* 왼쪽 정렬 */
  align-items: center; /* 아이콘이 중앙에 수직 정렬되도록 설정 */
}

</style>
