<template>
    <v-container style="width: 1200px;">
        <v-container style="width: 700px;">
            <v-spacer :style="{ height: '50px' }"></v-spacer>
            <v-row class="header-row">
                <h2>{{ this.hospitalName }}</h2>
                <v-chip class="schedule-chip ml-3" variant="flat" size="x-large" label>바로 대기</v-chip>
            </v-row>
            <v-row class="header-row">
                <v-col class="big-font">
                    <div class="no-wrap">
                        진료대상 선택
                    </div>
                    <div class="custom-text2">
                        자녀 추가
                    </div>
                </v-col>
            </v-row>
            <v-row>
                <div class="small-font inter-normal">실제 진료받을 자녀를 선택해주세요</div>
            </v-row>
            <v-row>
                <!-- childOptions 배열에 있는 아이들을 반복 렌더링 -->
                <v-col v-for="(child, index) in childOptions" :key="index">
                    <div class="child" @click="reservationValidation(child)"
                        :class="{ 'selected-child': this.child == child }">
                        <v-row justify="center">
                            <v-col class="text-center" cols="3">
                                <img :src="child.imageUrl" alt="child image"
                                    style="width: 50px; height: 50px; border-radius:30px;">
                            </v-col>
                            <v-col class="text-center" cols="5" style="margin-top: 11px;">
                                <v-row class="inter-bold child-name">{{ child.name }}</v-row>
                                <v-row class="inter-normal child-ssn">{{ maskSSN(child.ssn) }}</v-row>
                            </v-col>
                            <v-col cols="4">
                                <div class="mini-button inline" v-if="this.child == child" style="margin-top: 5px;">선택됨
                                </div>
                            </v-col>
                        </v-row>
                    </div>
                </v-col>
            </v-row>
            <v-row class="header-row">
                <v-col class="big-font">
                    의사 선택
                </v-col>
            </v-row>
            <v-row justify="center">
                <div v-for="(doctor, index) in doctorList" :key="index" class="doctor" @click="addDoctor(doctor)"
                    :class="{ 'selected-doctor': this.doctor == doctor }">
                    <v-row class="inter-bold inline" align="center">
                        <div class="d-flex align-center mx-3">
                            <img :src="doctor.profileImgUrl ? doctor.profileImgUrl : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png'"
                                alt="doctor image" class="mx-2"
                                style="width: 65px; height: 65px; border-radius: 30px;" />
                            <v-text class="ml-2">{{ doctor.name }} 원장</v-text>
                            <v-chip class="mx-3" style="font-weight:bold; color:white; background-color:#0066FF"
                                variant="flat">대기 {{ doctor.waiting }}명</v-chip>
                            <div class="d-flex justify-end" style="flex-grow: 1;">
                                <v-chip class="mini-button" v-if="this.doctor == doctor" variant="flat"
                                    label>선택됨</v-chip>
                            </div>
                        </div>
                    </v-row>
                </div>
            </v-row>
            <v-row class="header-row">
                <v-col class="big-font">
                    진료 항목
                </v-col>
            </v-row>
            <v-row class="mt-1 ml-1">
                <v-col cols="2">
                    <v-row class="inter-bold before-selected inline" :class="{ 'selected-medi': mediItem == '일반진료' }"
                        @click="addmediItem('일반진료')"> 일반진료 </v-row>
                </v-col>
                <v-col cols="2">
                    <v-row class="inter-bold before-selected inline" :class="{ 'selected-medi': mediItem == '예방접종' }"
                        @click="addmediItem('예방접종')">예방접종 </v-row>
                </v-col>
            </v-row>
            <v-row class="header-row">
                <v-col class="big-font">
                    증상 선택
                </v-col>
            </v-row>
            <v-row>
                <div class="mt-n5 ml-5">
                    <v-chip-group v-if="symptoms.length > 0">
                        <v-chip v-for="(symptom, index) in symptoms" :key="index" class="mr-2" size="large"
                            variant="flat" style="color:#00499E; background-color:#ECF2FD; font-weight:bold;">
                            {{ symptom }}
                        </v-chip>
                    </v-chip-group>
                </div>
            </v-row>
            <v-row class="ml-1">
                <div class="mini-button inter-bold mt-3" @click="symptomsModal = true">증상선택하기</div>
            </v-row>
            <v-row>
                <div class="inter-bold dark-blue subtitle mt-6 ml-5">의사선생님께 하고싶은 말</div>
            </v-row>
            <v-row><textarea class="text ml-4" v-model="comment"></textarea></v-row>
            <v-row class="mt-6 ml-1">
                <div class="button inter-bold" @click="reserved()">오늘예약 신청</div>
            </v-row>

            <v-dialog v-model="symptomsModal" max-width="700px">
                <v-card>
                    <v-card-title class="subtitle dark-blue inter-bold text-center">
                        증상 선택
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <!-- 호흡기 -->
                            <v-row justify="center" class="mb-2"> <!-- 위 아래 여백 줄임 -->
                                <v-col cols="11">
                                    <div class="inter-bold subtitle-2 dark-blue">호흡기</div>
                                </v-col>
                                <v-col cols="auto" v-for="(symptom, index) in symptomsOptions.respiratory"
                                    :key="'respiratory-' + index">
                                    <div class="inter-bold symptom-box"
                                        :class="symptoms.includes(symptom) ? 'selected-symptom' : 'symptom'"
                                        @click="addSymptom(symptom)">
                                        {{ symptom }}
                                    </div>
                                </v-col>
                            </v-row>

                            <!-- 소화기 -->
                            <v-row justify="center" class="mb-2"> <!-- 위 아래 여백 줄임 -->
                                <v-col cols="11">
                                    <div class="inter-bold subtitle-2 dark-blue">소화기</div>
                                </v-col>
                                <v-col cols="auto" v-for="(symptom, index) in symptomsOptions.digestive"
                                    :key="'digestive-' + index">
                                    <div class="inter-bold symptom-box"
                                        :class="symptoms.includes(symptom) ? 'selected-symptom' : 'symptom'"
                                        @click="addSymptom(symptom)">
                                        {{ symptom }}
                                    </div>
                                </v-col>
                            </v-row>

                            <!-- 피부 및 알레르기 -->
                            <v-row justify="center" class="mb-2"> <!-- 위 아래 여백 줄임 -->
                                <v-col cols="11">
                                    <div class="inter-bold subtitle-2 dark-blue">피부 및 알레르기</div>
                                </v-col>
                                <v-col cols="auto" v-for="(symptom, index) in symptomsOptions.skinAllergy"
                                    :key="'skinAllergy-' + index">
                                    <div class="inter-bold symptom-box"
                                        :class="symptoms.includes(symptom) ? 'selected-symptom' : 'symptom'"
                                        @click="addSymptom(symptom)">
                                        {{ symptom }}
                                    </div>
                                </v-col>
                            </v-row>

                            <!-- 전신 / 기타 -->
                            <v-row justify="center" class="mb-2"> <!-- 위 아래 여백 줄임 -->
                                <v-col cols="11">
                                    <div class="inter-bold subtitle-2 dark-blue">전신 / 기타</div>
                                </v-col>
                                <v-col cols="auto" v-for="(symptom, index) in symptomsOptions.general"
                                    :key="'general-' + index">
                                    <div class="inter-bold symptom-box"
                                        :class="symptoms.includes(symptom) ? 'selected-symptom' : 'symptom'"
                                        @click="addSymptom(symptom)">
                                        {{ symptom }}
                                    </div>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <div class="mini-button" @click="symptomsModal = false" style="margin: auto;">증상 선택 완료</div>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="reservedModal" max-width="500px">
                <v-card>
                    <v-card-title class="submodal mt-6 inter-bold text-center">
                        바로대기 완료하시겠습니까?
                    </v-card-title>
                    <v-card-text>
                        <v-container class="submodaltext">
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    병원 정보
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ hostpitalName }} <br>
                                    {{ doctor.name }} 원장
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    환자 정보
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ child.name }} <br>
                                    {{ maskSSN(child.ssn) }}
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    진료 항목
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ mediItem }}
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    진료 정보
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ symptoms.join("•") }}
                                </v-col>
                            </v-row>
                            <v-row justify="center">
                                <v-col class="inter-bold subtitle-3">
                                    원장님께 하고 싶은 말
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col style="margin-top: -20px">
                                    {{ comment }}
                                </v-col>
                            </v-row>
                        </v-container>
                        <v-container style="text-align: center;">
                            <v-row justify="center" align="center">
                                <v-col cols="4" class="modal-selected" @click="reservedModal = false">
                                    취소
                                </v-col>
                                <v-col cols="4" class="modal-reserved" @click="reservedApply">
                                    바로대기 신청
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-dialog>
            <v-dialog v-model="successReserveModal" max-width="600px">
                <v-card>
                    <v-card-title v-if="isValidation" class="submodal mt-6 inter-bold text-center">
                        바로대기가 성공적으로 완료되었습니다!
                    </v-card-title>
                    <v-card-title v-else class="submodal mt-6 inter-bold text-center">
                        해당 자녀의 바로대기 접수내역이 이미 존재합니다.
                    </v-card-title>
                    <v-container style="text-align: center;" class="mt-3">
                        <v-row v-if="isValidation">
                            <v-col class="waiting">
                                {{ totalWaiting }}명 대기중
                            </v-col>
                        </v-row>
                        <v-row v-if="isValidation">
                            <v-col class="waiting-text" style="margin-top: -20px;">
                                현재 내 차례는 <span style="color: #0066FF;">{{ myWaiting }}</span>번 째 입니다.
                            </v-col>
                        </v-row>

                        <v-row justify="center" align="center" class="mt-6">
                            <v-col cols="4" class="modal-success-home" @click="this.$router.push('/')">
                                홈으로 가기
                            </v-col>
                            <v-col cols="4" class="modal-success-detail"
                                @click="this.$router.push('/member/mypage/reservation')">
                                예약상세내역 확인
                            </v-col>
                        </v-row>
                        <br><br>
                    </v-container>
                </v-card>
            </v-dialog>
        </v-container>
    </v-container>
</template>

<script>
import axios from 'axios';
import { ref, onValue } from 'firebase/database';
import { useRoute } from 'vue-router';

export default {
    inject: ['firebaseDatabase'],
    data() {
        return {
            medicalType: "Immediate",
            hospitalName: "",
            hospitalId: '',
            child: null,
            doctor: null,
            childOptions: [],
            doctorList: [],
            symptoms: [],
            symptomsOptions: {
                respiratory: ['콧물', '기침', '인후통', '호흡곤란', '가래'],
                digestive: ['복통', '구토', '설사', '식욕부진', '변비'],
                skinAllergy: ['발진', '충혈/눈곱', '피부창백', '두드러기', '잇몸 부음'],
                general: ['무기력', '두통', '오한', '기절', '수면문제']
            },
            mediItem: null,
            symptomsModal: false,
            comment: null,
            mediData: [],
            reservedModal: false,
            successReserveModal: false,
            waitingData: null,
            totalWaiting: null,
            myWaiting: null,
            isValidation: null,
        }
    },
    methods: {
        addDoctor(doctor) {
            this.doctor = doctor;
        },
        addmediItem(mediItem) {
            this.mediItem = mediItem;
        },
        addSymptom(symptom) {
            const index = this.symptoms.indexOf(symptom);
            if (index === -1) {
                // 증상이 배열에 없으면 추가
                this.symptoms.push(symptom);
            } else {
                // 이미 있으면 배열에서 제거
                this.symptoms.splice(index, 1);
            }
        },
        async fetchDoctorList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctorList/${this.hospitalId}`);
                console.log(response);

                const today = new Date();
                const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long'});
                this.doctorList = response.data.result.content
                    .filter(item => {
                        return item.operatingHours.some(hour => hour.dayOfWeek === dayOfWeek)
                    })
                    .map(item => {
                    const waitingEntry = this.waitingData ? this.waitingData[item.id] : null;
                    let waitingTurn = 0;
                    if (waitingEntry) {
                        const entryValues = Object.values(waitingEntry);
                        if (entryValues.length > 0) {
                            waitingTurn = entryValues.length;
                        }
                    }
                    return {
                        ...item,
                        waiting: waitingTurn,
                    }
                });
                console.log(this.doctorList)
            } catch (e) {
                console.log(e);
            }
        },
        async fetchChildList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/`);
                this.childOptions = response.data.result;
            } catch (e) {
                console.log(e);
            }
        },
        async reservedApply() {
            try {
                const req = {
                    childId: this.child.id,
                    hospitalId: this.hospitalId,
                    doctorName: this.doctor.name,
                    doctorEmail: this.doctor.doctorEmail,
                    reservationType: this.medicalType,
                    untact: "false",
                    medicalItem: this.mediItem,
                    status: "Confirmed",
                    field: this.symptoms.toString(),
                    message: this.comment
                }

                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/immediate`,
                    req);

                const doctorId = this.doctorList.find(item => item.doctorEmail === response.data.result.doctorEmail).id;


                const waitingEntry = this.waitingData ? this.waitingData[doctorId] : null;
                const entryValues = waitingEntry ? Object.values(waitingEntry) : [];

                this.reservedModal = false;
                this.successReserveModal = true;
                this.totalWaiting = entryValues.length;
                this.myWaiting = this.totalWaiting + 1;
                this.successReserveModal = true;
            } catch (e) {
                alert(e.message)
            }
        },
        fetchWaitingData() {
            const waitingRef = ref(this.firebaseDatabase, `todakpadak/${this.hospitalName}`);
            onValue(waitingRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    this.waitingData = { ...data }; // 데이터를 갱신
                    console.log("Waiting data updated:", this.waitingData); // 데이터 변경 시 콘솔에 로그
                    this.fetchDoctorList();
                } else {
                    this.waitingData = null; // 데이터가 없으면 null로 설정
                    this.fetchDoctorList();
                }
            });
        },
        reserved() {
            try {
                if (!this.isValidation) {
                    alert("이미 예약이 존재합니다.");
                    this.successReserveModal = true;
                }
                else if (!this.child) {
                    throw new Error("자녀를 선택해주세요.")
                }
                else if (!this.doctor) {
                    throw new Error("의사를 선택해주세요.")
                }
                else if (!this.mediItem) {
                    throw new Error("진료항목을 선택해주세요.")
                }
                else {
                    this.reservedModal = true;
                }
            } catch (e) {
                alert(e.message)
            }
        },
        async reservationValidation(child) {
            try {
                console.log(child);
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/isValid`,{
                    params: {
                        hospitalId: this.hospitalId,
                        childId: child.id
                    }
                })
                this.isValidation = response.data;
                if (!this.isValidation) {
                    this.successReserveModal = true;
                }else{
                    this.child = child;
                }
            }catch(e){
                console.log(e.message);
            }
        },
        maskSSN(ssn) {
            if (!ssn) return ssn; // 잘못된 형식 처리
            return ssn.slice(0, 8) + "*******"; // 앞 8자리만 남기고 뒤는 마스킹
        }
    },
    async created() {
        this.fetchChildList();
        const route = useRoute();
        this.hospitalId = route.params.hospitalId;
        this.hospitalName = this.$route.query.hospitalName;
        this.fetchWaitingData();
        this.fetchDoctorList();
    },
    computed: {
    }
}
</script>

<style scoped>
* {
    font-weight: bold;
    user-select: none;
}

.title {
    margin-top: 50px;
    font-weight: bold;
    font-size: 1.7rem;
}

.big-font {
    text-align: left;
    color: #00499E;
    font-weight: bold;
    font-size: 21px;
    letter-spacing: -1px;
}

.small-font {
    text-align: left;
    margin-top: -20px;
    font-size: 13px;
    margin-left: 25px;
    color: #898787;
}

.custom-text {
    background-color: #ECF2FD;
    color: #00499E;
    font-size: 1.2rem;
    border-radius: 10px;
    padding: 2px 20px;
    display: inline-block;
    font-weight: bold;
}

.custom-text2 {
    background-color: #C2D7FF;
    color: #00499E;
    border-radius: 30px;
    font-size: 17px;
    padding: 2px 20px;
    display: inline-block;
    font-weight: bold;
    margin-left: 15px;
}

.custom-text3 {
    background-color: #0066FF;
    color: #FFFFFF;
    border-radius: 30px;
    font-size: 15px;
    padding: 2px 15px;
}

.mini-button {
    background-color: #0066FF;
    color: white;
    border-radius: 10px;
    padding: 10px 10px;
    margin-right: 10px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
}

.no-wrap {
    display: inline-block;
}

.header-row {
    width: 700px;
    margin: 0 auto;
}

.child {
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 320px;
    padding: 12px;
    cursor: pointer;
}

.before-selected {
    margin-top: -20px;
    background-color: #E7E7E7;
    padding: 6px 20px;
    border-radius: 15px;
    font-size: 15px;
    letter-spacing: -1px;
    cursor: pointer;
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

.modal-reserved {
    margin-top: 5px;
    background-color: #0058FF;
    border-radius: 10px;
    padding: 5px;
    margin-left: 5px;
    color: #FFFFFF;
    cursor: pointer;
}

.child-name {
    font-size: 15px;
}

.child-ssn {
    font-size: 12px;
    color: #898787;
}

.selected-child {
    background-color: #c2d7ff93;
    color: black;
}

.selected-doctor {
    background-color: #C2D7FF !important;
    color: black;
    height: 100px;
}

.selected-medi {
    background-color: #C2D7FF;
    color: #00499E;
}

.doctor {
    border: 1px solid #ccc;
    background-color: #F3F3F3;
    border-radius: 15px;
    width: 670px;
    height: 100px;
    padding: 20px 10px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.more {
    margin-right: 20px;
}

.inline {
    display: inline-block;
}

.subtitle {
    font-size: 21px;
}

.dark-blue {
    color: #00499E;
}

.selected-symptom {
    background-color: #C2D7FF;
    border-radius: 40px;
    padding: 10px;
    font-size: 17px;
    color: #00499E;
    text-align: center;
}

.symptom {
    background-color: #cccccc;
    border-radius: 40px;
    padding: 10px;
    font-size: 17px;
    color: #676767;
    text-align: center;
}

.button {
    background-color: #C2D7FF;
    border-radius: 10px;
    padding: 10px 20px;
    margin-right: 10px;
    font-size: 17px;
    color: #010565;
    cursor: pointer;
}

.text {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px 15px;
    height: 180px;
    width: 700px;
    margin-top: 10px;
}

.symptom-box {
    cursor: pointer;
    margin-bottom: 10px;
    width: 100px;
    text-align: center;
}

.subtitle-2 {
    font-size: 1.2em;
    margin-bottom: -15px;
    margin-top: -20px;
}

.subtitle-3 {
    font-size: 1.2em;
    color: #0058FF;
}

.submodal {
    font-size: 25px;
    font-weight: bold;
}

.submodaltext {
    background-color: #E5EEFF;
    width: 400px;
    margin: 0 auto;
}

.modal-success-home {
    margin-top: 5px;
    background-color: #E0E0E0;
    color: #5F5F5F;
    border-radius: 5px;
    padding: 5px;
    margin-right: 5px;
    cursor: pointer;
    font-weight: bold;
}

.modal-success-detail {
    margin-top: 5px;
    background-color: #C2D7FF;
    border-radius: 5px;
    padding: 5px;
    margin-left: 5px;
    color: #00499E;
    cursor: pointer;
    font-weight: bold;
}

.waiting {
    color: #0029FF;
    font-size: 28px;
    ;
    text-align: center;
    font-weight: bold;
    margin-top: -25px;
}

.waiting-text {
    color: #888888;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
}

.hospital {
    font-weight: bold !important;
}

.schedule-chip {
    font-weight: bold;
    font-size: 25px;
    color: #00499E;
    background-color: #ECF2FD;
    border-radius: 10px;
}
</style>