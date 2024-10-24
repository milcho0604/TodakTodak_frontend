<template>
    <v-container class="custom-container">
        <div class="hospitalName inter-bold">{{ hospitalName }}</div>
        <div>
            <input type="date" v-model="date" class="datePick">
        </div>
        <div>
            <v-row class="mt-3">
                <v-col class="list-box">
                    <div class="subtitle inter-bold">예약 내역</div>
                    <!-- 날짜별 예약 내역 가져오기 -->
                    <div v-for="r in paginatedConfirmList" :key="r.id">
                        <div :class="['reservation', { active: r.id === reservationDetail?.id }]" @click="setDetail(r)">
                            <v-row>
                                <v-col cols="4" class="doctor inter-normal">
                                    {{ r.doctorName }} 의사
                                    {{ formatTime(r.reservationTime) }}
                                </v-col>
                                <div style="border-left: 1px solid #ccc; height: 45px; margin: 12px 0;"></div>
                                <v-col>
                                    <div>
                                        <span class="inter-normal child">{{ r.childName }}</span> <span class="ssn">{{
                                            r.childSsn }}</span>
                                    </div>

                                    <div class="parent">
                                        보호자 {{ r.memberName }}
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                    <v-pagination v-model="confirmPage" :length="confirmTotalPages" :total-visible="5" class="pagination"
                        color="primary"></v-pagination>
                </v-col>
                <v-col class="list-box">
                    <div class="subtitle inter-bold">상세 내역</div>
                    <!-- 예약 상세 내역 가져오기 -->
                    <div v-if="reservationDetail" class="detail">
                        <v-row>
                            <v-col cols="4" class="inter-normal bold">날짜</v-col><v-col>{{
                                reservationDetail.reservationDate }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4" class="inter-normal bold">진료 분류</v-col><v-col>{{
                                reservationDetail.medicalItem }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4" class="inter-normal bold">진료 상태</v-col>
                            <v-col>
                                <span v-if="reservationDetail.status == 'Confirmed'">접수</span>
                                <span v-else-if="reservationDetail.status == 'Completed'">진료 완료</span>
                                <span v-else-if="reservationDetail.status == 'Cancelled'">취소</span>
                                <span v-else-if="reservationDetail.status == 'Noshow'">노쇼</span>
                                <span v-else>{{ reservationDetail.status }}</span>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4" class="inter-normal bold">증상</v-col><v-col>{{ reservationDetail.field
                                }}</v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4" class="inter-normal bold">환자 상태</v-col><v-col>{{ reservationDetail.message
                                }}</v-col>
                        </v-row>
                        <v-row v-if="reservationDetail.fee">
                            <v-col cols="4" class="inter-normal bold">진료비</v-col><v-col>{{ reservationDetail.fee
                                }}원</v-col>
                        </v-row>
                        <v-row v-if="reservationDetail.medicalStatus">
                            <v-col cols="4" class="inter-normal bold">결제 상태</v-col>
                            <v-col>
                                <span v-if="reservationDetail.medicalStatus != '결제완료'">미결제</span>
                                <span v-else>{{ reservationDetail.medicalStatus }}</span>

                            </v-col>
                        </v-row>
                        <div class="untactButton">
                            <v-chip class="no-untact" v-if="reservationDetail.status == 'Confirmed'"
                                @click="this.$router.push(`/member/room/${reservationDetail.id}`)"><img
                                    src="@/assets/untact_image.png" />
                                <strong>비대면진료 접속</strong>
                            </v-chip>
                        </div>
                    </div>
                    <div v-else class="pick-coment">
                        <p>상세 내역을 보려면 예약을 선택하세요.</p>
                    </div>
                </v-col>
                <v-col class="list-box">
                    <div class="subtitle inter-bold">진료 내역</div>
                    <!-- 날짜별 예약 내역 가져오기 -->
                    <div v-for="r in paginatedCompletedList" :key="r.id" @click="setDetail(r)">
                        <div :class="['completed', { active: r.id === reservationDetail?.id }]">
                            <v-row>
                                <v-col cols="4" class="doctor inter-normal">
                                    {{ r.doctorName }} 의사
                                    {{ formatTime(r.reservationTime) }}
                                </v-col>
                                <div style="border-left: 1px solid #ccc; height: 45px; margin: 12px 0;"></div>
                                <v-col>
                                    <div>
                                        <span class="inter-normal child">{{ r.childName }}</span> <span class="ssn">{{
                                            r.childSsn }}</span>
                                    </div>

                                    <div class="parent">
                                        보호자 {{ r.memberName }}
                                    </div>
                                </v-col>
                            </v-row>
                        </div>
                    </div>
                    <!-- Pagination -->
                    <v-pagination v-model="completedPage" :length="completedTotalPages" :total-visible="5" class="pagination"
                        color="primary"></v-pagination>
                </v-col>
            </v-row>

        </div>
    </v-container>
    <DoctorSideBar/>
</template>
<script>
import axios from 'axios';
import DoctorSideBar from '@/components/sidebar/DoctorSideBar.vue';

export default {
    components:{
        DoctorSideBar,
    },
    data() {
        return {
            confirmList: [],
            completedList: [],
            doctorEmail: localStorage.getItem('email'),
            hospitalName: null,
            reservationDetail: null,
            date: this.getToday(),
            confirmPage: 1,
            completedPage: 1,
            pageSize: 5
        }
    },
    watch: {
        date(newDate) {
            // this.fetchConfirm(newDate);
            this.fetchReservation(newDate);
        }
    },
    computed: {
        paginatedConfirmList() {
            const start = (this.confirmPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            console.log("paginatedConfirmList", start, end);
            return this.confirmList.slice(start, end);
        },
        confirmTotalPages() {
            return Math.ceil(this.confirmList.length / this.pageSize);
        },
        paginatedCompletedList() {
            const start = (this.completedPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.completedList.slice(start, end);
        },
        completedTotalPages() {
            return Math.ceil(this.completedList.length / this.pageSize);
        }
    },
    created() {
        this.fetchHospitalName();
        // this.fetchConfirm(this.getToday());
        this.fetchReservation(this.getToday());
    },
    methods: {
        // 병원 이름 불러오기
        async fetchHospitalName() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/hospitalName`)
            console.log('response: ', response.data);
            this.hospitalName = response.data.result.name;
        },
        async fetchReservation(date) {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/doctor/list`,
                {
                    // 요청 파라미터 (pageable)
                    params: {
                        doctorEmail: this.doctorEmail,
                        untact: true,
                        date: date,
                    }
                });
            console.log('response: ', response.data);

            this.completedList = [];
            this.confirmList = [];
            // 가져온 데이터를 상태별로 나누기
            response.data.forEach(reservation => {
                switch (reservation.status) {
                    case 'Completed':
                        console.log('Completed: ', reservation);
                        this.completedList.push(reservation);
                        break;
                    case 'Confirmed':

                        this.confirmList.push(reservation);
                        break;
                    case 'Cancelled':
                        this.completedList.push(reservation);
                        break;
                    case 'Noshow':
                        this.completedList.push(reservation);
                        break;
                    default:
                        console.warn(`Unknown status: ${reservation.status}`);
                }
            });
            // this.completedList = response.data;
        },
        async setDetail(reservation) {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/get/${reservation.id}`);
            this.reservationDetail = response.data.result;
            if (reservation.status == "Completed") {
                console.log("진료 완료된고네");
                const medicalResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/medical-chart/${reservation.id}`);
                console.log(medicalResponse);
                // reservationDetail에 medical chart 데이터를 추가
                this.reservationDetail = {
                    ...this.reservationDetail,  // 기존 데이터 유지
                    fee: medicalResponse.data.result.fee,
                    medicalStatus: medicalResponse.data.result.medicalStatus
                };
                console.log("this.reservationDetail: ", this.reservationDetail);
            }
        },
        getToday() {
            let today = new Date();
            let year = today.getFullYear();
            let month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
            let day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

            return year + '-' + month + '-' + day;
        },
        formatTime(time) {
            return time.slice(0, 5);
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
    min-height: 580px;
    border-radius: 10px;
    position: relative;
    padding-bottom: 90px; /* 페이지 버튼을 위한 공간 확보 */
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
    cursor: pointer;
}

.completed {
    background-color: #D5E3FF;
    margin: 10px 5px;
    padding: 13px 7px;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
}

.doctor {
    text-align: center;
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

.bold {
    text-align: center;
}

.untactButton {
    text-align: center;
}

.no-untact {
    margin-top: 30px;
    background-color: #00B2FF;
    color: #FFFFFF !important;
}

.datePick {
    border: 2px solid #DBDBDB;
    border-radius: 5px;
    padding: 5px 5px;
    width: 150px;
}

.pick-coment {
    margin-top: 30px;
    text-align: center;
    color: #6C6C6C;
}

.pagination {
    margin-top: 20px;
    display: flex;
    margin-right: 40px;
    position: absolute;
    bottom: 20px;
    left: 0;
    right: 0;
}
.reservation.active {
    border: 2px solid #0B99FF;
}
.completed.active {
    border: 2px solid #0B99FF;
}
</style>