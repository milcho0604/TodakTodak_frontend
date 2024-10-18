<template>
    <v-container class="custom-container">
        <div class="hospitalName inter-bold">{{ hospitalName }}</div>
        <div>
            <input type="date" v-model="date" class="datePick">
        </div>
        <div>
            <v-row class="mt-3">
                <v-col class="list-box">
                    <div class="subtitle inter-bold">당일 예약내역</div>
                    <!-- 날짜별 당일 예약 내역 가져오기 -->
                    <div v-for="r in paginatedList" :key="r.id">
                        <div class="reservation" @click="setDetail(r)">
                            <v-row>
                                <v-col cols="4" class="doctor inter-normal">
                                    {{ r.doctorName }} 의사
                                </v-col>
                                <div style="border-left: 1px solid #ccc; height: 40px; margin: 12px 0;"></div>
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
                    <v-row>
                        <v-col>
                            <div style="text-align: right;" class="mr-2">
                                <button @click="prevPage" :disabled="currentPage === 1">이전 </button>
                                <span>{{ currentPage }} / {{ totalPages }}</span>
                                <button @click="nextPage" :disabled="currentPage === totalPages"> 다음</button>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
                <v-col class="list-box">
                    <div class="subtitle inter-bold">스케쥴 예약내역</div>
                    <!-- 날짜별 스케쥴 예약 내역 가져오기 -->
                    <div v-for="r in scheduledList" :key="r.id">
                        <div class="screservation" @click="setDetail(r)">
                            <v-row>
                                <v-col cols="4" class="doctor inter-normal">
                                    {{ r.doctorName }} 의사
                                </v-col>
                                <div style="border-left: 1px solid #ccc; height: 40px; margin: 12px 0;"></div>
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
                </v-col>
                <v-col class="list-box">
                    <div class="subtitle inter-bold">접수 내역</div>
                    <!-- 날짜별 접수 내역 가져오기 -->
                    <div v-for="r in completedList" :key="r.id">
                        <div class="completed" @click="showDetail(r)">
                            <v-row>
                                <v-col cols="4" class="doctor inter-normal">
                                    {{ r.doctorName }} 의사
                                </v-col>
                                <div style="border-left: 1px solid #ccc; height: 40px; margin: 12px 0;"></div>
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
                </v-col>
            </v-row>
            <v-dialog v-model="toCompletedModal" max-width="600px">
                <v-card>
                    <v-card-title class="submodal mt-6 inter-bold text-center">
                        접수 완료 처리하시겠습니까?
                    </v-card-title>
                    <v-container style="text-align: center;">
                        <v-row justify="center">
                            <v-col v-if="reservationDetail.reservationType == 'Immediate'"
                                class="inter-bold subtitle-3">
                                당일 예약
                            </v-col>
                            <v-col v-else class="inter-bold subtitle-3">
                                스케줄 예약
                            </v-col>
                        </v-row>

                        <v-row justify="center">
                            <v-col class="inter-bold subtitle-3">
                                환자 정보
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col style="margin-top: -20px">
                                {{ reservationDetail.childName }} <br>
                                {{ reservationDetail.childSsn }}
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col class="inter-bold subtitle-3">
                                진료 일시
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col style="margin-top: -20px">
                                {{ reservationDetail.reservationDate }} /
                                {{ reservationDetail.reservationTime }}
                            </v-col>
                        </v-row>
                        <v-row justify="center">
                            <v-col class="inter-bold subtitle-3">
                                진료 항목
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col style="margin-top: -20px">
                                {{ reservationDetail.medicalItem }}
                            </v-col>
                        </v-row>
                        <br><br>
                        <v-row justify="center" align="center">
                            <v-col cols="2" class="modal-completed" @click="toCompleted('Completed')">
                                접수완료
                            </v-col>
                            <v-col cols="1"></v-col>
                            <v-col cols="2" class="modal-noshow" @click="toCompleted('Noshow')">
                                노쇼
                            </v-col>
                            <v-col cols="1"></v-col>
                            <v-col cols="2" class="modal-cancelled" @click="checkCompletedModal = true">
                                예약취소
                            </v-col>
                            <v-col cols="1"></v-col>
                            <v-col cols="2" class="modal-close" @click="toCompletedModal = false">
                                닫기
                            </v-col>
                        </v-row>
                        <br>
                    </v-container>
                </v-card>
            </v-dialog>

            <v-dialog v-model="checkCompletedModal" max-width="600px">
                <v-card>
                    <v-card-title class="submodal mt-6 inter-bold text-center">
                        정말 예약을 취소하시겠습니까?
                    </v-card-title>
                    <v-container style="text-align: center;" class="mt-3">
                        <v-row justify="center" align="center">
                            <v-col cols="3" class="modal-cancelled" @click="toCompleted('Cancelled')">
                                예약취소
                            </v-col>
                        </v-row>
                        <br><br>
                    </v-container>
                </v-card>
            </v-dialog>
            <v-dialog v-model="reserveDetailModal" max-width="500px">
                <v-card>
                    <v-card-title class="submodal mt-6 inter-bold text-center">
                        예약 내역 상세정보
                    </v-card-title>
                    <v-card-text>
                        <v-container class="submodaltext">
                            <v-row justify="center">
                                <v-col v-if="reservationDetail.reservationType == 'Immediate'"
                                    class="inter-bold subtitle-3">
                                    당일 예약
                                </v-col>
                                <v-col v-else class="inter-bold subtitle-3">
                                    스케줄 예약
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    원장선생님 정보
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ reservationDetail.doctorName }} 원장
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    보호자
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ reservationDetail.memberName }}
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    환자 정보
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ reservationDetail.childName }} <br>
                                    {{ reservationDetail.childSsn }}
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    예약 시간
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ reservationDetail.reservationDate }} /
                                    {{ reservationDetail.reservationTime }}
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    진료 항목
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ reservationDetail.medicalItem }}
                                </v-col>
                            </v-row>
                            <v-container style="text-align: center;">
                                <v-row justify="center" align="center">
                                    <v-col cols="4" class="modal-selected" @click="reserveDetailModal = false">
                                        닫기
                                    </v-col>
                                </v-row>
                            </v-container>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </div>
    </v-container>
</template>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            immediateList: [],
            scheduledList: [],
            completedList: [],
            doctorEmail: localStorage.getItem('email'),
            hospitalName: null,
            reservationDetail: null,
            date: this.getToday(),
            toCompletedModal: false,
            checkCompletedModal: false,
            reserveDetailModal: false,
            currentPage: 1, // 현재 페이지
            itemsPerPage: 10, // 한 페이지에 표시할 항목 수
        }
    },
    watch: {
        date(newDate) {
            this.fetchImmediate(newDate);
            this.fetchScheduled(newDate);
            this.fetchCompleted(newDate);
        }
    },
    created() {
        this.fetchHospitalName();
    },
    methods: {
        // 병원 이름 불러오기
        async fetchHospitalName() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/hospitalName`)
            // console.log('response: ', response.data);
            this.hospitalName = response.data.result.name;
            this.fetchImmediate(this.getToday());
            this.fetchScheduled(this.getToday());
            this.fetchCompleted(this.getToday());
        },
        async fetchImmediate(date) {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/list`,
                {
                    // 요청 파라미터 (pageable)
                    params: {
                        hospitalName: this.hospitalName,
                        reserveType: "Immediate",
                        status: "Confirmed",
                        date: date,
                    }
                });
            // console.log('Immediate response: ', response.data);
            this.immediateList = response.data;
        },
        async fetchScheduled(date) {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/list`,
                {
                    // 요청 파라미터 (pageable)
                    params: {
                        hospitalName: this.hospitalName,
                        reserveType: "Scheduled",
                        status: "Confirmed",
                        date: date,
                    }
                });
            // console.log('Scheduled response: ', response.data);
            this.scheduledList = response.data;
        },
        async setDetail(reservation) {
            this.toCompletedModal = true;
            this.reservationDetail = reservation;
            console.log(reservation);
        },
        async showDetail(reservation) {
            this.reserveDetailModal = true;
            this.reservationDetail = reservation
        },
        getToday() {
            let today = new Date();
            let year = today.getFullYear();
            let month = (today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
            let day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();

            return year + '-' + month + '-' + day;
        },
        async fetchCompleted(date) {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/list`,
                {
                    params: {
                        hospitalName: this.hospitalName,
                        reserveType: null,
                        status: "Completed",
                        date: date,
                    }
                });
            console.log('response: ', response.data);
            this.completedList = response.data;
        },
        async toCompleted(data) {
            try {
                const req = {
                    id: this.reservationDetail.id,
                    status: data
                }
                console.log(req);
                await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/update`,
                    req
                )

                this.toCompletedModal = false;
                this.checkCompletedModal = false;
                window.location.reload();
            } catch (e) {
                console.log(e)
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
    },
    computed: {
        totalPages() {
            return Math.ceil(this.immediateList.length / this.itemsPerPage);
        },
        paginatedList() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.immediateList.slice(start, end);
        },
    }
}
</script>
<style scoped>
* {
    user-select: none;
    font-weight: bold;
}

.hospitalName {
    text-align: center;
    font-size: 28px;
    color: #00499E;
}

.list-box {
    background-color: #F7F7F7;
    margin: 10px 10px;
    min-height: 500px;
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
    cursor: pointer;
}

.screservation {
    background-color: #D5E3FF;
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

.submodal {
    font-size: 25px;
    font-weight: bold;
}

.modal-close {
    margin-top: 5px;
    background-color: #E0E0E0;
    color: #5F5F5F;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    font-weight: bold;
}

.modal-noshow {
    margin-top: 5px;
    background-color: #FFA1A1;
    color: #A20000;
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    font-weight: bold;
}

.modal-completed {
    margin-top: 5px;
    background-color: #C2D7FF;
    border-radius: 5px;
    padding: 5px;
    color: #00499E;
    cursor: pointer;
    font-weight: bold;
}

.modal-cancelled {
    margin-top: 5px;
    background-color: #FFA1A1;
    border-radius: 5px;
    padding: 5px;
    color: #A20000;
    cursor: pointer;
    font-weight: bold;
}

.subtitle-3 {
    font-size: 1.2em;
    color: #0058FF;
}

.modal-selected {
    margin-top: 5px;
    background-color: #CACACA;
    color: #717171;
    border-radius: 10px;
    padding: 5px;
    margin-right: 5px;
    cursor: pointer;
}
</style>