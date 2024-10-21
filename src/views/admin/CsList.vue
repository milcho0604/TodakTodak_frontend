<template>
    <v-container style="width: 100%;">
        <v-row>
            <div class="cs-title inter-bold mt-10">상담 내역</div>
        </v-row>

        <!-- 검색어 입력 -->
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="searchQuery"
                    label="검색어 입력 (이메일 또는 이름)"
                    clearable
                    variant="underlined"
                    @input="onSearchInput"
                    style="max-width: 300px; margin-left: 30px;"
                />
            </v-col>
        </v-row>

        <!-- 상담 상태 필터 버튼 -->
        <v-row>
            <v-chip-group active-class="selected-chip" class="ml-3">
                <v-chip
                    v-for="(label, value) in csStatusOptions"
                    :key="value"
                    @click="() => { 
                        filterCsStatus = value; 
                        fetchCsList(); 
                    }"
                    :input-value="filterCsStatus === value"
                    class="mr-2"
                    filter
                >
                    {{ label }}
                </v-chip>
            </v-chip-group>
        </v-row>

        <!-- 상담 내역 리스트 -->
        <v-row>
            <v-col>
                <v-table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>상담 내용</th>
                            <th>상담 상태</th>
                            <th>채팅방 ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="cs in filteredCsList" :key="cs.id">
                            <td>{{ cs.id }}</td>
                            <td>{{ cs.memberName }}</td>
                            <td>{{ cs.memberEmail }}</td>
                            <td>{{ cs.csContents }}</td>
                            <td>{{ translateCsStatus(cs.csStatus) }}</td>
                            <td>{{ cs.chatRoomId }}</td>
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
                @input="fetchCsList"
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
            csList: [], // 전체 상담 내역 목록
            filteredCsList: [], // 필터된 상담 내역 목록 추가
            searchQuery: '', // 검색어
            page: 1, // 현재 페이지
            totalPages: 1, // 전체 페이지 수
            filterCsStatus: 'all', // 상담 상태 필터 상태 (초기값 'all')
            csStatusOptions: {
                all: '전체',
                COMPLETED: '완료',
                INPROCESS: '진행 중'
            },
        };
    },
    created() {
        this.fetchCsList();
    },
    methods: {
        async fetchCsList() {
            try {
                const params = {
                    page: this.page - 1, // 페이지는 0부터 시작
                    size: 3, // 페이지당 5개씩
                    csStatus: this.filterCsStatus !== 'all' ? this.filterCsStatus : null,
                    query: this.searchQuery || null, // 검색어를 이메일 또는 이름에 적용
                };

                const url = `${process.env.VUE_APP_API_BASE_URL}/member-service/cs/list`;
                const response = await axios.get(url, { params });
                
                if (response.data && response.data.content) {
                    this.csList = response.data.content;
                    this.filteredCsList = this.csList; // 필터링 결과를 따로 저장
                    this.totalPages = response.data.totalPages;
                } else {
                    console.error('Invalid response structure:', response.data);
                    this.csList = [];
                    this.filteredCsList = [];
                    this.totalPages = 1;
                }

            } catch (error) {
                console.error('Error fetching cs list:', error);
            }
        },
        translateCsStatus(status) {
            const csStatusMap = {
                COMPLETED: '완료',
                INPROCESS: '진행 중'
            };
            return csStatusMap[status] || status;
        },
        // 검색어 입력 시 호출되는 메서드
        onSearchInput() {
            this.page = 1; // 검색어 입력 시 페이지를 1로 초기화
            this.fetchCsList(); // 검색어에 맞는 목록 가져오기
        },
    },
    watch: {
        page(newPage) {
            console.log(newPage)
            this.fetchCsList(); // 페이지 변경 시 목록 다시 로드
        },
    },
};
</script>

<style scoped>
.cs-title {
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
