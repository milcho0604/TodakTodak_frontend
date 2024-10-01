<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="7">
        <v-card class="position-relative custom-card">
          <v-card-title class="text-h5 text-center">회원 가입</v-card-title>
          <v-card-text>
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
              class="custom-input-field"
              persistent-hint="false"
              hide-details="auto"
            >
              <template #append>
                <v-btn @click="openAddressSearch" icon>
                  <v-icon>mdi-magnify</v-icon>
                </v-btn>
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
              label="새 비밀번호"
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

            <!-- 회원 가입 버튼에 @submit.prevent="updateMemberInfo" 적용 -->
            <v-btn class="custom-btn" @click.prevent="updateMemberInfo">
              회원 가입 완료
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 주소 검색 다이얼로그 -->
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>주소 검색</v-card-title>
        <v-card-text>
          <div id="postcode"></div>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">닫기</v-btn>
        </v-card-actions>
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
    async updateMemberInfo() {
      if (this.memberEditReq.password && this.memberEditReq.password !== this.memberEditReq.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      try {
        const formData = new FormData();
        formData.append('name', this.memberEditInfo.name || this.originalMemberEditInfo.name);
        formData.append('phoneNumber', this.memberEditInfo.phoneNumber || this.originalMemberEditInfo.phoneNumber);

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

        if (response.status === 200) {
          alert('회원 정보가 성공적으로 수정되었습니다.');
        } else {
          alert('회원 정보 수정에 실패했습니다.');
        }
      } catch (e) {
        alert(e.response?.data?.status_message || '회원 정보 수정 중 오류가 발생했습니다.');
      }
    },
    openAddressSearch() {
      this.dialog = true;
      new window.daum.Postcode({
        oncomplete: (data) => {
          const fullAddress = data.roadAddress;
          const addressParts = fullAddress.split(' ');

          const city = addressParts[0] + ' ' + addressParts[1];
          const street = addressParts.slice(2).join(' ');

          this.memberEditInfo.address.city = city;
          this.memberEditInfo.address.street = street;
          this.memberEditInfo.address.zipcode = data.zonecode;
          this.dialog = false;
        }
      }).open({
        popupName: 'postcodePopup'
      });
    }
  }
};
</script>

<style scoped>

.v-container {
  max-width: auto;
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
.v-field__input {
  background-color: #FFFFFF !important;  /* 배경을 흰색으로 설정 */
  color: black !important;              /* 텍스트 색상을 검은색으로 설정 */
  border: 1px solid #E7E7E7;            /* 테두리도 명시적으로 설정 */
  border-radius: 5px;                   /* 둥근 테두리 */
}
.v-field__input {
  background-color: #FFFFFF !important;  /* 배경을 흰색으로 설정 */
  color: black !important;              /* 텍스트 색상을 검은색으로 설정 */
}

/* v-input__control 클래스에 흰색 배경을 적용 */
.v-input__control {
  background-color: #FFFFFF !important;  /* 컨트롤 부분 배경을 흰색으로 설정 */
}

/* v-field__field 클래스에 흰색 배경을 적용 */
.v-field__field {
  background-color: #FFFFFF !important;  /* 필드 부분 배경을 흰색으로 설정 */
}

/* v-input 전체 배경을 흰색으로 설정 */
.v-input {
  background-color: #FFFFFF !important;  /* 입력 필드 전체 영역 배경을 흰색으로 설정 */
}

.v-field__overlay {
  background-color: #FFFFFF !important;  /* 오버레이 배경도 흰색으로 설정 */
}

</style>
