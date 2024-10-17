<template>
    <v-container class="hospital-container">
      <v-row justify="center">
        <v-col cols="12" sm="9" md="8" lg="7">
          <div class="hospital-card-title inter-bold mt-10">병원 가입승인</div>
          <div class="line-container">
            <div class="hospital-line"></div>
          </div>
          <br>
          <br>
          <div class="profile-page-gap"></div>
  
          <!-- 병원 정보 카드 -->
          <v-card class="position-relative hospital-card">
            <v-card-text class="hospital-content">
              <v-card-title class="no-padding text-align-left">
                {{ hospitalDetail ? hospitalDetail.name : '' }}
              </v-card-title>
              <v-row>
                <!-- 좌측 정보 타이틀 -->
                <v-col cols="4">
                  <div class="hospital-info-title">주소</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-title">대표원장</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-title">이메일</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-title">사업자 등록번호</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-title">전화번호</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-title">승인 상태</div>
                </v-col>
                <!-- 우측 정보 내용 -->
                <v-col cols="8">
                  <div class="hospital-info-content">{{ hospitalDetail ? hospitalDetail.address : '' }}</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-content">{{ hospitalDetail ? hospitalDetail.representativeName : '' }}</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-content">{{ hospitalDetail ? hospitalDetail.adminEmail : '' }}</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-content">{{ hospitalDetail ? hospitalDetail.businessRegistrationInfo : '' }}</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-content">{{ hospitalDetail ? hospitalDetail.phoneNumber : '' }}</div>
                  <div class="hospital-underline"></div>
                  <div class="hospital-info-content">
                    <v-chip :color="hospitalDetail && hospitalDetail.isAccept ? 'green' : 'red'" dark small>
                      {{ hospitalDetail && hospitalDetail.isAccept ? '승인됨' : '미승인' }}
                    </v-chip>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
            <v-row justify="center" class="button-row">
              <v-btn class="edit-btn" @click="toggleEdit">회원가입승인</v-btn>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
  
      <!-- 승인 모달 -->
      <v-dialog v-model="showModal" persistent max-width="749px">
        <v-card class="approve-modal">
          <v-card-text>
            <div class="hospital-modal inter-bold mt-10">병원 가입을 승인하시겠습니까?</div>
          </v-card-text>
          <v-card-actions class="center-actions">
            <v-btn class="modal-cancel-btn" @click="closeModal">취소</v-btn>
            <v-divider vertical class="vertical-divider"></v-divider>
            <v-btn class="modal-submit-btn" @click="approveHospital">승인</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- 승인 완료 모달 -->
      <v-dialog v-model="successModal" persistent max-width="749px">
        <v-card class="approve-modal">
          <v-card-text>
            <div class="hospital-modal inter-bold mt-10">병원이 성공적으로 승인되었습니다.</div>
          </v-card-text>
          <v-card-actions class="center-actions">
            <v-btn class="modal-cancel-btn" @click="goHome">홈</v-btn>
            <v-divider vertical class="vertical-divider"></v-divider>
            <v-btn class="modal-submit-btn" @click="goToMemberList">리스트</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        hospitalDetail: null, // 병원 정보를 저장할 객체
        showModal: false, // 승인 모달
        successModal: false, // 승인 완료 모달
      };
    },
    created() {
      this.fetchHospitalDetail();
    },
    methods: {
      async fetchHospitalDetail() {
        try {
          const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/admin/hospital/detail/${this.$route.params.id}`);
          if (response.status === 200 && response.data.result) {
            this.hospitalDetail = response.data.result; // 서버에서 받아온 병원 세부 정보 저장
          } else {
            alert('병원 정보 조회에 실패했습니다.');
          }
        } catch (error) {
          alert('병원 정보 조회 중 오류가 발생했습니다.');
        }
      },
      toggleEdit() {
        this.showModal = true; // 모달을 열기
      },
      closeModal() {
        this.showModal = false; // 모달 닫기
      },
      approveHospital() {
        axios.put(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/accept/${this.hospitalDetail.id}`)
          .then(response => {
            if (response.status === 200) {
              this.showModal = false;
              this.successModal = true; // 승인 완료 모달 창 열기
            } else {
              alert("승인 처리에 실패했습니다.");
            }
          })
          .catch(error => {
            console.error(error);
            alert("승인 처리 중 오류가 발생했습니다.");
          });
      },
      closeSuccessModal() {
        this.successModal = false; // 승인 완료 모달 닫기
      },
      goHome() {
        this.$router.push("/"); // 홈으로 이동
      },
      goToMemberList() {
        this.$router.push("/admin/hospital/list"); // 멤버 리스트로 이동
      }
    }
  };
  </script>
  
  <style scoped>
  .line-container {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .hospital-line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 1px;
    background-color: #C5C5C5;
    width: 1000px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .hospital-card {
    width: 680px;
    background-color: #f3f3f3;
    border-radius: 10px;
    padding: 30px;
    position: relative;
    margin: 0 auto;
  }
  
  .hospital-info-title {
    font-family: 'Inter';
    font-weight: 400;
    font-size: 20px;
    color: #818181;
    margin-bottom: 2px;
    padding-top: 20px;
    text-align: left;
  }
  
  .hospital-info-content {
    font-family: 'Inter';
    font-weight: 400;
    font-size: 20px;
    color: #000000;
    margin-bottom: 2px;
    padding-top: 20px;
    text-align: left;
  }
  
  .hospital-underline {
    width: 100%;
    height: 1px;
    background-color: #e3e3e3;
  }
  
  .hospital-card-title {
    text-align: center;
    margin: auto;
    font-size: 25px;
    color: #00499E;
  }
  
  .edit-btn {
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
  
  .no-padding {
    padding: 0 !important;
    font-size: 30px;
  }
  
  .v-dialog .v-card-actions {
    justify-content: center !important; /* 기본 스타일 오버라이드 */
  }
  
  .approve-modal {
    position: absolute;
    width: 360px;
    height: 230px !important;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #FFFFFF;
    padding: 20px;
  }
  
  .hospital-modal {
    text-align: center;
    margin: auto;
    font-size: 18px;
    color: #00499E;
  }
  
  .center-actions {
    display: flex;
    justify-content: center; /* 버튼들을 가운데 정렬 */
    align-items: center; /* 세로 정렬 */
    height: 30px;
    margin-bottom: 30px;
  }
  
  .vertical-divider {
    height: 34px !important;
    margin: 0 10px;
    align-items: center;
  }
  
  .modal-cancel-btn {
    background-color: #CECECE !important;
    color: #717171;
    border-radius: 20px;
    width: 90px;
    height: 34px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-submit-btn {
    background-color: #C2D7FF !important;
    color: #00499e;
    border-radius: 20px;
    width: 90px;
    height: 34px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  </style>
  