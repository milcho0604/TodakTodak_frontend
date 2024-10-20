<template>
    <v-dialog v-model="internalModal" persistent max-width="1500px">
      <v-card class="custom-card custom-card2">
        <div class="blue-box">
          <v-card-title class="custom-head">토닥 서비스 결제 진행</v-card-title>
          <br />
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
                  <strong class="custom-strong">결제 금액</strong>
                  <div class="custom-field">{{ paymentData.amount }} 원</div>
                </v-col>
              </v-row>
  
              <div class="btn-container">
                <v-btn class="modal-btn" @click="subPayment">정기결제</v-btn>
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
    },
    data() {
      return {
        valid: false,
        internalModal: this.showPaymentModal,
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
      showPaymentModal(val) {
        this.internalModal = val;
      },
      internalModal(val) {
        this.$emit("update:showPaymentModal", val);
      },
    },
    methods: {
      async fetchPaymentData() {
        try {
          const response = await axios.get(
            "http://localhost:8080/reservation-service/payment/get/hospital"
          );
          this.paymentData.buyerName = response.data.representativeName;
          this.paymentData.buyerEmail = response.data.memberEmail;
          this.paymentData.buyerTel = response.data.representativePhoneNumber;
          this.paymentData.hospitalName = response.data.hospitalName;
          this.paymentData.businessRegistrationInfo = response.data.businessRegistrationInfo;
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
            name: `토닥 정기 구독_${this.paymentData.hospitalName}_${this.paymentData.businessRegistrationInfo}`,
            amount: this.paymentData.amount,
            buyer_email: this.paymentData.buyerEmail,
            buyer_name: this.paymentData.buyerName,
            buyer_tel: this.paymentData.buyerTel,
            customer_uid: `customer_${this.paymentData.buyerEmail}`,
          };
  
          IMP.request_pay(paymentParams, (rsp) => {
            if (rsp.success) {
              axios
                .post("http://localhost:8080/reservation-service/payment/sub", {
                  impUid: rsp.imp_uid,
                })
                .then(() => {
                  alert("결제 성공!");
                  this.closeModal();
                })
                .catch((error) => console.error("결제 실패:", error));
            }
          });
        } catch (error) {
          console.error("아임포트 SDK 로드 실패: ", error);
          alert("결제 모듈 로드에 실패했습니다.");
        }
      },
      closeModal() {
        this.internalModal = false;
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
    max-width: none;
    height: 600px;
    background: #ffffff;
    border-radius: 10px;
  }
  
  .blue-box {
    position: absolute;
    width: 500px;
    height: 400px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #e5eeff;
    border-radius: 10px;
    padding: 30px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  
  .custom-head {
    color: #606060;
    font-weight: bold;
    font-size: 30px;
    margin-top: -40px;
  }
  
  .custom-strong {
    font-size: 25px;
    color: #00499e;
  }
  
  .custom-field {
    font-size: 20px;
    margin-top: 10px;
    color: #000000;
  }
  
  .custom-card-text {
    width: 500px;
    margin-top: -15px;
  }
  
  .modal-btn {
    background-color: #0058ff !important;
    color: white !important;
    font-weight: bold;
    border-radius: 20px;
  }
  
  .btn-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  </style>
  