<template>
    <v-container fluid class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <v-row>
            <v-col cols="4"
            class="justify-start text-no-wrap"
            >
                <v-btn variant="plain" size="x-large" @click="openAddressSearch">
                    <h3> 
                        <v-icon> mdi-crosshairs-gps</v-icon>
                        {{dong}}
                        <v-icon class="custom-width ml-n1"> mdi-chevron-down</v-icon>
                    </h3>
                </v-btn>
            </v-col>

            <v-col cols="4" 
            class="d-flex flex-row justify-center text-no-wrap"
            align="center"
            >
                <h2>👶🏻 주변 소아과</h2>
            </v-col>

            <v-col cols="4">
                <!-- 공간 맞추기위한 빈 col -->
            </v-col>
        </v-row>

        <v-spacer :style="{ height: '30px' }"></v-spacer>

        <v-row>
            <v-col cols="2"> 
                <v-autocomplete
                v-model="sort"
                :items="sortOptions.map(option => option.text)"
                density="comfortable"
                label="정렬조건"
                class="mt-n1"
              ></v-autocomplete> 
            </v-col>
            <v-col cols="8">
                <v-text-field
                v-model="search"
                label="병원검색"
                prepend-inner-icon="mdi-magnify"
                variant="underlined"
                type="text"
                clearable
                class="mt-n1"
              ></v-text-field>
            </v-col>
            <v-col cols="2" >
                <v-btn variant="tonal" rounded="lg" size="large" color="#0066FF"> 진료중 </v-btn>
            </v-col>
        </v-row>

        <v-spacer></v-spacer>
        <!-- 필터 태그 그룹들 -->
        <v-chip-group
            v-model="selectedTag"
            selected-class="text-primary"
            mandatory
        >
            <v-chip value="전체" size="large" filter>전체</v-chip>
            <v-chip value="영유아검진" size="large" filter>영유아검진</v-chip>
            <v-chip value="전문의" size="large" filter>전문의</v-chip>
            <v-chip value="주차장" size="large" filter>주차장</v-chip>
            <v-chip value="어린이 국가예방접종" size="large" filter>어린이 국가예방접종</v-chip>
            <v-chip value="예방접종" size="large" filter>비대면</v-chip>
            <v-chip value="신속항원" size="large" filter>신속항원</v-chip>
        </v-chip-group>

        <v-spacer :style="{ height: '20px' }"></v-spacer>
        <!-- 병원리스트 -->
         <v-card
            style="width: 1000px;"
            variant="outlined"
            class="custom-card"
         >
            <div class="d-flex flex-no-wrap">
                <v-avatar
                  class="ma-5"
                  style="height:140px; width:180px; border-radius: 10px; object-fit:cover;"
                >
                  <v-img :src=hospital[0].hospitalImageUrl />
        
                </v-avatar>

                <div style="flex: 1;">
                    <div class="d-flex flex-row align-center justify-space-between">
                        <!-- 병원 이름 및 평점 -->
                        <div class="d-flex flex-row align-center">
                          <v-card-title class="mt-2 ml-n4 custom-card-title">
                            {{ hospital[0].name }}
                          </v-card-title>
              
                          <v-card-text class="rating-text mt-5 ml-n7">
                            <v-icon color="#00499E">mdi-star</v-icon>
                            {{ hospital[0].averageRating }} ({{ hospital[0].reviewCount }})
                          </v-card-text>
                        </div>
              
                        <!-- 대기 인원 (오른쪽 정렬) -->
                        <v-chip color="#0066FF" size="large" class="ml-auto mr-10 mt-2">
                          <strong>대기 {{ hospital[0].standby }}명</strong>
                        </v-chip>
                      </div>
              

                    <div class="d-flex flex-row align-center">
                        <v-text class="ml-1">
                            {{ hospital[0].todaySchedule }}
                        </v-text>
                        <v-text class="ml-3 distance-text">
                            {{ hospital[0].distance }}
                        </v-text>
                    </div>

                    <div class="d-flex flex-row align-center mt-1">
                        <v-text style="color:#888888; font-weight: bold; font-size:15px">
                            <v-icon>mdi-map-marker-outline</v-icon>
                            {{ hospital[0].address }}
                        </v-text>
                    </div>

                    <div class="d-flex flex-row align-center">
                        <v-chip
                        v-for="(keyword, index) in keywordList"
                        :key="index"
                        color="#00499E"
                        size="default"
                        class="mr-2 mt-3"
                      >
                        {{ keyword }} 
                      </v-chip>
                    </div>
                </div>
            </div>
         </v-card>


    </v-container>
</template>

<script>

export default{
    data() {
      return {
        dong:"성수동",
        search:"", 
        sort:"거리 순", // 사용자가 선택한 정렬조건
        sortOptions: [
            { text: "거리 순", value: "distance" }, // 서버로 넘길 값: distance
            { text: "별점 순", value: "rating" },    // 서버로 넘길 값: rating
            { text: "리뷰 순", value: "review" }     // 서버로 넘길 값: review
        ], // 정렬 옵션
        selectedTag: "전체",
        hospitalList:[], // 병원리스트
        keywordList:['전문의','주차장','예방접종'],
        // 예시데이터
        hospital:[{
            id:'1', // 병원 id
            standby: '5', // 실시간 대기인원
            distance: '252m', // 내위치 ~ 병원 직선거리
            name: '서초아이 소아청소년과의원', // 병원이름
            hospitalImageUrl :'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital-example-image.png',
            address: '서울 강남구 삼성로14 (개포자이 프레지던스) 자이스퀘어 상가 216호', // 병원주소
            dong: '방배동', // 병원주소(동)
            keywords: '전문의, 주차장, 예방접종', // 병원 keywords
            dayOfWeek: '화요일', // 요일
            openTime: '08:30', // 영업시작 시각
            closeTime: '19:00', // 영업종료 시각
            todaySchedule: '화요일 08:30 ~ 19:00', // 오늘 영업시간(최종)
            averageRating: '4.5', // 병원 평균평점
            reviewCount: '32' // 병원리뷰개수
        }]
      }
    },
    created() {

    },
    methods: {
        openAddressSearch() {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    // bname에서 동 이름을 추출하여 dong에 할당
                    this.dong = data.bname || "주소 선택 안됨";
                }
            }).open();
        }
    }
}
</script>

<style scoped>
.custom-card {
    border: 2px solid #DBDBDB; /* 테두리 색상만 변경 */
    border-radius: 10px; /* 모서리 둥글기 */
    background-color: white !important; /* 카드 내부 배경색 고정 */
  }
/* v-avatar border-radius */
.custom-avatar {
    border-radius: 10px; /* Avatar에 10px 둥글기 적용 */
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
/* v-card-title 폰트 스타일 */
.custom-card-title {
    font-weight: bold; /* 글씨 굵게 */
    font-size: 23px; /* 원하는 폰트 크기 설정 */
}
.rating-text{
    font-weight: bold;
    color: #00499E
}
.distance-text{
    font-weight: bold;
    color: #0066FF;
    font-size: 17px;
}
</style>
