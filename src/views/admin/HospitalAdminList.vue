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
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
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
                    size: 2, // 페이지당 10개씩
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

        // 검색어 입력 시 호출되는 메서드
        onSearchInput() {
            this.page = 1; // 검색어 입력 시 페이지를 1로 초기화
            this.fetchHospitals(); // 검색어에 맞는 목록 가져오기
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
.hospital-title {
    text-align: center;
    margin: auto;
    font-size: 25px;
    color: #00499E;
}

.selected-chip {
    background-color: #1976d2 !important;
    color: white !important;
}
</style>
