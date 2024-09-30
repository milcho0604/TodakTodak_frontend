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

              <v-text-field
                label="주소"
                v-model="memberEditInfo.address.city"
                prepend-icon="mdi-home"
                required
              ></v-text-field>
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
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'MemberEditPage',
  data() {
    return {
      memberEditInfo: {  // 회원 정보 변수
        name: '',
        memberEmail: '',
        phoneNumber: '',
        address: {
          city: '',
          street: '',
          zipcode: ''
        },
        profileImgUrl: ''  // 기존 프로필 이미지 URL
      },
      memberEditReq: {  // 수정 요청 변수
        password: '',
        confirmPassword: '',
        profileImage: null // 이미지 파일
      },
      originalMemberEditInfo: null  // 원래 회원 정보 저장
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
          this.memberEditInfo = response.data.result;  // 회원 정보 할당
          this.originalMemberEditInfo = { ...response.data.result }; // 원래 정보를 저장
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

    // 주소를 JSON 문자열로 변환하여 추가
    const address = {
      city: this.memberEditInfo.address.city || this.originalMemberEditInfo.address.city,
      street: this.memberEditInfo.address.street || this.originalMemberEditInfo.address.street,
      zipcode: this.memberEditInfo.address.zipcode || this.originalMemberEditInfo.address.zipcode
    };
    formData.append('address', JSON.stringify(address));  // JSON 형식으로 address 추가

    // 프로필 이미지가 있으면 추가
    if (this.memberEditReq.profileImage) {
      formData.append('profileImage', this.memberEditReq.profileImage);  // 프로필 이미지 추가
    }

    // 비밀번호가 있으면 추가
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
