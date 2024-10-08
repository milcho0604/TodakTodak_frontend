<template>
    <v-container style="width: 1200px;">
        <v-container style="width: 700px;">
            <v-spacer :style="{ height: '50px' }"></v-spacer>
            <v-row class="header-row">
                <v-col cols="5">
                    <h2>{{ hostpitalName }}</h2>
                </v-col>
                <v-col>
                    <div class="custom-text">
                        오늘예약
                    </div>
                </v-col>
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
                    <div class="child" @click="addChild(child)" :class="{ 'selected-child': this.child == child }">
                        <v-row justify="center">
                            <v-col class="text-center" cols="3">
                                <img :src="child.imageUrl" alt="child image" style="width: 40px; height: 40px;">
                            </v-col>
                            <v-col class="text-center" cols="5" style="margin-top: 11px;">
                                <v-row class="inter-bold child-name">{{ child.name }}</v-row>
                                <v-row class="inter-normal child-ssn">{{ child.ssn }}</v-row>
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
                    <v-row>
                        <v-col cols="2">
                            <img :src="doctor.image" alt="doctor image" style="width: 40px; height: 40px;">
                        </v-col>
                        <v-col cols="2">
                            <v-row class="inter-bold inline">{{ doctor.name }}</v-row>
                        </v-col>
                        <v-col>
                            <v-row class="inter-bold custom-text3 inline">대기 {{ doctor.waiting }}명</v-row>
                        </v-col>
                        <v-col cols="2">
                            <div class="mini-button" v-if="this.doctor == doctor" style="margin-top: 5px;">선택됨</div>
                        </v-col>
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
                <div class="mt-3">
                    <v-chip-group v-if="symptoms.length > 0">
                        <v-chip v-for="(symptom, index) in symptoms" :key="index" class="mr-2">
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
                <div class="button inter-bold" @click="reservedApply">오늘예약 신청</div>
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
        </v-container>
    </v-container>
</template>

<script>
import axios from 'axios';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';

export default {
    data() {
        return {
            medicalType: "Immediate",
            hostpitalName: "삼성화곡소아청소년과",
            hospitalId: 1,
            child: null,
            doctor: [],
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
        }
    },
    methods: {
        addChild(child) {
            this.child = child;
            console.log(child);
        },
        addDoctor(doctor) {
            this.doctor = doctor;
            console.log(doctor);
        },
        addmediItem(mediItem) {
            this.mediItem = mediItem;
            console.log(mediItem);
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
                this.doctorList = response.data.result.content;

                console.log(this.doctorList);
            } catch (e) {
                console.log(e);
            }
        },
        async fetchChildList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/`);
                this.childOptions = response.data.result;
                console.log(this.childOptions)
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
                console.log(req)

                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/immediate`,
                    req);

                console.log(response)
                this.$router.push('/')
            } catch (e) {
                alert(e.message)
            }
        },
        fetchMediData() {
            const firebaseConfig = {
                apiKey: "AIzaSyBSH8wJ7aoblNAj8Kj7iNTfsJhlEL4KEcE",
                authDomain: "padak-todak.firebaseapp.com",
                projectId: "padak-todak",
                storageBucket: "padak-todak.appspot.com",
                messagingSenderId: "22351664979",
                appId: "1:22351664979:web:f8a3cc4b2f5e249d88b3a6",
                databaseURL: "https://padak-todak-default-rtdb.asia-southeast1.firebasedatabase.app"
            };

            const app = initializeApp(firebaseConfig);
            const db = getDatabase(app);
            const mediRef = ref(db, 'medi');

            onValue(mediRef,(snapshot) => {
                const data = snapshot.val();
                console.log(data);
                if(data){
                    this.mediData = Object.keys(data)
                    .filter(key => data[key] && data[key].data)
                    .map(key => data[key]);
                }
            });
        }
    },
    async created() {
        this.fetchDoctorList();
        this.fetchChildList();
    },
    mounted(){
        this.fetchMediData();
    }
}
</script>

<style scoped>
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
    font-size: 1.4rem;
    border-radius: 10px;
    padding: 4px 20px;
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
    background-color: #C2D7FF;
    color: #00499E;
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
}

.before-selected {
    margin-top: -20px;
    background-color: #E7E7E7;
    padding: 6px 20px;
    border-radius: 15px;
    font-size: 15px;
    letter-spacing: -1px;
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
    padding: 20px 10px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
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
</style>