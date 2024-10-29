<template>
    <v-container>
        <v-row>
            <div class="hospital-title inter-bold mt-10">병원 목록</div>
        </v-row>

        <!-- 검색어 입력 -->
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="searchQuery"
                    label="검색어 입력 (이름 또는 대표자명)"
                    clearable
                    variant="underlined"
                    @input="onSearchInput"
                    style="max-width: 300px; margin-left: 30px;"
                />
            </v-col>
        </v-row>

        <!-- 필터 버튼 -->
        <v-row>
            <v-chip-group active-class="selected-chip" class="ml-3">
                <v-chip
                    v-for="(label, value) in acceptOptions"
                    :key="value"
                    @click="() => { 
                        filterAcceptStatus = value; 
                        fetchHospitals(); 
                    }"
                    :input-value="filterAcceptStatus === value.toString()"
                    class="mr-2"
                    filter
                >
                    {{ label }}
                </v-chip>
            </v-chip-group>
        </v-row>

        <!-- 병원 리스트 -->
        <v-row>
            <v-col>
                <v-table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>병원명</th>
                            <th>주소</th>
                            <th>전화번호</th>
                            <th>대표자명</th>
                            <th>이메일</th>
                            <th>승인 상태</th>
                            <th>탈퇴</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="hospital in filteredHospitals" :key="hospital.id">
                            <td>{{ hospital.id }}</td>
                            <td>{{ hospital.name }}</td>
                            <td>{{ hospital.address }}</td>
                            <td>{{ hospital.phoneNumber }}</td>
                            <td>{{ hospital.representativeName }}</td>
                            <td>{{ hospital.adminEmail }}</td>
                            <td>
                                <v-chip :color="hospital.isAccept ? 'green' : 'red'" dark small>
                                    {{ hospital.isAccept ? '승인됨' : '미승인' }}
                                </v-chip>
                            </td>
                            <td>
                                <v-chip
                                    color="red"
                                    dark
                                    @click="confirmDeleteHospital(hospital.id)"
                                >
                                    삭제
                                </v-chip>
                            </td>
                            <td>
                                <v-icon @click="nextLevel(hospital.id)">mdi-chevron-right</v-icon>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>

        <!-- 페이지 네이션 -->
        <v-row justify="center" class="mt-4">
            <v-pagination
                v-model="page"
                :length="totalPages"
                @input="fetchHospitals"
                :total-visible="5"
            ></v-pagination>
        </v-row>

        <!-- 삭제 확인 모달 -->
        <!-- <v-dialog v-model="confirmDialog" max-width="400px">
            <v-card>
                <v-card-title class="text-h6">삭제 확인</v-card-title>
                <v-card-text>이 병원을 삭제하시겠습니까?</v-card-text>
                <v-card-actions>
                    <v-btn text @click="confirmDialog = false">취소</v-btn>
                    <v-btn text color="red" @click="deleteHospital">삭제</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog> -->
        <v-dialog v-model="confirmDialog" persistent max-width="400px">
            <v-card class="approve-modal">
              <v-card-text>
                <div class="hospital-modal inter-bold mt-10">이 병원을 삭제하시겠습니까?</div>
              </v-card-text>
              <v-card-actions class="center-actions">
                <v-btn class="modal-cancel-btn" @click="confirmDialog = false">취소</v-btn>
                <v-divider vertical class="vertical-divider"></v-divider>
                <v-btn class="modal-submit-btn" @click="deleteHospital">삭제</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
    </v-container>
    <PadakAdminSideBar/>
</template>

<script>
import axios from 'axios';
import PadakAdminSideBar from '@/components/sidebar/PadakAdminSideBar.vue';

export default {
    components: {
        PadakAdminSideBar,
    },
    data() {
        return {
            hospitals: [], // 전체 병원 목록
            filteredHospitals: [], // 필터된 병원 목록
            searchQuery: '', // 검색어
            page: 1, // 현재 페이지
            totalPages: 1, // 전체 페이지 수
            filterAcceptStatus: 'all', // 선택된 승인 필터 상태 (초기값 'all')
            acceptOptions: {
                all: '전체',
                true: '승인된 병원',
                false: '미승인 병원',
            },
            confirmDialog: false, // 삭제 확인 모달 상태
            hospitalIdToDelete: null, // 삭제할 병원의 ID
        };
    },
    created() {
        this.fetchHospitals();
    },
    methods: {
        async fetchHospitals() {
            try {
                const params = {
                    page: this.page - 1, // 페이지는 0부터 시작
                    size: 10, // 페이지당 10개씩
                    accept: this.filterAcceptStatus !== 'all' ? this.filterAcceptStatus : null, // 필터 적용
                };

                if (this.searchQuery) {
                    params.query = this.searchQuery;
                }

                const url = this.searchQuery
                    ? `${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/admin/hospital/search`
                    : `${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/admin/hospital/list`;

                const response = await axios.get(url, { params });

                if (response.data && response.data.result && response.data.result.content) {
                    this.hospitals = response.data.result.content;
                    this.filteredHospitals = this.hospitals;
                    this.totalPages = response.data.result.totalPages;
                } else {
                    console.error('Invalid response structure:', response.data);
                    this.hospitals = [];
                    this.filteredHospitals = [];
                    this.totalPages = 1;
                }
            } catch (error) {
                console.error('Error fetching hospitals:', error);
            }
        },
        nextLevel(hospitalId) {
            this.$router.push(`/admin/hospital/detail/${hospitalId}`); // 병원의 id를 사용하여 상세 페이지로 이동
        },
        onSearchInput() {
            this.page = 1; // 검색어 입력 시 페이지를 1로 초기화
            this.fetchHospitals(); // 검색어에 맞는 목록 가져오기
        },
        confirmDeleteHospital(id) {
            this.hospitalIdToDelete = id; // 삭제할 병원의 ID 설정
            this.confirmDialog = true; // 삭제 확인 모달 열기
        },
        async deleteHospital() {
            try {
                const url = `${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/delete/${this.hospitalIdToDelete}`;
                await axios.delete(url);
                this.confirmDialog = false; // 모달 닫기
                this.fetchHospitals(); // 병원 목록 다시 로드
                alert('병원이 성공적으로 삭제되었습니다.');
            } catch (error) {
                console.error('Error deleting hospital:', error);
                alert('병원 삭제 중 오류가 발생했습니다.');
            }
        },
    },
    watch: {
        page(newPage) {
            console.log(newPage)
            this.fetchHospitals(); // 페이지 변경 시 목록 다시 로드
        },
    },
};
</script>
<style scoped>
.approve-modal {
    position: absolute;
    width: 360px;
    height: 230px !important;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #FFFFFF;
    padding: 20px;
  }
  
  .hospital-modal {
    text-align: center;
    margin: auto;
    font-size: 18px;
    color: #00499E;
  }
  .center-actions {
    display: flex;
    justify-content: center; /* 버튼들을 가운데 정렬 */
    align-items: center; /* 세로 정렬 */
    height: 30px;
    margin-bottom: 30px;
  }
  .vertical-divider {
    height: 34px !important;
    margin: 0 10px;
    margin-right: 2px;
    align-items: center;
  }
  
  .modal-cancel-btn {
    background-color: #CECECE !important;
    color: #717171;
    border-radius: 20px;
    width: 90px;
    height: 34px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-submit-btn {
    background-color: #C2D7FF !important;
    color: #00499e;
    border-radius: 20px;
    width: 90px;
    height: 34px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 52px;
  }
</style>