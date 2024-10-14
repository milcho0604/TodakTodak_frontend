<template>
    <v-container class="custom-container text-center">
        <v-row class="header-row">
            <v-col class="title location">
                <div class="dropdown inter-bold" @click="toggleDropdown">
                    📍 {{ selectedCity }} ▾
                </div>
                <ul v-if="isDropdownOpen" class="dropdown-list">
                    <li v-for="(city, index) in cities" :key="index" @click="selectCity(city)">
                        {{ city }}
                    </li>
                </ul>
            </v-col>
            <v-col class="inter-bold title">💉비대면 진료</v-col>
            <v-col cols="3"></v-col>
        </v-row>
        <v-row class="header-row">
            <v-col cols="3">
                <select class="select" v-model="sortOrder">
                    <option value="popular">인기 순</option>
                    <option value="waiting">진료수 순</option>
                </select>
            </v-col>
            <v-col>
                <div class="search">
                    <input type="text" v-model="searchQuery" class="search-input" placeholder="검색...">
                    <span>
                        🔍
                    </span>
                </div>
            </v-col>
        </v-row>
        <v-row justify="center">
            <div v-for="doctor in sortedDoctorList" :key=doctor.doctorId class="doctor" @click="$router.push(`/untact/${doctor.memberEmail}/form`)">
                <v-row>
                    <v-col cols="2">
                        <v-avatar size="70">
                            <v-img :src="doctor.profileImg" alt="doctor image"/>
                        </v-avatar>
                    </v-col>
                    <v-col>
                        <v-row class="inter-bold big-font mt-1">{{ doctor.doctorName }}</v-row>
                        <v-row class="inter-bold small-font">{{ doctor.hospitalName }}</v-row>
                        <v-row class="inter-normal small-font">
                            <v-icon class="star-icon">mdi-star</v-icon>
                            {{ doctor.reviewPoint }} ({{doctor.reviewCount}})</v-row>
                    </v-col>
                    <div class="more mt-2">
                        <v-col>
                            <v-row justify="end">
                                <div class="round inter-normal dark-blue mr-12">대기 3명</div>
                            </v-row>
                            <v-row justify="end" class="inter-bold small-font mr-2">></v-row>
                        </v-col>
                    </div>
                </v-row>
            </div>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            selectedCity: "토닥구", // 기본 값
            isDropdownOpen: false,
            cities: ["강남구", "강동구", "강서구", "강북구", "관악구", "광진구", "구로구", "금천구", "노원구", "동대문구", "도봉구", "동작구", "마포구", "서대문구", "성동구", "성북구", "서초구", "송파구", "영등포구", "용산구", "양천구", "은평구", "종로구", "중구", "중랑구"], // city 배열
            searchQuery: '', // 검색어 저장 변수
            sortOrder: 'popular', // 정렬 기준
            doctorList: []
        };
    },
    created() {
        this.fetchDoctorList();
    },
    computed: {
        filteredDoctorList() {
            const query = this.searchQuery.toLowerCase();            
            return this.doctorList.filter(doctor => {
                return (doctor.doctorName.toLowerCase().includes(query) ||
                        doctor.hospitalName.toLowerCase().includes(query))
                        
            });
        },
        sortedDoctorList() {
            // 정렬 기준에 따라 의사 목록을 정렬
            return this.filteredDoctorList.slice().sort((a, b) => {
                if (this.sortOrder === 'popular') {
                    return b.reviewPoint - a.reviewPoint; // 평점 높은 순서
                } else {
                    return b.reviewCount - a.reviewCount; // 진료수 많은 순서
                }
            });
        }
    },
    methods: {
        async fetchDoctorList() {
            try {
                // 의사 정보를 가져옴
                const today = this.getToday();
                const reservationResponse = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/untact/list/${today}`);
                const reservationData = reservationResponse.data.result;
                this.doctorList = reservationData;
                console.log("Reservation Data:", reservationData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        },
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        selectCity(city) {
            this.selectedCity = city;
            this.isDropdownOpen = false; // 선택 후 드롭다운 닫기
        },
        getToday() {
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const date = new Date();
            return days[date.getDay()]; // 현재 요일 반환
        }
    }
};
</script>

<style scoped>
.title {
    font-size: 25px;
}

.doctor {
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 80%;
    padding: 20px 10px;
    margin-bottom: 10px;
}

.big-font {
    font-size: 16px;
}

.small-font {
    font-size: 12px;
    color: #888888;
}

.round {
    background-color: #C2D7FF;
    border-radius: 40px;
    padding: 3px 15px;
    font-size: 14px;
    margin-right: 30px;
}

.more {
    margin-right: 20px;
}

.header-row {
    width: 1000px;
    margin: 0 auto;
}

.select {
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 8px;
    width: 90%;
    font-size: 15px;
    outline: none;
    cursor: pointer;
    text-align: center;
}

.search {
    border-radius: 10px;
    background-color: #EEEEEE;
    width: 100%;
    padding: 8px 5px;
}

.search-input {
    width: 90%;
}

.search-input:focus {
    outline: none;
}

.location {
    text-align: left;
}

.dropdown {
    cursor: pointer;
    display: inline-block;
    background-color: #fff;
    padding: 8px;
}

.dropdown-list {
    list-style: none;
    padding: 10px;
    margin-left: 20px;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
    position: absolute;
    font-size: 15px;
    max-height: 220px;
    overflow-y: auto;
}

.dropdown-list li {
    padding: 10px;
    cursor: pointer;
}

.dropdown-list li:hover {
    background-color: #f0f0f0;
}

.star-icon {
    margin-top: 2px;
    font-size: 14px;
  }
</style>
