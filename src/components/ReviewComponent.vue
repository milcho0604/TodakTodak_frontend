<template>
    <!-- 리뷰 모달 -->
    <v-dialog v-model="dialog" width="500">
        <v-card class="review-edit-modal">

            <v-card-text>
                <div class="inter-bold title">비대면 진료가 완료되었습니다!</div>

                <!-- 평점 입력 -->
                <div class="rating-label inter-bold">진료 만족도를 남겨주세요!</div>
                <v-rating v-model="rating" length="5" color="#0094FF" background-color="#E7EEF0"
                    class="modal-rating" justify="center"></v-rating>

                <!-- 텍스트 박스 -->
                <v-textarea v-model="contents" label="진료 경험에 대해서 상세하게 알려주세요." outlined :counter="500" rows="5"
                    class="modal-textarea"></v-textarea>
                <v-row>
                    <div class="submit-btn inter-bold edit-modal-actions" @click="createReview">리뷰 작성 완료</div>
                </v-row>
                <v-row>
                    <div class="small-font inter-normal mt-2" @click="moveToPay"> 리뷰 다음에 남기고 결제하기 </div>
                </v-row>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>
<script>
import axios from "axios";

export default {
    props: ['reservationId'],
    data() {
        return {
            dialog: true,  // 모달 열림 여부
            contents: null,
            rating: 0,
        };
    },
    methods: {
        async createReview() {
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/create`, {
                rating: this.rating,
                contents: this.contents,
                reservationId: this.reservationId
            });
            this.moveToPay();
        },
        closeModal() {
            this.$emit('update:dialog', false);
        },
        moveToPay() {
            this.closeModal();
            this.$emit('openPayModal', true);
        }
    }
}
</script>
<style scoped>
.title {
    text-align: center;
    font-size: 25px;
    margin-top: 10px;
}

.review-edit-modal {
    width: 500px;
    background-color: #FFFFFF;
    border-radius: 20px;
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
}

.rating-label {
    text-align: center;
    font-size: 18px;
    color: #777777;
    margin-top: 15px;
}

.modal-rating {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.modal-textarea {
    width: 422px;
    height: 160px;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    margin: 20px auto;
}

.edit-modal-actions {
    margin: 0 auto;
}

.submit-btn {
    background-color: #C2D7FF;
    color: #00499E;
    border-radius: 40px;
    width: 118px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 5px;
}

.small-font {
    font-size: 12px;
    color: #808080;
    text-align: center;
    margin: auto;
}
</style>