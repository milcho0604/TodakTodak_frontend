<template>
  <v-container class="main-content">
    <div class="text-center">
      <img src="@/assets/todak-new-logo-removebg.png" alt="TodakTodak Logo" class="logo-image" />
    </div>

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="simple-card" variant="flat">
          <div class="signup-title text-center">회원 정보를 입력해주세요.</div>
          <v-card-text>
            <!-- 이름 필드 (빈 값 유지) -->
            <v-text-field
              label="이름을 입력해주세요."
              v-model="memberEditReq.name"
              required
              placeholder="이름을 입력해주세요."
              class="custom-input-field"
            />

            <!-- 이메일 필드 (자동으로 입력됨, 수정 불가) -->
            <v-text-field
              label="이메일"
              v-model="memberEditInfo.memberEmail"
              disabled
              class="custom-input-field"
            />

            <!-- 핸드폰 번호 필드 (빈 값 유지) -->
            <v-text-field
            label="핸드폰 번호를 입력해주세요."
            v-model="memberEditReq.phoneNumber"
            required
            placeholder="핸드폰 번호를 입력해주세요."
            class="custom-input-field"
            @input="filterPhoneNumber"
          />
          
            <!-- 주소 필드 (빈 값 유지) -->
            <v-text-field
              label="주소를 입력해주세요."
              v-model="fullAddress"
              readonly
              placeholder="주소를 입력해주세요."
              class="custom-input-field"
            >
              <template #append-inner>
                <v-icon @click="openAddressSearch">mdi-magnify</v-icon>
              </template>
            </v-text-field>

            <!-- 프로필 이미지 변경 필드 -->
            <v-file-input
              label="프로필 이미지 변경"
              v-model="memberEditReq.profileImage"
              accept="image/*"
              class="custom-input-field"
            ></v-file-input>

            <!-- 회원가입 완료 버튼 -->
            <div class="signup-btn-container">
              <v-btn class="custom-btn signup-complete-btn" @click.prevent="submitForm" variant="flat">
                회원가입 완료
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 완료 모달 -->
    <v-dialog v-model="completeModal" max-width="500px">
      <v-card class="custom-modal">
        <v-card-title class="text-h5 text-center">{{ isSuccess ? '회원가입 완료' : '회원 정보 수정 실패' }}</v-card-title>
        <v-card-text>
          <p class="text-center">{{ isSuccess ? '회원가입이 완료되었습니다! 자녀정보를 바로 등록하시겠습니까?' : '회원 정보 수정에 실패했습니다. 정보를 변경해주세요.' }}</p>
          <v-row justify="center" class="mt-4">
            <v-btn v-if="isSuccess" class="custom-modal-btn" @click="goToChildRegistration">
              자녀등록
            </v-btn>
            <v-divider vertical class="vertical-divider"></v-divider>

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
      completeModal: false,
      isSuccess: false,
      // 사용자의 입력 필드 (빈 값으로 초기화)
      memberEditReq: {
        name: '',
        memberEmail: '',
        phoneNumber: '',
        address: {
          city: '',
          street: '',
          zipcode: ''
        },
        profileImage: null,
        password: '',
        confirmPassword: ''
      },
      // 실제 서버에서 받아온 회원 정보를 저장 (자동으로 폼에 반영되지 않음)
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
      fullAddress: ''  // 주소 초기화
    };
  },
  created() {
    this.fetchMemberInfo();   // 회원 정보를 가져오지만 필드에는 반영되지 않음
    // 폼 필드 값들은 빈칸으로 유지
    this.memberEditReq.name = '';
    this.memberEditReq.phoneNumber = '';
    this.fullAddress = '';  // 주소도 초기화
  },
  methods: {
    // 서버에서 회원 정보를 가져옴
    async fetchMemberInfo() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/edit-info`);
        if (response.status === 200 && response.data.result) {
          this.memberEditInfo = response.data.result;  // 받아온 회원 정보를 저장
          this.updateFullAddress();  // 주소 갱신
        } else {
          alert('회원 정보 조회에 실패했습니다.');
        }
      } catch (e) {
        alert(e.response?.data?.status_message || '회원 정보 조회 중 오류가 발생했습니다.');
      }
    },
    filterPhoneNumber() {
    this.memberEditReq.phoneNumber = this.memberEditReq.phoneNumber.replace(/[^0-9]/g, '');
    },
    // 주소 필드를 업데이트
    updateFullAddress() {
      const { city, street, zipcode } = this.memberEditInfo.address;
      this.fullAddress = `${city} ${street} (${zipcode})`;
    },
    // 폼 제출 시 서버로 데이터를 전송
    async submitForm() {
      if (this.memberEditReq.password !== this.memberEditReq.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('name', this.memberEditReq.name);  // 사용자 입력값을 보냄
        formData.append('phoneNumber', this.memberEditReq.phoneNumber);
        formData.append('address', JSON.stringify(this.memberEditReq.address));

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

        this.isSuccess = response.status === 200;
      } catch (e) {
        this.isSuccess = false;
      } finally {
        this.completeModal = true;  // 모달 열기
      }
    },
    // 주소 검색 기능
    openAddressSearch() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          const fullAddress = data.roadAddress || data.jibunAddress; // 도로명 주소 또는 지번 주소 가져오기
          const city = fullAddress.split(' ')[0] + ' ' + fullAddress.split(' ')[1];
          const street = fullAddress.split(' ').slice(2).join(' ');
          const zipcode = data.zonecode;

          // 주소 데이터가 유효한지 확인 후 할당
          if (fullAddress) {
            this.fullAddress = fullAddress;
            this.memberEditReq.address.city = city;
            this.memberEditReq.address.street = street;
            this.memberEditReq.address.zipcode = zipcode;
          } else {
            this.fullAddress = ''; // 주소가 없을 때 빈 값 할당
          }
        },
        onerror: (error) => {
          alert('주소 검색 중 오류가 발생했습니다.');
          console.error(error);
        }
      }).open();
    },
    // 자녀 등록 페이지로 이동
    goToChildRegistration() {
      window.location.href = '/member/child';
    },
    // 메인 페이지로 이동
    skipToMain() {
      window.location.href = '/';
    },
    // 모달 닫기
    closeModal() {
      this.completeModal = false;
    }
  }
};
</script>

<style scoped>
.v-container {
  max-width: 850px;
  margin: auto;
  padding: 40px;
}

.signup-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.logo-image {
  max-width: 150px;
  margin-bottom: 20px;
}

.simple-card {
  border-radius: 8px;
  padding: 30px;
  background-color: #f9f9f9;
}

.custom-input-field {
  margin-bottom: 20px;
}

/* 버튼을 중앙에 배치 */
.signup-btn-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.signup-complete-btn {
  width: 240px;
  height: 43.89px;
  background: #C2D7FF;
  border-radius: 20px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #00499E;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-modal {
  position: absolute;
  width: 500px;
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
  color: #00499E;
  text-align: center;
}

.signup-underline {
  width: 100%;
  max-width: 1000px;
  height: 1px;
  background-color: #E3E3E3;
  margin-top: 10px;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.logo-image {
  max-width: 150px;
  width: 100%;
  height: auto;
}

.right-align-icon {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.vertical-divider {
  width: 1px;
  height: 30px;
  background-color: #a7a7a7;
  margin: 0 10px;
}
</style>
