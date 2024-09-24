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
          <br>
          <v-btn color="primary" @click="subPayment">정기결제</v-btn>
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
        amount: 100,
      },
    };
  },
  methods: {
    async fetchPaymentData() {
      try {
        // 서버에서 사용자 정보 가져오기
        const response = await axios.get("http://localhost:8080/reservation-service/payment/get/member");
        this.paymentData.buyerName = response.data.name;
        this.paymentData.buyerEmail = response.data.memberEmail;
        this.paymentData.buyerTel = response.data.phoneNumber;
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    },
    async loadIamportSdk() {
  return new Promise((resolve, reject) => {
    if (!window.IMP) {
      const script = document.createElement("script");
      script.src = "https://cdn.iamport.kr/v1/iamport.js";
      script.onload = () => {
        resolve(window.IMP);
        console.log("성공")
      };
      script.onerror = (error) => {
        console.error("아임포트 스크립트 로드 실패:", error); // 에러 출력
        reject(error); // 에러를 reject로 전달
      };
      document.head.appendChild(script);
    } else {
      resolve(window.IMP);
    }
  });
},
    async submitPayment() {
      try {
        // 아임포트 SDK를 동적으로 로드
        const IMP = await this.loadIamportSdk();
        IMP.init("imp86026232"); // 아임포트 가맹점 식별코드

        // 결제 정보
        const paymentParams = {
          pg: "html5_inicis", // 결제 방식
          PaymentMethod: "SINGLE", // 결제 수단
          merchant_uid: `order_${new Date().getTime()}`, // 고유 주문번호
          name: "결제 테스트",
          amount: this.paymentData.amount, // 결제 금액
          buyer_email: this.paymentData.buyerEmail,
          buyer_name: this.paymentData.buyerName,
          buyer_tel: this.paymentData.buyerTel,
        };

        // 결제 요청
        IMP.request_pay(paymentParams, (rsp) => {
          if (rsp.success) {
            console.log(rsp.imp_uid)
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
      // 서버 응답이 있으면 상태와 메시지 출력
      console.log("Response error:", error.response.status, error.response.data);
    } else if (error.request) {
      // 요청이 성공적으로 전송되지 않은 경우
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
    async subPayment() {
      try {
        // 아임포트 SDK를 동적으로 로드
        const IMP = await this.loadIamportSdk();
        IMP.init("imp86026232"); // 아임포트 가맹점 식별코드

        // 결제 정보
        const paymentParams = {
          pg: "html5_inicis", // 결제 방식
          pay_method: "card", // 결제 수단
          merchant_uid: `order_${new Date().getTime()}`, // 고유 주문번호
          name: "결제 테스트",
          amount: this.paymentData.amount, // 결제 금액
          buyer_email: this.paymentData.buyerEmail,
          buyer_name: this.paymentData.buyerName,
          buyer_tel: this.paymentData.buyerTel,
          // customer_uid: "customer_tjqkdsla1217@naver.com"
          // customer_uid: `customer_${this.paymentData.buyerEmail}`
          customer_uid: "customer_" + this.paymentData.buyerEmail,
          popup: true, // 팝업 창 사용
        };

        // 결제 요청
        IMP.request_pay(paymentParams, (rsp) => {
          if (rsp.success) {
            console.log(rsp.imp_uid)
            // 결제가 성공하면 서버로 결제 정보 전송
            axios
              .post("http://localhost:8080/reservation-service/payment/sub", {
                impUid: rsp.imp_uid,
              })
              .then((response) => {
                if (response.status === 200) {
                  alert("결제 성공!");
                }
              })
              .catch((error) => {
    if (error.response) {
      // 서버 응답이 있으면 상태와 메시지 출력
      console.log("Response error:", error.response.status, error.response.data);
    } else if (error.request) {
      // 요청이 성공적으로 전송되지 않은 경우
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
    }
  },
  created() {
    this.fetchPaymentData(); // 페이지 로딩 시 사용자 정보 가져오기
  },
};
</script>

<style scoped>
.pa-5 {
  padding: 40px;
}
</style>
