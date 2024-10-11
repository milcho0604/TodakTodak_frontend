<template>
    <!-- 자녀 삭제 모달 -->
    <v-dialog v-model="childDeleteDialog" max-width="450px">
        <v-card class="modal">
            <v-row class="mt-3" justify="center">
                <div class="headline inter-bold">자녀정보 삭제</div>
            </v-row>
            <v-card-text class="mt-5">
                <div class="weak inter-light">
                    자녀 정보를 정말로 삭제하시겠습니까?<br>
                    자녀와 함께 모든 정보가 삭제됩니다.
                </div>
            </v-card-text>
            <v-card-actions style="display: flex; justify-content: center; align-items: center; gap: 5px;">
                <div class="round-grey inter-bold mr-3" @click="closeModal()">최소</div>

                <div style="border-left: 1px solid #ccc; height: 20px; "></div>

                <div class="round inter-bold ml-3" @click="deleteChild()">확인</div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import axios from 'axios';

export default {
    props: ['childId'],
    data() {
        return {

        }
    },
    methods: {
        closeModal() {
            this.$emit('update:childDeleteDialog', false);
        },
        async deleteChild() {
            try {
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/delete/${this.childId}`);
                this.closeModal(); // 삭제 후 모달을 닫습니다
                // 삭제 완료 후 추가적으로 필요한 작업(ex. 목록 갱신 등)을 처리할 수 있습니다.
            } catch (error) {
                console.error("Failed to delete child:", error);
                // 오류 처리 로직을 추가할 수 있습니다.
            }
        }
    }
}
</script>
<style scoped>
.modal {
    padding: 20px;
    border-radius: 40px;
}

.headline {
    text-align: center;
    color: #00499E;
    font-size: 25px;
    margin-top: 10px;
    margin: auto;
}

.weak {
    color: #5B5B5B;
    text-align: center;
    font-size: 15px;
}

.round {
    background-color: #C2D7FF;
    border-radius: 40px;
    padding: 4px 18px;
    font-size: 14px;
    display: inline-block;
    /* 글자 수에 맞춰 버튼 길이 조정 */
    text-align: center;
    color: #00499E;
}

.round-grey {
    background-color: #D9D9D9;
    border-radius: 40px;
    padding: 4px 18px;
    font-size: 14px;
    display: inline-block;
    /* 글자 수에 맞춰 버튼 길이 조정 */
    text-align: center;
    color: #7F7D7D;
}
</style>