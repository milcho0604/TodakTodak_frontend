<template>
    <v-dialog v-model="dialog" max-width="450px">
        <v-card class="modal">
            <v-row class="mt-3">
                <div class="headline inter-bold">자녀정보 추가하기</div>
                <div class="hover-btn mr-3" text @click="closeModal">
                    <v-icon class="close-icon">mdi-window-close</v-icon>
                </div>
            </v-row>
            <v-card-text class="mt-5">
                <v-row>
                    <v-col cols="4">
                        <v-img :src="previewImage || defaultImage" alt="Profile Image" max-width="100px"
                            max-height="100px"></v-img>
                    </v-col>
                    <v-col cols="8">
                        <v-row class="inter-light field-label">
                            프로필 사진
                        </v-row>
                        <v-row class="input-space">
                            <label class="file-label">
                                <v-icon class="file-icon">mdi-paperclip</v-icon>
                                <input type="file" @change="onImageChange" accept="image/*" class="hidden-input">
                                <span class="file-name">{{ shortenedFileName }}</span>
                            </label>
                        </v-row>
                        <v-row class="inter-light field-label mt-4">
                            자녀 이름
                        </v-row>
                        <v-row class="input-space">
                            <input v-model="childName" class="search-input ml-2">
                        </v-row>
                        <v-row class="inter-light field-label mt-4">
                            주민번호
                        </v-row>
                        <v-row class="input-space ssn-container" :class="{ 'error-border': !isValidSSN }">
                            <!-- 앞 6자리 입력 -->
                            <input v-model="childSSN1" class="search-input ssn-input" maxlength="6" 
                                 @input="moveToNextField" ref="ssn1">
                            <span class="dash">-</span>
                            <!-- 뒤 7자리 입력 -->
                            <input v-model="childSSN2" class="search-input ssn-input" maxlength="7" 
                                 @input="validateSSN" ref="ssn2">
                        </v-row>
                        <!-- 유효하지 않을 때 에러 메시지 출력 -->
                        <v-row v-if="!isValidSSN" class="error-message inter-light">
                            유효하지 않은 주민등록번호입니다.
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <div class="round inter-bold" @click="addChild">추가</div>
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
            childName: '',
            childSSN1: '', // 주민번호 앞 6자리
            childSSN2: '', // 주민번호 뒤 7자리
            isValidSSN: true,  // 유효성 상태를 저장하는 변수
            fileName: '',  // 파일명 저장
            alertModal: false,
        };
    },
    computed: {
        shortenedFileName() {
            if (this.fileName.length > 14) {
                return this.fileName.substring(0, 14) + '...';
            }
            return this.fileName || '파일 선택';
        }
    },
    methods: {
        moveToNextField() {
            // 앞 6자리 입력이 완료되면 뒤 7자리 입력 칸으로 포커스 이동
            if (this.childSSN1.length === 6) {
                this.$refs.ssn2.focus();
            }
        },
        validateSSN() {
            const fullSSN = this.childSSN1 + this.childSSN2;
            if (fullSSN.length === 13) {
                this.isValidSSN = this.checkSSN(fullSSN); // 유효성 검사 로직 호출
            } else {
                this.isValidSSN = true; // 13자리가 아니면 유효성 검사를 진행하지 않음
            }
        },
        checkSSN(ssn) {
            if (ssn.length !== 13) {
                return false;
            }

            const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
            const firstTwelveDigits = ssn.substring(0, 12);
            let sum = 0;

            for (let i = 0; i < 12; i++) {
                sum += parseInt(firstTwelveDigits[i], 10) * multipliers[i];
            }

            const remainder = sum % 11;
            let checkDigit = 11 - remainder;

            if (checkDigit >= 10) {
                checkDigit -= 10;
            }

            return checkDigit === parseInt(ssn[12], 10);
        },
        onImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.previewImage = URL.createObjectURL(file);
                this.fileName = file.name;
                this.selectedFile = file;
            }
        },
        async addChild() {
            if (!this.childName || !this.childSSN1 || !this.childSSN2 ) {
                alert('모든 필드를 입력해주세요.');
                return;
            }

            const formData = new FormData();
            const fullSSN = this.childSSN1 + '-' + this.childSSN2;

            formData.append('name', this.childName);
            formData.append('ssn', fullSSN);
            formData.append('image', this.selectedFile);

            try {
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 201) {
                    alert('자녀 등록 성공');
                } else {
                    alert(response.data.message);
                }
                this.closeModal();
            } catch (error) {
                console.error('자녀 등록 중 오류 발생:', error.response.data.result.parents);
                
                if (error.response && error.response.status === 400) {  // 이미 등록된 자녀 상태
                    this.dialog = false;  // 자녀 추가 모달 닫기
                    this.$emit('child-exists', error.response.data.result.parents);  // 부모 컴포넌트에 이벤트와 메시지 전파
                } else {
                    alert('자녀 등록에 실패했습니다.');
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

.input-space {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    width: 100%;
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
}

.ssn-container {
    display: flex;
    align-items: center;
}

.ssn-input {
    width: 40%;
    text-align: center;
}

.dash {
    margin: 0 10px;
}

.search-input:focus {
    outline: none;
}

.close-icon {
    color: #676767;
}

.error-border {
    border-color: #E10000;
}

.error-message {
    color: #E10000;
    font-size: 12px;
    margin-top: 5px;
    margin-left: 2px;
}
</style>