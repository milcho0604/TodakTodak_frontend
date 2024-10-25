<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card class="custom-card">
      <!-- 하늘색 사각형을 감싸는 div -->
      <div class="blue-box">
        <v-card-title class="custom-head">토닥 서비스 정기 결제 진행</v-card-title>
        <v-card-text class="custom-card-text">
          <v-form ref="form" v-model="valid" style="margin-left: 10px;">
            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">병원명</strong>
                <div class="custom-field">{{ paymentData.hospitalName }}</div>
              </v-col>
            </v-row>

            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">사업자 번호</strong>
                <div class="custom-field">{{ paymentData.businessRegistrationInfo }}</div>
              </v-col>
            </v-row>

            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">대표원장님</strong>
                <div class="custom-field">{{ paymentData.buyerName }}</div>
              </v-col>
            </v-row>

            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">대표원장님 이메일</strong>
                <div class="custom-field">{{ paymentData.buyerEmail }}</div>
              </v-col>
            </v-row>

            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">대표원장님 번호</strong>
                <div class="custom-field">{{ paymentData.buyerTel }}</div>
              </v-col>
            </v-row>

            <v-row class="text-left">
              <v-col>
                <strong class="custom-strong">금액</strong>
                <div class="custom-field">{{ paymentData.amount }} 원</div>
              </v-col>
            </v-row>

            <div class="btn-container">
              <v-btn class="modal-btn" @click="subPayment">결제요청</v-btn>
            </div>
          </v-form>
        </v-card-text>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      dialog: false,
      valid: false,
      paymentData: {
        buyerName: "",
        buyerEmail: "",
        buyerTel: "",
        amount: 1000000,
        hospitalName: "",
        businessRegistrationInfo: "",
      },
    };
  },
  watch: {
    value(val) {
      this.dialog = val;
    },
    dialog(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    async fetchPaymentData() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/payment/get/hospital`);
        this.paymentData.buyerName = response.data.representativeName;
        this.paymentData.buyerEmail = response.data.memberEmail;
        this.paymentData.buyerTel = response.data.representativePhoneNumber;
        this.paymentData.hospitalName = response.data.hospitalName;
        this.paymentData.businessRegistrationInfo = response.data.businessRegistrationInfo;

        if (!response.data.fee || response.data.fee === 0) {
          this.paymentData.amount = 1000000;
        } else {
          this.paymentData.amount = response.data.fee;
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    },

    async loadIamportSdk() {
      return new Promise((resolve, reject) => {
        if (!window.IMP) {
          const script = document.createElement("script");
          script.src = "https://cdn.iamport.kr/v1/iamport.js";
          script.onload = () => resolve(window.IMP);
          script.onerror = (error) => reject(error);
          document.head.appendChild(script);
        } else {
          resolve(window.IMP);
        }
      });
    },

    async subPayment() {
      try {
        const IMP = await this.loadIamportSdk();
        IMP.init("imp86026232");

        const paymentParams = {
          pg: "kakaopay",
          pay_method: "card",
          merchant_uid: `order_${new Date().getTime()}`,
          name: "토닥 정기 구독_" + this.paymentData.hospitalName + "_" + this.paymentData.businessRegistrationInfo,
          amount: this.paymentData.amount,
          buyer_email: this.paymentData.buyerEmail,
          buyer_name: this.paymentData.buyerName,
          buyer_tel: this.paymentData.buyerTel,
          customer_uid: "customer_" + this.paymentData.buyerEmail,
        };

        IMP.request_pay(paymentParams, (rsp) => {
          if (rsp.success) {
            this.onPaymentSuccess(rsp.imp_uid);
          }
        });
      } catch (error) {
        console.error("아임포트 SDK 로드 실패: ", error);
        alert("결제 모듈 로드에 실패했습니다.");
      }
    },

    async onPaymentSuccess(impUid) {
      try {
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/payment/sub`, { impUid });
        console.log(response);

        const tokenResponse = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/success`, {
          memberId: localStorage.getItem("memberId"),
        });

        const newToken = tokenResponse.data;
        localStorage.setItem("token", newToken);
        const decodedToken = jwtDecode(newToken);
        const role = decodedToken.role;
        localStorage.setItem("role", role);

        alert("결제가 완료되었습니다.");
        window.location.href = "/";
      } catch (error) {
        console.error("결제 처리 중 오류:", error);
      }
    },
  },
  created() {
    this.fetchPaymentData();
  },
};
</script>

<style scoped>
.custom-card {
  max-width: 600px;
  background: #FFFFFF;
  border-radius: 10px;
}

.v-dialog {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}

.blue-box {
  background: #FFFFFF;
  border-radius: 10px;
  padding: 30px;
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
  margin-top: 20px;
}

.custom-head {
  color: #606060;
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 20px;
}

.custom-strong {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #00499E;
}

.custom-field {
  margin-top: 10px;
  font-family: 'Inter';
  font-weight: 400;
  font-size: 18px;
  color: #000000;
}

.custom-card-text {
  width: 100%;
  margin-top: 10px;
}
</style>
