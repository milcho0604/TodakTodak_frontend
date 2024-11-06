<template>
  <v-dialog v-model="internalModal" persistent max-width="700px">
    <v-card class="custom-card custom-card2">
      <!-- 하늘색 사각형을 감싸는 div로 추가 -->
      <div class="blue-box">
        <v-card-title class="custom-head">비대면 진료가 완료되었습니다!</v-card-title>
        <br>
        <v-card-text class="custom-card-text">
          <v-form ref="form" v-model="valid" style="margin-left: 10px;">
            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">환자명</strong>
                <div class="custom-field">{{ paymentData.buyerName }}</div>
                <div>아이조은성모병원</div>
              </v-col>
            </v-row>

            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">이메일</strong>
                <div class="custom-field">{{ paymentData.buyerEmail }}</div>
              </v-col>
            </v-row>

            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">전화번호</strong>
                <div class="custom-field">{{ paymentData.buyerTel }}</div>
              </v-col>
            </v-row>

            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">진료비</strong>
                <div class="custom-field">{{ paymentData.amount }} 원</div>
              </v-col>
            </v-row>
            <div class="btn-container"
              style="position: absolute; bottom: -50px; left: 50%; transform: translateX(-50%);">
              <v-btn class="modal-btn" @click="submitPayment">결제하러 가기</v-btn>
            </div>
          </v-form>
        </v-card-text>


        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";

export default {
  props: {
    showPaymentModal: {
      type: Boolean,
      default: false,
    },
    reservationId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      valid: false,
      internalModal: this.showPaymentModal,
      paymentData: {
        buyerName: "",
        buyerEmail: "",
        buyerTel: "",
        amount: 100,
      },
    };
  },
  watch: {
    showPaymentModal(val) {
      this.internalModal = val;
    },
    internalModal(val) {
      this.$emit("update:showPaymentModal", val);
    },
  },
  methods: {
    closeModal() {
      this.internalModal = false;
      window.location.href = '/member/mypage/reservation';
    },
    async fetchPaymentData() {
      try {
        const memberResponse = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/reservation-service/payment/get/member`
        );
        this.paymentData.buyerName = memberResponse.data.name;
        this.paymentData.buyerEmail = memberResponse.data.memberEmail;
        this.paymentData.buyerTel = memberResponse.data.phoneNumber;

        const feeResponse = await axios.get(
          `${process.env.VUE_APP_API_BASE_URL}/reservation-service/payment/get/reservation/${this.reservationId}`
        );
        if (feeResponse.status === 200 && feeResponse.data !== null) {
          this.paymentData.amount = feeResponse.data;
        } else {
          this.paymentData.amount = 0;
        }
      } catch (error) {
        console.error("Error fetching member or fee data:", error);
        this.paymentData.amount = 0;
        console.log("Response error:", error.response?.data);
      }
    },
    async loadIamportSdk() {
      return new Promise((resolve, reject) => {
        if (!window.IMP) {
          const script = document.createElement("script");
          script.src = "https://cdn.iamport.kr/v1/iamport.js";
          script.onload = () => {
            resolve(window.IMP);
          };
          script.onerror = (error) => {
            reject(error);
          };
          document.head.appendChild(script);
        } else {
          resolve(window.IMP);
        }
      });
    },
    async submitPayment() {
      try {
        const IMP = await this.loadIamportSdk();
        IMP.init("imp86026232");

        const paymentParams = {
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid: `order_${new Date().getTime()}`,
          name: "비대면 진료",
          amount: this.paymentData.amount,
          buyer_email: this.paymentData.buyerEmail,
          buyer_name: this.paymentData.buyerName,
          buyer_tel: this.paymentData.buyerTel,
        };

        IMP.request_pay(paymentParams, (rsp) => {
          if (rsp.success) {
            axios
              .post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/payment/single/${this.reservationId}`, {
                impUid: rsp.imp_uid,
              })
              .then((response) => {
                if (response.status === 200) {
                  alert("결제 성공!");
                  this.closeModal();
                }
              })
              .catch((error) => {
                console.error("결제 실패:", error.response?.data || error.message);
              });
          }
        });
      } catch (error) {
        console.error("아임포트 SDK 로드 실패: ", error);
        alert("결제 모듈 로드에 실패했습니다.");
      }
    },
  },
  created() {
    this.fetchPaymentData();
  },
};
</script>

<style scoped>
.custom-card.custom-card2 {
  position: relative;
  width: 700px;
  height: 600px;
  background: #FFFFFF;
  border-radius: 10px;
}

.blue-box {
  position: absolute;
  width: 500px;
  height: 400px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #E5EEFF;
  border-radius: 10px;
  padding: 30px;
  z-index: 1;
  /* blue-box 안에 내용이 포함되도록 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.v-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 700px;
}

.pa-5 {
  padding: 40px;
}

.modal-btn {
  background-color: #0058FF !important;
  color: white !important;
  font-weight: bold;
  border-radius: 20px;
}

.btn-container {
  display: flex;
  justify-content: center;
  /* 버튼을 중앙으로 정렬 */
  margin-top: 20px;
}

.custom-head {
  color: #606060;
  font-weight: bold;
  font-size: 30px;
  margin-top: -40px;
}

.custom-strong {
  width: 98px;
  height: 30.98px;
  left: 687px;
  top: 571px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: 700;
  font-size: 25px;
  line-height: 30px;
  color: #00499E;
}

.custom-field {
  width: 300px;
  height: 24px;
  left: 694px;
  top: 934px;
  margin-top: 10px;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;

  color: #000000;
}

.custom-card-text {
  width: 500px;
  margin-top: -15px;
}
</style>