<template>
    <v-container>
        <v-row>
            <div class="member-title inter-bold mt-10">일반 회원 목록</div>
        </v-row>

        <!-- 검색어 입력 -->
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="searchQuery"
                    label="검색어 입력 (이름 또는 이메일)"
                    clearable
                    variant="underlined"
                    @input="onSearchInput"
                    style="max-width: 300px; margin-left: 30px;"
                />
            </v-col>
        </v-row>

        <!-- 필터 버튼 -->
        <v-row>
            <v-chip @click="filterVerified('all')" class="mr-2 ml-3">전체 회원</v-chip>
            <v-chip @click="filterVerified(true)" class="mr-2">인증 회원</v-chip>
            <v-chip @click="filterVerified(false)" class="mr-2">미인증 회원</v-chip>
            <v-chip @click="filterDeleted('all')" class="mr-2">전체 상태</v-chip>
            <v-chip @click="filterDeleted('true')" class="mr-2">정상 회원</v-chip>
            <v-chip @click="filterDeleted('false')" class="mr-2">탈퇴 회원</v-chip>
        </v-row>

        <!-- 멤버 리스트 -->
        <v-row>
            <v-col>
                <v-table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" @change="toggleSelectAll" /></th> 
                            <th>ID</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>전화번호</th>
                            <th>주소</th>
                            <th>인증 상태</th>
                            <th>회원 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="member in filteredMembers" :key="member.id">
                            <td><input type="checkbox" v-model="selectedItems" :value="member" /></td>
                            <td>{{ member.id }}</td>
                            <td>{{ member.name }}</td>
                            <td>{{ member.memberEmail }}</td>
                            <td>{{ member.phone }}</td>
                            <td>{{ member.address.city }}, {{ member.address.street }} ({{ member.address.zipcode }})</td>
                            <td>
                                <v-chip :color="member.verified ? '' : 'red'" dark small>
                                    {{ member.verified ? '인증' : '미인증' }}
                                </v-chip>
                            </td>
                            <td>
                                <v-chip :color="member.deletedAt ? 'red' : ''" dark small>
                                    {{ member.deletedAt ? '탈퇴' : '정상' }}
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
                @input="fetchMembers"
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
            members: [], // 전체 회원 목록
            filteredMembers: [], // 필터된 회원 목록
            searchQuery: '', // 검색어
            selectedItems: [], // 선택된 항목을 저장할 배열
            selectedMembers: [], // 선택된 항목의 ID만 저장할 배열
            page: 1, // 현재 페이지
            totalPages: 1, // 전체 페이지 수
            filterVerifiedStatus: 'all', // 인증 필터 상태
            filterDeletedStatus: 'all', // 탈퇴 필터 상태
        };
    },
    created() {
        this.fetchMembers();
    },
    watch: {
        selectedItems(val) {
            this.selectedMembers = val.map((item) => item.id);
        },
        page(newPage) {
            console.log(newPage)
            this.fetchMembers(); // 페이지 변경 시 멤버 목록을 다시 로드
        },
    },
    methods: {
        async fetchMembers() {
            const url = this.searchQuery
                ? `${process.env.VUE_APP_API_BASE_URL}/member-service/member/search`
                : `${process.env.VUE_APP_API_BASE_URL}/member-service/member/list`;

            try {
                const response = await axios.get(url, {
                    params: {
                        query: this.searchQuery || undefined, // 검색어가 있을 때만 추가
                        page: this.page - 1, // Spring에서 페이지는 0부터 시작
                        size: 10, // 페이지당 10개의 항목을 표시
                    },
                });
                this.members = response.data.result.content;
                this.filteredMembers = this.members; // 필터링된 회원 목록 초기화
                this.totalPages = response.data.result.totalPages; // 전체 페이지 수 설정
                this.applyFilters(); // 필터 적용
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        },

        // 검색어 입력 시 호출되는 메서드
        onSearchInput() {
            this.page = 1; // 검색어 입력 시 페이지를 1로 초기화
            this.fetchMembers(); // 검색어에 맞는 목록을 가져옴
        },

        // 인증 상태 필터링
        filterVerified(status) {
            this.filterVerifiedStatus = status;
            this.applyFilters();
        },

        // 탈퇴 상태 필터링
        filterDeleted(status) {
            this.filterDeletedStatus = status;
            this.applyFilters();
        },

        // 필터 적용
        applyFilters() {
            this.filteredMembers = this.members.filter((member) => {
                const matchVerified =
                    this.filterVerifiedStatus === 'all' ||
                    member.verified === this.filterVerifiedStatus;
                const matchDeleted =
                    this.filterDeletedStatus === 'all' ||
                    (member.deletedAt ? true : false) === this.filterDeletedStatus;

                return matchVerified && matchDeleted;
            });
        },
    },
};
</script>

<style scoped>
.member-title {
    text-align: center;
    margin: auto;
    font-size: 25px;
    color: #00499E;
}

.member-container {
    margin-bottom: 20px;
}

.member-box {
    padding: 20px;
    border-radius: 10px;
    background-color: #ffffff;
    border: 1px solid #dbdbdb;
    cursor: pointer;
}

.member-box:hover {
    background-color: #f9f9f9;
}

.member-title {
    font-family: 'Inter', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #000000;
}

.member-info {
    font-family: 'ABeeZee', sans-serif;
    font-size: 14px;
    font-weight: 400;
    color: #888888;
    margin-top: 10px;
}

.member-header {
    width: 100%;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.header-title {
    font: bold;
    font-family: 'Inter';
    font-weight: 700;
    font-size: 30px;
    color: #000000;
    text-align: center;
    margin-bottom: 10px;
}
</style>
