<template>
    <v-dialog v-model="doctorDeleteModal" max-width="500px">
        <v-card class="doctor-modal">
            <v-row class="mt-3" justify="center">
                <div class="headline inter-bold">의사정보 삭제</div>
            </v-row>
            <v-card-text class="mt-3">
                <div class="weak inter-light">
                    의사 정보를 정말로 삭제하시겠습니까?<br>
                    의사계정과 함께 모든 정보가 삭제됩니다.<br>
                    의사계정 삭제 후 동일한 이메일로 재등록 할 수 없습니다.<br><br>
                    의사계정 삭제를 원하시면 아래에 <br>
                    "의사 삭제 후 동일 이메일로 등록할 수 없음을 동의합니다"<br>
                    를 입력해 주십시오.
                </div>
                <p></p>
                <v-text-field v-model="withdrawalConfirmation" label="입력"></v-text-field>
            </v-card-text>
            <v-card-actions style="display: flex; justify-content: center; align-items: center; gap: 5px;">
                <div class="round-grey inter-bold mr-3" @click="closeModal">최소</div>

                <div style="border-left: 1px solid #ccc; height: 20px; "></div>

                <div class="round inter-bold ml-3" @click="confirmWithdraw">확인</div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
import axios from 'axios';

export default {
    props: {
        dialog: {
            type: Boolean,
            required: true
        },
        doctorId: {
            type: Number,
            required: true
        },
        doctorEmail: {
            type: String,
            required: true // 이메일을 props로 받음
        }
    },
    data() {
        return {
            withdrawalConfirmation: "",
        }
    },
    methods: {
        async confirmWithdraw() {
            if (this.withdrawalConfirmation === "의사 삭제 후 동일 이메일로 등록할 수 없음을 동의합니다") {
                try {
                    const formData = new FormData();
                    formData.append('doctorEmail', this.doctorEmail);
                    formData.append('confirmation', this.withdrawalConfirmation);
                    console.log('heeerr');
                    console.log(this.doctorEmail);
                    await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/member-service/member/delete-doctor`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                            },
                        }
                    );

                    alert("의사 삭제가 완료되었습니다.");
                    this.closeModal();
                } catch (error) {
                    alert("삭제 처리 중 문제가 발생했습니다.");
                }
            } else {
                alert("정확한 문구를 입력해 주십시오.");
            }
        },
        closeModal() {
            this.doctorDeleteModal = false;
            this.$emit('update:dialog', false);
        },
    }
}
</script>
<style scoped>
.doctor-modal {
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
    cursor: pointer;
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
    cursor: pointer;
}
</style>