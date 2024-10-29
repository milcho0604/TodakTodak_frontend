<template>
    <v-container style="width: 100%;">
        <v-row>
            <h3 class="cs-text">고객 상담</h3>
        </v-row>

        <v-row style="margin-top: -20px;">
            <v-col>
                <v-table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>상담 내용</th>
                            <th>처리 상태</th>
                            <th>채팅방 ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- 만약 눌렀을때 그 채팅방으로 이동하고 싶으면 여기서 @click 넣으면 됌 -->
                        <tr v-for="cs in filteredCsList" :key="cs.id">
                            <td>{{ cs.id }}</td>
                            <td>{{ cs.csContents }}</td>
                            <td>
                                <!-- {{ translateCsStatus(cs.csStatus) }} -->
                                <v-chip :color="getCsStatusColor(cs.csStatus)" dark>
                                    {{ translateCsStatus(cs.csStatus) }}
                                </v-chip>
                            </td>
                            <td>{{ cs.chatRoomId }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>

        <!-- 페이지 네이션 -->
        <v-row justify="center" class="mt-4">
            <v-pagination
                v-model="currentPage"
                :length="totalPages"
                @input="fetchCsList"
                :total-visible="2"
                class="pagination-center" 
            ></v-pagination>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    props:{
        memberId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            csList: [], // 전체 상담 내역 목록
            filteredCsList: [], // 필터된 상담 내역 목록 추가
            searchQuery: '', // 검색어
            currentPage: 1,  // 현재 페이지
            totalPages: 0,   // 총 페이지 수
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
    watch:{
        currentPage(newCurrnetPage){
            if(newCurrnetPage){
                this.fetchCsList();
            }
        }
    },
    methods: {
        async fetchCsList() {
            try {
                let params = {
                    page: this.currentPage -1
                };
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/cs/list/member/${this.memberId}`,{params});
                
                if (response.data && response.data.result) {
                    this.csList = response.data.result.content;
                    this.filteredCsList = this.csList; // 필터링 결과를 따로 저장
                    this.totalPages = response.data.result.totalPages; // 총 페이지 수 저장
                    console.log("csList : ", this.csList);
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
        getCsStatusColor(status) {
            const csStatusColorMap = {
                '처리중': 'green',
                '처리완료': 'blue'
            };
            return csStatusColorMap[status] || 'gray'; // 기본 색상은 gray로 설정
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
        nextLevel(csId) {
            this.$router.push(`/admin/cd/detail/${csId}`); // 병원의 id를 사용하여 상세 페이지로 이동
        },
    },
    mounted() {
        console.log("나는 멤버 아이디",this.memberId);
    }
};
</script>

<style scoped>
.cs-text {
    padding-top: 20px;
    padding-left: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #676767;
}
.pagination-center {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
</style>
