<template>
    <v-container class="custome-container">
        <v-container style="width: 700px;">
            <v-spacer :style="{ height: '70px' }"></v-spacer>
            <v-row justify="center">
                <v-col cols="12" sm="9" md="8" lg="7">
                    <!-- 프로필 섹션 -->
                    <v-row class="profile-section" no-gutters>
                        <v-col cols="3">
                        </v-col>
                        <v-col cols="9">
                            <div class="reservation-text"><img src="@/assets/myreserve.png" alt="TodakTodak Logo"
                                    class="logo-image" />예약 내역</div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>

            <div class="line-container">
                <div class="custom-line"></div>
            </div>

            <div class="profile-page-gap"></div>

            <v-row>
                <v-col cols="6" style="text-align: right">
                    <div class="type-style" :class="{ 'select-style': reserveType == '오는예약' }"
                        @click="updateReserveList('오는예약')">
                        오는 예약
                    </div>
                </v-col>
                <v-col cols="6" style="text-align: left;">
                    <div class="type-style" :class="{ 'select-style': reserveType == '지난예약' }"
                        @click="updateReserveList('지난예약')">
                        지난 예약
                    </div>
                </v-col>
            </v-row>
            <v-row v-if="reserveType == '오는예약'">
                <v-chip-group selected-class="text-primary" v-model="sort">
                    <v-chip value="오늘" filter><strong>오늘</strong></v-chip>
                </v-chip-group>
            </v-row>
            <v-row v-if="reserveType == '지난예약'">
                <v-chip-group selected-class="text-primary" v-model="filter">
                    <v-chip value="전체" filter><strong>전체</strong></v-chip>
                    <v-chip value="오늘" filter><strong>오늘</strong></v-chip>
                    <v-chip value="진료완료" :class="filter === '진료완료' ? 'after-completed' : ''"
                        filter><strong>진료완료</strong></v-chip>
                    <v-chip value="예약취소" filter><strong>예약취소</strong></v-chip>
                    <v-chip value="노쇼" :class="filter === '노쇼' ? 'noshow' : ''" filter><strong>노쇼</strong></v-chip>
                    <v-chip value="비대면" :class="filter === '비대면' ? 'untact' : ''" filter><strong>비대면</strong></v-chip>
                </v-chip-group>
            </v-row>
            <v-row>
                <div v-for="(item, index) in filteredReserveList" class="reservelist" :key="index" cols="12" sm="6">
                    <v-col class="ml-7">
                        <v-row>
                            <v-col cols="4">
                                <v-avatar>
                                <v-img :src="item.profileImgUrl" alt="자녀 이미지" width="30px" height="30px"
                                    style=" display: inline-block; vertical-align: middle; object-fit: cover;"></v-img>
                                </v-avatar>
                                <div class="ml-3 childName" style="display: inline-block; vertical-align: middle;">
                                    {{ item.childName }}</div>
                            </v-col>
                            <v-col cols="4"></v-col>
                            <v-col cols="4" style="text-align: end;">
                                <v-chip v-if="reserveType == '지난예약' &&
                                    item.status == 'Completed'" class="after-completed"><strong>진료완료</strong></v-chip>
                                <v-chip v-if="item.status == 'Cancelled'"><strong>예약취소</strong></v-chip>
                                <v-chip v-if="reserveType == '지난예약' &&
                                    item.status == 'Noshow'" class="noshow"><strong>노쇼</strong></v-chip>
                            </v-col>
                        </v-row>
                        <!-- 스케줄 예약일 떄  -->
                        <v-row v-if="item.reservationType == 'Scheduled'">
                            <v-col cols="4">
                                <div class="ml-1 waiting">
                                    {{ formatTime(item.reservationTime) }} 진료 예약</div>
                            </v-col>
                            <v-col cols="4"></v-col>
                            <v-col cols="4" style="text-align: end;">
                                <v-chip v-if="reserveType == '지난예약' &&
                                    item.status == 'Completed'"
                                    :class="item.review ? 'review' : 'no-review'"
                                    @click="item.review ? this.$router.push('/') : reviewData(item)"><img
                                        src="@/assets/pencil_img.png" /><strong>리뷰쓰기</strong>
                                </v-chip>
                            </v-col>
                        </v-row>
                        <!-- 당일 예약일 때  -->
                        <v-row v-else-if="item.reservationType == 'Immediate' && item.status == 'Confirmed'">
                            <v-col cols="4">
                                <div class="ml-1 waiting">
                                    {{  item.waiting }}명 대기중
                                </div>
                            </v-col>
                            <v-col cols="4"></v-col>
                            <v-col cols="4" style="text-align: end;">
                                <v-chip v-if="item.untact && item.waiting==1" class="no-untact"
                                    @click="this.$router.push(`/member/room/${item.id}`)"><img
                                        src="@/assets/untact_image.png" />
                                    <strong>비대면진료 접속</strong>
                                </v-chip>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col style="margin-top: -15px">
                                <p class="ml-1">{{ item.hospitalName }}</p>
                            </v-col>
                            <v-col cols="4" style="text-align: end; ">
                                <v-chip v-if="reserveType == '지난예약' && item.reservationType == 'Immediate' &&
                                    item.status == 'Completed' && item.medichart != '진료중'"
                                    :class="item.review ? 'review' : 'no-review'"
                                    @click="item.review ? this.$router.push('/') : reviewData(item)"><img
                                        src="@/assets/pencil_img.png" /><strong>리뷰쓰기</strong>
                                </v-chip>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4">
                                <div class="ml-1 doctorname">{{ item.doctorName }} 원장</div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4">
                                <div class="ml-1 doctorname" style="margin-top: -26px;">
                                    접수 : {{ formatDate(item.reservationDate) }} {{ formatTime(item.reservationTime) }}
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="12">
                                <div class="list-line"></div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="2.5">
                                <v-chip v-if="!item.untact"
                                    :class="{ 'immediate': item.reservationType == 'Immediate', 'scheduled': item.reservationType !== 'Immediate' }">
                                    <strong>{{ formatType(item.reservationType) }}</strong>
                                </v-chip>
                                <v-chip v-else-if="item.untact" class="untact1">
                                    <strong>비대면 진료</strong>
                                </v-chip>
                            </v-col>
                            <v-col cols="2">
                                <v-chip v-if="item.status == 'Completed' && !item.untact"
                                    :class="{ 'confirmed': item.status == 'Confirmed', 'completed': item.status !== 'Confirmed' }">
                                    <strong>{{ formatStatus(item.status) }}</strong>
                                </v-chip>
                                <v-chip v-else-if="item.untact && item.medichart == '결제완료'" class="payment">
                                    <strong>결제완료</strong>
                                </v-chip>
                                <v-chip v-else-if="item.untact && item.medichart == '진료완료'" class="payment">
                                    <strong>결제전</strong>
                                </v-chip>
                                <v-chip v-else-if="item.untact && item.medichart == '진료중'" class="beforeuntact">
                                    <strong>진료전</strong>
                                </v-chip>
                            </v-col>
                            <v-col cols="2"></v-col>
                            <v-col class="detail ml-6" cols="5">
                                <div @click="toggleDetails(index)" style="cursor: pointer;">자세히 보기
                                    <img v-if="item.showDetails" src="@/assets/right_arrow.png" style="color: #FFFFFF;">
                                    <img v-else src="@/assets/left_arrow.png" style="color: #FFFFFF;">
                                </div>
                            </v-col>
                        </v-row>
                        <div v-if="item.showDetails">
                            <v-row>
                                <v-col class="inter-bold subtitle-3 ml-1 mt-2">
                                    병원 정보
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="detail-text" style="margin-left: 6px;">
                                    {{ item.hospitalName }} <br>
                                    {{ item.doctorName }} 원장
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="inter-bold subtitle-3 ml-1 mt-2">
                                    환자 정보
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="detail-text" style="margin-left: 6px;">
                                    {{ item.childName }} <br>
                                    {{ item.ssn }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="inter-bold subtitle-3 ml-1 mt-2">
                                    진료 항목
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="detail-text" style="margin-left: 6px;">
                                    {{ item.medicalItem }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="inter-bold subtitle-3 ml-1 mt-2">
                                    진료 정보
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="detail-text" style="margin-left: 6px;">
                                    {{ item.field.replaceAll(',', ' • ') }}
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="inter-bold subtitle-3 ml-1 mt-2">
                                    원장님께 하고 싶은 말
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="detail-text" style="margin-left: 6px;">
                                    {{ item.message }}
                                </v-col>
                            </v-row>
                            <v-row v-if="item.status == 'Confirmed'" justify="center">
                                <v-chip class="cancel-btn" @click="cancelReserve(item.id)"><strong>예약
                                        취소</strong></v-chip>
                            </v-row>
                        </div>
                    </v-col>
                </div>
            </v-row>

            <v-dialog v-model="dialog" width="500">
                <v-card class="review-edit-modal">
                    <v-card-text>
                        <div class="inter-bold title">{{ dialogReserve.hospitalName }}</div>
                        <div class="rating-label inter-bold">{{ dialogReserve.doctorName }} 원장</div>
                        <!-- 평점 입력 -->
                        <div class="rating-label inter-bold">진료 만족도를 남겨주세요!</div>
                        <v-rating v-model="rating" length="5" color="#0094FF" background-color="#E7EEF0"
                            class="modal-rating" justify="center"></v-rating>
                        <!-- 텍스트 박스 -->
                        <v-textarea v-model="contents" label="진료 경험에 대해서 상세하게 알려주세요." outlined :counter="500" rows="5"
                            class="modal-textarea"></v-textarea>
                        <v-row justify="center">
                            <v-chip class="text-primary" @click="createReview"><strong>리뷰작성완료</strong></v-chip>
                        </v-row>
                        <br>
                    </v-card-text>
                </v-card>
            </v-dialog>
        </v-container>
    </v-container>
    <MyPageSideBar/>
</template>

<script>
import axios from 'axios';
import MyPageSideBar from "@/components/sidebar/MyPageSideBar.vue";
import { ref, onValue } from 'firebase/database';

export default {
    inject: ['firebaseDatabase'],
    components: { 
        MyPageSideBar 
    },
    data() {
        return {
            reserveType: '오는예약',
            reserveList: [], // 실제 예약 데이터가 여기에 있음
            filteredReserveList: [],
            sort: null,
            filter: null,
            dialogReserve: null,
            dialog: false,
            contents: null,
            rating: 0,
            untact: null,
            mediChart: null,
            waiting: null,
        }
    },
    methods: {
        updateType(type) {
            this.reserveType = type;
        },
        async updateReserveList(req) {
            if (req == '오는예약') {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/list/comes`);
                this.sort = null;
                this.reserveList = await Promise.all(response.data.map(async (item) => {
                    let wait = null;
                    if (item.reservationType == 'Immediate') {
                        try {
                            wait = await this.fetchWaitingData(item.hospitalName, item.doctorId, item.id);  // 대기
                        } catch (e) {
                            console.log(e);
                        }
                    }
                    return {
                        ...item,
                        showDetails: false,
                        waiting: wait,
                    }
                }));
            } else if (req == '지난예약') {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/list/yesterday`);
                this.filter = null;
                this.reserveList = response.data.map(item => ({
                    ...item,
                    showDetails: false,
                    review: false,
                    medichart: ""
                }));
                await Promise.all(this.reserveList.map(async (item, index) => {
                    await this.isReview(item.id, index);
                }));
                await Promise.all(this.reserveList.map(async (item, index) => {
                    if (item.untact) {
                        await this.medicalChart(item.id, index);
                        this.reserveList[this.mediChart.id].medichart = this.mediChart.status;
                    }
                }))
            }
            this.sortReserveList();
            this.updateType(req);
            this.filteredReserveList = this.reserveList;
        },
        sortReserveList() {
            this.reserveList.sort((a, b) => {
                const dateA = new Date(a.reservationDate + ' ' + a.reservationTime);
                const dateB = new Date(b.reservationDate + ' ' + b.reservationTime);

                return dateA - dateB;
            })
        },
        filterReserveList() {
            if (this.reserveType === '오는예약') {
                if (this.sort === "오늘") {
                    const today = this.dateFormat(new Date());
                    this.filteredReserveList = this.reserveList.filter(item => item.reservationDate === today);
                } else {
                    this.filteredReserveList = this.reserveList;
                }
            } else if (this.reserveType === '지난예약') {
                if (this.filter === '진료완료') {
                    this.filteredReserveList = this.reserveList.filter(item => item.status === 'Completed')
                } else if (this.filter === '오늘') {
                    const today = this.dateFormat(new Date());
                    this.filteredReserveList = this.reserveList.filter(item => item.reservationDate === today);
                } else if (this.filter === '예약취소') {
                    this.filteredReserveList = this.reserveList.filter(item => item.status === 'Cancelled')
                } else if (this.filter === '노쇼') {
                    this.filteredReserveList = this.reserveList.filter(item => item.status === 'Noshow')
                } else if (this.filter === '비대면') {
                    this.filteredReserveList = this.reserveList.filter(item => item.untact)
                } else {
                    this.filteredReserveList = this.reserveList;
                }
            }
        },
        formatDate(date) {
            const option = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                weekday: 'short'
            }

            const formattedDate = new Date(date).toLocaleDateString('ko-KR', option);
            return formattedDate
        },
        formatTime(time) {
            if (!time) return '';
            return time.substring(0, 5);
        },
        formatType(data) {
            if (data == 'Immediate') {
                return "당일접수"
            } else {
                return "예약접수"
            }
        },
        formatStatus(data) {
            if (data == 'Confirmed') {
                return "내원 전"
            } else {
                return "내원 완료"
            }
        },
        toggleDetails(index) {
            this.filteredReserveList[index].showDetails = !this.filteredReserveList[index].showDetails;
            console.log(this.filteredReserveList[index].showDetails);
        },
        async isReview(id, index) {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/reserve/${id}`);
            this.reserveList[index].review = response.data;
        },
        dateFormat(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작하므로 1을 더함
            const day = String(date.getDate()).padStart(2, '0');  // 일

            return `${year}-${month}-${day}`;
        },
        reviewData(item) {
            this.dialog = true;
            this.dialogReserve = item;
        },
        async createReview() {
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/create`, {
                rating: this.rating,
                contents: this.contents,
                reservationId: this.dialogReserve.id
            });
            window.location.reload();
        },
        async cancelReserve(id) {
            await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/cancel/${id}`);

            alert("예약 취소 완료")
        },
        async medicalChart(id, index) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/medical-chart/${id}`);
                this.mediChart = {
                    id: index,
                    status: response.data.result.medicalStatus
                }
            } catch (e) {
                console.log(e)
            }
        },
        fetchWaitingData(hospitalName, doctorId, id) {
            return new Promise((resolve, reject) => {
                const waitingRef = ref(this.firebaseDatabase, `todakpadak/${hospitalName}/${doctorId}/${id}`);
                onValue(waitingRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        this.waiting = data.turn;
                        resolve(this.waiting);  // resolve waiting 값을 반환
                    } else {
                        this.waitingData = null;
                        reject('No waiting data found');  // 에러 처리
                    }
                });
            });
        }
    },
    created() {
        this.updateReserveList(this.reserveType)
    },
    watch: {
        sort(newVal) {
            this.filterReserveList(newVal);
        },
        filter(newVal) {
            this.filterReserveList(newVal);
        }
    }
}
</script>
<style scoped>
* {
    user-select: none;
    font-family: "Inter";
    font-weight: bold;
}

.main-content {
    display: flex;
    justify-content: center;
    min-height: 100vh;
    width: 1200px;
}

.header-row {
    width: 700px;
}

.reservation-text {
    font-weight: 700;
    font-size: 30px;
    margin-left: -35px;
    color: #00499E;
}

.line-container {
    position: relative;
    width: 100%;
}

.custom-line {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 1px;
    background-color: #C5C5C5;
    width: 800px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.profile-page-gap {
    height: 40px;
}

.type-style {
    font-size: 22px;
    color: #898787;
    font-weight: bold;
    cursor: pointer;
    margin-right: 20px;
}

.select-style {
    color: #0075FF;
    cursor: pointer;
    display: inline-block;
    border-bottom: 3px solid #0066FF;
    padding-bottom: 1px;
}

.profile-section {
    display: flex;
    margin-bottom: 20px;
}

.reseve-list {
    background-color: #ECF2FE;
}

.reserve {
    text-align: left;
}

.logo-image {
    width: 50px;
    /* 원하는 고정 너비 */
    max-width: 100%;
    /* 부모 요소 너비를 넘지 않도록 설정 */
    height: auto;
    /* 높이는 비율에 맞춰 자동 조절 */
    object-fit: contain;
    /* 이미지가 고정된 크기 안에서 비율을 유지 */
    margin-right: 10px;
}

.reservelist {
    border: 1px solid #ccc;
    background-color: #ECF2FE;
    border-radius: 15px;
    width: 670px;
    padding: 20px 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    border: none;
}

.childName {
    font-size: 12px;
}

.waiting {
    margin-top: -20px;
    font-size: 20px;
    font-weight: bold;
    color: #0066FF;
}

.hospitalname {
    margin-top: -20px;
    font-size: 15px;
    font-weight: bold;
}

.doctorname {
    margin-top: -20px;
    font-size: 12px;
    color: #676767;
}

.list-line {
    border-top: 1px solid #ccc;
    margin: 10px 0;
    margin-left: -10px;
    margin-top: -15px;
    width: 580px;
}

.immediate {
    margin-top: -40px;
    background-color: #0066FF;
    color: #FFFFFF;
}

.scheduled {
    margin-top: -40px;
    background-color: #B6CFFF;
    color: #00499E;
}

.confirmed {
    margin-top: -40px;
    margin-left: -25px;
    background-color: #DBDBDB;
    color: #737373;
}

.completed {
    margin-top: -40px;
    margin-left: -25px;
    background-color: #FFE792;
    color: #996E00;
}

.untact1 {
    margin-top: -40px;
    background-color: #00B2FF;
    color: #FFFFFF !important;
}

.payment {
    margin-top: -40px;
    margin-left: -25px;
    background-color: #D0F593;
    color: #4F7F00;
}

.beforeuntact {
    margin-top: -40px;
    margin-left: -25px;
    background-color: #DBDBDB;
    color: #737373;
}

.detail {
    margin-top: -25px;
    text-align: end;
    color: #676767;
    font-size: 13px;
    letter-spacing: -1px;
}

.subtitle-3 {
    font-size: 1.2em;
    color: #00499E;
}

.detail-text {
    margin-top: -20px;
    font-size: 12px;
    color: black;

}

.cancel-btn {
    background-color: #0066FF;
    color: #FFFFFF;
    border-radius: 30px;
    padding: 5px 15px;
    /* 텍스트 주변에 여백 추가 */
    cursor: pointer;
    /* 클릭 가능하게 커서 스타일 변경 */
}

.after-completed {
    background-color: #CDFFB5;
    color: #4E7E00 !important;
}

.noshow {
    background-color: #FFA1A1;
    color: #A20000 !important;
}

.untact {
    background-color: #00B2FF;
    color: #FFFFFF !important;
}

.no-review {
    margin-top: -30px;
    background-color: #0066FF;
    color: #FFFFFF;
    cursor: pointer;
}

.review {
    margin-top: -30px;
    background-color: #DBDBDB;
    color: #888888;
}

.no-untact {
    margin-top: -30px;
    background-color: #00B2FF;
    color: #FFFFFF !important;
}

.review-edit-modal {
    width: 500px;
    background-color: #FFFFFF;
    border-radius: 30px;
}

.title {
    text-align: center;
    font-size: 25px;
    margin-top: 10px;
}

.rating-label {
    text-align: center;
    font-size: 18px;
    color: #777777;
    margin-top: 15px;
}

.modal-rating {
    display: flex;
    justify-content: center;
    margin-top: 10px;
}

.modal-textarea {
    width: 422px;
    height: 160px;
    border: 1px solid #E0E0E0;
    border-radius: 12px;
    margin: 20px auto;
}
</style>