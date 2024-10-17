<template>
    <v-container>
        <v-row>
            <div class="member-title inter-bold mt-10">회원 목록</div>
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
            <!-- 인증 상태 필터 -->
            <v-chip-group active-class="selected-chip">
                <v-chip
                    v-for="(label, value) in verifiedOptions"
                    :key="value"
                    @click="filterVerifiedStatus = value; fetchMembers();"
                    :input-value="filterVerifiedStatus === value"
                    class="mr-2"
                    filter
                >
                    {{ label }}
                </v-chip>
            </v-chip-group>

            <!-- 회원 상태 필터 -->
            <v-chip-group active-class="selected-chip">
                <v-chip
                    v-for="(label, value) in deletedOptions"
                    :key="value"
                    @click="filterDeletedStatus = value; fetchMembers();"
                    :input-value="filterDeletedStatus === value"
                    class="mr-2"
                    filter
                >
                    {{ label }}
                </v-chip>
            </v-chip-group>
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
                            <th>회원 타입</th>
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
                                <v-chip :color="getRoleColor(member.role)" dark small>
                                    {{ getRoleLabel(member.role) }}
                                </v-chip>
                            </td>
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
            filterVerifiedStatus: 'true', // 선택된 인증 필터 상태 (초기값 true)
            filterDeletedStatus: 'false', // 선택된 탈퇴 필터 상태 (초기값 false)
            verifiedOptions: {
                true: '인증 회원',
                false: '미인증 회원',
            },
            deletedOptions: {
                false: '정상 회원',
                true: '탈퇴 회원',
            },
        };
    },
    created() {
        this.fetchMembers();
    },
    methods: {
        async fetchMembers() {
            try {
                const params = {
                    page: this.page - 1, // 페이지는 0부터 시작
                    size: 10, // 페이지당 10개씩
                    verified: this.filterVerifiedStatus, // 선택된 인증 필터
                    deleted: this.filterDeletedStatus, // 선택된 탈퇴 필터
                };

                if (this.searchQuery) {
                    params.query = this.searchQuery;
                }

                const url = this.searchQuery
                    ? `${process.env.VUE_APP_API_BASE_URL}/member-service/member/search`
                    : `${process.env.VUE_APP_API_BASE_URL}/member-service/member/list`;

                const response = await axios.get(url, { params });
                this.members = response.data.result.content;
                this.filteredMembers = this.members; // 필터링된 회원 목록 초기화
                this.totalPages = response.data.result.totalPages; // 전체 페이지 수 설정
            } catch (error) {
                console.error('Error fetching members:', error);
            }
        },

        getRoleLabel(role) {
            switch (role) {
                case 'TodakAdmin':
                    return '관리자';
                case 'HospitalAdmin':
                    return '병원관리자';
                case 'Member':
                    return '회원';
                case 'Doctor':
                    return '의사';
                default:
                    return '알 수 없음';
            }
        },
        getRoleColor(role) {
            switch (role) {
                case 'TodakAdmin':
                    return 'blue'; // 관리자: 파란색
                case 'HospitalAdmin':
                    return 'green'; // 병원관리자: 초록색
                case 'Member':
                    return 'grey'; // 회원: 회색
                case 'Doctor':
                    return 'purple'; // 의사: 보라색
                default:
                    return 'grey'; // 기본 색상: 회색
            }
        },

        // 검색어 입력 시 호출되는 메서드
        onSearchInput() {
            this.page = 1; // 검색어 입력 시 페이지를 1로 초기화
            this.fetchMembers(); // 검색어에 맞는 목록 가져오기
        },

        // 인증 필터 토글
        toggleVerifiedFilter(value) {
            this.filterVerifiedStatus = value;
            this.page = 1;
            this.fetchMembers();
        },

        // 탈퇴 필터 토글
        toggleDeletedFilter(value) {
            this.filterDeletedStatus = value;
            this.page = 1;
            this.fetchMembers();
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

.selected-chip {
    background-color: #1976d2 !important;
    color: white !important;
}
</style>
