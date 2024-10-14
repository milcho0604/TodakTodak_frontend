<template>
    <div class="calendar-container">
      <!-- FullCalendar Integration -->
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
              <v-select
                v-model="formData.type"
                :items="eventTypes"
                label="Event Type"
                required
              />
  
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
                    label="Start Date"
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
                    label="End Date"
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
      FullCalendar,
    },
    data() {
      return {
        calendarOptions: {
          plugins: [dayGridPlugin, interactionPlugin],
          initialView: 'dayGridMonth',
          events: [], // Calendar events will be fetched and set here
          dateClick: this.handleDateClick,
          eventClick: this.handleEventClick,
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
      };
    },
    methods: {
      formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
  
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
  
        return [year, month, day].join('-');
      },
  
      updateStartDate(val) {
        this.formData.startDate = val;
        this.formData.startDateText = this.formatDate(val);
      },
  
      updateEndDate(val) {
        this.formData.endDate = val;
        this.formData.endDateText = this.formatDate(val);
      },
  
      confirmStartDate() {
        this.updateStartDate(this.formData.startDate);
        this.menuStart = false;
      },
  
      confirmEndDate() {
        this.updateEndDate(this.formData.endDate);
        this.menuEnd = false;
      },
  
      // Save event (either create or update)
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
            this.fetchUserEvents(); // Refresh events after saving
          })
          .catch((error) => {
            console.error('Error saving event:', error);
          });
      },
  
      // Fetch user events
      fetchUserEvents() {
        axios
          .get(`${process.env.VUE_APP_API_BASE_URL}/member-service/event/list`)
          .then((response) => {
            const userEvents = response.data.content.map((event) => ({
              id: event.id,
              title: event.title,
              start: new Date(event.startTime),
              end: new Date(event.endTime),
              backgroundColor: '#4CAF50', // User event color
              extendedProps: {
                content: event.content,
                type: event.type,
              },
            }));
            this.calendarOptions.events = userEvents;
          })
          .catch((error) => {
            console.error('Error fetching user events:', error);
          });
      },
  
      // Handle Date Click to open modal
      handleDateClick(info) {
        this.isEditing = false;
        this.formData.startDate = info.date;
        this.formData.endDate = info.date;
        this.formData.startDateText = this.formatDate(info.date);
        this.formData.endDateText = this.formatDate(info.date);
        this.isModalOpen = true;
      },
  
      // Handle Event Click to edit
      handleEventClick(info) {
        this.isEditing = true;
        this.formData.id = info.event.id;
        this.formData.title = info.event.title;
        this.formData.content = info.event.extendedProps.content;
        this.formData.startDate = info.event.start;
        this.formData.endDate = info.event.end;
        this.formData.startDateText = this.formatDate(info.event.start);
        this.formData.endDateText = this.formatDate(info.event.end);
        this.isModalOpen = true;
      },
    },
    mounted() {
      this.fetchUserEvents(); // Fetch user events on mount
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
    max-width: 900px;
    height: 800px;
    margin: auto;
  }
  </style>
  