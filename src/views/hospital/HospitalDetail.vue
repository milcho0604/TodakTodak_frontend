<template>
    <v-container fluid class="hospital-detail-container">
        <!-- 여기에서는 700px로 맞춤 -->

        <v-spacer :style="{ height: '50px' }"></v-spacer>

        <div class="image-wrapper">
            <v-img :src="hospital[0].hospitalImageUrl" class="hospital-image" />
        </div>

        <v-spacer :style="{ height: '30px' }"></v-spacer>
        <!-- 병원이름, 별점, 대기인원 -->
        <v-row>
            <h2 class="ml-5">{{hospital[0].name}}</h2>
            <v-icon color="#00499E" class="ml-2 mt-1" style="font-size:22px">mdi-star</v-icon>
            <v-text class="ml-1 mt-1 rating-text">
                {{ hospital[0].averageRating }} ({{ hospital[0].reviewCount }})
            </v-text>
            <v-chip color="#0066FF" size="default" class="ml-3">
                <strong>대기 {{ hospital[0].standby }}명</strong>
            </v-chip>
        </v-row>
        <!-- 병원주소 -->
        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-map-marker-outline</v-icon>
                {{ hospital[0].address }}
            </v-text>
        </v-row>
        <!-- 병원 영업시간, 점심시간 -->
        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-clock-time-four-outline</v-icon>
                {{ hospital[0].todaySchedule }} | 점심시간 {{ hospital[0].breakTime }}
            </v-text>
        </v-row>
        <!-- 병원 전화번호 -->
        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-phone</v-icon>
                {{ hospital[0].phoneNumber }}
            </v-text>
        </v-row>
        <!-- 병원 keywords -->
        <v-row>
            <v-text style="color:#888888; font-weight: bold; font-size:15px" class="ml-3 mt-2">
                <v-icon>mdi-tag-outline</v-icon>
            </v-text>
            <v-chip
            v-for="(keyword, index) in keywordList"
            :key="index"
            color="#0066FF"
            size="small"
            class="ml-2 mt-1"
            label
            >
            <strong>{{ keyword }} </strong>
            </v-chip>  
        </v-row>
        <!-- 오늘예약, 스케쥴예약 버튼 (click 이벤트 이후 추가예정) -->
        <v-row class="my-7 ml-2">
            <v-btn size="large" class="schedule-button" rounded="lg" variant="flat">스케쥴 예약</v-btn>
            <v-btn size="large" class="today-button ml-5" rounded="lg" variant="flat">오늘 예약</v-btn>
        </v-row>
        <!-- 병원소개, 진료정보, 리뷰 메뉴 tab -->
        <v-tabs
        align-tabs="center"
        style="color: #00499E;"
        >
            <!-- <v-tab :to="`/hospital-intro/${hospitalId}`">병원소개</v-tab>
            <v-tab :to="`/medical-info/${hospitalId}`">진료정보</v-tab>
            <v-tab :to="`/review/${hospitalId}`">리뷰</v-tab> -->
            <v-tab class="custom-tab">병원소개</v-tab>
            <v-tab class="custom-tab">진료정보</v-tab>
            <v-tab class="custom-tab">리뷰</v-tab>
        </v-tabs>

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <!-- 경계선 -->
        <v-row justify="center" class="divider-row">
            <hr class="divider">
        </v-row>

        
        <!-- 라우터에 의해 컴포넌트가 여기서 로드됨 -->
        <router-view />



        <v-spacer :style="{ height: '50px' }"></v-spacer>

    </v-container>
</template>

<script>

export default{
    data() {
      return {
            // 예시데이터
            keywordList:['전문의','주차장','예방접종'],
            hospital:[{
                id:'1', // 병원 id
                standby: '5', // 실시간 대기인원
                distance: '252m', // 내위치 ~ 병원 직선거리
                name: '서초아이 소아청소년과의원', // 병원이름
                hospitalImageUrl :'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital-example-image.png',
                address: '서울 강남구 삼성로14 (개포자이 프레지던스) 자이스퀘어 상가 216호', // 병원주소
                dong: '방배동', // 병원주소(동)
                phoneNumber: '02-465-1234', // 병원전화번호
                description: '', // 병원소개
                notice: '', // 병원공지
                keywords: '전문의, 주차장, 예방접종', // 병원 keywords
                latitude: '', // 위도
                longitude: '', // 경도
                dayOfWeek: '화요일', // 요일
                openTime: '08:30', // 영업시작 시각
                closeTime: '19:00', // 영업종료 시각
                todaySchedule: '화요일 08:30 ~ 19:00', // 오늘 영업시간(최종)
                averageRating: '4.5', // 병원 평균평점
                reviewCount: '32', // 병원리뷰개수
                breakTime: '12:30 ~ 13:30' // 오늘 휴게시간
        }]
        
      }
    },
    created() {

    },
    methods: {
        
    }
}
</script>

<style scoped>
.hospital-detail-container{
    max-width: 700px !important; /* 원하는 최대 폭 */
    margin: 0 auto !important;    /* 중앙 정렬 */
    width: 100% !important; /* 컨테이너의 폭을 100%로 설정 */
  }
.image-wrapper {
    display: flex;
    justify-content: center; /* 수평 중앙 정렬 */
  }
.hospital-image {
    border-radius: 10px; /* Avatar에 10px 둥글기 적용 */
    max-width: 700px;
    width: 100%;
    height: auto; /* 이미지의 비율을 유지하면서 높이를 자동으로 조절 */
    object-fit: cover;
    justify-content: center; /* 수평 중앙 정렬 */
  }
.rating-text{
    font-weight: bold;
    font-size: 18px;
    color: #00499E
}
.schedule-button{
    background-color: #0075FF;
    color: white;
    font-weight: bold;
    width: 300px
}
.today-button{
    background-color: #ECF2FD;
    color: #00499E;
    font-weight: bold;
    width: 300px
}
.custom-tab{
    font-size:20px; 
    font-weight: bold; 
    margin-right: 5px;
}
.divider-row {
    width: 100%;
    justify-content: center;
}

.divider {
    width: 100%;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 20px 0;
    
}

</style>
