<template>
    <div class="cs-title inter-bold mt-10">병원 영업시간</div>

    <!-- 모달을 띄우는 생성 버튼 -->
    <v-btn color="primary" class="mb-4" @click="openModal('create')">영업시간 생성</v-btn>

    <v-container style="width: 100%;" class="d-flex justify-center">
        <v-row justify="center" class="mt-4">
            <v-col cols="12" md="8" class="d-flex justify-center">
                <v-table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>요일</th>
                            <th>오픈 시간</th>
                            <th>클로즈 시간</th>
                            <th>브레이크 시작</th>
                            <th>브레이크 종료</th>
                            <th>수정</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="hour in operatingHours" :key="hour.id">
                            <td>{{ formatDayOfWeek(hour.dayOfWeek) }}</td>
                            <td>{{ formatTime(hour.openTime) }}</td>
                            <td>{{ formatTime(hour.closeTime) }}</td>
                            <td>{{ formatTime(hour.breakStart) }}</td>
                            <td>{{ formatTime(hour.breakEnd) }}</td>
                            <td>
                                <v-btn color="warning" @click="openModal('edit', hour)">수정</v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>

    <!-- 영업시간 생성/수정 모달 -->
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
            <v-card-title>
                <span v-if="isEdit">영업시간 수정</span>
                <span v-else>영업시간 생성</span>
            </v-card-title>

            <v-card-text>
                <!-- 요일 선택 -->
                <v-select
                    v-model="selectedOperatingHour.dayOfWeek"
                    :items="daysOfWeek"
                    label="요일 선택"
                    item-text="label"
                    item-value="value"
                ></v-select>

                <!-- 오픈 시간 선택 -->
                <v-time-picker
                    v-model="selectedOperatingHour.openTime"
                    label="오픈 시간 선택"
                    format="24hr"
                    full-width
                ></v-time-picker>

                <!-- 클로즈 시간 선택 -->
                <v-time-picker
                    v-model="selectedOperatingHour.closeTime"
                    label="클로즈 시간 선택"
                    format="24hr"
                    full-width
                ></v-time-picker>

                <!-- 브레이크 시간 선택 -->
                <v-time-picker
                    v-model="selectedOperatingHour.breakStart"
                    label="브레이크 시작 시간 선택"
                    format="24hr"
                    full-width
                ></v-time-picker>

                <v-time-picker
                    v-model="selectedOperatingHour.breakEnd"
                    label="브레이크 종료 시간 선택"
                    format="24hr"
                    full-width
                ></v-time-picker>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialog = false">취소</v-btn>
                <v-btn color="green darken-1" text @click="saveOperatingHours" :loading="loading">{{ isEdit ? '수정' : '생성' }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            operatingHours: [], // 영업시간 데이터
            dialog: false,
            isEdit: false, // 수정 여부
            loading: false, // 로딩 상태
            selectedOperatingHour: {
                dayOfWeek: '',
                openTime: '',
                closeTime: '',
                breakStart: '',
                breakEnd: ''
            },
            daysOfWeek: [
                { label: '월요일', value: 'Monday' },
                { label: '화요일', value: 'Tuesday' },
                { label: '수요일', value: 'Wednesday' },
                { label: '목요일', value: 'Thursday' },
                { label: '금요일', value: 'Friday' },
                { label: '토요일', value: 'Saturday' },
                { label: '일요일', value: 'Sunday' }
            ]
        };
    },
    created() {
        this.fetchOperatingHours();
        this.selectedOperatingHour.dayOfWeek = this.daysOfWeek[0].value;
    },
    methods: {
        async fetchOperatingHours() {
            this.loading = true; // 로딩 시작
            try {
                const url = `${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital-operating-hours/admin/detail`;
                const response = await axios.get(url);
                console.log('Fetched operating hours:', response.data);
                if (response.data && response.data.result) {
                    this.operatingHours = response.data.result || [];
                } else {
                    console.error('Invalid response structure:', response.data);
                    this.operatingHours = [];
                }
            } catch (error) {
                console.error('Error fetching operating hours:', error);
            } finally {
                this.loading = false; // 로딩 종료
            }
        },
        formatTime(time) {
            return time.slice(0, 5); // HH:mm 형식으로 변환
        },
        formatDayOfWeek(day) {
            const dayMap = {
                Monday: '월요일',
                Tuesday: '화요일',
                Wednesday: '수요일',
                Thursday: '목요일',
                Friday: '금요일',
                Saturday: '토요일',
                Sunday: '일요일',
            };
            return dayMap[day] || day;
        },
        openModal(action, hour = null) {
            this.dialog = true;
            if (action === 'edit') {
                this.isEdit = true;
                this.selectedOperatingHour = { ...hour };
                console.log('Editing Operating Hour:', this.selectedOperatingHour);
            } else {
                this.isEdit = false;
                this.selectedOperatingHour = {
                    dayOfWeek: '',
                    openTime: '',
                    closeTime: '',
                    breakStart: '',
                    breakEnd: ''
                };
            }
        },
        async saveOperatingHours() {
            this.loading = true; // 로딩 시작
            const url = this.isEdit 
                ? `${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital-operating-hours/admin/update` 
                : `${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital-operating-hours/admin/register`;
            
            const method = 'post';
            const payload = this.isEdit
                ? { ...this.selectedOperatingHour, id: this.selectedOperatingHour.id }
                : this.selectedOperatingHour; // 수정: 배열이 아닌 객체로 보냄

            console.log('Saving Operating Hours:', payload);

            try {
                await axios[method](url, payload);
                this.dialog = false;
                await this.fetchOperatingHours(); // 업데이트 후 다시 영업시간 목록 가져오기
            } catch (error) {
                console.error('Error saving operating hours:', error);
            } finally {
                this.loading = false; // 로딩 종료
            }
        },
    },
    watch: {
    'selectedOperatingHour.dayOfWeek': function(newVal) {
        console.log('Selected Day:', newVal);
    }
}
};
</script>

<style scoped>
.cs-title {
    text-align: center;
    margin: auto;
    font-size: 25px;
    color: #00499E;
}

.v-table {
    margin: auto;
}

.v-col {
    display: flex;
    justify-content: center;
}
</style>
