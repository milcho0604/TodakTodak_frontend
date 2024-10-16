<template>
    <v-container>
        <v-row>
            <div class="member-title inter-bold mt-10">일반 회원 목록</div>
        </v-row>
        <v-row>
            <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="searchQuery"
                    label="검색어 입력 (이름 또는 이메일)"
                    clearable
                    variant="underlined"  
                    @input="filterMembers"
                    style="max-width: 300px; margin-left: 30px;"
                  />
                </v-col>
              </v-row>
        </v-row>
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
                            <th>회원 상태</th> <!-- 추가된 열 -->
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
        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/list`, {
                params: {
                    page: this.page - 1, // Spring에서 페이지는 0부터 시작
                    size: 1, // 페이지당 10개의 항목을 표시
                },
            });
            this.members = response.data.result.content;
            this.filteredMembers = this.members; // 필터링된 회원 목록 초기화
            this.totalPages = response.data.result.totalPages; // 전체 페이지 수 설정
        } catch (error) {
            console.error('Error fetching members:', error);
        }
    },

    async filterMembers() {
        if (!this.searchQuery) {
        // 검색어가 없으면 전체 리스트를 보여줌
        this.page = 1; // 검색어를 지울 때 페이지를 초기화
        this.fetchMembers(); // 전체 목록을 다시 로드
        return;
        }

        try {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/search`, {
                params: {
                    query: this.searchQuery,
                    page: this.page - 1,
                    size: 10,
                },
            });
            this.filteredMembers = response.data.result.content;
            this.totalPages = response.data.result.totalPages;
        } catch (error) {
            console.error('Error searching members:', error);
        }
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
