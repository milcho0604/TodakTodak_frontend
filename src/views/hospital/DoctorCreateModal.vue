<template>
    <v-dialog v-model="dialog" max-width="500px">
        <v-card class="child-modal">
            <v-row class="mt-3" justify="center">
                <div class="headline inter-bold">의사 등록</div>
                <div class="hover-btn mr-3" text @click="closeModal">
                    <v-icon class="close-icon">mdi-window-close</v-icon>
                </div>
            </v-row>            
            <v-row>
                <v-col cols="12" class="text-center">
                    <v-row class="inter-light field-label mt-2 ml-6">
                        의사 이름
                    </v-row>
                    <v-row class="input-space mb-2">
                        <input v-model="doctorName" class="email-input">
                    </v-row>
                    <v-row class="inter-light field-label ml-6">
                        이메일
                    </v-row>
                    <v-row class="input-space mb-2 email-container">
                        <input v-model="emailPrefix" class="email-input" @input="moveToNextField">
                        <span class="dash">@</span>
                        <select v-model="emailDomain">
                            <option v-for="domain in emailDomains" :key="domain" :value="domain">
                              {{ domain }}
                            </option>
                        </select>
                    </v-row>
                </v-col>
            </v-row>
            <v-card-actions justify="center">
                <div class="round inter-bold" @click="addDoctor">추가</div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            dialog: false,  // 모달 열림 여부
            previewImage: null,  // 업로드한 이미지 미리보기
            defaultImage: 'https://via.placeholder.com/100',  // 기본 이미지
            selectedFile: null,  // 선택된 파일 저장
            doctorName: '',
            emailPrefix: '', // 이메일 앞부분
            alertModal: false,
            emailDomains: [
                'gmail.com',
                'naver.com',
                'daum.net',
                'hanmail.net',
                'icoud.com',
                'outlook.com',
                'outlook.kr',
                'hotmail.com',
                'yahoo.com',
                'nate.com',
                'kakao.com'
            ],
        };
    },
    computed: {
        completeEmail() {
            return `${this.emailPrefix}@${this.emailDomain}`;
        },
    },
    methods: {
        async addDoctor() {
            if (!this.doctorName || !this.emailPrefix || !this.emailDomain ) {
                alert('모든 필드를 입력해주세요.');
                return;
            }


            const doctorData = {
                name: this.doctorName,
                memberEmail: `${this.emailPrefix}@${this.emailDomain}` // 이메일 완성
            };
            const token = localStorage.getItem('token');

            try {
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctor-admin/register`, doctorData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });

                console.log("전달하는 데이터 형식", doctorData);

                if (response.status === 200) {
                    alert('의사 등록 성공');
                } else {
                    alert(response.data.message);
                }
                this.closeModal();
            } catch (error) {
                console.error('의사 등록 중 오류 발생:', error.response.data.result);
                
                if (error.response && error.response.status === 400) {  // 이미 등록된 의사 상태
                    this.dialog = false;  // 의사 추가 모달 닫기
                    this.$emit('child-exists', error.response.data.result.parents); 
                } else {
                    alert('의사 등록에 실패했습니다.');
                }
            }

            this.dialog = false;
        },
        closeModal() {
            this.$emit('update:dialog', false);
        }
    }
};
</script>

<style scoped>
.child-modal {
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

.inter-light{
    margin-left: 20px;
    font-weight: bold;
}

.input-space {
    margin: 0 auto;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    width: 90%;
}

.file-label {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.file-icon {
    font-size: 20px;
    color: #333;
}

.hidden-input {
    display: none;
}

.file-name {
    margin-left: 10px;
    font-size: 14px;
    color: #333;
}

.round {
    background-color: #C2D7FF;
    border-radius: 40px;
    padding: 3px 15px;
    font-size: 14px;
    width: 80px;
    cursor: pointer;
    text-align: center;
    color: #00499E;
    margin: auto;
}

.field-label {
    font-size: 15px;
    margin: 0 auto;
    margin-bottom: 8px; /* 라벨과 입력 필드 사이의 간격 */
}

.email-container {
    display: flex;
    align-items: center;
}

.dash {
    margin: 0 10px;
}

.email-input:focus {
    outline: none;
}

.email-input{
    width: 45%;
}

.close-icon {
    color: #676767;
}


select {
    width: 45%;
    border: none; /* 기본 테두리 제거 */
    outline: none; /* 포커스 시 테두리 제거 */
    /* 추가 스타일 */
    background: none; /* 배경을 투명하게 설정 */
    /* 필요한 경우 padding, font-size 등 조정 가능 */
  }
  
  select:focus {
    outline: none; /* 포커스 상태에서 테두리 제거 */
  }
</style>