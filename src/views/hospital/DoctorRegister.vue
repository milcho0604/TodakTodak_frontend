<template>
    <v-container class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <v-row justify="center" align="center" class="inter-bold title">
            <v-col class="d-flex align-center justify-center">
                <img src="@/assets/doctor.png" width="50px" />
                <span style="margin-left: 10px;">병원 내 의사 목록</span>
            </v-col>
        </v-row>
        
        <v-row justify="center" style="position: relative; transform: translateX(380px); margin-bottom: 10px;">
            <div class="round inter-normal dark-blue" @click="createModal = true">
                <v-icon class="plus-icon">mdi-plus-circle-outline</v-icon>
            </div>  
        </v-row>

        <v-row justify="center">
            <div style="display: flex; justify-content: center; align-items: flex-start; flex-direction: column;"> 
                <v-table style="width: 770px;">
                    <thead>
                        <tr>
                            <th style="text-align: center;">no.</th>  
                            <th style="text-align: center;">사진</th>
                            <th style="text-align: center;">이름</th>
                            <th style="text-align: center;">이메일</th>
                            <th style="text-align: center;">인증여부</th>
                            <th></th>                  
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="doctor in doctors" :key="doctor.id">
                            <td style="text-align: center;">{{ doctor.id }}</td>
                            <td style="text-align: center;">
                                <v-avatar size="40" class="mr-4">
                                    <v-img :src="doctor.profileImgUrl ? doctor.profileImgUrl : require('@/assets/doctor.png')" />
                                </v-avatar>
                            </td>
                            <td style="text-align: center; white-space: nowrap;" @click="goToDoctorDetail(doctor)" class="clickable">{{ doctor.name }}</td>
                            <td style="text-align: center;">{{ doctor.doctorEmail }}</td>
                            <td style="text-align: center;">
                                <v-chip :color="doctor.verified ? 'green' : 'red'" dark>
                                    {{ doctor.verified ? '인증 완료' : '미인증' }}
                                </v-chip>
                            </td>
                            <td style="text-align: center;">
                                <v-btn class="delete-icon" @click="openDeleteModal(doctor.id)"> 삭제 </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </v-row>
        
        <!-- 의사 추가 모달 -->
        <DoctorCreateModal 
            v-model="createModal" 
            @update:dialog="createModal = $event; this.fetchDoctor()"
            @doctor-exists="openChildExistsDialog">
        </DoctorCreateModal>

        <DoctorDeleteModal 
            v-model="doctorDeleteModal"
            :doctor-id="selectedDoctorId"
            :doctor-email="selectedDoctorEmail"
            @update:dialog="doctorDeleteModal = $event"
            @deleted="fetchDoctor">
        </DoctorDeleteModal>

    </v-container>
    <HospitalAdminSideBar/>
</template>

<script>
import axios from 'axios';
import DoctorCreateModal from './DoctorCreateModal.vue';
import DoctorDeleteModal from './DoctorDeleteModal.vue';
import HospitalAdminSideBar from '@/components/sidebar/HospitalAdminSideBar.vue';

export default {
    components: {
        DoctorCreateModal,
        DoctorDeleteModal,
        HospitalAdminSideBar,
    },
    data() {
        return {
            createModal: false,
            doctorDeleteModal: false,
            doctors: [],
            selectedDoctorId: null,
            selectedDoctorEmail: '',
        }
    },
    created() {
        this.fetchDoctor();
    },
    methods: {
        async fetchDoctor() {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctors`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                this.doctors = response.data.result.content;
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
            }
        },
        openDeleteModal(doctorId) {
            const doctor = this.doctors.find(doc => doc.id === doctorId);
            if (doctor) {
                this.selectedDoctorId = doctorId;
                this.doctorDeleteModal = true;
                this.selectedDoctorEmail = doctor.doctorEmail;
            }
        },
        goToDoctorDetail(doctor) {
            this.$store.commit('setDoctorEmail', doctor.doctorEmail); // doctorEmail
            this.$store.commit('setDoctorId', doctor.id); // doctorId
            this.$router.push({ path: '/doctor/detail' }); // 디테일 페이지로 이동
        }
    }
}
</script>

<style scoped>
.delete-icon {
    box-shadow: none !important;
    border-radius: 16px;
    background-color: #f44336;
    color: white;
    padding: 6px 12px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

.delete-icon:hover {
    background-color: #d32f2f;
}
</style>
