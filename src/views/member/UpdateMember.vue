<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="7">
        <v-card>
          <v-card-title class="text-h5 text-center">회원 정보 수정</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="updateMemberInfo">
              <v-text-field
                label="이름"
                v-model="memberEditInfo.name"
                prepend-icon="mdi-account-box"
                required
              ></v-text-field>
              <v-text-field
                label="이메일"
                v-model="memberEditInfo.memberEmail"
                prepend-icon="mdi-email"
                disabled
              ></v-text-field>
              <v-text-field
                label="핸드폰 번호"
                v-model="memberEditInfo.phoneNumber"
                prepend-icon="mdi-phone"
                required
              ></v-text-field>

              <!-- 도로명 주소 검색 버튼 -->
              <v-text-field
                label="주소"
                v-model="memberEditInfo.address.city"
                prepend-icon="mdi-home"
                required
                readonly
              >
                <template #append>
                  <v-btn @click="openAddressSearch">주소 검색</v-btn>
                </template>
              </v-text-field>

              <v-text-field
                label="상세주소"
                v-model="memberEditInfo.address.street"
                prepend-icon="mdi-home-outline"
                required
              ></v-text-field>
              <v-text-field
                label="우편번호"
                v-model="memberEditInfo.address.zipcode"
                prepend-icon="mdi-map-marker"
                required
              ></v-text-field>

              <!-- 프로필 이미지 -->
              <v-img
                v-if="memberEditInfo.profileImgUrl"
                :src="memberEditInfo.profileImgUrl"
                alt="프로필 이미지"
                max-height="200"
                max-width="200"
              ></v-img>
              <v-file-input
                label="프로필 이미지 변경"
                v-model="memberEditReq.profileImage"
                prepend-icon="mdi-camera"
                accept="image/*"
              ></v-file-input>

              <v-divider class="my-4"></v-divider>
              <v-text-field
                label="새 비밀번호"
                v-model="memberEditReq.password"
                type="password"
                prepend-icon="mdi-lock"
              ></v-text-field>
              <v-text-field
                label="비밀번호 확인"
                v-model="memberEditReq.confirmPassword"
                type="password"
                prepend-icon="mdi-lock-check"
              ></v-text-field>
              <v-btn block type="submit" color="primary">회원 정보 수정</v-btn>
            </v-form>
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
      dialog: false,  // 다이얼로그 상태
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
          const fullAddress = data.roadAddress;  // 전체 주소
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
        popupName: 'postcodePopup'  // 팝업 이름 지정 (optional)
      });
    }
  }
};
</script>

<style scoped>
.v-container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.v-card {
  border-radius: 10px;
}

.v-text-field {
  margin-bottom: 20px;
}

.v-btn {
  font-weight: bold;
}
</style>
