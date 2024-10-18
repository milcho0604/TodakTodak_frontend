<template>
    <v-container class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <v-row justify="center" align="center" class="inter-bold title">
            <v-col class="d-flex align-center justify-center">
                <img src="@/assets/doctor.png" width="50px" />
                <span style="margin-left: 10px;">의사 정보 수정</span>
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" md="8"> 
                <v-card style="max-width: 700px; margin: auto; padding:20px"> 
                    <v-row>
                        <v-col>
                            <h4>
                                <v-avatar size="50">
                                    <v-img :src="doctorDetails?.doctorImageUrl || imagePreview || '@/assets/doctor.png'" />
                                </v-avatar>
                                &nbsp;{{ doctorDetails?.doctorName }}
                                <span 
                                    @click="selectPhoto" 
                                    :class="['d-flex', 'align-center', 'action-link', 'mr-2', { 'selected': isPhotoSelected }]" 
                                    style="margin-top: 10px; font-size: 14px; color: gray; cursor: pointer;">
                                    사진선택
                                </span>
                                <input type="file" 
                                    @change="onFileChange" 
                                    accept="image/png, image/jpeg, image/jpg" 
                                    ref="fileInput" 
                                    style="display: none;" />                                
                            </h4>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>이메일&nbsp;&nbsp;&nbsp;&nbsp; {{ doctorDetails?.doctorEmail }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="1">약력</v-col>
                        <v-col cols="10">
                            <v-textarea
                                v-model="doctorDetails.bio"
                                label="의사 약력을 입력해주세요"
                                placeholder="의사 약력을 입력해주세요"
                                @keydown.enter.prevent="handleEnter"
                                hide-details
                                variant="outlined"
                            ></v-textarea>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>근무시간</v-col>
                    </v-row>
                    <v-row v-for="hour in koreanDays" :key="hour.id" class="my-2">
                        <v-col class="operatingHour">
                            {{ hour.dayOfWeekKorean }} &nbsp;
                            <v-chip :color="hour.untact ? 'blue' : 'orange'" dark small class="custom-chip" @click="toggleUntact(hour)">
                                {{ hour.untact ? '비대면진료' : '대면진료' }}
                            </v-chip> &nbsp;
                    
                            <v-icon>mdi-clock-outline</v-icon>
                            <select v-model="selectedOpenTime[hour.id]" class="time-select">
                                <option v-for="h in hours" :key="h" :value="h">{{ h < 10 ? '0' + h : h }}&nbsp;&nbsp;&nbsp;:</option>
                            </select>
                            <select v-model="selectedOpenMinute[hour.id]" class="time-select">
                                <option v-for="m in minutes" :key="m" :value="m">{{ m < 10 ? '0' + m : m }}</option>
                            </select>
                    
                            - 
                    
                            <select v-model="selectedCloseTime[hour.id]" class="time-select">
                                <option v-for="h in hours" :key="h" :value="h">{{ h < 10 ? '0' + h : h }}&nbsp;&nbsp;&nbsp;:</option>
                            </select>
                            <select v-model="selectedCloseMinute[hour.id]" class="time-select">
                                <option v-for="m in minutes" :key="m" :value="m">{{ m < 10 ? '0' + m : m }}</option>
                            </select>
                        </v-col>
                    </v-row>                    
                    <v-row align="center" justify="center">
                        <v-btn @click="save" class="saveBtn">저장</v-btn>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { mapState } from 'vuex';
import axios from 'axios';

export default {
    data() {
        return {
            imagePreview: null,
            isPhotoSelected: false,
            fileError: false,
            selectedFile: null,
            hours: Array.from({ length: 24 }, (_, i) => i),
            minutes: Array.from({ length: 60 }, (_, i) => i),
            selectedOpenTime: {},
            selectedOpenMinute: {},
            selectedCloseTime: {},
            selectedCloseMinute: {},
        };
    },
    computed: {
    ...mapState(['doctorEmail', 'doctorDetails']),
    koreanDays() {
        const days = {
            Monday: '월요일',
            Tuesday: '화요일',
            Wednesday: '수요일',
            Thursday: '목요일',
            Friday: '금요일',
            Saturday: '토요일',
            Sunday: '일요일',
        };
        return this.doctorDetails?.operatingHours.map(hour => ({
            ...hour,
            dayOfWeekKorean: days[hour.dayOfWeek] || hour.dayOfWeek,  // 사용자에게 보여줄 한글 요일
            dayOfWeek: hour.dayOfWeek // 데이터 요청 보낼 영어 요일
        })) || [];
    },
},
    watch: {
        doctorEmail(newEmail) {
            if (newEmail) {
                this.fetchDoctorDetail();
            }
        },
        doctorDetails(newDetails) {
            console.log("doctorDetails가 업데이트되었습니다:", newDetails);
        },
    },
    methods: {
        async fetchDoctorDetail() {
            if (!this.doctorDetails) {
                await this.$store.dispatch('fetchDoctorDetails', this.doctorEmail);
            }
        },
        selectPhoto() {
            this.isPhotoSelected = true;
            this.$refs.fileInput.click();
        },
        onFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                const validExtensions = ['image/png', 'image/jpeg', 'image/jpg'];
                if (!validExtensions.includes(file.type)) {
                    this.fileError = true;
                    this.selectedFile = null;
                    this.imagePreview = null;
                } else {
                    this.fileError = false;
                    this.selectedFile = file;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.imagePreview = e.target.result;
                        this.doctorDetails.doctorImageUrl = this.imagePreview;
                    };
                    reader.readAsDataURL(file);
                }
            } else {
                this.fileError = false;
                this.imagePreview = null;
            }
        },
        handleEnter(event) {
            const textarea = event.target;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;
            textarea.value = value.substring(0, start) + '\n' + value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 1;
            this.doctorDetails.bio = textarea.value;
        },
        toggleUntact(hour) {
            const index = this.doctorDetails.operatingHours.findIndex(item => item.id === hour.id);
            if (index !== -1) {
            // operatingHours의 값을 직접 수정
            this.doctorDetails.operatingHours[index].untact = !this.doctorDetails.operatingHours[index].untact;
    }
        },
        async save() {
            const formData = new FormData();
            if (this.selectedFile) {
                formData.append('profileImage', this.selectedFile);
            }

            try {
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/edit-doctor`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                console.log("프로필 업데이트 성공");
            } catch (error) {
                console.error("프로필 업데이트 실패:", error);
            }

            // 영업시간 업데이트
            for (const hour of this.koreanDays) {
                const operatingHourData = {
                    dayOfWeek: hour.dayOfWeek,
                    openTime: `${this.selectedOpenTime[hour.id]}:${this.selectedOpenMinute[hour.id]}:00`,
                    closeTime: `${this.selectedCloseTime[hour.id]}:${this.selectedCloseMinute[hour.id]}:00`,
                    untact: hour.untact.toString()
                };

                try {
                    await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/doctor-operating-hours/update/${hour.id}`, operatingHourData);
                    console.log(`영업시간 업데이트 성공: ${hour.dayOfWeek}`);
                } catch (error) {
                    console.error(`영업시간 업데이트 실패(${hour.dayOfWeek}):`, error);
                }
            }
        },
    },
    mounted() {
        if (this.doctorEmail) {
            this.fetchDoctorDetail();
        }

        this.koreanDays.forEach(hour => {
            const [openHour, openMinute] = hour.openTime.split(':').map(Number);
            const [closeHour, closeMinute] = hour.closeTime.split(':').map(Number);

            this.selectedOpenTime[hour.id] = openHour;
            this.selectedOpenMinute[hour.id] = openMinute;
            this.selectedCloseTime[hour.id] = closeHour;
            this.selectedCloseMinute[hour.id] = closeMinute;
        });

        console.log("화면 로드 시 doctorDetails:", this.doctorDetails);
    },
}
</script>


<style scoped>
.selected {
    color: none;
    font-weight: bold;
}

.custom-chip {
    width: 80px; /* 원하는 너비로 설정 */
    justify-content: center; /* 가로 방향 가운데 정렬 */
    align-items: center; /* 세로 방향 가운데 정렬 */
}

.time-select {
    margin: 0 5px; /* select 간격 조정 */
}

.operatingHour {
    background: #f6f9ff;
    border-radius: 80px;
    padding: 12px 24px;
    border: 1px solid #d8e2f4;
    font-size: 12px;
}

.saveBtn{
    border-radius: 20px;
    box-shadow: none;
    background-color: #d8e2f4;
    color: white;
    font-weight: bold;
}
</style>
