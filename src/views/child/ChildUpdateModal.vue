<template>
    <v-dialog v-model="dialog" max-width="450px">
        <v-card class="modal">
            <v-row class="mt-3">
                <div class="headline inter-bold">자녀정보 수정하기</div>
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
                                <!-- 실제 파일 input은 숨김 -->
                                <input type="file" @change="onImageChange" accept="image/*" class="hidden-input">
                                <span class="file-name">{{ shortenedFileName }}</span>
                            </label>
                        </v-row>
                        <v-row class="inter-light field-label mt-4">
                            자녀 이름
                        </v-row>
                        <v-row class="input-space">
                            <input v-model="childName" class="search-input">
                        </v-row>
                        <v-row class="inter-light field-label mt-4">
                            주민번호
                        </v-row>
                        <v-row class="input-space">
                            <input v-model="childSSN" class="search-input" disabled>
                        </v-row>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <div class="round inter-bold" @click="updateChild">저장</div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';
export default {
    props: ['initialName','initialSSN','initialImage','childId'],
    data() {
        return {
            previewImage: this.initialImage,  // 기존 이미지로 미리보기 설정
            defaultImage: 'https://via.placeholder.com/100',  // 기본 이미지
            selectedFile: null,  // 선택된 파일 저장
            childName: this.initialName,  // 자녀 이름
            childSSN: this.initialSSN,  // 주민번호
            fileName: ''  // 파일명 저장
        };
    },
    computed: {
        shortenedFileName() {
            // 파일명이 있으면 최대 7자만 표시하고 뒤에 "..." 추가
            if (this.fileName.length > 14) {
                return this.fileName.substring(0, 14) + '...';
            }
            return this.fileName || '파일 선택';  // 파일명이 없으면 기본 텍스트 표시
        }
    },
    watch: {
        // Prop이 변경될 때 data 속성도 업데이트
        initialName(newValue) {
            this.childName = newValue;
        },
        initialSSN(newValue) {
            this.childSSN = newValue;
        },
        initialImage(newValue) {
            this.previewImage = newValue;
        }
    },
    methods: {

        // 이미지가 변경될 때 실행되는 메서드
        onImageChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.previewImage = URL.createObjectURL(file);
                this.fileName = file.name;  // 파일명 저장
                this.selectedFile = file;  // 선택한 파일 저장
            }
        },
        async updateChild() {
            console.log(this.childId);
            console.log(this.childName);
            console.log(this.selectedFile);
            if (!this.childName || !this.childSSN) {
                alert('모든 필드를 입력해주세요.');
                return;
            }

            const formData = new FormData();
            formData.append('childId', this.childId);  // 자녀 이름 추가
            formData.append('name', this.childName);  // 자녀 이름 추가
            if (this.selectedFile) {
                formData.append('image', this.selectedFile);  // 선택된 이미지 파일이 있으면 추가
            }

            try {
                // axios를 사용하여 서버에 PUT 요청
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/update`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                if (response.status === 200) {
                    alert('자녀 정보 수정 성공');
                } else {
                    alert(response.data.message);  // 서버에서 전달한 메시지 출력
                }
                this.closeModal();
            } catch (error) {
                console.error('자녀 정보 수정 중 오류 발생:', error);
                alert('자녀 정보 수정에 실패했습니다.');
            }

            // 다이얼로그 닫기
            this.dialog = false;
            this.$emit('close');
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

.search-input {
    width: 90%;
}

.search-input:focus {
    outline: none;
}
.close-icon {
    color: #676767;
}
</style>