<template>
  <v-container>
    <v-btn @click="openModal">결제 모달 열기</v-btn>

    <!-- SubPaymentComponent 컴포넌트를 호출 -->
    <SubPaymentComponent :showPaymentModal="showPaymentModal" @close="closeModal" />
  </v-container>
</template>

<script>
import SubPaymentComponent from '@/components/pay/SubPaymentComponent.vue'; // 결제 모달 컴포넌트

export default {
  data() {
    return {
      showPaymentModal: false, // 모달 초기 값
    };
  },
  components: {
    SubPaymentComponent, // 결제 모달 컴포넌트
  },
  methods: {
    openModal() {
      this.showPaymentModal = true; // 모달 열기
    },
    closeModal() {
      this.showPaymentModal = false; // 모달 닫기
    },
  },
};
</script>

<style scoped>
.v-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
