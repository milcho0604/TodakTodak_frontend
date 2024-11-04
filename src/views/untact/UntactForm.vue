<template>
    <v-container style="width: 700px;">
        <v-row class="mt-6">
            <v-col class="text-center" cols="2">
                <v-avatar size="60">
                    <v-img
                        :src="doctor.profileImg ? doctor.profileImg : 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png'" />
                </v-avatar>
            </v-col>
            <v-col class="text-center" cols="7">
                <v-row class="inter-bold big-font">{{ doctor.doctorName }} 의사</v-row>
                <v-row class="inter-bold small-font">{{ doctor.hospitalName }}</v-row>
                <v-row class="inter-normal small-font">
                    <v-icon class="star-icon">mdi-star</v-icon>
                    {{ doctor.reviewPoint }} ({{ doctor.reviewCount }})
                </v-row>
            </v-col>
        </v-row>
        <v-row class="mt-4">
            <v-col cols="3">
                <div class="inter-bold dark-blue subtitle">진료대상선택</div>
            </v-col>
            <v-col>
                <div class="round inter-normal dark-blue" @click="$router.push('/member/child')">자녀추가</div>
            </v-col>
        </v-row>
        <v-row>
            <div class="small-font inter-normal">실제 진료받을 자녀를 선택해주세요</div>
        </v-row>
        <v-row>
            <!-- childOptions 배열에 있는 아이들을 반복 렌더링 -->
            <v-col v-for="(child, index) in childOptions" :key="index">
                <div class="child" @click="addChild(child)" :class="{ 'selected-child': this.child == child }">
                    <v-row justify="center">
                        <v-col class="text-center" cols="3">
                            <v-avatar size="50">
                                <v-img :src="child.imageUrl" alt="doctor image" />
                            </v-avatar>
                        </v-col>
                        <v-col class="text-center" cols="5" style="margin-top: 11px;">
                            <v-row class="inter-bold big-font">{{ child.name }}</v-row>
                            <v-row class="inter-normal small-font">{{ maskSSN(child.ssn) }}</v-row>
                        </v-col>
                        <v-col cols="4">
                            <div class="mini-button" v-if="this.child == child" style="margin-top: 5px;">선택</div>
                        </v-col>
                    </v-row>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <div class="inter-bold dark-blue subtitle mt-4">증상선택</div>
        </v-row>
        <v-row>
            <div class="mt-3">
                <v-chip-group v-if="symptoms.length > 0">
                    <v-chip v-for="(symptom, index) in symptoms" :key="index" class="mr-2">
                        {{ symptom }}
                    </v-chip>
                </v-chip-group>
            </div>
        </v-row>
        <v-row>
            <div class="mini-button inter-bold mt-3" @click="symptomsModal = true">증상 선택하기</div>
        </v-row>
        <v-row>
            <div class="inter-bold dark-blue subtitle mt-6">의사선생님께 하고싶은 말</div>
        </v-row>
        <v-row><textarea class="text" v-model="comment"></textarea></v-row>
        <v-row class="mt-6">
            <div class="button inter-bold" @click="confirmModal = true">비대면 진료 신청</div>
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
                    <div class="mini-button inter-bold" @click="symptomsModal = false" style="margin: auto;">증상 선택 완료</div>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="confirmModal" style="width: 700px">
            <v-card>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <div class="modal-title inter-bold mt-4">비대면 진료 접수를 완료하시겠습니까?</div>
                        </v-row>
                        <v-row>
                            <div class="modal-container mt-3">
                                <v-row>
                                    <div class="modal-subtitle inter-bold">의사정보</div>
                                </v-row>
                                <v-row class="inter-light mt-3">
                                    {{ doctor.doctorName }}
                                </v-row>
                                <v-row class="inter-light">
                                    {{ doctor.hospitalName }}
                                </v-row>
                                <v-row>
                                    <div class="modal-subtitle inter-bold mt-3">환자정보</div>
                                </v-row>
                                <v-row v-if="child" class="inter-light mt-3">
                                    {{ child.name }}
                                </v-row>
                                <v-row v-if="child" class="inter-light">
                                    {{ maskSSN(child.ssn) }}
                                </v-row>
                                <v-row>
                                    <div class="modal-subtitle inter-bold mt-3">진료정보</div>
                                </v-row>
                                <v-row class="inter-light mt-3">
                                    <v-chip-group v-if="symptoms.length > 0">
                                        <v-chip v-for="(symptom, index) in symptoms" :key="index" class="mr-2">
                                            {{ symptom }}
                                        </v-chip>
                                    </v-chip-group>
                                </v-row>
                                <v-row class="inter-light">
                                    <div class="modal-subtitle inter-bold mt-3">선생님께 하고싶은 말</div>
                                </v-row>
                                <v-row class="inter-light mt-3">
                                    {{ comment }}
                                </v-row>
                            </div>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions style="display: flex; justify-content: center; align-items: center;">
                    <div class="mini-button-grey inter-bold" @click="confirmModal = false" style="margin-right: 10px;">
                        취소</div>

                    <div style="border-left: 1px solid #ccc; height: 30px; margin: 0 20px;"></div>

                    <div class="mini-button inter-bold" @click="createReservation">비대면 진료 신청</div>
                </v-card-actions>
                <br>
            </v-card>
        </v-dialog>
        <v-dialog v-model="successReserveModal" max-width="600px">
            <v-card>
                <v-card-title class="submodal mt-6 inter-bold text-center">
                    비대면 진료 접수가 성공적으로 완료되었습니다!
                </v-card-title>
                <v-container style="text-align: center;" class="mt-3">
                    <v-row>
                        <v-col class="waiting">
                            {{ totalWaiting -1 }}명 대기중
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="waiting-text" style="margin-top: -20px;">
                            현재 내 차례는 <span style="color: #0066FF;">{{ totalWaiting }}</span>번 째 입니다.
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
</template>
<script>
import axios from 'axios';
import { ref, onValue } from 'firebase/database';
export default {
    inject: ['firebaseDatabase'],
    props: ['doctorEmail'],
    data() {
        return {
            doctor: {
                imageUrl: "https://todak-file.s3.amazonaws.com/9227db48-1e3a-4559-9ff9-fad2db9cd68b_스크린샷 2024-10-08 오후 2.08.28.png",
                name: "김천재",
                hospital: "파닥병원1",
                rating: "4.5"
            },
            child: null,
            // childOptions 배열에 자녀 정보 저장
            childOptions: [
                {
                    name: "이한아",
                    ssn: "181227-4321121",
                    image: "https://todak-file.s3.amazonaws.com/d278dfb1-9275-41ad-8b86-f7a0a904892b_IMG_8641.JPG"
                },

                {
                    name: "김준수",
                    ssn: "190315-4321132",
                    image: "https://todak-file.s3.amazonaws.com/d278dfb1-9275-41ad-8b86-f7a0a904892b_IMG_8641.JPG"
                },

            ],
            symptoms: [],
            // symptomsOptions: ["콧물", "기침", "인후통", "호흡곤란", "가래",
            //     "복통", "구토", "설사", "식욕부진", "변비", "발진", "충혈/눈곱",
            //     "피부창백", "두드러기", "잇몸부음", "무기력", "두통", "오한", "기절", "수면문제"
            // ],
            symptomsOptions: {
                respiratory: ['콧물', '기침', '인후통', '호흡곤란', '가래'],
                digestive: ['복통', '구토', '설사', '식욕부진', '변비'],
                skinAllergy: ['발진', '충혈/눈곱', '피부창백', '두드러기', '잇몸 부음'],
                general: ['무기력', '두통', '오한', '기절', '수면문제']
            },
            comment: null,
            symptomsModal: false,
            confirmModal: false,
            successReserveModal: false,
            totalWaiting: 1,
            waitingData: null,
        };
    },
    created() {
        this.fetchDoctor();
        this.fetchChild();
    },
    methods: {
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
        addChild(child) {
            this.child = child;
            console.log(child);
        },
        async fetchDoctor() {
            console.log("fetchDoctor")
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctor/${this.doctorEmail}`);
            this.doctor = response.data.result;
            this.fetchWaitingData(this.doctor);
        },
        async fetchChild() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/`);
            this.childOptions = response.data.result;
        },
        async createReservation() {
            console.log("예약할게");
            console.log(this.child);
            const reservation = {
                childId: this.child.id,
                hospitalId: this.doctor.hospitalId,
                doctorEmail: this.doctorEmail,
                reservationType: "Immediate",
                untact: true,
                status: "Confirmed",
                medicalItem: "일반진료",
                field: this.symptoms.join(','),
                message: this.comment
            }
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/immediate`, reservation);
            this.confirmModal = false;
            this.successReserveModal = true;
        },
        fetchWaitingData(doctor) {
            console.log("fetchWaitingData", doctor);
            const waitingRef = ref(this.firebaseDatabase, `todakpadak/${doctor.hospitalName}/${doctor.doctorId}`);
            onValue(waitingRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    console.log("data", data);
                    this.waitingData = { ...data }; // 데이터를 갱신
                    console.log("Waiting data updated:", this.waitingData); // 데이터 변경 시 콘솔에 로그
                    this.totalWaiting = Object.keys(this.waitingData).length;
                    console.log(this.totalWaiting);
                } else {
                    console.log("data", "없어");
                    this.waitingData = null; // 데이터가 없으면 null로 설정
                }
            });
        },
        maskSSN(ssn) {
            if (!ssn || ssn.length < 14) return ssn; // 잘못된 형식 처리
            return ssn.slice(0, 8) + "*******"; // 앞 8자리만 남기고 뒤는 마스킹
        }
    },
}
</script>
<style scoped>
.big-font {
    font-size: 15px;
}

.small-font {
    font-size: 12px;
    color: #888888;
}

.child {
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 290px;
    padding: 16px 10px;
    cursor: pointer;
}

.dark-blue {
    color: #00499E;
}

.subtitle {
    font-size: 21px;
}

.subtitle-2 {
    font-size: 1.2em;
    margin-bottom: -15px;
    margin-top: -20px;
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

.button {
    background-color: #C2D7FF;
    border-radius: 10px;
    padding: 10px 20px;
    margin-right: 10px;
    font-size: 17px;
    color: #010565;
    cursor: pointer;
}

.round {
    background-color: #C2D7FF;
    border-radius: 40px;
    padding: 3px 15px;
    font-size: 14px;
    width: 80px;
}

.text {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 10px 15px;
    height: 180px;
    width: 700px;
    margin-top: 10px;
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

.selected-child {
    background-color: #c2d7ff93;
}

.mini-button-grey {
    background-color: #CACACA;
    color: #717171;
    border-radius: 10px;
    padding: 5px 10px;
    margin-right: 10px;
    font-size: 14px;
    text-align: center;
    width: 110px;
}

.modal-title {
    font-size: 25px;
    margin: auto;
}

.modal-subtitle {
    font-size: 19px;
    color: #00499E;
}

.modal-container {
    background-color: #E5EEFF;
    border-radius: 10px;
    padding: 30px 30px;
    width: 90%;
    margin: auto;
}

.star-icon {
    margin-top: 2px;
    font-size: 14px;
}

.submodal {
    font-size: 25px;
    font-weight: bold;
}
.waiting {
    color: #0029FF;
    font-size: 28px;
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
.symptom-box {
    cursor: pointer;
    margin-bottom: 10px;
    width: 100px;
    text-align: center;
}
</style>