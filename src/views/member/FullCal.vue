<template>
    <div>
      <!-- 자녀 리스트 -->
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
            <v-spacer :style="{ height: '30px' }"></v-spacer>
            <v-avatar size="70">
              <v-img @click="handleChildClick(child)" :src="child.imageUrl" contain />
            </v-avatar>
            <v-text>{{ child.name }}</v-text>
          </v-col>
        </v-row>
      </div>
  
      <div class="d-flex">
        <!-- 캘린더 영역 -->
        <div class="milcho-calendar-container">
          <!-- 일정 추가 버튼 -->
          <v-btn variant="flat" @click="startNewEvent" class="milcho-btn-add">✏️</v-btn>
          <FullCalendar :options="calendarOptions" class="milcho-custom-calendar" />
        </div>
  
        <!-- 이벤트 및 예약 상세 정보 표시 영역 -->
        <div class="milcho-details">
          <!-- 예약 상세 정보 -->
          <div v-if="selectedReservation && isReservationEvent">
            <v-avatar class="ma-5" style="height:200px; width:350px; border-radius: 10px; object-fit:cover;">
              <img :src="selectedReservation.hospitalImgUrl" class="milcho-customHosImage" style="width: 100%; height: 100%; object-fit: cover;" />
            </v-avatar>
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
  
          <!-- 사용자 이벤트 상세 정보 또는 생성 양식 -->
          <div v-else-if="selectedEvent && !isReservationEvent || isEditing ">
            <!-- 이벤트 디테일 보기 -->
            <div v-if="!isEditing">
              <div class="milcho-reservation-row">
                <strong>제목</strong>
                <span>{{ formData.title }}</span>
              </div>
              <div class="milcho-reservation-row">
                <strong>내용</strong>
                <span class="milcho-custom-span">{{ formData.content }}</span>
              </div>
              <div class="milcho-reservation-row">
                <strong>타입</strong>
                <span>{{ formData.type }}</span>
              </div>
              <div class="milcho-reservation-row">
                <strong>시작일</strong>
                <span>{{ formData.startDateText }}</span>
              </div>
              
              <div class="milcho-reservation-row">
                <strong>종료일</strong>
                <span>{{ formData.endDateText }}</span>
              </div>
              <v-btn class="milcho-btn-edit" @click="isEditing = true">수정하기</v-btn>
            </div>
  
            <!-- 이벤트 수정 및 생성 폼 -->
            <v-form ref="form" v-if="isEditing">
              <v-text-field v-model="formData.title" variant="underlined" label="제목" required />
              <v-textarea
                v-model="formData.content"
                label="내용"
                rows="5"
                outlined  
                class="milcho-custom-textarea"
              />
              <v-select
                v-model="formData.type"
                :items="eventTypes"
                item-title="name"
                item-value="type"
                label="타입"
                required
              />
              <v-menu
                v-model="menuStart"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-x="true"
                min-width="auto"
              >
                <template v-slot:activator="{ attrs }">
                  <v-text-field v-model="formData.startDateText" label="시작일" readonly v-bind="attrs" @click.stop="menuStart = true" />
                </template>
                <v-date-picker v-model="formData.startDate" @input="updateStartDate" show-current="true" scrollable class="milcho-custom-picker">
                  <template v-slot:actions>
                    <div class="milcho-center-align">
                    <v-btn text color="primary" @click="confirmStartDate">확인</v-btn>
                    </div>
                  </template>
                </v-date-picker>
              </v-menu>
  
              <v-menu
                v-model="menuEnd"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-x="true"
                min-width="auto"
              >
                <template v-slot:activator="{ attrs }">
                  <v-text-field v-model="formData.endDateText" label="종료일" readonly v-bind="attrs" @click.stop="menuEnd = true" />
                </template>
                <v-date-picker v-model="formData.endDate" @input="updateEndDate" show-current="true" scrollable 
                class="milcho-custom-picker">
                  <template v-slot:actions>
                    <v-btn text color="primary" @click="confirmEndDate">확인</v-btn>
                  </template>
                </v-date-picker>
              </v-menu>
  
              <v-btn v-if="isEditing" class="milcho-btn-delete" elevation="0" @click="deleteEvent">삭제</v-btn>
              <v-divider vertical class="milcho-vertical-divider"></v-divider>
              <v-btn class="milcho-btn-save" elevation="0" @click="handleSaveEvent">저장</v-btn>

            </v-form>
          </div>
  
          <!-- 아무것도 선택되지 않은 경우 -->
          <div v-else>
            <p>선택된 예약 또는 이벤트가 없습니다.</p>
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
          eventClick: this.handleEventClick,
          displayEventTime: true,
          navLinks: true,
          dayCellClassNames: (arg) => {
            const day = arg.date.getDay();
            if (day === 0) {
            return 'fc-sunday';
            } else if (day === 6) {
            return 'fc-saturday';
            } else {
            return 'fc-weekday';
            }
        },
        dayHeaderClassNames: (arg) => {
            const day = arg.date.getDay();
            if (day === 0) {
            return 'fc-sunday-header';
            } else if (day === 6) {
            return 'fc-saturday-header';
            } else {
            return 'fc-weekday-header';
            }
        },
        datesSet: this.handleDatesSet,
        locale: 'ko', // 한국어 로케일 설정
        },
        isModalOpen: false,
        isEditing: false,
        eventTypes: [
            { name: '진행 중', type: 'IN_PROGRESS' },
            { name: '완료됨', type: 'COMPLETED' }
        ],
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
        holidays: [], // 공휴일 초기화
        menuStart: false,
        menuEnd: false,
        childList: [],
        reservationList: [],
        userEvents: [],
        selectedReservation: null,
        selectedEvent: null,
        isReservationEvent: false,
        selectedChildName: '',
        selectedChild: null,
        colorPalette: ['#FF9800', '#4CAF50', '#FFC107', '#2196F3', '#9C27B0', '#E91E63', '#00BCD4', '#3F51B5', '#8BC34A', '#FF5722'],
        colorIndex: 0,
        memberColors: {},
      };
    },
methods: {
    handleDatesSet(info) {
    const startDate = info.start.toISOString(); // 시작일 ISO 포맷
    const endDate = info.end.toISOString();     // 종료일 ISO 포맷

    this.fetchHolidays(startDate, endDate);
    if (this.selectedChild) {
        this.fetchReservationList(this.selectedChild, startDate, endDate);
    }
    },


    fetchHolidays(startDate, endDate) {
        axios
            .get(`${process.env.VUE_APP_API_BASE_URL}/member-service/api/google-calendar-holidays`, {
            params: {
                start: startDate,
                end: endDate,
            },
            })
        .then((response) => {
            // 공휴일 데이터를 저장
            this.holidays = response.data.items.map(korea => ({
                title: korea.summary,
                start: korea.start.date || korea.start.dateTime,
                end: korea.end.date || korea.end.dateTime,
                allDay: true,
                backgroundColor: 'red',
                editable: false,
                extendedProps: {
                    isHoliday: true,
                }
            }));

            // 공휴일을 가져온 후 이벤트 결합
            this.combineEvents();
        })
        .catch((error) => {
            console.error('Error fetching holidays:', error);
        });
    },



    fetchChildList() {
    axios
        .get(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/`)
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
        this.colorIndex = 0;
        this.memberColors = {};

        axios
            .get(`http://localhost:8080/reservation-service/reservation/list/child/${child.id}`)
            .then((response) => {
                const reservationEvents = response.data.map((reservation) => {
                    let memberName = reservation.memberName;

                    if (!this.memberColors[memberName]) {
                        this.memberColors[memberName] = this.colorPalette[this.colorIndex];
                        this.colorIndex = (this.colorIndex + 1) % this.colorPalette.length;
                    }

                    return {
                        title: `${reservation.hospitalName} - ${reservation.medicalItem}`,
                        start: new Date(`${reservation.reservationDate}T${reservation.reservationTime}`),
                        end: new Date(`${reservation.reservationDate}T${reservation.reservationTime}`),
                        backgroundColor: this.memberColors[memberName],
                        allDay: false,
                        editable: false,
                        extendedProps: {
                            ...reservation,
                            isReservationEvent: true,
                        },
                    };
                });
                this.reservationList = reservationEvents;

                // 예약 리스트를 가져온 후 이벤트 결합
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
                isReservationEvent: false,
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
    // 공휴일, 사용자 이벤트, 예약 리스트를 모두 결합
    this.calendarOptions.events = [...this.holidays, ...this.userEvents, ...this.reservationList];
    
    this.$nextTick(() => {
        if (this.$refs.fullCalendar) {
            this.$refs.fullCalendar.getApi().refetchEvents();
        }
    });
    },

  
    handleChildClick(child) {
    // 자녀 선택 후 selectedChild에 저장
        this.selectedChild = child;
        this.fetchReservationList(child);
    },

  
      handleEventClick(info) {
        const isReservationEvent = info.event.extendedProps.isReservationEvent;
        const isHoliday = info.event.extendedProps.isHoliday;

        // 공휴일일 경우 아무 동작도 하지 않음
        if (isHoliday) {
        return;  // 클릭 이벤트를 무시
        }
  
        if (isReservationEvent) {
          this.selectedReservation = info.event.extendedProps;
          this.isReservationEvent = true;
        } else {
          this.isEditing = false; // 처음엔 수정모드가 아님
          this.selectedEvent = info.event.extendedProps;
          this.formData.id = info.event.id;
          this.formData.title = info.event.title;
          this.formData.content = info.event.extendedProps.content;
          this.formData.startDate = info.event.start;
          this.formData.endDate = info.event.end;
          this.formData.startDateText = this.formatDate(info.event.start);
          this.formData.endDateText = this.formatDate(info.event.end);
          this.formData.type = info.event.extendedProps.type || '';
          this.isReservationEvent = false;
        }
      },
  
      handleDateClick(info) {
        this.isEditing = false;
        this.formData.startDate = info.date;
        this.formData.endDate = info.date;
        this.formData.startDateText = this.formatDate(info.date);
        this.formData.endDateText = this.formatDate(info.date);
        this.selectedEvent = null;
        this.isReservationEvent = false;
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
        const url = this.isEditing
          ? `${process.env.VUE_APP_API_BASE_URL}/member-service/event/update/${this.formData.id}`
          : `${process.env.VUE_APP_API_BASE_URL}/member-service/event/create`;
  
        const payload = {
          title: this.formData.title,
          content: this.formData.content,
          startTime: `${this.formData.startDateText}T00:00:00`,
          endTime: `${this.formData.endDateText}T23:59:59`,
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
            this.fetchUserEvents(); // 이벤트 저장 후 사용자 이벤트 새로고침
            this.isEditing = false; // 수정 모드를 해제하고 다시 디테일을 보여줌
          })
          .catch((error) => {
            console.error('Error saving event:', error);
          });
      },
  
      deleteEvent() {
        const id = this.formData.id;
  
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/member-service/event/delete/${id}`)
          .then(() => {
            this.fetchUserEvents(); // 삭제 후 사용자 이벤트 새로고침
          })
          .catch((error) => {
            console.error('Error deleting event:', error);
          });
      },
  
      startNewEvent() {
        this.isEditing = true;
        this.formData = {
          id: null,
          title: '',
          content: '',
          startDate: new Date(),
          endDate: new Date(),
          startDateText: this.formatDate(new Date()),
          endDateText: this.formatDate(new Date()),
          type: '',
        };
        this.selectedEvent = null;
        this.isReservationEvent = false;
      },
    },
  
    mounted() {
        this.fetchUserEvents(); 
        this.fetchChildList(); 
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
  .milcho-custom-calendar {
    width: 700px;
    height: 800px;
    margin: auto;
    margin-left: 250px;
  }
  .milcho-custom-calendar .fc-h-event {
    border: none !important; /* 테두리 완전히 제거 */
  }
  
  .milcho-details {
    width: 400px;
    height: 740px;
    border: 1px solid #ddd;
    background-color: #f9f9f9;
    margin-bottom: 30px;
    margin-top: 144px;
    margin-right: 30px;
    border-radius: 10px;
    padding: 20px;
  }
  
  .milcho-reservation-row {
    display: flex;
    margin-bottom: 10px;
    margin-left: 20px;
  }
  
  .milcho-reservation-row strong {
    width: 100px;
  }
  
  .milcho-btn-save {
    background-color: #C2D7FF !important;
    color: #00499e;
    border-radius: 20px;
    width: 50px;
    height: 44px;
    margin-bottom: 40px;
    margin-top: 10px;
    margin-left: 20px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius : 20px;
    font-weight: bold;

  }
  
  .milcho-btn-delete {
    background-color: #FFAFAF !important;
    color: #650101;
    width: 50px;
    height: 44px;
    margin-bottom: 40px;
    margin-top: 10px;
    margin-left: 105px;
    border-radius: 20px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius : 20px;
    font-weight: bold;
  }
  .milcho-vertical-divider {
    width: 1px !important;
    height: 30px !important;
    background-color: black o !important;
    margin: 0 10px !important; 
    margin-left: 10px !important;
    position: absolute !important;
    margin-top: 8px !important;
  }
  
  .milcho-btn-edit {
    background-color: #c2d7ff !important;
    margin-left: 135px;
    margin-top: 10px;
  }
  
  .milcho-btn-add {
    position: relative; /* 상대적인 위치를 설정 */
    top: 40px; /* 버튼을 10px 아래로 이동 */
    background-color: #ECF2FD !important;
    margin-left: 1330px;
    width: 40px;  /* 원형을 만들기 위한 가로 크기 */
    height: 40px; /* 원형을 만들기 위한 세로 크기 */
    min-width: 50px !important;  /* 최소 너비를 동일하게 설정하여 원형 유지 */
    min-height: 50px !important; /* 최소 높이도 동일하게 설정 */
    border-radius: 50% !important; /* 원형을 만들기 위한 테두리 둥글기 */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .milcho-custom-picker {
    display: flex;
    justify-content: center; /* date-picker 전체를 가운데로 */
    align-items: center;
    margin-left: 700px;
    margin-top: 200px;

  }
  
  .milcho-center-align {
    display: flex;
    justify-content: center; /* 버튼을 가운데로 */
    width: 100%; /* 버튼을 부모 크기에 맞춤 */
  }
  .milcho-custom-span {
    display: block;      /* span을 블록 요소로 변경하여 줄바꿈 가능 */
    width: 400px;        /* 원하는 너비를 설정 */
    word-wrap: break-word; /* 긴 단어가 있을 경우 줄바꿈 처리 */
    white-space: normal; /* 텍스트가 자동으로 줄바꿈되도록 설정 */
    margin-left: 40px;
  }
  .fc-weekday .fc-daygrid-day-number {
    color: black;
  }
  
  /* 토요일 텍스트 색상 */
  .fc-saturday .fc-daygrid-day-number {
    color: blue;
  }
  
  /* 일요일 텍스트 색상 */
  .fc-sunday .fc-daygrid-day-number {
    color: red;
  }
/* 월~금요일 헤더 텍스트 색상 */
.fc-weekday-header .fc-col-header-cell-cushion {
    color: black !important;
  }
  
  /* 토요일 헤더 텍스트 색상 */
  .fc-saturday-header .fc-col-header-cell-cushion {
    color: blue !important;
  }
  
  /* 일요일 헤더 텍스트 색상 */
  .fc-sunday-header .fc-col-header-cell-cushion {
    color: red !important;
  }
  
  </style>
  