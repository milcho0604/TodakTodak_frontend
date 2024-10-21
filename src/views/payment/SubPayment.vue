<template>
  <div>
    <v-btn @click="showDialog = true">결제 모달 열기</v-btn>
    <PaymentModal v-model="showDialog" />
  </div>
</template>

<script>
import PaymentModal from "@/components/pay/SubPaymentComponent.vue"; // 위에서 만든 모달 컴포넌트

export default {
  data() {
    return {
      showDialog: false, // 모달 창 열림 여부
    };
  },
  components: {
    PaymentModal,
  },
};
</script>
