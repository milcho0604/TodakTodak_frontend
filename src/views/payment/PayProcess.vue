<template>
  <v-container class="pa-5">
    <v-card class="mx-auto" max-width="600">
      <v-card-title class="headline">결제 진행</v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="paymentData.buyerName"
            label="구매자 이름"
            required
          ></v-text-field>

          <v-text-field
            v-model="paymentData.buyerEmail"
            label="이메일"
            required
          ></v-text-field>

          <v-text-field
            v-model="paymentData.buyerTel"
            label="전화번호"
            required
          ></v-text-field>

          <v-text-field
            v-model="paymentData.amount"
            label="결제 금액"
            required
            type="number"
          ></v-text-field>

          <v-btn color="primary" @click="submitPayment">단건결제</v-btn>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      valid: false,
      paymentData: {
        buyerName: "",
        buyerEmail: "",
        buyerTel: "",
        amount: 100, // 결제 금액
      },
    };
  },
  methods: {
    async fetchPaymentData() {
      try {
        // 사용자 정보 가져오기
        const memberResponse = await axios.get("http://localhost:8080/reservation-service/payment/get/member");
        this.paymentData.buyerName = memberResponse.data.name;
        this.paymentData.buyerEmail = memberResponse.data.memberEmail;
        this.paymentData.buyerTel = memberResponse.data.phoneNumber;

        // 결제 금액 가져오기 (fee 값)
        const feeResponse = await axios.get("http://localhost:8080/reservation-service/payment/get/fee");
        if (feeResponse.status === 200 && feeResponse.data !== null) {
          this.paymentData.amount = feeResponse.data; // 서버에서 가져온 fee를 amount로 설정
        } else {
          this.paymentData.amount = 0; // 기본 금액 설정
        }
      } catch (error) {
        console.error("Error fetching member or fee data:", error);
        this.paymentData.amount = 0; // 오류가 발생하면 기본 금액 사용
        console.log("Response error:", error.response.data); // 응답 데이터 확인

      }
      
    },

    async loadIamportSdk() {
      return new Promise((resolve, reject) => {
        if (!window.IMP) {
          const script = document.createElement("script");
          script.src = "https://cdn.iamport.kr/v1/iamport.js";
          script.onload = () => {
            resolve(window.IMP);
            console.log("성공");
          };
          script.onerror = (error) => {
            console.error("아임포트 스크립트 로드 실패:", error);
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
        // 아임포트 SDK 로드
        const IMP = await this.loadIamportSdk();
        IMP.init("imp86026232"); // 아임포트 가맹점 식별코드

        const amount = this.paymentData.amount || 0; // 금액이 없으면 기본값

        // 결제 정보
        const paymentParams = {
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid: `order_${new Date().getTime()}`, // 고유 주문번호
          name: "결제 테스트",
          amount: amount, // 결제 금액
          buyer_email: this.paymentData.buyerEmail,
          buyer_name: this.paymentData.buyerName,
          buyer_tel: this.paymentData.buyerTel,
        };

        // 결제 요청
        IMP.request_pay(paymentParams, (rsp) => {
          if (rsp.success) {
            console.log(rsp.imp_uid);
            // 결제가 성공하면 서버로 결제 정보 전송
            axios
              .post("http://localhost:8080/reservation-service/payment/single", {
                impUid: rsp.imp_uid,
              })
              .then((response) => {
                if (response.status === 200) {
                  alert("결제 성공!");
                }
              })
              .catch((error) => {
                if (error.response) {
                  console.log("Response error:", error.response.status, error.response.data);
                } else if (error.request) {
                  console.log("Request error:", error.request);
                } else {
                  console.log("Error", error.message);
                }
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
    this.fetchPaymentData(); // 페이지 로딩 시 사용자 정보 및 금액 가져오기
  },
};
</script>

<style scoped>
.pa-5 {
  padding: 40px;
}
</style>
