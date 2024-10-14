<template>
    <div>
      <!-- 자녀 리스트 들어가는 곳 -->
      <div>
        <v-row justify="center" align="center">
          <v-col
            v-for="child in childList"
            :key="child.id"
            cols="12"
            md="2"
            lg="1"
            class="d-flex flex-column align-items-center"
          >
            <v-avatar size="70">
              <v-img @click="handleChildClick(child)" :src="child.imageUrl" max-width="120" max-height="120" contain />
            </v-avatar>
  
            <v-text>{{ child.name }}</v-text>
          </v-col>
        </v-row>
      </div>
  
      <div class="d-flex">
        <!-- 캘린더 영역 -->
        <div class="milcho-calendar-container">
          <FullCalendar :options="calendarOptions" class="milcho-custom-calendar" />
  
          <!-- Event Modal for creating/updating events -->
          <v-dialog v-model="isModalOpen" persistent max-width="500px">
            <v-card>
              <v-card-title>{{ isEditing ? '일정 수정' : '일정 생성' }}</v-card-title>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field v-model="formData.title" label="제목" required />
                  <v-text-field v-model="formData.content" label="내용" required />
  
                  <!-- Type Selection -->
                  <v-select v-model="formData.type" :items="eventTypes" label="타입" required />
  
                  <!-- Date Picker for Start Date -->
                  <v-menu
                    v-model="menuStart"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-x="true"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ attrs }">
                      <v-text-field
                        v-model="formData.startDateText"
                        label="시작일"
                        readonly
                        v-bind="attrs"
                        @click.stop="menuStart = true"
                      />
                    </template>
                    <v-date-picker
                      v-model="formData.startDate"
                      @input="updateStartDate"
                      show-current="true"
                      scrollable
                      style="margin: 100px;"
                    >
                      <template v-slot:actions>
                        <v-btn text color="primary" @click="confirmStartDate">확인</v-btn>
                      </template>
                    </v-date-picker>
                  </v-menu>
  
                  <!-- Date Picker for End Date -->
                  <v-menu
                    v-model="menuEnd"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-x="true"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ attrs }">
                      <v-text-field
                        v-model="formData.endDateText"
                        label="종료일"
                        readonly
                        v-bind="attrs"
                        @click.stop="menuEnd = true"
                      />
                    </template>
                    <v-date-picker
                      v-model="formData.endDate"
                      @input="updateEndDate"
                      show-current="true"
                      scrollable
                      style="margin: 100px;"
                    >
                      <template v-slot:actions>
                        <v-btn text color="primary" @click="confirmEndDate">확인</v-btn>
                      </template>
                    </v-date-picker>
                  </v-menu>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="milcho-btn-save" elevation="0" @click="handleSaveEvent">저장</v-btn>
                <v-btn class="milcho-btn-delete" elevation="0" @click="deleteEvent">삭제</v-btn>
                <v-btn class="milcho-btn-cancel" elevation="0" @click="isModalOpen = false">취소</v-btn>
              </v-card-actions>              
            </v-card>
          </v-dialog>
        </div>
  
        <!-- 예약 상세 정보 표시 영역 -->
        <div class="milcho-reservation-details">
          <div v-if="selectedReservation">
            <v-avatar
              class="ma-5"
              style="height:200px; width:350px; border-radius: 10px; object-fit:cover;"
            >
              <img
                :src="selectedReservation.hospitalImgUrl"
                class="milcho-customHosImage"
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </v-avatar>
          </div>
          <div v-if="selectedReservation">
            <div class="milcho-reservation-row">
              <strong>병원명</strong>
              <span>{{ selectedReservation.hospitalName }}</span>
            </div>
            <div class="milcho-reservation-row">
              <strong>의사명</strong>
              <span>{{ selectedReservation.doctorName }}</span>
            </div>
            <div class="milcho-reservation-row">
              <strong>환자명</strong>
              <span>{{ selectedChildName }}</span>
            </div>
            <div class="milcho-reservation-row">
              <strong>예약자</strong>
              <span>{{ selectedReservation.memberName }}</span>
            </div>
            <div class="milcho-reservation-row">
              <strong>진료타입</strong>
              <span>{{ selectedReservation.medicalItem }}</span>
            </div>
            <div class="milcho-reservation-row">
              <strong>예약 날짜</strong>
              <span>{{ selectedReservation.reservationDate }} {{ selectedReservation.reservationTime }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script>
  import FullCalendar from '@fullcalendar/vue3';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction';
  import axios from 'axios';
  
  export default {
    components: {
      FullCalendar,
    },
    data() {
      return {
        calendarOptions: {
          plugins: [dayGridPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          events: [],
          dateClick: this.handleDateClick,
          eventClick: this.handleEventClick, // 이벤트 클릭 처리
          displayEventTime: true,
          navLinks: true,
        },
        isModalOpen: false,
        isEditing: false,
        formData: {
          id: null,
          title: '',
          content: '',
          startDate: new Date(),
          endDate: new Date(),
          startDateText: '',
          endDateText: '',
          type: '',
        },
        eventTypes: ['IN_PROGRESS', 'COMPLETED'],
        menuStart: false,
        menuEnd: false,
        childList: [],
        reservationList: [],
        userEvents: [],
        selectedReservation: null, // 선택된 예약 정보 저장
        selectedChildName: '',
        colorPalette: ['#FF9800', '#4CAF50', '#FFC107', '#2196F3', '#9C27B0', '#E91E63', '#00BCD4', '#3F51B5', '#8BC34A', '#FF5722'],
        colorIndex: 0, // 색상 인덱스 초기화 변수
        memberColors: {}, // memberName별로 색상을 저장할 객체
      };
    },
    methods: {
      fetchChildList() {
        axios
          .get('http://localhost:8080/member-service/child/')
          .then((response) => {
            this.childList = response.data.result;
          })
          .catch((error) => {
            console.error('Error fetching child list:', error);
          });
      },
  
      fetchReservationList(child) {
        console.log(child)
        this.selectedChildName = child.name;
        this.colorIndex = 0; // child가 바뀔 때마다 색상 인덱스를 초기화
        this.memberColors = {}; // 색상 매핑 초기화
        axios
          .get(`http://localhost:8080/reservation-service/reservation/list/child/${child.id}`)
          .then((response) => {
            console.log(response)

            const reservationEvents = response.data.map((reservation) => {
            let memberName = reservation.memberName;

            // memberName별 색상이 이미 설정되어 있지 않다면 새로 할당
            if (!this.memberColors[memberName]) {
                this.memberColors[memberName] = this.colorPalette[this.colorIndex];
                // 색상 인덱스를 순차적으로 증가시킴 , 10개의 색상 이후에는 다시 처음으로 돌아가도록 함
                this.colorIndex = (this.colorIndex + 1) % this.colorPalette.length;
            }

            return {
                title: `${reservation.hospitalName} - ${reservation.medicalItem}`,
                start: new Date(`${reservation.reservationDate}T${reservation.reservationTime}`),
                end: new Date(`${reservation.reservationDate}T${reservation.reservationTime}`),
                backgroundColor: this.memberColors[memberName], // memberName에 해당하는 색상 사용
                allDay: false,
                editable: false,
                extendedProps: {
                ...reservation, // 예약 정보 전체를 extendedProps에 추가
                isReservationEvent: true
                },
            };
            });
            this.reservationList = reservationEvents;
            this.combineEvents();
          })
          .catch((error) => {
            console.error('Error fetching reservation list:', error);
          });
      },
  
      fetchUserEvents() {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/member-service/event/list`)
          .then((response) => {
            const userEvents = response.data.content.map((event) => ({
              id: event.id,
              title: event.title,
              start: new Date(event.startTime),
              end: new Date(event.endTime),
              backgroundColor: event.type === 'COMPLETED' ? '#D3D3D3' : '#C2D7FF',
              border: 'none',
              extendedProps: {
                content: event.content,
                type: event.type,
                border: 'none',
                isReservationEvent: false // 사용자 이벤트임을 나타내는 플래그 추가
              },
            }));
            this.userEvents = userEvents;
            this.combineEvents();
          })
          .catch((error) => {
            console.error('Error fetching user events:', error);
          });
      },
  
      combineEvents() {
        this.calendarOptions.events = [...this.userEvents, ...this.reservationList];
      },
  
      handleChildClick(childId) {
        this.fetchReservationList(childId); // 자녀 예약 리스트 가져오기
      },
  
      handleEventClick(info) {
        // 예약 이벤트 클릭 시 예약 정보를 상세 정보로 표시
        const isReservationEvent = info.event.extendedProps.isReservationEvent;


        if (isReservationEvent) {
        // 예약 이벤트일 경우 상세 정보를 표시합니다.
        this.selectedReservation = info.event.extendedProps;
        } else {
          // 사용자 이벤트 수정 모달 열기
          this.isEditing = true;
          this.formData.id = info.event.id;
          this.formData.title = info.event.title;
          this.formData.content = info.event.extendedProps.content;
          this.formData.startDate = info.event.start;
          this.formData.endDate = info.event.end;
          this.formData.startDateText = this.formatDate(info.event.start);
          this.formData.endDateText = this.formatDate(info.event.end);
          this.formData.type = info.event.extendedProps.type || '';  
          this.isModalOpen = true;
        }
      },
  
      handleDateClick(info) {
        this.isEditing = false;
        this.formData.startDate = info.date;
        this.formData.endDate = info.date;
        this.formData.startDateText = this.formatDate(info.date);
        this.formData.endDateText = this.formatDate(info.date);
        this.isModalOpen = true;
      },
  
      formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
  
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
  
        return [year, month, day].join('-');
      },
  
      confirmStartDate() {
        this.updateStartDate(this.formData.startDate);
        this.menuStart = false;
      },
  
      confirmEndDate() {
        this.updateEndDate(this.formData.endDate);
        this.menuEnd = false;
      },
  
      updateStartDate(val) {
        this.formData.startDate = val;
        this.formData.startDateText = this.formatDate(val);
      },
  
      updateEndDate(val) {
        this.formData.endDate = val;
        this.formData.endDateText = this.formatDate(val);
      },
  
      deleteEvent() {
        const id = this.formData.id;

        axios
            .get(`http://localhost:8080/member-service/event/delete/${id}`) // 백틱 사용
            .then((response) => {
            console.log('Event deleted successfully:', response.data);
            this.isModalOpen = false; // 모달 닫기
            this.fetchUserEvents(); // 삭제 후 사용자 이벤트 새로고침
            })
            .catch((error) => {
            console.error('Error deleting event:', error);
            });
        },
      handleSaveEvent() {
        const startTime = `${this.formData.startDateText}T00:00:00`;
        const endTime = `${this.formData.endDateText}T23:59:59`;

        const url = this.isEditing
            ? `${process.env.VUE_APP_API_BASE_URL}/member-service/event/update/${this.formData.id}`
            : `${process.env.VUE_APP_API_BASE_URL}/member-service/event/create`;

        const payload = {
            title: this.formData.title,
            content: this.formData.content,
            startTime: startTime,
            endTime: endTime,
            type: this.formData.type,  // 이벤트 타입을 포함하여 전송
        };

        console.log(payload)

        axios({
            method: 'post',
            url: url,
            data: payload,
            headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(() => {
            this.isModalOpen = false;
            this.fetchUserEvents(); // 이벤트 저장 후 사용자 이벤트 새로고침
            })
            .catch((error) => {
            console.error('Error saving event:', error);
            });
        },
    },
    mounted() {
      this.fetchUserEvents(); // Fetch user events on mount
      this.fetchChildList(); // Fetch child list on mount
    },
  };
  </script>
  
<style>
  .milcho-calendar-container {
    max-width: 900px;
    height: 900px;
    margin: auto;
    margin-top: 30px;
}

.milcho-fc-theme-standard td,
.milcho-fc-theme-standard th {
    height: 30px;
    border: 1px solid var(--fc-border-color);
}

.milcho-custom-calendar {
    width: 700px;
    height: 800px;
    margin: auto;
    margin-left: 250px;
}

.milcho-custom-calendar .fc-h-event {
    border: none !important; /* 테두리 완전히 제거 */
}

.milcho-reservation-details {
    width: 400px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    margin-bottom: 30px;
    border-radius: 10px;
}

.milcho-v-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.milcho-customHosImage {
    width: 358px;
    height: 200px;
    object-fit: cover;
}

.milcho-reservation-row {
    display: flex;
    margin-bottom: 10px;
    margin-left: 20px;
}

.milcho-reservation-row strong {
    width: 100px; /* 레이블의 고정 너비 */
    flex-shrink: 0; /* 레이블이 줄어들지 않도록 고정 */
}

.milcho-reservation-row span {
    flex-grow: 1; /* 값 부분이 남은 공간을 채움 */
}

.milcho-reservations {
    width: 100%;  /* div의 너비를 지정, 필요에 맞게 조정 가능 */
    height: 100%; /* div의 높이도 지정 가능 */
    position: relative; /* 이미지에 절대 위치를 줄 경우 필요할 수 있음 */
}

.milcho-reservations img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* 이미지의 비율을 유지하면서 div를 가득 채움 */
}
.milcho-btn-save {
    background-color: #C2D7FF !important;
}

.milcho-btn-cancel {
    background-color: #D3D3D3 !important;
}

.milcho-btn-delete {
    background-color: #F9C3C3 !important;
}
</style>


