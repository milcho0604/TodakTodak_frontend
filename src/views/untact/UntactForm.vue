<template>
    <v-container style="width: 700px;">
        <v-row class="mt-6">
            <v-col class="text-center" cols="2">
                <v-avatar size="60">
                    <v-img :src="doctor.imageUrl" alt="doctor image" />
                  </v-avatar>
            </v-col>
            <v-col class="text-center" cols="7">
                <v-row class="inter-bold big-font">{{doctor.doctorName}} 의사</v-row>
                <v-row class="inter-bold small-font">{{doctor.hospitalName}}</v-row>
                <v-row class="inter-normal small-font">
                    <v-icon class="star-icon">mdi-star</v-icon>
                            {{ doctor.reviewPoint }} ({{doctor.reviewCount}})
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
                <div class="child" @click="addChild(child)" :class="{ 'selected-child' : this.child==child}">
                    <v-row justify="center">
                        <v-col class="text-center" cols="3">
                            <v-avatar size="50">
                                <v-img :src="child.imageUrl" alt="doctor image" />
                              </v-avatar>
                        </v-col>
                        <v-col class="text-center" cols="5" style="margin-top: 11px;">
                            <v-row class="inter-bold big-font">{{ child.name }}</v-row>
                            <v-row class="inter-normal small-font">{{ child.ssn }}</v-row>
                        </v-col>
                        <v-col cols="4"><div class="mini-button" v-if="this.child==child" style="margin-top: 5px;">선택</div></v-col>
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
            <div class="button inter-bold" @click="confirmModal=true">비대면 진료 신청</div>
        </v-row>

        <v-dialog v-model="symptomsModal" style="width: 70%">
            <v-card>
                <v-card-title class="subtitle dark-blue inter-bold" style="margin:auto;">증상선택</v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col cols="3" v-for="(symptom, index) in symptomsOptions" :key="index">
                                <div class="inter-bold" block
                                    :class="symptoms.includes(symptom) ? 'selected-symptom' : 'symptom'"
                                    @click="addSymptom(symptom)" style="cursor: pointer; margin-bottom: 10px;">
                                    {{ symptom }}
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <div class="mini-button" @click="symptomsModal = false" style="margin: auto;">증상선택완료</div>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="confirmModal" style="width: 70%">
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
                                    {{ child.ssn }}
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
                    <div class="mini-button-grey inter-bold" @click="confirmModal = false" style="margin-right: 10px;">취소</div>
                    
                    <div style="border-left: 1px solid #ccc; height: 30px; margin: 0 20px;"></div>
                    
                    <div class="mini-button inter-bold" @click="createReservation">비대면 진료 신청</div>
                </v-card-actions>
                <br>
            </v-card>
        </v-dialog>
    </v-container>
</template>
<script>
import axios from 'axios';
export default {
    props: ['doctorEmail'],
    data() {
        return {
            doctor: {
                imageUrl: "https://todak-file.s3.amazonaws.com/9227db48-1e3a-4559-9ff9-fad2db9cd68b_스크린샷 2024-10-08 오후 2.08.28.png",
                name: "김천재",
                hospital:"아이조은성모병원",
                rating:"4.5"
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
            symptomsOptions: ["콧물", "기침", "인후통", "호흡곤란", "가래",
                "복통", "구토", "설사", "식욕부진", "변비", "발진", "충혈/눈곱",
                "피부창백", "두드러기", "잇몸부음", "무기력", "두통", "오한", "기절", "수면문제"
            ],
            comment:null,
            symptomsModal: false,
            confirmModal: false,
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
            this.child =child;
            console.log(child);
        },
        async fetchDoctor() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctor/${this.doctorEmail}`);
            this.doctor = response.data.result;
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
            await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/immediate`, reservation );
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
}

.dark-blue {
    color: #00499E;
}

.subtitle {
    font-size: 21px;
}

.mini-button {
    background-color: #0066FF;
    color: white;
    border-radius: 10px;
    padding: 5px 10px;
    margin-right: 10px;
    font-size: 14px;
    text-align: center;
}

.button {
    background-color: #C2D7FF;
    border-radius: 10px;
    padding: 10px 20px;
    margin-right: 10px;
    font-size: 17px;
    color: #010565;
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
    padding: 5px 5px;
    margin-right: 10px;
    font-size: 17px;
    color: #00499E;
    text-align: center;
}

.symptom {
    background-color: #cccccc;
    border-radius: 40px;
    padding: 5px 5px;
    margin-right: 10px;
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
</style>