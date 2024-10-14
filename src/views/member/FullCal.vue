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
            <img class="v-avatar" @click="handleChildClick(child)" :src="child.imageUrl" max-width="120" max-height="120" contain />
            <v-text>{{ child.name }}</v-text>
          </v-col>
        </v-row>
      </div>
  
      <div class="d-flex">
        <!-- 캘린더 영역 -->
        <div class="calendar-container">
          <FullCalendar :options="calendarOptions" class="custom-calendar" />
  
          <!-- Event Modal for creating/updating events -->
          <v-dialog v-model="isModalOpen" persistent max-width="500px">
            <v-card>
              <v-card-title>{{ isEditing ? 'Update Event' : 'Create Event' }}</v-card-title>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field v-model="formData.title" label="Title" required />
                  <v-text-field v-model="formData.content" label="Content" required />
  
                  <!-- Type Selection -->
                  <v-select v-model="formData.type" :items="eventTypes" label="Event Type" required />
  
                  <!-- Date Picker for Start Date -->
                  <v-menu
                    v-model="menuStart"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-x="true"
                    min-width="auto"
                  >
                    <template v-slot:activator="{ attrs }">
                      <v-text-field v-model="formData.startDateText" label="Start Date" readonly v-bind="attrs" @click.stop="menuStart = true" />
                    </template>
                    <v-date-picker v-model="formData.startDate" @input="updateStartDate" show-current="true" scrollable style="margin: 100px;">
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
                      <v-text-field v-model="formData.endDateText" label="End Date" readonly v-bind="attrs" @click.stop="menuEnd = true" />
                    </template>
                    <v-date-picker v-model="formData.endDate" @input="updateEndDate" show-current="true" scrollable style="margin: 100px;">
                      <template v-slot:actions>
                        <v-btn text color="primary" @click="confirmEndDate">확인</v-btn>
                      </template>
                    </v-date-picker>
                  </v-menu>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="handleSaveEvent">Save</v-btn>
                <v-btn color="red darken-1" text @click="isModalOpen = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
  
        <!-- 예약 상세 정보 표시 영역 -->
        <div class="reservation-details">
          <h3>예약 상세</h3>
          <div v-if="selectedReservation">
            <!-- <img class="v-avatar" @click="handleChildClick(child.id)" :src="child.imageUrl" max-width="120" max-height="120" contain /> -->
            <img :src="selectedReservation.hospitalImgUrl" class="customHosImage" />
            <p><strong>병원명:</strong> {{ selectedReservation.hospitalName }}</p>
            <p><strong>의사명:</strong> {{ selectedReservation.doctorName }}</p>
            <p><strong>환자명:</strong> {{ selectedChildName }}</p>
            <p><strong>예약자:</strong> {{ selectedReservation.memberName }}</p>
            <p><strong>진료타입:</strong> {{ selectedReservation.medicalItem }}</p>
            <p><strong>예약 날짜:</strong> {{ selectedReservation.reservationDate }} {{ selectedReservation.reservationTime }}</p>
          </div>
          <div v-else>
            <p>No reservation selected</p>
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
        },
        eventTypes: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
        menuStart: false,
        menuEnd: false,
        childList: [],
        reservationList: [],
        userEvents: [],
        selectedReservation: null, // 선택된 예약 정보 저장
        selectedChildName: '',
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
        axios
          .get(`http://localhost:8080/reservation-service/reservation/list/child/${child.id}`)
          .then((response) => {
            const reservationEvents = response.data.map((reservation) => ({
              title: `${reservation.hospitalName} - ${reservation.medicalItem}`,
              start: new Date(`${reservation.reservationDate}T${reservation.reservationTime}`),
              end: new Date(`${reservation.reservationDate}T${reservation.reservationTime}`),
              backgroundColor: '#FF9800', // 예약 이벤트는 주황색
              allDay: false,
              editable: false,
              extendedProps: {
                ...reservation, // 예약 정보 전체를 extendedProps에 추가
              },
            }));
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
              backgroundColor: '#4CAF50', // 사용자 이벤트는 초록색
              extendedProps: {
                content: event.content,
                type: event.type,
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
        if (info.event.backgroundColor === '#FF9800') {
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
          type: this.formData.type,
        };
  
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
  
  <style scoped>
  .calendar-container {
    max-width: 900px;
    height: 900px;
    margin: auto;
    margin-top: 30px;
  }
  
  .fc-theme-standard td,
  .fc-theme-standard th {
    height: 30px;
    border: 1px solid var(--fc-border-color);
  }
  
  .custom-calendar {
    width: 700px;
    height: 800px;
    margin: auto;
    margin-left: 250px;
  }
  
  .reservation-details {
    width: 400px;
    padding: 20px;
    margin-left: 20px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    margin-bottom: 30px;
  }
  
  .v-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .customHosImage{
    width: 350px;
    height: 300px;
  }
  </style>
  