<template>
    <div class="calendar-container">
      <!-- FullCalendar Integration -->
      <FullCalendar :options="calendarOptions" class="custom-calendar">
      </FullCalendar>
  
      <!-- Event Modal for creating/updating events -->
      <v-dialog v-model="isModalOpen" persistent max-width="500px">
        <v-card>
          <v-card-title>{{ isEditing ? 'Update Event' : 'Create Event' }}</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-text-field v-model="formData.title" label="Title" required></v-text-field>
              <v-text-field v-model="formData.content" label="Content" required></v-text-field>
  
              <!-- Type Selection -->
              <v-select
                v-model="formData.type"
                :items="eventTypes"
                label="Event Type"
                required
              ></v-select>
  
              <!-- Date and Time Pickers for Start Time -->
              <v-menu v-model="menuStart" :close-on-content-click="false" transition="scale-transition" offset-y>
                <template v-slot:activator="{ attrs }">
                  <v-text-field v-model="formData.startDate" label="Start Date" readonly v-bind="attrs" @click="menuStart = true"></v-text-field>
                </template>
                <v-date-picker v-model="formData.startDate" @input="menuStart = false"></v-date-picker>
              </v-menu>
              <v-time-picker
                v-model="formData.startTimeClock"
                label="Start Time"
                format="24hr"
                @input="handleTimeChange('startTimeClock', $event)"
              ></v-time-picker>
  
              <!-- Date and Time Pickers for End Time -->
              <v-menu v-model="menuEnd" :close-on-content-click="false" transition="scale-transition" offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field v-model="formData.endDate" label="End Date" readonly v-bind="attrs" v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="formData.endDate" @input="menuEnd = false"></v-date-picker>
              </v-menu>
  
              <!-- End Time Clock -->
              <v-time-picker
                v-model="formData.endTimeClock"
                label="End Time"
                format="24hr"
                @input="handleTimeChange('endTimeClock', $event)"
              ></v-time-picker>
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
  </template>
  
  <script>
    import FullCalendar from '@fullcalendar/vue3';
    import dayGridPlugin from '@fullcalendar/daygrid';
    import interactionPlugin from '@fullcalendar/interaction';
    import axios from 'axios';
  
    export default {
      components: {
        FullCalendar
      },
      data() {
        return {
          calendarOptions: {
            plugins: [dayGridPlugin, interactionPlugin],
            initialView: 'dayGridMonth',
            events: [], // Calendar events will be fetched and set here
            dateClick: this.handleDateClick,
            eventClick: this.handleEventClick,
            displayEventTime: true, // 이벤트에 시간을 표시할지 여부
            navLinks: true, // 제목을 링크로 만들어 클릭 시 날짜로 이동할 수 있도록 설정
          },
          isModalOpen: false,
          isEditing: false,
          formData: {
            id: null,
            title: '',
            content: '',
            startDate: '', // 날짜
            startTimeClock: '', // 시간 (clock)
            endDate: '',
            endTimeClock: '', // 시간 (clock)
          },
          eventTypes: ['유저', '부서', '회사일정'], // Event Types Selection
          menuStart: false,
          menuEnd: false
        };
      },
      methods: {
        // Fetch all events including holidays and user events
        fetchEvents() {
            const email = localStorage.getItem('email'); // 로컬 스토리지에서 email을 가져옴

            axios
                .get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/list`, {
                params: {
                    email: email, // 로컬 스토리지에서 가져온 이메일
                    type: "All" // 예약 타입
                }
                })
                .then((response) => {
                console.log(response.data); // 예약 데이터를 콘솔에 출력하여 확인
                const events = response.data.map((reservation) => ({
                    title: reservation.medicalItem || '예약', // 예약 이름
                    start: new Date(reservation.reservationDate), // 시작 날짜 (Date 객체로 변환)
                    extendedProps: {
                    content: reservation.status || '확정되지 않음', // 예약 상태
                    },
                }));

                // FullCalendar의 이벤트에 직접 할당하여 데이터 반영
                this.calendarOptions.events = events;
                })
                .catch((error) => {
                console.error('Error fetching reservation events:', error);
                });
            },


        handleTimeChange(type, value) {
          const hours = value.split(':')[0];
          const minutes = value.split(':')[1];
          const seconds = '00'; // 기본적으로 초는 00으로 설정
          const formattedTime = `${hours}:${minutes}:${seconds}`;
  
          if (type === 'startTimeClock') {
            this.formData.startTimeClock = formattedTime;
          } else if (type === 'endTimeClock') {
            this.formData.endTimeClock = formattedTime;
          }
        },
        // Handle clicking a date in the calendar to create a new event
        handleDateClick(info) {
          this.isEditing = false;
          this.formData.startDate = info.dateStr;
          this.formData.startTimeClock = '';
          this.formData.endDate = info.dateStr;
          this.formData.endTimeClock = '';
          this.formData.title = ''; // Clear previous input
          this.formData.content = ''; // Clear previous input
          this.formData.type = '유저'; // 기본적으로 유저로 설정
          this.isModalOpen = true;
        },
        // Handle clicking an existing event to edit it
        handleEventClick(info) {
          this.isEditing = true;
          this.formData.id = info.event.id;
          this.formData.title = info.event.title;
          this.formData.startDate = info.event.startStr.split('T')[0];
          this.formData.startTimeClock = info.event.startStr.split('T')[1];
          this.formData.endDate = info.event.endStr.split('T')[0];
          this.formData.endTimeClock = info.event.endStr.split('T')[1];
          this.formData.content = info.event.extendedProps.content;
          this.formData.type = info.event.extendedProps.type || '유저'; // 기본값 설정
          this.isModalOpen = true;
        },
        // Handle saving an event (either create or update)
        handleSaveEvent() {
          const startTime = this.formatDateTime(this.formData.startDate, this.formData.startTimeClock);
          const endTime = this.formatDateTime(this.formData.endDate, this.formData.endTimeClock);
  
          const url = this.isEditing
            ? `${process.env.VUE_APP_API_BASE_URL}/calendars/update/${this.formData.id}`
            : `${process.env.VUE_APP_API_BASE_URL}/calendars/create`;
  
          const method = this.isEditing ? 'put' : 'post';
  
          const payload = {
            title: this.formData.title,
            content: this.formData.content,
            startTime: startTime, // ISO 8601 형식으로 변환된 시작 시간
            endTime: endTime, // ISO 8601 형식으로 변환된 종료 시간
            type: this.formData.type
          };
  
          axios({
            method: method,
            url: url,
            data: payload,
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
            .then(() => {
              this.isModalOpen = false;
              this.fetchEvents(); // 이벤트 저장 후 다시 이벤트 목록을 불러옴
            })
            .catch((error) => {
              if (error.response) {
                console.error('Server Response:', error.response.data);
                alert(`Error: ${error.response.data.message || '이벤트 저장에 실패했습니다.'}`);
              } else if (error.request) {
                console.error('No Response from Server:', error.request);
              } else {
                console.error('Error setting up the request:', error.message);
              }
            });
        },
        // 날짜와 시간을 결합하여 ISO 8601 형식으로 변환하는 메서드
        formatDateTime(date, time) {
          if (date && time) {
            return `${date}T${time}`; // YYYY-MM-DDTHH:MM:SS 형식으로 결합
          } else if (date) {
            return `${date}T00:00:00`; // 시간이 없으면 00:00:00을 기본으로 설정
          }
          return '';
        }
      },
      mounted() {
        this.fetchEvents(); // Fetch events when the component is mounted
      }
    };
  </script>
  
  <style scoped>
  .calendar-container {
    max-width: 900px; /* 너비를 900px로 제한 */
    height: 900px; /* 높이를 900px로 설정 */
    margin: auto; /* 가운데 정렬 */
    margin-top: 30px;
  }
  .fc-theme-standard td, .fc-theme-standard th {
    height: 30px;
    border: 1px solid var(--fc-border-color);
}
.fc .fc-daygrid-day-frame {
    height: 30px;
    position: relative;
}
  .fc-daygrid-day-top {
    max-height: 30px; /* 날짜 상단 부분의 최대 높이를 설정 */
    height: 30px;
    overflow: hidden; /* 넘치는 부분은 숨김 */
  }
  
  .custom-calendar{
    max-width: 900px; /* 너비를 900px로 제한 */
    height: 800px; /* 높이를 900px로 설정 */
    margin: auto; /* 가운데 정렬 */
  }
  </style>
