<template>
    <v-container class="pa-5">
      <v-card class="mx-auto" max-width="600">
        <v-card-title class="headline">정기 결제</v-card-title>
  
        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field v-model="paymentData.buyerName" label="구매자 이름" required></v-text-field>
            <v-text-field v-model="paymentData.buyerEmail" label="이메일" required></v-text-field>
            <v-text-field v-model="paymentData.buyerTel" label="전화번호" required></v-text-field>
            <v-text-field v-model="paymentData.amount" label="결제 금액" required type="number"></v-text-field>
  
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
          amount: 10000,
        },
      };
    },
    methods: {
      loadIamportSdk() {
        return new Promise((resolve, reject) => {
          if (!window.IMP) {
            const script = document.createElement("script");
            script.src = "https://cdn.iamport.kr/v1/iamport.js";
            script.onload = () => {
              resolve(window.IMP);
            };
            script.onerror = reject;
            document.head.appendChild(script);
          } else {
            resolve(window.IMP);
          }
        });
      },
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
      async subPayment() {
        try {
          const IMP = await this.loadIamportSdk();
          IMP.init("가맹점식별코드"); // 아임포트 가맹점 식별코드
  
          const paymentParams = {
            pg: "html5_inicis", // 결제 방식
            pay_method: "card",
            customer_uid: `customer_${this.paymentData.buyerEmail}`, // 정기결제용 customer_uid
            merchant_uid: `order_${new Date().getTime()}`,
            name: "정기 결제 테스트",
            amount: this.paymentData.amount,
            buyer_email: this.paymentData.buyerEmail,
            buyer_name: this.paymentData.buyerName,
            buyer_tel: this.paymentData.buyerTel,
          };
  
          IMP.request_pay(paymentParams, (rsp) => {
            if (rsp.success) {
              axios
                .post("http://localhost:8080/reservation-service/payment/sub", { impUid: rsp.imp_uid })
                .then(() => alert("정기 결제 요청 성공"))
                .catch((error) => console.error("서버 응답 오류:", error));
            } else {
              alert("결제 실패: " + rsp.error_msg);
            }
          });
        } catch (error) {
          alert("결제 오류 발생: " + error.message);
        }
      },
    },
  };
  </script>
  