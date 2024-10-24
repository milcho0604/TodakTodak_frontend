<template>
    <v-container class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <v-row justify="center" style="position: relative; transform: translateX(380px); margin-bottom: 10px;">
            <div class="round inter-normal dark-blue" @click="createModal = true">
                <v-icon class="plus-icon">mdi-plus-circle-outline</v-icon>
            </div>
        </v-row>

        <v-row justify="center">
            <v-col v-for="doctor in doctors" :key="doctor.id" md="2" lg="1">
                <v-avatar size="70">
                    <v-img @click="handleDoctorClick(doctor)"
                        :src="doctor.profileImgUrl ? doctor.profileImgUrl : defaultImageUrl" class="doctor-img" />
                </v-avatar>
            </v-col>
        </v-row>
        <v-spacer :style="{ height: '70px' }"></v-spacer>

        <!-- 의사 basic 카드 -->
        <v-row style="width: 80%; margin: 0 auto;" v-if="selectedDoctor">
            <v-col cols="3">
                <!-- 의사약력 -->
                <v-avatar style="height:auto; width:180px; border-radius: 5px; object-fit:cover;" class="ml-10">
                    <v-img @click="handleDoctorClick(doctor)"
                        :src="selectedDoctor.profileImgUrl ? selectedDoctor.profileImgUrl : defaultImageUrl"
                        class="doctor-img" />
                </v-avatar>
            </v-col>
            <v-col cols="7">
                <div class="ml-1">
                    <v-card-title style="font-weight:bold;">
                        이름
                    </v-card-title>
                    <v-card-text>
                        {{ this.selectedDoctor.name }}
                    </v-card-text>
                </div>
                <div class="ml-1">
                    <v-card-title style="font-weight:bold;">
                        이메일
                    </v-card-title>
                    <v-card-text>
                        {{ this.selectedDoctor.doctorEmail }}
                    </v-card-text>
                </div>
            </v-col>
        </v-row>
        <v-divider style="width: 75%; margin: 0 auto;"></v-divider>


        <!-- 의사 정보 bio 카드 -->
        <v-row style="width: 80%; margin: 0 auto;" v-if="selectedDoctor">
            <v-col cols="10">
                <!-- 의사약력 -->
                <v-card-title class="ml-4" style="font-weight:bold;">
                    의사 약력
                </v-card-title>
                <v-card class="doctor-bio-card mx-4" variant="flat">
                    <v-card-text :style="{ whiteSpace: 'pre-line' }">
                        <template v-if="isEditing">
                            <!-- 수정 중이면 text-field로 변환 -->
                            <v-textarea v-model="editedBio" label="의사 약력" rows="5" auto-grow></v-textarea>
                        </template>
                        <template v-else>
                            <!-- 수정 중이 아니면 기존 bio 출력 -->
                            {{ selectedDoctor.bio }}
                        </template>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col class="ml-2 modify-button">
                <!-- 수정 버튼 -->
                <div :class="isEditing ? 'edit' : 'modify-button'" @click="toggleEdit">
                    {{ isEditing ? '저장' : '수정' }}
                </div>
            </v-col>
        </v-row>
        <v-divider style="width: 75%; margin: 0 auto;"></v-divider>


        <!-- 진료시간 -->
        <v-row v-if="selectedDoctor" style="width: 80%; margin: 0 auto;">
            <v-col cols="12">
                <v-card-title class="ml-4" style="font-weight:bold;">
                    진료 시간
                </v-card-title>
                <!-- 새 진료 시간 추가 버튼 -->
                <v-row justify="end" class="mb-1" style="margin-right: 50px;"> <!-- 버튼을 오른쪽 끝으로 배치 -->
                    <div class="round inter-normal dark-blue" @click="createNewHour = !createNewHour"
                        v-if="!createNewHour">
                        <v-icon class="plus-icon">mdi-plus-circle-outline</v-icon>
                    </div>
                    <div class="round inter-normal dark-blue" @click="createNewHour = !createNewHour"
                        v-if="createNewHour">
                        <v-icon class="plus-icon">mdi-minus-circle-outline</v-icon>
                    </div>
                </v-row>
                <v-card class="doctor-bio-card mx-4" variant="flat">
                    <v-card-text>
                        <!-- + 버튼 눌렀을 경우 새 진료 시간 추가 입력칸 보이게 -->
                        <div v-if="createNewHour" class="createNewOperatingHours ml-10">
                            <v-row v-for="(hour, index) in newOperatingHour" :key="index" justify="center">
                                <v-col cols="3">
                                    <v-select outline v-model="hour.dayOfWeek" :items="weekdays" item-title="name"
                                        item-value="value" label="요일"></v-select>
                                </v-col>

                                <v-col cols="3">
                                    <v-text-field v-model="hour.openTime" label="오픈 시간" type="time"></v-text-field>
                                </v-col>

                                <v-col cols="3">
                                    <v-text-field v-model="hour.closeTime" label="종료 시간" type="time"></v-text-field>
                                </v-col>

                                <v-col cols="2">
                                    <v-checkbox v-model="hour.untact" label="비대면"></v-checkbox>
                                </v-col>

                            </v-row>
                            <v-row justify="center" class="mb-10">
                                <v-btn @click="createNewOperatingHours" class="save-button"><span
                                        class="inter-bold">저장</span></v-btn>
                            </v-row>

                        </div>
                        <v-row v-for="hour in selectedDoctor.operatingHours" :key="hour.id" class="oper-hour">
                            <v-col cols="2" style="text-align: center">
                                {{ hour.dayOfWeek }}
                            </v-col>
                            <v-col style="text-align: center">
                                <input type="text" v-model="hour.openTime" @change="checkIfChanged(hour.id)">
                            </v-col>
                            <v-col style="text-align: center">
                                <input type="text" v-model="hour.closeTime" @change="checkIfChanged(hour.id)">
                            </v-col>
                            <v-col cols="2" style="text-align: center">
                                <v-chip :key="index" color="#0075FF" size="default" class="mr-2">
                                    <span v-if="hour.untact">비대면</span>
                                    <span v-else>대면</span>
                                </v-chip>
                            </v-col>
                            <v-col cols="1" style="text-align: center">
                                <div icon @click="updateOperatingHour(hour)">
                                    <v-icon class="check-button"
                                        :class="{ 'check-icon-green': changedHours.includes(hour.id) }">mdi-check</v-icon>
                                    <!-- 체크 버튼 -->
                                </div>
                            </v-col>
                            <v-col cols="1" style="text-align: center">
                                <div icon @click="deleteOperatingHour(hour.id)">
                                    <v-icon class="check-button">mdi-close</v-icon>
                                    <!-- 삭제 버튼 -->
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- 의사 추가 모달 -->
        <DoctorCreateModal v-model="createModal" @update:dialog="createModal = $event; this.fetchDoctors()"
            @doctor-exists="openChildExistsDialog">
        </DoctorCreateModal>

        <DoctorDeleteModal v-model="doctorDeleteModal" :doctor-id="selectedDoctorId" :doctor-email="selectedDoctorEmail"
            @update:dialog="doctorDeleteModal = $event" @deleted="fetchDoctor">
        </DoctorDeleteModal>

    </v-container>
    <HospitalAdminSideBar/>
</template>

<script>
import axios from 'axios';
import DoctorCreateModal from './DoctorCreateModal.vue';
import DoctorDeleteModal from './DoctorDeleteModal.vue';
import HospitalAdminSideBar from '@/components/sidebar/HospitalAdminSideBar.vue';

export default {
    props: {
        defaultImageUrl: {
            type: String,
            default: "https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png"
        }
    },
    components: {
        DoctorCreateModal,
        DoctorDeleteModal,
        HospitalAdminSideBar,
    },
    data() {
        return {
            createModal: false,
            doctorDeleteModal: false,
            doctors: [],
            selectedDoctor: null,
            selectedDoctorId: null,
            selectedDoctorEmail: '',
            createNewHour: false,
            newOperatingHour: [
                { dayOfWeek: "", openTime: "", closeTime: "", untact: false }
            ],
            originalOperatingHours: [], // 초기 값을 저장하는 배열
            changedHours: [], // 변경된 시간의 ID를 저장할 배열
            isEditing: false, // 수정 중인지 여부를 관리
            editedBio: '',     // 수정 중인 약력 데이터를 저장
            weekdays: [
                { name: '월요일', value: 'Monday' },
                { name: '화요일', value: 'Tuesday' },
                { name: '수요일', value: 'Wednesday' },
                { name: '목요일', value: 'Thursday' },
                { name: '금요일', value: 'Friday' },
                { name: '토요일', value: 'Saturday' },
                { name: '일요일', value: 'Sunday' }
            ]
        }
    },
    created() {
        this.fetchDoctors();
    },
    computed: {
        dayOfWeekList() {
            return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        },
    },
    watch: {
        selectedDoctor(newDoctor) {
            console.log("의사 변경 감지", newDoctor);
            this.originalOperatingHours = JSON.parse(JSON.stringify(this.selectedDoctor.operatingHours)); // 깊은 복사
            console.log("originalOperatingHours", this.originalOperatingHours);
        }
    },
    methods: {
        checkIfChanged(hourId) {
            // 변경된 데이터와 원본 데이터를 비교
            const originalHour = this.originalOperatingHours.find(hour => hour.id === hourId);
            console.log("originalHour", originalHour);
            const currentHour = this.selectedDoctor.operatingHours.find(hour => hour.id === hourId);
            console.log("currentHour", currentHour);
            if (
                originalHour.openTime !== currentHour.openTime ||
                originalHour.closeTime !== currentHour.closeTime
            ) {
                // 변경된 항목이 있으면 changedHours에 ID 추가
                if (!this.changedHours.includes(hourId)) {
                    this.changedHours.push(hourId);
                }
            } else {
                // 변경 사항이 없으면 changedHours에서 ID 제거
                this.changedHours = this.changedHours.filter(id => id !== hourId);
            }
        },
        async fetchDoctors() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctors`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.doctors = response.data.result.content;
                console.log(this.doctors);
                // this.selectedDoctor = this.doctors[0];
                this.handleDoctorClick(this.doctors[0])
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
            }
        },
        openDeleteModal(doctorId) {
            const doctor = this.doctors.find(doc => doc.id === doctorId);
            if (doctor) {
                this.selectedDoctorId = doctorId;
                this.doctorDeleteModal = true;
                this.selectedDoctorEmail = doctor.doctorEmail;
            }
        },
        handleDoctorClick(doctor) {
            this.selectedDoctor = doctor;
            this.fetchDoctor(doctor);
        },
        async fetchDoctor(doctor) {
            console.log(doctor.operatingHours);
            // Monday -> 월요일 
            const daysOfWeek = {
                Monday: '월요일',
                Tuesday: '화요일',
                Wednesday: '수요일',
                Thursday: '목요일',
                Friday: '금요일',
                Saturday: '토요일',
                Sunday: '일요일'
            };
            // 요일 순서 배열
            const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            this.selectedDoctor.operatingHours = doctor.operatingHours
                .sort((a, b) => {
                    // 요일 순서대로 정렬
                    return daysOrder.indexOf(a.dayOfWeek) - daysOrder.indexOf(b.dayOfWeek);
                })
                .map(item => {
                    return {
                        ...item,
                        dayOfWeek: daysOfWeek[item.dayOfWeek] || item.dayOfWeek // 영어 요일을 한국어로 변환, 없으면 그대로 반환
                    }
                });
            console.log("eefefefefe", this.selectedDoctor);
        },
        formatTime(time) {
            return time.slice(0, 5);
        },
        async createNewOperatingHours() {
            console.log(this.newOperatingHour);
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/doctor-operating-hours/register/${this.selectedDoctor.id}`, this.newOperatingHour);
                console.log("Successfully submitted:", response.data);
                this.createNewHour = !this.createNewHour;
                this.fetchDoctors();
            } catch (error) {
                console.error("Error submitting:", error);
            }
        },
        async updateOperatingHour(hour) {
            console.log("updateHour", hour);
            // 월요일 -> Monday 
            const daysOfWeek = {
                월요일: 'Monday',
                화요일: 'Tuesday',
                수요일: 'Wednesday',
                목요일: 'Thursday',
                금요일: 'Friday',
                토요일: 'Saturday',
                일요일: 'Sunday'
            };
            this.changedHours = this.changedHours.filter(id => id !== hour.id);
            // 업데이트 
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/doctor-operating-hours/update/${hour.id}`,
                    {
                        dayOfWeek: daysOfWeek[hour.dayOfWeek],
                        openTime: hour.openTime,
                        closeTime: hour.closeTime,
                        untact: hour.untact
                    }
                );
                console.log("Successfully submitted:", response.data);
                this.fetchDoctors();
            } catch (error) {
                console.error("Error submitting:", error);
            }
            this.fetchDoctors();
        },
        async deleteOperatingHour(hourId) {
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/doctor-operating-hours/delete/${hourId}`);
                console.log("Successfully submitted:", response.data);
                this.fetchDoctors();
            } catch (error) {
                console.error("Error submitting:", error);
            }
        },
        toggleEdit() {
            if (this.isEditing) {
                // '저장'을 눌렀을 때, 수정된 내용을 적용하고 상태 변경
                this.selectedDoctor.bio = this.editedBio;
                // 여기서 서버로 수정된 데이터를 보낼 수도 있습니다
                this.updateDoctorBio();
            } else {
                // '수정'을 눌렀을 때, 현재 약력을 텍스트 필드에 설정
                this.editedBio = this.selectedDoctor.bio;
            }
            this.isEditing = !this.isEditing; // 수정 상태 변경
        },
        async updateDoctorBio() {
            try {
                const formData = new FormData();

                formData.append('memberEmail', this.selectedDoctor.doctorEmail);
                formData.append('bio', this.selectedDoctor.bio);
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/edit-doctor`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log("Successfully submitted:", response.data);
                this.fetchDoctors();
            } catch (error) {
                console.error("Error submitting:", error);
            }
        }
    }
}
</script>

<style scoped>
.delete-icon {
    box-shadow: none !important;
    border-radius: 16px;
    background-color: #f44336;
    color: white;
    padding: 6px 12px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

.delete-icon:hover {
    background-color: #d32f2f;
}

.big-font {
    font-size: 20px;
}

.check-button {
    color: #898787;
    cursor: pointer;
    font-size: 25px;
}

.doctor-img {
    cursor: pointer;
}

.check-icon-green {
    color: green;
    font-size: 27px;
}

.oper-hour {
    font-size: 15px;
}

.save-button {
    border-radius: 20px;
    background-color: #C2D7FF;
}

.modify-button {
    color: gray;
    cursor: pointer;
}
.edit {
    color: green;
    cursor: pointer;
}
</style>
