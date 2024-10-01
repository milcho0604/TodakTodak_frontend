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
                <select class="select">
                    <option>인기 순</option>
                    <option>진료수 순</option>
                </select>
            </v-col>
            <v-col>
                <div class="search">
                    <input type="text" class="search-input">
                    <span>
                        🔍
                    </span>
                </div>
            </v-col>
        </v-row>
        <v-row justify="center">
            <div v-for="(doctor, index) in doctorList" :key="index" class="doctor">
                <v-row>
                    <v-col cols="2">
                        <img :src="doctor.image" alt="doctor image" style="width: 40px; height: 40px;">
                    </v-col>
                    <v-col>
                        <v-row class="inter-bold big-font">{{ doctor.name }}</v-row>
                        <v-row class="inter-bold small-font">{{ doctor.hospital }}</v-row>
                        <v-row class="inter-normal small-font">별 {{ doctor.rating }}</v-row>
                    </v-col>
                    <div class="more">
                        <v-col>
                            <v-row justify="end">
                                <div class="round inter-normal dark-blue">대기 {{ doctor.waiting }}명</div>
                            </v-row>
                            <v-row justify="end" class="inter-bold small-font">></v-row>
                        </v-col>
                    </div>
                </v-row>
            </div>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            selectedCity: "토닥구", // 기본 값
            isDropdownOpen: false,
            cities: ["강남구", "강동구", "강서구", "강북구", "관악구", "광진구", "구로구", "금천구", "노원구", "동대문구", "도봉구", "동작구", "마포구"
                , "서대문구", "성동구", "성북구", "서초구", "송파구", "영등포구", "용산구", "양천구", "은평구", "종로구", "중구", "중랑구"], // city 배열
            doctorList: [
                {
                    id: 1,
                    name: "김천재 의사",
                    hospital: "아이조은성모병원",
                    rating: 4.5,
                    waiting: 5,
                    image: "https://todak-file.s3.amazonaws.com/d278dfb1-9275-41ad-8b86-f7a0a904892b_IMG_8641.JPG"
                },
                {
                    id: 2,
                    name: "박명석 의사",
                    hospital: "서울해빛병원",
                    rating: 4.7,
                    waiting: 3,
                    image: "https://todak-file.s3.amazonaws.com/d278dfb1-9275-41ad-8b86-f7a0a904892b_IMG_8641.JPG"
                }
            ]
        };
    },
    methods: {
        toggleDropdown() {
            this.isDropdownOpen = !this.isDropdownOpen;
        },
        selectCity(city) {
            this.selectedCity = city;
            this.isDropdownOpen = false; // 선택 후 드롭다운 닫기
        }
    }
};
</script>

<style scoped>
.title {
    font-size: 20px;
}

.doctor {
    border: 1px solid #ccc;
    border-radius: 10px;
    width: 700px;
    padding: 40px 10px;
    margin-bottom: 10px;
}

.big-font {
    font-size: 16px;
}

.small-font {
    font-size: 13px;
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
    width: 700px;
    margin: 0 auto;
}

.select {
    background-color: transparent;
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 8px;
    font-size: 15px;
    width: 150px;
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
    /* 최대 높이를 설정하여 스크롤 가능하도록 */
    overflow-y: auto;
    /* 세로 스크롤 */
}

.dropdown-list li {
    padding: 10px;
    cursor: pointer;
}

.dropdown-list li:hover {
    background-color: #f0f0f0;
}
</style>