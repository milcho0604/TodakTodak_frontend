<template>
    <v-container class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <v-row justify="center" align="center" class="inter-bold title">
            <v-col class="d-flex align-center justify-center">
                <img src="@/assets/doctor.png" width="50px" />
                <span style="margin-left: 10px;">의사 정보</span>
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
                                {{ doctorDetails?.doctorName }}
                            </h4>
                        </v-col>
                        <v-col class="d-flex justify-end">
                            <span @click="goToEdit" class="d-flex align-center action-link mr-2">
                                <v-icon small>mdi-pencil</v-icon> 수정
                            </span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>이메일 : {{ doctorDetails?.doctorEmail }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col>약력 : {{ doctorDetails?.bio }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col>리뷰 수 : {{ doctorDetails?.reviewCount }}</v-col>
                    </v-row>
                    <v-row>
                        <v-col><v-icon style="color: gold; font-size: 18px;">mdi-star</v-icon> {{ doctorDetails?.reviewPoint }}</v-col>
                    </v-row>
                    <v-row><v-col>근무시간</v-col></v-row>
                    <v-row v-for="hour in operatingHours" :key="hour.id" class="my-2">
                        <v-col class="operatingHour">
                            {{ getKoreanDay(hour.dayOfWeek) }} &nbsp;
                            <v-chip :color="hour.untact ? 'blue' : 'orange'" dark small class="custom-chip">
                                {{ hour.untact ? '비대면 가능' : '대면진료' }}
                            </v-chip> &nbsp;
                            {{ formatTime(hour.openTime) }} - {{ formatTime(hour.closeTime) }}
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        
    </v-container>
</template>

<script>
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState(['doctorEmail', 'doctorDetails']),
        operatingHours() {
            return this.doctorDetails?.operatingHours || [];
        },
    },
    watch: {
        doctorEmail(newEmail) {
            if (newEmail) {
                this.fetchDoctorDetail();
            }
        },
    },
    methods: {
        async fetchDoctorDetail() {
            if (!this.doctorDetails) {
                await this.$store.dispatch('fetchDoctorDetails', this.doctorEmail);
            }
        },
        goToEdit() {
            this.$router.push('/doctor/edit');
        },
        formatTime(time) {
            const [hour, minute] = time.split(':').map(num => (num.length < 2 ? '0' + num : num));
            return `${hour} : ${minute}`;
        },
        getKoreanDay(day) {
            const days = {
                Monday: '월요일',
                Tuesday: '화요일',
                Wednesday: '수요일',
                Thursday: '목요일',
                Friday: '금요일',
                Saturday: '토요일',
                Sunday: '일요일',
            };
            return days[day] || day; // Default to original if not found
        },
    },
    mounted() {
        if (this.doctorEmail) {
            this.fetchDoctorDetail();
        }
    },
}
</script>

<style scoped>
.operatingHour {
    background: #f6f9ff;
    border-radius: 80px;
    padding: 12px 24px;
    border: 1px solid #d8e2f4;
    font-size: 14px;
}
.custom-chip {
    width: auto; /* 원하는 너비로 설정 */
    justify-content: center; /* 가로 방향 가운데 정렬 */
    align-items: center; /* 세로 방향 가운데 정렬 */
}
</style>
