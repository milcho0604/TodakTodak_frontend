<template>
    <div style="background-color: #F0F0F0;">
        <v-container class="custom-container" style="background-color: #F0F0F0;">
            <v-container style="width: 1000px;">
                <p class="dashboard-title">파닥즈 Admin Dashboard</p>
                <div class="dashboard-cards">
                    <div class="dashboard-user-card" @click="$router.push('/admin/member/list')">
                        <span class="dashboard-text">회원리스트</span>
                        <img src="https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png"
                            alt="회원" class="card-icon" />
                    </div>
                    <div class="dashboard-hospital-card" @click="$router.push('/admin/hospital/list')">
                        <span class="dashboard-text">병원리스트</span>
                        <img src="https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital-icon.png"
                            alt="병원" class="card-icon" />
                    </div>
                    <div class="dashboard-cs-card">
                        <span class="dashboard-text">고객상담 채팅</span>
                        <img src="https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/cs_center_image.png"
                            alt="채팅" class="card-icon" />
                    </div>
                    <div class="dashboard-card1" @click="$router.push('/admin/hospital/list')">
                        <span class="dashboard-text2">
                            가입 승인대기
                            <p class="card-number"> {{ waitingMember }}건</p>
                        </span>
                    </div>
                </div>
                <v-spacer :style="{ height: '20px' }"></v-spacer>
                <div class="dashboard-graph-cards">
                    <div class="dashboard-graph-card">
                        <span class="graph-text">신규회원유입 추이</span>
                        <canvas ref="MemberGrowChart" class="chart-canvas" />
                    </div>
                    <div class="dashboard-pie-card">
                        <sapn class="pie-text">회원비율</sapn>
                        <canvas ref="MemberChart" class="chart-canvas" />
                    </div>
                    <div>
                        <div class="dashboard-chart-card">
                            <span class="dashboard-chart-text">
                                총 매출(정기구독)
                                <p class="card-number">{{ money }}원</p>
                            </span>
                        </div>
                        <v-spacer :style="{ height: '15px' }"></v-spacer>
                        <div class="dashboard-chart-card">
                            <span class="dashboard-chart-text">
                                총 예약건수
                                <p class="card-number">{{ totalReservation }}건</p>
                            </span>
                        </div>
                        <v-spacer :style="{ height: '15px' }"></v-spacer>
                        <div class="dashboard-chart-card">
                            <span class="dashboard-chart-text">
                                총 회원수
                                <p class="card-number">{{ total }}명</p>
                            </span>

                        </div>
                    </div>
                </div>
                <v-spacer :style="{ height: '20px' }"></v-spacer>
                <div class="dashboard-cards">
                    <div class="dashboard-cslist-card">
                        <AdminCsList/>
                    </div>
                </div>
                <v-spacer :style="{ height: '20px' }"></v-spacer>
                <div class="dashboard-cards">
                    <div class="dashboard-reportlist-card">
                        <ReportList/>
                    </div>
                </div>
            </v-container>
        </v-container>
    </div>
</template>

<script>
import axios from 'axios';
import { Chart, registerables } from 'chart.js'
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AdminCsList from './AdminCsList.vue';
import ReportList from './ReportList.vue';

Chart.register(...registerables, ChartDataLabels)

export default {
    components:{
        AdminCsList,
        ReportList
    },
    data() {
        return {
            total: 0,
            roles: ['Doctor', 'HospitalAdmin', 'Member'],
            totalReservation: 0,
            waitingMember: 0,
            // 멤버 데이터
            memberData: {
                labels: [],
                datasets: [{
                    label: '',
                    data: [],
                    borderWidth: 1
                }]
            },
            memberGrowData: {
                labels: this.getMonths(), // 1월부터 12월까지의 레이블
                datasets: [
                    {
                        label: 'Member',
                        data: Array(12).fill(0), // 월별 회원 수 초기화
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        tension: 0.4
                    },
                    {
                        label: 'Hospital',
                        data: Array(12).fill(0), // 월별 회원 수 초기화
                        fill: false,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        tension: 0.4
                    },
                    {
                        label: 'Doctor',
                        data: Array(12).fill(0), // 월별 회원 수 초기화
                        fill: false,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        tension: 0.4
                    },
                ]
            },
            options: {
                plugins: {
                    datalabels: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10,
                        ticks: {
                            stepSize: 1
                        },
                    },
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    }
                }
            },
            pieOptions: {
                plugins: {
                    datalabels: {
                        color: '#fff',
                        aling: 'center',
                        anchor: 'center',
                        font: {
                            weight: 'bold',
                            size: 10
                        },
                        formatter: (value, ctx) => {
                            let label = ctx.chart.data.labels[ctx.dataIndex];
                            return label + '\n' + value / this.total * 100 + '%'; // 라벨 + 값
                        }
                    },
                    legend: {
                        display: false // 범례 표시
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        display: false
                    },
                    x: {
                        display: false
                    }
                }
            }
        };
    },
    mounted() {
        this.getMemberList();
        this.getMonthlyGrowthMember();
        this.totalReservationCount();
        this.waitingMemberCount();
    },
    methods: {
        createChart() {
            new Chart(this.$refs.MemberChart, {
                type: 'pie',
                data: this.memberData,
                options: this.pieOptions
            })

        },
        createLineChart() {
            new Chart(this.$refs.MemberGrowChart, {
                type: 'line',
                data: this.memberGrowData,
                options: this.options
            })
        },
        async getMemberList() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/list`, {
                    params: {
                        verified: true,
                        deleted: false,
                    }
                });
                const members = response.data.result.content;
                console.log(members);
                // role별로 멤버 수 카운트
                const roleCounts = {};
                members.forEach(member => {
                    const role = member.role;
                    if (role !== 'TodakAdmin') {
                        this.total += 1;
                        if (roleCounts[role]) {
                            roleCounts[role]++;
                        } else {
                            roleCounts[role] = 1;
                        }
                    }
                });

                // role과 카운트를 각각 labels와 data에 설정
                this.memberData.labels = Object.keys(roleCounts);  // role을 라벨로 설정
                this.memberData.datasets[0].data = Object.values(roleCounts);  // role별 카운트 설정

                // 차트 생성
                this.createChart();
                this.createChart1();
            } catch (e) {
                console.error(e);
            }
        },
        getMonths() {
            // 1월부터 12월까지의 레이블을 "1월", "2월", ... "12월" 형식으로 설정
            return [
                '1월', '2월', '3월', '4월',
                '5월', '6월', '7월', '8월',
                '9월', '10월', '11월', '12월'
            ];
        },
        async getMonthlyGrowthMember() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/growup`);
                const monthlyData = response.data;

                console.log(monthlyData)
                // 월별 회원 수를 업데이트
                monthlyData.forEach(item => {
                    const monthIndex = item.month - 1; // month는 1부터 시작하므로 0으로 조정
                    const roleIndex = this.roles.indexOf(item.role); // 역할 인덱스 찾기

                    if (roleIndex !== -1) {
                        this.memberGrowData.datasets[roleIndex].data[monthIndex] = item.memberCount; // 해당 월에 카운트 설정
                    }
                });

                // 월별 증가 추세 차트 생성
                this.createLineChart();
            } catch (e) {
                console.error(e);
            }
        },
        async totalReservationCount() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/reservation/hospital/total/list`);
                
                this.totalReservation = response.data;
            } catch (e) {
                console.error(e);
            }
        },
        async waitingMemberCount() {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/waiting/list`);

                this.waitingMember = response.data;
            } catch (e) {
                console.error(e);
            }
        }
    }

}
</script>

<style scoped>
* {
    user-select: none;
    font-family: 'Inter';
}

.dashboard-title {
    font-weight: 800;
    font-family: 'Inter';
}

.dashboard-cards {
    display: flex;
    gap: 20px;
}

.dashboard-graph-cards {
    display: flex;
    gap: 20px;
}

.dashboard-user-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 230px;
    height: 90px;
    cursor: pointer;
}

.dashboard-hospital-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 250px;
    height: 90px;
    cursor: pointer;
}

.dashboard-cs-card {
    background-color: white;
    border-radius: 10px;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 280px;
    height: 90px;
    cursor: pointer;
}

.dashboard-card1 {
    background-color: white;
    border-radius: 10px;
    display: flex;
    width: 200px;
    cursor: pointer;
}

.dashboard-graph-card {
    background-color: white;
    border-radius: 10px;
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    width: 500px;
    height: 300px;
}

.dashboard-pie-card {
    background-color: white;
    border-radius: 10px;
    padding-top: 10px;
    padding-left: 20px;
    padding-right: 20px;
    width: 280px;
    height: 300px;
}

.dashboard-chart-card {
    background-color: white;
    border-radius: 10px;
    display: flex;
    width: 180px;
    cursor: pointer;
    height: 90px;
}

.dashboard-cslist-card {
    background-color: white;
    border-radius: 10px;
    display: flex;
    width: 1000px;
    min-height: 250px;
}

.dashboard-reportlist-card {
    background-color: white;
    border-radius: 10px;
    display: flex;
    width: 1000px;
    min-height: 250px;
}

.dashboard-text {
    font-size: 15px;
    font-weight: bold;
}

.dashboard-text2 {
    font-size: 12px;
    margin-top: 10px;
    margin-left: 20px;
    color: #575656;
}

.dashboard-chart-text {
    font-size: 14px;
    margin-top: 13px;
    margin-left: 20px;
    color: #575656;
}

.graph-text {
    font-size: 12px;
    font-weight: bold;
}

.pie-text {
    font-size: 12px;
    color: #737373;
    font-weight: bold;
}

.cs-text {
    padding-top: 15px;
    padding-left: 20px;
    font-size: 14px;
    font-weight: bold;
    color: #676767;
}

.report-text {
    padding-top: 15px;
    padding-left: 20px;
    font-size: 14px;
    font-weight: bold;
    color: #676767;
}

.card-icon {
    width: 45px;
    height: 45px;
}

.card-number {
    margin-top: 10px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
}
</style>>
