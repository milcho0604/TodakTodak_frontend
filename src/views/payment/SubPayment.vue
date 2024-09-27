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
          amount: 1000000, // 기본 값 백만원 설정
        },
      };
    },
    methods: {
      // 진료 없이도 기본 값으로 member 정보 가져오기
      async fetchPaymentData() {
        try {
          const response = await axios.get("http://localhost:8080/reservation-service/payment/get/member");
          this.paymentData.buyerName = response.data.name;
          this.paymentData.buyerEmail = response.data.memberEmail;
          this.paymentData.buyerTel = response.data.phoneNumber;
  
          // 금액이 없거나 0이면 기본 금액(백만원) 설정
          if (!response.data.fee || response.data.fee === 0) {
            this.paymentData.amount = 1000000; // 백만원으로 기본 설정
          } else {
            this.paymentData.amount = response.data.fee; // 서버에서 가져온 금액 설정
          }
  
        } catch (error) {
          console.error("Error fetching member data:", error);
        }
      },
  
      // 아임포트 SDK 로드 및 결제 처리 로직
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
              console.error("아임포트 스크립트 로드 실패:", error); // 에러 출력
              reject(error); // 에러를 reject로 전달
            };
            document.head.appendChild(script);
          } else {
            resolve(window.IMP);
          }
        });
      },
  
      // 정기결제 처리 로직
      async subPayment() {
        try {
          const IMP = await this.loadIamportSdk();
          IMP.init("imp86026232");
  
          const paymentParams = {
            pg: "kakaopay",
            pay_method: "card",
            merchant_uid: `order_${new Date().getTime()}`,
            name: "결제 테스트",
            amount: this.paymentData.amount,
            buyer_email: this.paymentData.buyerEmail,
            buyer_name: this.paymentData.buyerName,
            buyer_tel: this.paymentData.buyerTel,
            customer_uid: "customer_" + this.paymentData.buyerEmail,
            popup: true,
          };
  
          IMP.request_pay(paymentParams, (rsp) => {
            if (rsp.success) {
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
      this.fetchPaymentData(); // 페이지 로딩 시 사용자 정보 가져오기
    },
  };
  </script>
  
  <style scoped>
  .pa-5 {
    padding: 40px;
  }
  </style>
  