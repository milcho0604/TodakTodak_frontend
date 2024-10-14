<template>
    <v-container style="width: 1200px">
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
                    <v-chip value="진료완료" :class="filter === '진료완료' ? 'after-completed' : ''" filter><strong>진료완료</strong></v-chip>
                    <v-chip value="예약취소" filter><strong>예약취소</strong></v-chip>
                    <v-chip value="노쇼" :class="filter === '노쇼' ? 'noshow' : ''" filter><strong>노쇼</strong></v-chip>
                </v-chip-group>
            </v-row>
            <v-row>
                <div v-for="(item, index) in filteredReserveList" class="reservelist" :key="index" cols="12" sm="6">
                    <v-col class="ml-7">
                        <v-row>
                            <v-col cols="4">
                                <v-img :src="item.profileImgUrl" alt="자녀 이미지" width="30px" height="30px"
                                    style="border-radius: 30px; display: inline-block; vertical-align: middle;"></v-img>
                                <div class="ml-3 childName" style="display: inline-block; vertical-align: middle;">
                                    {{ item.childName }}</div>
                            </v-col>
                            <v-col cols="4"></v-col>
                            <v-col cols="4" style="text-align: end;">
                                <v-chip v-if="reserveType == '지난예약' &&
                                    item.status == 'Completed'"
                                    class="after-completed"><strong>진료완료</strong></v-chip>
                                <v-chip v-if="reserveType == '지난예약' &&
                                    item.status == 'Cancelled'"><strong>예약취소</strong></v-chip>
                                <v-chip v-if="reserveType == '지난예약' &&
                                    item.status == 'Noshow'"
                                    class="noshow"><strong>노쇼</strong></v-chip>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4">
                                <div class="ml-1 waiting" v-if="item.reservationType == 'Immediate'">{{ waiting }}명 대기중
                                </div>
                                <div class="ml-1 waiting" v-if="item.reservationType == 'Scheduled'">
                                    {{ formatTime(item.reservationTime) }} 진료 예약</div>
                            </v-col>
                            <v-col cols="4"></v-col>
                            <v-col cols="4" style="text-align: end;">
                                <v-chip v-if="reserveType == '지난예약' &&
                                    item.status == 'Completed'" 
                                    :class="item.review ? 'review' : 'no-review'"
                                    @click="item.review ? this.$router.push('/') : this.$router.push('/review')"><img src="@/assets/pencil_img.png" /><strong>리뷰쓰기</strong>
                                </v-chip>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col cols="4">
                                <div class="ml-1 hospitalname">{{ item.hospitalName }}</div>
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
                            <v-col cols="2">
                                <div
                                    :class="{ 'immediate': item.reservationType == 'Immediate', 'scheduled': item.reservationType !== 'Immediate' }">
                                    {{ formatType(item.reservationType) }}
                                </div>
                            </v-col>
                            <v-col cols="2">
                                <div
                                    v-if="item.status == 'Completed'"
                                    :class="{ 'confirmed': item.status == 'Confirmed', 'completed': item.status !== 'Confirmed' }">
                                    {{ formatStatus(item.status) }}
                                </div>
                            </v-col>
                            <v-col class="detail ml-6" cols="7">
                                <div @click="toggleDetails(index)" style="cursor: pointer;">자세히 보기
                                    <img v-if="!showDetails" src="@/assets/right_arrow.png" style="color: #FFFFFF;">
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
                            <v-row style="width:130px;">
                                <v-btn class="cancel-btn">
                                    예약 취소
                                </v-btn>
                            </v-row>
                        </div>
                    </v-col>
                </div>
            </v-row>
        </v-container>

    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            reserveType: '오는예약',
            reserveList: [], // 실제 예약 데이터가 여기에 있음
            filteredReserveList: [],
            waiting: 23,
            sort: null,
            filter: null,
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
                this.reserveList = response.data.map(item => ({
                    ...item,
                    showDetails: false,
                }));
            } else if (req == '지난예약') {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/list/yesterday`);
                this.reserveList = response.data.map(item => ({
                    ...item,
                    showDetails: false,
                    review: false
                }));
                await Promise.all(this.reserveList.map(async (item, index) => {
                    await this.isReview(item.id, index);
                }));
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
                }else if(this.filter === '오늘'){
                    const today = this.dateFormat(new Date());
                    this.filteredReserveList = this.reserveList.filter(item => item.reservationDate === today);
                } else if (this.filter === '예약취소') {
                    this.filteredReserveList = this.reserveList.filter(item => item.status === 'Cancelled')
                } else if (this.filter === '노쇼') {
                    this.filteredReserveList = this.reserveList.filter(item => item.status === 'Noshow')
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
            this.reserveList[index].showDetails = !this.reserveList[index].showDetails;
        },
        async isReview(id, index) {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/review/reserve/${id}`);
            this.reserveList[index].review = response.data;
            console.log(this.reserveList);
        },
        dateFormat(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');  // 월은 0부터 시작하므로 1을 더함
            const day = String(date.getDate()).padStart(2, '0');  // 일

            return `${year}-${month}-${day}`;
        }
    },
    mounted() {
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
    margin-top: -20px;
    margin-left: 5px;
    font-size: 13px;
    padding: 5px;
    background-color: #0066FF;
    text-align: center;
    color: #FFFFFF;
    border-radius: 15px;
}

.scheduled {
    margin-top: -20px;
    margin-left: 5px;
    font-size: 13px;
    padding: 5px;
    background-color: #B6CFFF;
    text-align: center;
    color: #00499E;
    border-radius: 15px;
}

.confirmed {
    margin-top: -20px;
    margin-left: -10px;
    padding: 5px;
    font-size: 13px;
    background-color: #DBDBDB;
    text-align: center;
    color: #737373;
    border-radius: 15px;
}

.completed {
    margin-top: -20px;
    margin-left: -10px;
    font-size: 13px;
    padding: 5px;
    background-color: #FFE792;
    text-align: center;
    color: #996E00;
    border-radius: 15px;
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
</style>