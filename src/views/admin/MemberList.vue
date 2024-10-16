<template>
    <v-container>
        <v-row>
            <div class="member-title inter-bold mt-10">일반 회원 목록</div>
        </v-row>
        <v-row>
            <!-- <v-col>인증 상태</v-col> -->
            <!-- <v-col>작업</v-col> -->
            <!-- <v-btn @click="updateStatus">인증 상태를 변경</v-btn> -->
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
                        <tr v-for="member in members" :key="member.id">
                            <td><input type="checkbox" v-model="selectedItems" :value="member" /></td>
                            <td>{{ member.id }}</td>
                            <td>{{ member.name }}</td>
                            <td>{{ member.memberEmail }}</td>
                            <td>{{ member.phone }}</td>
                            <td>{{ member.address.city }}, {{ member.address.street }} ({{ member.address.zipcode }})</td>
                            <!-- <v-chip :color="question.answeredAt ? 'green' : 'red'" dark small> -->
                                <!-- {{ question.answeredAt ? "답변완료" : "미답변" }} -->
                              <!-- </v-chip> -->
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
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            members: [],
            selectedItems: [], // 선택된 항목을 저장할 배열
            selectedMembers: [], // 선택된 항목의 ID만 저장할 배열
        };
    },
    created() {
        this.fetchMembers();
    },
    watch: {
        // selectedItems 변경을 감지하여 selectedMembers에 ID만 추출해서 저장
        selectedItems(val) {
            this.selectedMembers = val.map((item) => item.id);
        },
    },
    methods: {
        async fetchMembers() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/list`);
            this.members = response.data.result.content;
        },
        async updateStatus() {
            console.log(this.selectedMembers);
            if (this.selectedMembers.length === 0) {
                alert("선택된 항목이 없습니다.");
                return;
            }

            // 선택된 항목들의 ID와 상태를 업데이트
            const updatePromises = this.selectedMembers.map((memberId) => {
                return axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/update/${memberId}`);
            });

            try {
                await Promise.all(updatePromises);
                alert("상태가 완료로 업데이트되었습니다.");
                this.fetchMembers(); // 업데이트 후 데이터 새로고침
            } catch (error) {
                console.error("업데이트 중 오류 발생:", error);
            }
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                // 전체 선택
                this.selectedItems = [...this.members];
            } else {
                // 전체 선택 해제
                this.selectedItems = [];
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
