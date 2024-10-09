<template>
  <v-container class="main-content d-flex align-center justify-center">
    <v-row justify="center">
      <v-col cols="12" sm="9" md="8" lg="7">
        <!-- 프로필 섹션 -->
        <v-row class="profile-section" no-gutters>
          <v-col cols="3">
            <v-img
              :src="memberInfo && memberInfo.profileImgUrl ? memberInfo.profileImgUrl : require('@/assets/default_user_image.png')"
              alt="프로필 이미지"
              max-width="120px"
              max-height="120px"
              class="v-avatar with-shadow"
              @click="triggerFileUpload" 
            ></v-img>
            <input type="file" ref="fileInput" style="display:none" @change="handleFileUpload"/> <!-- 숨겨진 파일 input -->
          </v-col>
          <v-col cols="9">
            <div class="profile-name">{{ memberInfo ? memberInfo.name : '' }}</div>
            <div class="profile-penalty">나의 패널티 : {{ penaltyCount }}회</div>
          </v-col>
        </v-row>

        <!-- <hr class="unified-line"> -->
        <div class="line-container">
          <div class="custom-line"></div>
        </div>

        <br>

        <div class="profile-page-gap"></div>

        <!-- 마이페이지 카드 -->
        <v-card class="position-relative mypage-card">
          <v-card-title class="text-h5 text-center"></v-card-title>
          <v-card-text class="mypage-content">
            <v-row>
              <!-- 좌측 정보 타이틀 -->
              <v-col cols="4">
                <div class="info-title">이름</div>
                <div class="signup-underline"></div>
                <div class="info-title">이메일</div>
                <div class="signup-underline"></div>
                <div class="info-title">전화번호</div>
                <div class="signup-underline"></div>
                <div class="info-title">주소</div>
                <div class="signup-underline"></div>
              </v-col>
              <!-- 우측 정보 내용 -->
              <v-col cols="8">
                <div class="info-content">{{ memberInfo ? memberInfo.name : '' }}</div>
                <div class="signup-underline"></div>
                <div class="info-content">{{ memberInfo ? memberInfo.memberEmail : '' }}</div>
                <div class="signup-underline"></div>

                <!-- 수정 모드일 때는 전화번호를 입력 가능 -->
                <div v-if="isEditMode">
                  <v-text-field
                    v-model="memberEditInfo.phoneNumber"
                    label="전화번호"
                    class="custom-input-field"
                  ></v-text-field>
                </div>
                <div v-else>
                  <div class="info-content">{{ memberInfo ? memberInfo.phoneNumber : '' }}</div>
                </div>
                <div class="signup-underline"></div>

                <!-- 수정 모드일 때는 주소 입력 가능 -->
                <div v-if="isEditMode">
                  <v-text-field
                    v-model="fullAddress"
                    label="주소"
                    readonly
                    class="custom-input-field"
                    @click="openAddressSearch"
                  >
                    <template #append-inner>
                      <v-icon class="right-align-icon">mdi-magnify</v-icon>
                    </template>
                  </v-text-field>
                </div>
                <div v-else>
                  <div class="info-content">{{ fullAddress }}</div>
                </div>
                <div class="signup-underline"></div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-row justify="center" class="button-row">
            <v-btn class="edit-btn" v-if="isEditMode" @click="submitEdit">수정 완료</v-btn>
            <v-btn class="edit-btn" v-else @click="toggleEdit">수정</v-btn>
          </v-row>

          <!-- 회원탈퇴 및 로그아웃 -->
          <v-row justify="center" class="membership-options">
            <v-btn text class="membership-option" @click="openWithdrawModal">회원탈퇴</v-btn>
            <v-divider vertical class="vertical-divider"></v-divider>
            <v-btn text class="membership-option" @click="logout">로그아웃</v-btn>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- 탈퇴 모달 -->
    <v-dialog v-model="withdrawModal" max-width="500px">
      <v-card class="custom-modal-background">
        <v-card-title>회원 탈퇴</v-card-title>
        <v-card-text>
          <p>회원 탈퇴를 원하시면 아래에 "토닥 회원 탈퇴에 동의합니다"를 입력해 주십시오.</p>
          <v-text-field v-model="withdrawalConfirmation" label="입력"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="custom-modal-btn" @click="confirmWithdraw">확인</v-btn>
          <v-btn class="custom-modal-btn" @click="closeWithdrawModal">취소</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "MyPage",
  data() {
    return {
      isEditMode: false,
      memberInfo: {
        name: "",
        memberEmail: "",
        phoneNumber: "",
        address: {
          city: "",
          street: "",
          zipcode: "",
        },
        profileImageUrl: "",
      },
      memberEditInfo: {
        phoneNumber: "",
        address: {
          city: "",
          street: "",
          zipcode: "",
        },
      },
      fullAddress: "",
      penaltyCount: 0,
      withdrawModal: false,
      withdrawalConfirmation: "",
    };
  },
  created() {
    this.fetchMemberInfo();
    this.fetchPenaltyCount();
  },
  methods: {
    async fetchMemberInfo() {
      try {
        const response = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/member/edit-info`
        );
        if (response.status === 200 && response.data.result) {
          this.memberInfo = response.data.result;
          this.memberEditInfo.phoneNumber = this.memberInfo.phoneNumber;
          this.memberEditInfo.address = { ...this.memberInfo.address };
          this.updateFullAddress();
        } else {
          alert("회원 정보 조회에 실패했습니다.");
        }
      } catch (e) {
        alert(e.response?.data?.status_message || "회원 정보 조회 중 오류가 발생했습니다.");
      }
    },
    updateFullAddress() {
      const { city, street, zipcode } = this.memberEditInfo.address;
      this.fullAddress = `${city} ${street} (${zipcode})`;
    },
    async fetchPenaltyCount() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/reportCount`);
        if (response.status === 200 && response.data.result !== undefined) {
          this.penaltyCount = response.data.result;
        } else {
          alert("패널티 조회에 실패했습니다.");
        }
      } catch (error) {
        alert("패널티 조회 중 오류가 발생했습니다.");
      }
    },
    toggleEdit() {
      this.isEditMode = !this.isEditMode;
    },
    async submitEdit() {
      try {
        const formData = new FormData();
        formData.append("name", this.memberInfo.name);
        formData.append("phoneNumber", this.memberEditInfo.phoneNumber);
        formData.append("address", JSON.stringify(this.memberEditInfo.address));

        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/member-service/member/edit-info`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          alert("회원 정보가 성공적으로 수정되었습니다.");
          this.toggleEdit();
          this.fetchMemberInfo();
        }
      } catch (error) {
        alert("수정 처리 중 문제가 발생했습니다.");
      }
    },
    openAddressSearch() {
      new window.daum.Postcode({
        oncomplete: (data) => {
          const city = data.roadAddress.split(" ")[0] + " " + data.roadAddress.split(" ")[1];
          const street = data.roadAddress.split(" ").slice(2).join(" ");
          const zipcode = data.zonecode;

          this.memberEditInfo.address.city = city;
          this.memberEditInfo.address.street = street;
          this.memberEditInfo.address.zipcode = zipcode;

          this.updateFullAddress();
        },
      }).open();
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/");
    },
    openWithdrawModal() {
      this.withdrawModal = true;
    },
    closeWithdrawModal() {
      this.withdrawModal = false;
    },
    async confirmWithdraw() {
      if (this.withdrawalConfirmation === "토닥 회원 탈퇴에 동의합니다") {
        try {
          await axios.post(
            `${process.env.VUE_APP_API_BASE_URL}/member-service/member/delete-account`,
            { confirmation: this.withdrawalConfirmation },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          alert("회원 탈퇴가 완료되었습니다.");
          this.$router.push("/");
        } catch (error) {
          alert("탈퇴 처리 중 문제가 발생했습니다.");
        }
      } else {
        alert("정확한 문구를 입력해 주십시오.");
      }
    },

    // 프로필 이미지 변경 기능
    triggerFileUpload() {
      this.$refs.fileInput.click(); // 파일 선택 창을 열기
    },

    // 파일 업로드 후 처리
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('profileImage', file);

        try {
          const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/update/profileImage`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 200) {
            alert("프로필 이미지가 성공적으로 변경되었습니다.");
            this.fetchMemberInfo(); // 변경된 이미지 정보를 다시 불러옴
          }
        } catch (error) {
          alert("프로필 이미지 업데이트 중 오류가 발생했습니다.");
        }
      }
    },
  },
};
</script>

<style scoped>
.main-content {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
.profile-section {
  display: flex;
  margin-bottom: 20px;
}
.profile-img {
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer; /* 프로필 이미지에 클릭 가능 마우스 커서 적용 */
}
.profile-name {
  font-family: "Inter";
  font-weight: 700;
  font-size: 30px;
  color: #000;
  margin-left: 20px;
}
.profile-penalty {
  font-family: "Inter";
  font-weight: 400;
  font-size: 18px;
  color: #606060;
  margin-left: 20px;
  margin-top: 5px;
}
.profile-page-gap {
  height: 30px;
}
.mypage-card {
  width: 878px;
  background-color: #f3f3f3;
  border-radius: 10px;
  padding: 30px;
  position: relative;
  margin-left: -100px;
}

.unified-line {
  border: 0;
  height: 1px;
  background-color: #C5C5C5;
  width: 1000px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}
.info-title {
  font-family: "Inter";
  font-weight: 400;
  font-size: 20px;
  color: #818181;
  margin-bottom: 24px;
  padding-top: 20px;
}
.info-content {
  font-family: "Inter";
  font-weight: 400;
  font-size: 20px;
  color: #000000;
  margin-bottom: 24px;
  padding-top: 20px;
}
.signup-underline {
  width: 100%;
  height: 1px;
  background-color: #e3e3e3;
}

.line-container {
  position: relative;
  width: 100%;
}

.custom-line {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 1px;
  background-color: #C5C5C5;
  width: 1000px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.edit-btn {
  background-color: #C2D7FF !important;
  color: #00499e;
  border-radius: 20px;
  width: 113px;
  height: 44px;
  margin-bottom: 40px;
  margin-top: 10px;
  border-radius: 20px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.membership-options {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
.membership-option {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-size: 15px;
  color: #A7A7A7;
  background-color: #f3f3f3;
  box-shadow: none;
}
.vertical-divider {
  width: 1px;
  height: 30px;
  background-color: #a7a7a7;
  margin: 0 10px;
  
}
.custom-modal-background {
  background-color: #c2d7ff;
}
.custom-modal-btn {
  background-color: #c2d7ff;
  border-radius: 20px;
  color: #00499e;
  margin-right: 10px;
}
.profile-img.with-shadow {
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.v-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
