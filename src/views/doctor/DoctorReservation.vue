<template>
    <v-container class="custom-container">
        <div class="hospitalName inter-bold">병원이름</div>
        <div>
            <input type="date">
        </div>
        <div>
            <v-row class="mt-3">
                <v-col class="list-box">
                    <div class="subtitle inter-bold">예약 내역</div>
                    <!-- 날짜별 예약 내역 가져오기 -->
                    <div v-for="r in confirmList" :key="r.id">
                        <div class="reservation" @click="setDetail(r)">
                            <v-row>
                                <v-col cols="4" class="doctor inter-normal">
                                    {{r.doctorName}} 의사
                                </v-col>
                                <div style="border-left: 1px solid #ccc; height: 40px; margin: 12px 0;"></div>
                                <v-col>
                                    <div>
                                        <span class="inter-normal child">{{ r.childName }}</span> <span class="ssn">{{ r.childSsn }}</span>
                                    </div>

                                    <div class="parent">
                                        보호자 {{ r.memberName }}
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-col>
                <v-col class="list-box">
                    <div class="subtitle inter-bold">상세 내역</div>
                    <!-- 예약 상세 내역 가져오기 -->
                    <div v-if="reservationDetail" class="detail">
                        <v-row>
                            <v-col>날짜</v-col><v-col>{{ reservationDetail.reservationDate }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col>진료 분류</v-col><v-col>{{ reservationDetail.medicalItem }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col>진료 상태</v-col><v-col>{{ reservationDetail.status }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col>증상</v-col><v-col>{{ reservationDetail.field }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col>환자 상태</v-col><v-col>{{ reservationDetail.message }}</v-col>
                        </v-row>
                        
                    </div>
                    <div v-else>
                        <p>상세 내역을 보려면 예약을 선택하세요.</p>
                    </div>
                </v-col>
                <v-col class="list-box">
                    <div class="subtitle inter-bold">진료 내역</div>
                    <!-- 날짜별 예약 내역 가져오기 -->
                    <div v-for="r in completedList" :key="r.id">
                        <div class="completed">
                            <v-row>
                                <v-col cols="4" class="doctor inter-normal">
                                    {{r.doctorName}} 의사
                                </v-col>
                                <div style="border-left: 1px solid #ccc; height: 40px; margin: 12px 0;"></div>
                                <v-col>
                                    <div>
                                        <span class="inter-normal child">{{ r.childName }}</span> <span class="ssn">{{ r.childSsn }}</span>
                                    </div>

                                    <div class="parent">
                                        보호자 {{ r.memberName }}
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                </v-col>
            </v-row>

        </div>
    </v-container>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            confirmList: [],
            completedList: [],
            doctorEmail: localStorage.getItem('email'),
            hospitalName: null,
            reservationDetail: null,
            page: 0,
            size: 100
        }
    },
    created() {
        this.fetchHospitalName();
        this.fetchConfirm();
        this.fetchCompleted();
    },
    methods: {
        // 병원 이름 불러오기
        async fetchHospitalName() {
            // const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/list`)
            // console.log('response: ', response.data);
        },
        async fetchConfirm() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/list`,
                {
                    // 요청 파라미터 (pageable)
                    params: {
                        doctorEmail: this.doctorEmail,
                        status: "Confirmed",
                        date: "2024-10-10",
                        page: this.page,
                        size: this.size, 
                    }
                });
            console.log('response: ', response.data);
            this.confirmList = response.data;
        },
        async fetchCompleted() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/list`,
                {
                    // 요청 파라미터 (pageable)
                    params: {
                        doctorEmail: this.doctorEmail,
                        status: "Completed",
                        date: "2024-10-10",
                        page: this.page, 
                        size: this.size, 
                    }
                });
            console.log('response: ', response.data);
            this.completedList = response.data;
        },
        async setDetail(reservation) {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/get/${reservation.id}`);
            this.reservationDetail = response.data.result;
        }
    }
}
</script>
<style scoped>
.hospitalName {
    text-align: center;
    font-size: 28px;
    color: #00499E;
}

.list-box {
    background-color: #F7F7F7;
    margin: 10px 10px;
    height: 500px;
    border-radius: 10px;
}

.subtitle {
    text-align: center;
    font-size: 20px;
    color: #0066FF;
    margin: 10px 0;
}
.reservation {
    background-color: #ffffff;
    margin: 10px 5px;
    padding: 13px 7px;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    position: relative;
}
.completed {
    background-color: #D5E3FF;
    margin: 10px 5px;
    padding: 13px 7px;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    position: relative;
}
.doctor {
    text-align: center;
    margin-top: 10px;
    color: #00499E;
}
.child {
    font-size: 15px;
}
.ssn {
    font-size: 13px;
    color: #6C6C6C;
}
.parent {
    font-size: 13px;
    color: #6C6C6C;
}
.detail {
    margin: 15px 15px;
}
</style>