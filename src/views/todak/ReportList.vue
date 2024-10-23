<template>
    <v-container>
        <v-row>
            <!-- <div class="report-title inter-bold mt-10">신고 목록</div> -->
            <div class="report-title inter-bold">신고 목록</div>            
        </v-row>
        <v-row></v-row>
        <!-- <v-row>
            <v-col>처리 상태</v-col>
            <v-col>작업</v-col>
            <v-btn @click="updateStatus">상태를 Completed로 변경</v-btn>
        </v-row> -->
        <v-row>
            <v-col class="report-text">처리 상태</v-col>
            <v-col class="report-text">작업</v-col>
            <v-col>
                <v-btn @click="updateStatus">상태를 Completed로 변경</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" @change="toggleSelectAll" /></th> 
                            <th>ID</th>
                            <th>게시글</th>
                            <th>댓글</th>
                            <th>신고자</th>
                            <th>피신고자</th>
                            <th>신고 사유</th>
                            <th>처리 상태</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="report in reportList" :key="report.id">
                            <td><input type="checkbox" v-model="selectedItems" :value="report" /></td>
                            <td>{{ report.id }}</td>
                            <td>{{ report.postId }}</td>
                            <td>{{ report.commentId }}</td>
                            <td>{{ report.reporterEmail }}</td>
                            <td>{{ report.reportedEmail }}</td>
                            <td>{{ report.reason }}</td>
                            <td>{{ report.status }}</td>
                        </tr>
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios";

export default {
    data() {
        return {
            reportList: [],
            selectedItems: [], // 선택된 항목을 저장할 배열
            selectedReports: [], // 선택된 항목의 ID만 저장할 배열
        };
    },
    created() {
        this.fetchReport();
    },
    watch: {
        // selectedItems 변경을 감지하여 selectedReports에 ID만 추출해서 저장
        selectedItems(val) {
            this.selectedReports = val.map((item) => item.id);
        },
    },
    methods: {
        async fetchReport() {
            const response = await axios.get(
                `${process.env.VUE_APP_API_BASE_URL}/community-service/report/list`
            );
            this.reportList = response.data.result.content;
        },
        async updateStatus() {
            console.log(this.selectedReports);
            if (this.selectedReports.length === 0) {
                alert("선택된 항목이 없습니다.");
                return;
            }

            // 선택된 항목들의 ID와 상태를 업데이트
            const updatePromises = this.selectedReports.map((reportId) => {
                return axios.post(
                    `${process.env.VUE_APP_API_BASE_URL}/community-service/report/update/${reportId}`
                );
            });

            try {
                await Promise.all(updatePromises);
                alert("상태가 완료로 업데이트되었습니다.");
                this.fetchReport(); // 업데이트 후 데이터 새로고침
            } catch (error) {
                console.error("업데이트 중 오류 발생:", error);
            }
        },
        toggleSelectAll(event) {
            if (event.target.checked) {
                // 전체 선택
                this.selectedItems = [...this.reportList];
            } else {
                // 전체 선택 해제
                this.selectedItems = [];
            }
        },
    },
};
</script>
<!-- .report-title {
    text-align: center;
    margin: auto;
    font-size: 25px;
    color: #00499E;
} -->
<style scoped>
.report-title {
    padding-top: 20px;
    padding-left: 20px;
    font-size: 20px;
    font-weight: bold;
    color: #676767;
}
.report-text{
    margin-left: 20px;
    margin-top: 10px;
    font-size: 15px;
    font-weight: bold;
    color: #8F8F8F;
}
</style>