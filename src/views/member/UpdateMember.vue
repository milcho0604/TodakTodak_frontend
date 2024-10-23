<template>
  <v-container class="main-content">
    <div class="text-center">
      <img src="@/assets/todak-new-logo-removebg.png" alt="TodakTodak Logo" class="logo-image" />
    </div>

    <!-- <div class="signup-title text-center">회원가입</div> -->

    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-card class="simple-card">
          <div class="signup-title text-center">회원가입</div>
          <v-card-text>
            <v-text-field
              label="이름"
              v-model="memberEditInfo.name"
              required
              class="custom-input-field"
            ></v-text-field>

            <v-text-field
              label="이메일"
              v-model="memberEditInfo.memberEmail"
              disabled
              class="custom-input-field"
            ></v-text-field>

            <v-text-field
              label="핸드폰 번호"
              v-model="memberEditInfo.phoneNumber"
              required
              class="custom-input-field"
            ></v-text-field>

            <v-text-field
              label="주소"
              v-model="fullAddress"
              readonly
              class="custom-input-field"
            >
              <template #append-inner>
                <v-icon @click="openAddressSearch">mdi-magnify</v-icon>
              </template>
            </v-text-field>

            <v-file-input
              label="프로필 이미지 변경"
              v-model="memberEditReq.profileImage"
              accept="image/*"
              class="custom-input-field"
            ></v-file-input>

            <!-- 회원가입 완료 버튼을 프로필 이미지 아래 중앙에 배치 -->
            <div class="signup-btn-container">
              <v-btn class="custom-btn signup-complete-btn" @click.prevent="submitForm" variant="flat">
                회원가입 완료
              </v-btn>
            </div>
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
      fullAddress: ''
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
          this.updateFullAddress();
        } else {
          alert('회원 정보 조회에 실패했습니다.');
        }
      } catch (e) {
        alert(e.response?.data?.status_message || '회원 정보 조회 중 오류가 발생했습니다.');
      }
    },
    updateFullAddress() {
      const { city, street, zipcode } = this.memberEditInfo.address;
      this.fullAddress = `${city} ${street} (${zipcode})`;
    },
    async submitForm() {
      if (this.memberEditReq.password !== this.memberEditReq.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('name', this.memberEditInfo.name);
        formData.append('phoneNumber', this.memberEditInfo.phoneNumber);
        formData.append('address', JSON.stringify(this.memberEditInfo.address));

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
        this.completeModal = true;
      }
    },
    openAddressSearch() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          const city = data.roadAddress.split(' ')[0] + ' ' + data.roadAddress.split(' ')[1];
          const street = data.roadAddress.split(' ').slice(2).join(' ');
          const zipcode = data.zonecode;

          this.memberEditInfo.address.city = city;
          this.memberEditInfo.address.street = street;
          this.memberEditInfo.address.zipcode = zipcode;

          this.updateFullAddress();
        }
      }).open();
    },
    goToChildRegistration() {
      this.$router.push('/child-registration');
    },
    skipToMain() {
      this.$router.push('/');
    },
    closeModal() {
      this.completeModal = false;
    }
  }
};
</script>

<style scoped>
.v-container {
  max-width: 850px; /* 가로를 더 넓힘 */
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