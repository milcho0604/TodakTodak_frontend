<template>
    <div class="cs-title inter-bold mt-10">병원 영업시간</div>
  
    <v-container style="width: 100%;" class="d-flex justify-center">
      <v-row justify="center" class="mt-4">
        <!-- 모달을 띄우는 생성 버튼 -->
        <v-col cols="12" md="8" class="d-flex justify-center">
          <v-btn class="custom-time" variant="text" @click="openModal('create')">생성</v-btn>
        </v-col>
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
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="hour in sortedOperatingHours" :key="hour.id">
                <td>{{ formatDayOfWeek(hour.dayOfWeek) }}</td>
                <td>{{ formatTime(hour.openTime) }}</td>
                <td>{{ formatTime(hour.closeTime) }}</td>
                <td>{{ formatTime(hour.breakStart) }}</td>
                <td>{{ formatTime(hour.breakEnd) }}</td>
                <td>삭제코드</td>
                <td>
                  <v-btn class="custom-time-line" variant="text" @click="openModal('edit', hour)">수정</v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>
    </v-container>
  
    <v-dialog v-model="dialog" max-width="600px" class="d-fle,x justify-center">
      <v-card max-width="600px">
        <v-card-title class="d-flex justify-center">
          <span class="cs-title inter-bold mt-10">{{ isEdit ? '영업시간 관리' : '영업시간 관리' }}</span>
        </v-card-title>
  
        <v-card-text class="d-flex flex-column align-center">
          <!-- 요일 선택 -->
          <v-select
            v-model="selectedOperatingHour.dayOfWeek"
            :items="daysOfWeek.map(option => option.label)"
            variant="outlined"
            label="요일 선택"
            item-text="label"
            item-value="value"
            style="flex: 1; min-width: 450px;" 
          ></v-select>
  
          <v-row align="center" justify="space-around" class="mt-3">
            <!-- 오픈 시간 선택 -->
            <v-col class="d-flex align-center" cols="6">
              <v-icon @click.stop="openTimeMenu = !openTimeMenu" class="mr-2 mb-3">
                mdi-clock-time-four-outline
              </v-icon>
              <v-text-field
                v-model="selectedOperatingHour.openTime"
                label="오픈 시간 선택"
                variant="outlined"
                :rules="timeRules"
                @focus="openTimeMenu = true"
                style="flex: 1; min-width: 200px;" 
              />
              <v-menu
                v-model="openTimeMenu"
                :close-on-content-click="false"
                activator="parent"
                transition="scale-transition"
              >
                <v-time-picker
                  v-model="selectedOperatingHour.openTime"
                  @change="openTimeMenu = false"
                  format="24hr"
                ></v-time-picker>
              </v-menu>
            </v-col>
  
            <!-- 클로즈 시간 선택 -->
            <v-col class="d-flex align-center" cols="6">
              <v-icon @click.stop="closeTimeMenu = !closeTimeMenu" class="mr-2 mb-3">
                mdi-clock-time-four-outline
              </v-icon>
              <v-text-field
                v-model="selectedOperatingHour.closeTime"
                label="클로즈 시간 선택"
                variant="outlined"
                :rules="timeRules"
                @focus="closeTimeMenu = true"
                style="flex: 1; min-width: 200px;" 
              />
              <v-menu
                v-model="closeTimeMenu"
                :close-on-content-click="false"
                activator="parent"
                transition="scale-transition"
              >
                <v-time-picker
                  v-model="selectedOperatingHour.closeTime"
                  @change="closeTimeMenu = false"
                  format="24hr"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
  
          <v-row align="center" justify="space-around" class="mt-3">
            <!-- 브레이크 시작 시간 선택 -->
            <v-col class="d-flex align-center" cols="6">
              <v-icon @click.stop="breakStartMenu = !breakStartMenu" class="mr-2 mb-3">
                mdi-clock-time-four-outline
              </v-icon>
              <v-text-field
                v-model="selectedOperatingHour.breakStart"
                label="브레이크 시작 시간 선택"
                variant="outlined"
                :rules="timeRules"
                @focus="breakStartMenu = true"
                style="flex: 1; min-width: 200px;"  
              />
              <v-menu
                v-model="breakStartMenu"
                :close-on-content-click="false"
                activator="parent"
                transition="scale-transition"
              >
                <v-time-picker
                  v-model="selectedOperatingHour.breakStart"
                  @change="breakStartMenu = false"
                  format="24hr"
                ></v-time-picker>
              </v-menu>
            </v-col>
  
            <!-- 브레이크 종료 시간 선택 -->
            <v-col class="d-flex align-center" cols="6">
              <v-icon @click.stop="breakEndMenu = !breakEndMenu" class="mr-2 mb-3">
                mdi-clock-time-four-outline
              </v-icon>
              <v-text-field
                v-model="selectedOperatingHour.breakEnd"
                label="브레이크 종료 시간 선택"
                variant="outlined"
                :rules="timeRules"
                @focus="breakEndMenu = true"
                style="flex: 1; min-width: 200px;" 
              />
              <v-menu
                v-model="breakEndMenu"
                :close-on-content-click="false"
                activator="parent"
                transition="scale-transition"
              >
                <v-time-picker
                  v-model="selectedOperatingHour.breakEnd"
                  @change="breakEndMenu = false"
                  format="24hr"
                ></v-time-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-card-text>
  
        <v-card-text>
          <v-row justify="center" class="mt-4">
            <v-btn class="custom-time-3" variant="text" @click="dialog = false">취소</v-btn>
            <v-divider vertical class="vertical-divider"></v-divider>
            <v-btn class="custom-time-2" variant="text" @click="saveOperatingHours" :loading="loading">
              {{ isEdit ? '수정' : '생성' }}
            </v-btn>
          </v-row>
        </v-card-text>
        <v-spacer :style="{ height: '30px' }"></v-spacer>
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
          openTime: '09:00', // 기본 시간 설정
          closeTime: '18:00', // 기본 시간 설정
          breakStart: '12:00', // 기본 시간 설정
          breakEnd: '13:00' // 기본 시간 설정
        },
        timeRules: [
          v => !!v || '시간을 입력하세요.',
          v => /^\d{2}:\d{2}$/.test(v) || 'HH:MM 형식으로 입력하세요.'
        ],
        daysOfWeek: [
          { label: '월요일', value: 'Monday' },
          { label: '화요일', value: 'Tuesday' },
          { label: '수요일', value: 'Wednesday' },
          { label: '목요일', value: 'Thursday' },
          { label: '금요일', value: 'Friday' },
          { label: '토요일', value: 'Saturday' },
          { label: '일요일', value: 'Sunday' }
        ],
        openTimeMenu: false,
        closeTimeMenu: false,
        breakStartMenu: false,
        breakEndMenu: false,
      };
    },
    created() {
      this.fetchOperatingHours();
      this.selectedOperatingHour.dayOfWeek = this.daysOfWeek[0].label;
    },
    computed: {
      sortedOperatingHours() {
        const daysOrder = {
          Monday: 0,
          Tuesday: 1,
          Wednesday: 2,
          Thursday: 3,
          Friday: 4,
          Saturday: 5,
          Sunday: 6
        };
        return [...this.operatingHours].sort((a, b) => daysOrder[a.dayOfWeek] - daysOrder[b.dayOfWeek]);
      }
    },
    methods: {
      async fetchOperatingHours() {
        this.loading = true; // 로딩 시작
        try {
            const url = `${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital-operating-hours/admin/detail`;
            const response = await axios.get(url);
            console.log('Fetched operating hours:', response.data);
            // 응답 결과가 배열인지 확인
            if (response.data && Array.isArray(response.data.result)) {
            this.operatingHours = response.data.result; // 배열인 경우
            } else {
            console.error('Invalid response structure:', response.data);
            this.operatingHours = []; // 배열이 아닐 경우 빈 배열로 초기화
            }
        } catch (error) {
            console.error('Error fetching operating hours:', error);
            this.operatingHours = []; // 에러가 발생한 경우에도 빈 배열로 초기화
        } finally {
            this.loading = false; // 로딩 종료
        }
        },
      formatDayOfWeek(day) {
        return this.daysOfWeek.find(option => option.value === day)?.label || day;
      },
      formatTime(time) {
        if (!time) return ''; // Null 체크
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
      },
      openModal(action, hour = null) {
        console.log('Selected hour:', hour); // 로그 추가
        this.dialog = true;
        if (action === 'edit') {
          this.isEdit = true;
          const dayOfWeekMappingReverse = {
            Monday: '월요일',
            Tuesday: '화요일',
            Wednesday: '수요일',
            Thursday: '목요일',
            Friday: '금요일',
            Saturday: '토요일',
            Sunday: '일요일'
        };
          this.selectedOperatingHour = { 
            ...hour, 
            openTime: hour.openTime.slice(0, 5), // HH:MM만 추출
            closeTime: hour.closeTime.slice(0, 5),
            breakStart: hour.breakStart.slice(0, 5),
            breakEnd: hour.breakEnd.slice(0, 5),
            dayOfWeek: dayOfWeekMappingReverse[hour.dayOfWeek] // 한국어 요일로 설정
            }; // 수정할 영업시간 설정
        } else {
          this.isEdit = false;
          this.selectedOperatingHour = {
            dayOfWeek: this.daysOfWeek[0].label,
            openTime: '09:00',
            closeTime: '18:00',
            breakStart: '12:00',
            breakEnd: '13:00',
          }; // 기본값 설정
        }
      },
      saveOperatingHours() {
    this.loading = true; // 로딩 시작
    const url = this.isEdit 
      ? `http://localhost:8080/reservation-service/hospital-operating-hours/update/${this.selectedOperatingHour.id}`
      : 'http://localhost:8080/reservation-service/hospital-operating-hours/register';

        const dayOfWeekMapping = {
            '월요일': 'Monday',
            '화요일': 'Tuesday',
            '수요일': 'Wednesday',
            '목요일': 'Thursday',
            '금요일': 'Friday',
            '토요일': 'Saturday',
            '일요일': 'Sunday'
        };

        const requestData = {
            dayOfWeek: this.isEdit 
            ? (this.selectedOperatingHour.dayOfWeek 
                ? dayOfWeekMapping[this.selectedOperatingHour.dayOfWeek] 
                : dayOfWeekMapping[this.selectedOperatingHour.previousDayOfWeek] || null) // 이전 요일 매핑
            : dayOfWeekMapping[this.selectedOperatingHour.dayOfWeek],
            openTime: this.selectedOperatingHour.openTime,
            closeTime: this.selectedOperatingHour.closeTime,
            breakStart: this.selectedOperatingHour.breakStart,
            breakEnd: this.selectedOperatingHour.breakEnd
        };
        console.log('이전' + requestData)

        axios.post(url, this.isEdit ? requestData : [requestData]) // 수정할 때는 객체, 생성할 때는 배열로 감싸기
            .then(response => {
                console.log(response);
                this.fetchOperatingHours(); // 데이터 다시 가져오기
                this.dialog = false; // 모달 닫기
            })
            .catch(error => {
                console.error("Error saving operating hours:", error);
                if (error.response && error.response.status === 500) {
                alert('이미 등록한 요일입니다.'); // 에러 메시지 출력
            }
            })
            .finally(() => {
                this.loading = false; // 로딩 종료
            });
    }
    }
  }
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
  
  /* 필요에 따라 추가적인 스타일링 */
  .v-card-text {
    padding: 16px;
  }
  .custom-time{
    margin-left: auto; /* 왼쪽 마진을 자동으로 설정하여 오른쪽 정렬 */
    margin-right: 50px;
    background-color: #C2D7FF !important;
    color: #00499e;
    border-radius: 20px;
    width: 70px;
    height: 44px;
    margin-bottom: 40px;
    margin-top: 10px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .custom-time-2{
    background-color: #C2D7FF;
    color: #00499E;
    border-radius: 20px;
  }
  .custom-time-3{
    background-color: #E7E7E7;
    color: black;
    border-radius: 20px;
  }
  .custom-time-line{
    background-color: #C2D7FF !important;
    color: #00499e;
    border-radius: 20px;
    width: 70px;
    height: 44px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .vertical-divider {
    width: 1px;
    height: 30px;
    background-color: #a7a7a7;
    margin: 0 10px;
  }
  .custom-width {
    width: 500px;  /* 클래스에 대한 CSS 규칙 */
    justify-content: center;
  }
  .custom-card-1{
    justify-content: center;
  }
  </style>
  