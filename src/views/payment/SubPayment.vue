<template>
  <v-container class="pa-5">
    <v-card class="mx-auto" max-width="600">
      <v-card-title class="headline">토닥 서비스 결제 진행</v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field
            v-model="paymentData.hospitalName"
            label="병원명"
            required
          ></v-text-field>

          <v-text-field
            v-model="paymentData.businessRegistrationInfo"
            label="사업자 번호"
            required
          ></v-text-field>

          <v-text-field
            v-model="paymentData.buyerName"
            label="대표원장님"
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
import { jwtDecode } from "jwt-decode";


export default {
  data() {
    return {
      valid: false,
      paymentData: {
        buyerName: "",
        buyerEmail: "",
        buyerTel: "",
        amount: 1000000, // 기본 값 백만원 설정
        hospitalName: "",
        businessRegistrationInfo: "",
      },
    };
  },
  methods: {
    // 사용자 정보 가져오기
    async fetchPaymentData() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}reservation-service/payment/get/hospital`);
        this.paymentData.buyerName = response.data.representativeName;
        this.paymentData.buyerEmail = response.data.memberEmail;
        this.paymentData.buyerTel = response.data.representativePhoneNumber;
        this.paymentData.hospitalName = response.data.hospitalName;
        this.paymentData.businessRegistrationInfo = response.data.businessRegistrationInfo;

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

    // 아임포트 SDK 로드 및 결제 처리
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

    // 정기결제 처리 로직
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
          popup: true,
        };

        IMP.request_pay(paymentParams, (rsp) => {
          if (rsp.success) {
            // 결제 성공 처리
            this.onPaymentSuccess(rsp.imp_uid);
          }
        });
      } catch (error) {
        console.error("아임포트 SDK 로드 실패: ", error);
        alert("결제 모듈 로드에 실패했습니다.");
      }
    },

    // 결제 성공 후 처리
    async onPaymentSuccess(impUid) {
      try {
        // 결제 정보 서버에 전달
        const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/payment/sub`, {
          impUid,
        });

        console.log(response)

        // 결제 성공 후 역할 변경 및 토큰 갱신 API 호출
        const tokenResponse = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/success`, {
          memberId: localStorage.getItem("memberId"),
        });
        console.log(tokenResponse);

        // 새로운 토큰을 로컬 스토리지에 저장
        const newToken = tokenResponse.data;
        localStorage.setItem('token', newToken);
        console.log(newToken);
        const decodedToken = jwtDecode(newToken);
        const role = decodedToken.role;
        localStorage.setItem('role', role);


        // 성공 메시지 출력 및 메인 페이지로 이동
        alert("결제 성공 및 토큰 갱신 성공!");
        window.location.href = "/"; // 메인 페이지로 리다이렉트

      } catch (error) {
        console.error("결제 처리 중 오류:", error);
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
