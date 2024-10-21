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
                                    <v-img :src="doctorDetails?.doctorImageUrl ? doctorDetails.doctorImageUrl : require('@/assets/doctor.png')" />

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
                        <v-col>
                            근무시간
                        </v-col>
                        <v-col class="d-flex justify-end">
                            <v-icon small @click="addOperatingHour" :disabled="koreanDays.length >= 7">mdi-plus-circle-outline</v-icon>
                        </v-col>
                    </v-row>
                    <v-row v-for="hour in koreanDays" :key="hour.id" class="my-2">
                        <v-col class="operatingHour">
                            <select v-model="hour.dayOfWeek" @change="updateDayOfWeek(index, hour.dayOfWeek)" class="time-select">
                                <option value="Monday">월요일</option>
                                <option value="Tuesday">화요일</option>
                                <option value="Wednesday">수요일</option>
                                <option value="Thursday">목요일</option>
                                <option value="Friday">금요일</option>
                                <option value="Saturday">토요일</option>
                                <option value="Sunday">일요일</option>
                            </select> &nbsp;
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
                            &nbsp;&nbsp;&nbsp;&nbsp;<v-icon small @click="deleteOperatingHour">mdi-window-close</v-icon>
                            &nbsp;&nbsp;&nbsp;&nbsp;<v-icon small @click="saveOperatingHour(hour)">mdi-check</v-icon>
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
        updateDayOfWeek(index, newDay) {
        const days = {
            '월요일': 'Monday',
            '화요일': 'Tuesday',
            '수요일': 'Wednesday',
            '목요일': 'Thursday',
            '금요일': 'Friday',
            '토요일': 'Saturday',
            '일요일': 'Sunday',
        };
        
        // operatingHours가 존재하고 인덱스가 유효한지 확인
        if (this.doctorDetails.operatingHours && this.doctorDetails.operatingHours[index]) {
            const dayOfWeek = days[newDay] || newDay;
            this.doctorDetails.operatingHours[index].dayOfWeek = dayOfWeek;
        } else {
            console.error("유효하지 않은 인덱스 또는 operatingHours가 정의되지 않았습니다.");
        }
        },

        addOperatingHour() {
            if (this.koreanDays.length >= 7) return
            const newHour = {
                id: Date.now(),  // 고유 ID 생성
                dayOfWeek: 'Monday',  // 기본 요일 설정
                untact: false,  // 기본 비대면 여부
                openTime: '09:00',  // 기본 오픈 시간
                closeTime: '18:00'  // 기본 클로즈 시간
            };

            this.doctorDetails.operatingHours.push(newHour);

        },
        saveOperatingHour(hour){
            if (!hour || !hour.id) {
               console.error("유효하지 않은 hour 객체:", hour);
                return; // 유효하지 않을 경우 메소드 종료
            }

            const openTime = `${this.selectedOpenTime[hour.id].toString().padStart(2, '0')}:${this.selectedOpenMinute[hour.id].toString().padStart(2, '0')}`;
            const closeTime = `${this.selectedCloseTime[hour.id].toString().padStart(2, '0')}:${this.selectedCloseMinute[hour.id].toString().padStart(2, '0')}`;

            const operatingHourData = {
            dayOfWeek: hour.dayOfWeek, // 영어로 된 요일
            openTime: openTime,
            closeTime: closeTime,
            untact: hour.untact // 비대면 여부
            };

            console.log("전송할 operatingHourData:", operatingHourData);
            const doctorId = this.doctorDetails.id; // 의사 ID 가져오기

            // POST 요청 보내기
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/doctor-operating-hours/register/${doctorId}`, [operatingHourData])
            .then(response => {
                console.log("근무시간 저장 성공:", response.data);
            })
            .catch(error => {
                console.error("근무시간 저장 실패:", error);
            });
        },
        deleteOperatingHour(hour) {
            const index = this.doctorDetails.operatingHours.findIndex(item => item.id === hour.id);
            if (index !== -1) {
                this.doctorDetails.operatingHours.splice(index, 1);
                console.log("근무시간 삭제 성공:", hour);
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

            // 근무시간 업데이트
            for (const hour of this.koreanDays) {
                const openTime = `${this.selectedOpenTime[hour.id].toString().padStart(2, '0')}:${this.selectedOpenMinute[hour.id].toString().padStart(2, '0')}:00`;
                const closeTime = `${this.selectedCloseTime[hour.id].toString().padStart(2, '0')}:${this.selectedCloseMinute[hour.id].toString().padStart(2, '0')}:00`;

                const operatingHourData = {
                    dayOfWeek: hour.dayOfWeek,
                    openTime: openTime,
                    closeTime: closeTime,
                    untact: hour.untact.toString()
                };

                console.log(`영업시간 업데이트 요청 데이터:`, operatingHourData);

                try {
                    await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/doctor-operating-hours/update/${hour.id}`, operatingHourData);
                    console.log(`영업시간 업데이트 성공: ${hour.dayOfWeek}`);
                } catch (error) {
                    console.error(`영업시간 업데이트 실패(${hour.dayOfWeek}):`, error);
                }
            }
            this.$router.push('/doctor/detail');
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
