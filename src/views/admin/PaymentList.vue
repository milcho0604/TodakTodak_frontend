<template>
    <v-container style="width: 100%;">
        <v-row>
            <div class="payment-title inter-bold mt-10">결제 내역</div>
        </v-row>

        <!-- 검색어 입력 -->
        <v-row>
            <v-col cols="12" md="6">
                <v-text-field
                    v-model="searchQuery"
                    label="검색어 입력 (impUid 또는 이메일)"
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
                    v-for="(label, value) in paymentMethodOptions"
                    :key="value"
                    @click="() => { 
                        filterPaymentMethod = value; 
                        fetchPayments(); 
                    }"
                    :input-value="filterPaymentMethod === value"
                    class="mr-2"
                    filter
                >
                    {{ label }}
                </v-chip>
            </v-chip-group>
        </v-row>

        <!-- 결제 내역 리스트 -->
        <v-row>
            <v-col>
                <v-table style="width: 100%;">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>impUid</th>
                            <!-- <th>구독 이름</th> -->
                            <th>이메일</th>
                            <th>구매자명</th>
                            <th>전화번호</th>
                            <th>금액</th>
                            <th>결제 시간</th>
                            <th>결제 방식</th>
                            <th>결제 상태</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="payment in filteredPayments" :key="payment.id">
                            <td>{{ payment.id }}</td>
                            <td>{{ payment.impUid }}</td>
                            <!-- <td>{{ payment.name }}</td> -->
                            <td>{{ payment.memberEmail }}</td>
                            <td>{{ payment.buyerName }}</td>
                            <td>{{ payment.buyerTel }}</td>
                            <td>{{ payment.amount.toLocaleString() }} 원</td>
                            <td>{{ formatDate(payment.approvalTimeStamp) }}</td>
                            <td>{{ translatePaymentMethod(payment.paymentMethod) }}</td>
                            <td>{{ translatePaymentStatus(payment.paymentStatus) }}</td>
                            <td>
                                <v-row justify="center" class="button-row">
                                    <v-btn class="cancel-btn" @click="openCancelModal(payment.impUid, payment.paymentMethod)">취소</v-btn>
                                </v-row>
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
                @input="fetchPayments"
                :total-visible="5"
            ></v-pagination>
        </v-row>

        <!-- 결제 취소 모달 -->
        <v-dialog v-model="cancelModal" max-width="500px">
            <v-card>
                <v-card-title class="headline">결제를 취소하시겠습니까?</v-card-title>
                <v-card-actions>
                    <v-btn color="red" @click="cancelPayment">확인</v-btn>
                    <v-btn color="gray" @click="cancelModal = false">취소</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            payments: [], // 전체 결제 내역 목록
            filteredPayments: [], // 필터된 결제 내역 목록 추가
            searchQuery: '', // 검색어
            page: 1, // 현재 페이지
            totalPages: 1, // 전체 페이지 수
            filterPaymentMethod: 'all', // 결제 방식 필터 상태 (초기값 'all')
            paymentMethodOptions: {
                all: '전체',
                SUBSCRIPTION: '정기결제',
                SINGLE: '단건결제',
            },
            cancelModal: false, // 결제 취소 모달 표시 여부
            impUidToCancel: null, // 취소할 impUid 저장
            cancelPaymentMethod: null, // 취소할 결제 방식 저장
        };
    },
    created() {
        this.fetchPayments();
    },
    methods: {
        async fetchPayments() {
            try {
                const params = {
                    page: this.page - 1, // 페이지는 0부터 시작
                    size: 5, // 페이지당 5개씩
                    paymentMethod: this.filterPaymentMethod !== 'all' ? this.filterPaymentMethod : null,
                    query: this.searchQuery || null, // 검색어를 impUid와 memberEmail 모두에 적용
                };

                const url = `${process.env.VUE_APP_API_BASE_URL}/reservation-service/payment/detail/list`;
                const response = await axios.get(url, { params });
                
                if (response.data && response.data.content) {
                    this.payments = response.data.content;
                    this.filteredPayments = this.payments; // 필터링 결과를 따로 저장
                    this.totalPages = response.data.totalPages;
                } else {
                    console.error('Invalid response structure:', response.data);
                    this.payments = [];
                    this.filteredPayments = [];
                    this.totalPages = 1;
                }

            } catch (error) {
                console.error('Error fetching payments:', error);
            }
        },
        translatePaymentMethod(method) {
            const paymentMethodMap = {
                SUBSCRIPTION: '정기',
                SINGLE: '단건'
            };
            return paymentMethodMap[method] || method;
        },
        translatePaymentStatus(status) {
            const paymentStatusMap = {
                SUBSCRIBING: '구독',
                OK: '단건 완료',
                CANCEL: '단건 취소',
                UNSUBSCRIBE: '구독 취소'
            };
            return paymentStatusMap[status] || status;
        },
        openCancelModal(impUid, paymentMethod) {
            this.impUidToCancel = impUid;
            this.cancelPaymentMethod = paymentMethod;
            this.cancelModal = true;
        },

        async cancelPayment() {
            try {
                let url;
                if (this.cancelPaymentMethod === 'SINGLE') {
                    url = `${process.env.VUE_APP_API_BASE_URL}/reservation-service/payment/cancel`;
                } else if (this.cancelPaymentMethod === 'SUBSCRIPTION') {
                    url = `${process.env.VUE_APP_API_BASE_URL}/reservation-service/payment/subCancel`;
                }

                if (url) {
                    await axios.post(url, { impUid: this.impUidToCancel });
                    alert('결제가 취소되었습니다.');
                    this.cancelModal = false;
                    this.fetchPayments(); // 결제 목록 새로고침
                } else {
                    console.error('결제 방식이 유효하지 않습니다.');
                }
            } catch (error) {
                console.error('Error cancelling payment:', error);
                alert('결제 취소 중 오류가 발생했습니다.');
            }
        },

        // 날짜 포맷
        formatDate(dateString) {
            const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            return new Date(dateString).toLocaleDateString('ko-KR', options);
        },
        // 검색어 입력 시 호출되는 메서드
        onSearchInput() {
            this.page = 1; // 검색어 입력 시 페이지를 1로 초기화
            this.fetchPayments(); // 검색어에 맞는 목록 가져오기
        },
    },
    watch: {
        page(newPage) {
            console.log(newPage)
            this.fetchPayments(); // 페이지 변경 시 목록 다시 로드
        },
    },
};
</script>

<style scoped>
.payment-title {
    text-align: center;
    margin: auto;
    font-size: 25px;
    color: #00499E;
}

.selected-chip {
    background-color: #1976d2 !important;
    color: white !important;
}

.cancel-btn {
    background-color: #C2D7FF !important;
    color: #00499e;
    border-radius: 20px;
    width: 60px;
    height: 40px;
    margin-bottom: 10px;
    margin-top: 10px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
