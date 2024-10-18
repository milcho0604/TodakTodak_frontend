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
                                <v-row>
                                <v-col cols="2">
                                <v-avatar size="50">
                                    <v-img :src="doctorDetails?.doctorImageUrl ? doctorDetails.doctorImageUrl : require('@/assets/doctor.png')" />
                                </v-avatar>
                                </v-col>
                                <v-col cols="5">
                                    <div>
                                    {{ doctorDetails?.doctorName }}     
                                    <br>
                                    <div style="font-size: 12px;">
                                        <v-icon >mdi-account-heart-outline</v-icon> {{ doctorDetails?.reviewCount }}
                                        <v-icon style="color: gold;">mdi-star</v-icon> {{ doctorDetails?.reviewPoint }}                
                                    </div>
                                    </div>
                                </v-col>
                                </v-row>
                            </h4>
                        </v-col>
                        <v-col cols="5" class="d-flex justify-end">
                            <span @click="goToEdit" class="d-flex align-center action-link mr-2">
                                <v-icon small>mdi-pencil</v-icon> 수정
                            </span>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>약력 : {{ doctorDetails?.bio }}</v-col>
                    </v-row>
                    <v-row><v-col>근무시간</v-col></v-row>

        <v-card class="notice-card mt-3" variant="flat">
            <v-row align="center">
              <!-- 왼쪽: '점심시간' -->
              <v-col class="text-center" cols="6">
                <v-card-title class="text-subtitle-1 font-weight-bold">점심시간</v-card-title>
              </v-col>
          
              <!-- 오른쪽: hospital.breakTime -->
              <v-col class="text-center" cols="6">
                <v-card-title style="font-size:17px; font-weight:bold">12:00-13:00</v-card-title>
              </v-col>
            </v-row>
        </v-card>
        <v-spacer :style="{ height: '10px' }"></v-spacer>
        <v-card class="notice-card mt-3" variant="flat">
            <v-row v-for="hour in operatingHours" :key="hour.id" class="my-2" align="center">
                
              <v-col class="text-center" cols="4">
                <v-card-title class="text-subtitle-1 font-weight-bold">{{ getKoreanDay(hour.dayOfWeek) }}</v-card-title>
              </v-col>
              <v-col class="text-center" cols="4">
                <v-card-title style="font-size:17px; font-weight:bold">{{ formatTime(hour.openTime) }} - {{ formatTime(hour.closeTime) }}</v-card-title>
              </v-col>
              <v-col class="text-center" cols="4">
                <v-card-title class="text-subtitle-1 font-weight-bold">{{ hour.untact ? '비대면 진료' : '대면 진료' }}</v-card-title>
              </v-col>
            </v-row>
            </v-card>
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
.notice-card{
    width: 630px;
    background-color: #F3F3F3;
    border-radius: 10px; /* 모서리 둥글기 */
}
</style>
