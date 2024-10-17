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
                                <v-img :src="doctor.profileImgUrl || 'https://via.placeholder.com/55'" alt="doctor image" style="width: 55px; margin: auto;" />
                            </td>
                            <td style="text-align: center; white-space: nowrap;">{{ doctor.name }}</td>
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
        <DoctorCreateModal v-model="createModal" @update:dialog="createModal = $event; this.fetchDoctor()"
            @doctor-exists="openChildExistsDialog"></DoctorCreateModal>

        <DoctorDeleteModal 
            v-model="doctorDeleteModal"
            :doctor-id="selectedDoctorId"
            :doctor-email="selectedDoctorEmail"
            @update:dialog="doctorDeleteModal = $event"
            @deleted="fetchDoctor" >
        </DoctorDeleteModal>

    </v-container>
    <MyPageSideBar/>
</template>

<script>
import axios from 'axios';
import MyPageSideBar from "@/components/sidebar/MyPageSideBar.vue";
import DoctorCreateModal from './DoctorCreateModal.vue';
import DoctorDeleteModal from './DoctorDeleteModal.vue';

export default {
    components: {
        DoctorCreateModal,
        DoctorDeleteModal,
        MyPageSideBar,
    },
    data() {
        return {
            createModal: false,
            doctorDeleteModal: false, // 변수 이름 수정
            doctors: [],
            selectedDoctorId: null,
            doctorExistsMessage: [],
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
                this.doctors = response.data.result.content; // 데이터가 비어있지 않은지 확인
                console.log(response.data.result);
            } catch (error) {
                console.error('Failed to fetch doctors:', error);
            }
        },
        openDeleteModal(doctorId) {
            const doctor = this.doctors.find(doc => doc.id === doctorId);
            if(doctor){
                this.selectedDoctorId = doctorId;
                this.doctorDeleteModal = true; // 변수 이름 수정
                this.selectedDoctorEmail = doctor.doctorEmail;
            }
        },
    }
}
</script>


<style scoped>

.delete-icon {
    box-shadow: none !important; /* 그림자 제거 */
    border-radius: 16px; /* 둥근 테두리 */
    background-color: #f44336; /* 배경색 (레드) */
    color: white; /* 텍스트 색상 */
    padding: 6px 12px; /* 내부 여백 */
    border: none; /* 기본 테두리 제거 */
    cursor: pointer; /* 포인터 커서 */
    transition: background-color 0.3s; /* 배경색 전환 효과 *
}

.delete-icon:hover {
    background-color: #d32f2f; /* 호버 시 색상 변경 */
}
</style>