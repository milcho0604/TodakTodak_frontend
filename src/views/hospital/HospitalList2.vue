<template>
    <v-container fluid class="custom-container">
        <v-spacer :style="{ height: '50px' }"></v-spacer>
        <!-- 주변소아과, gps -->
        <v-row>
            <v-col cols="4"
            class="ml-50 justify-end text-no-wrap"
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

        <!-- 검색창 -->
        <v-row>
            <v-col cols="2"> 
                
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
        <v-row>
            <v-col cols="2">
                <!-- <v-autocomplete
                v-model="sort"
                :items="sortOptions.map(option => option.text)"
                density="comfortable"
                label="정렬조건"
                class="mt-n1"
              ></v-autocomplete>  -->

            </v-col>

            <v-col cols="8">
                <!-- 필터 태그 그룹 -->
                <v-chip-group
                v-model="selectedTag"
                selected-class="text-primary"
                mandatory
                >
                    <v-chip value="전체" size="large">전체</v-chip>
                    <v-chip value="영유아검진" size="large">영유아검진</v-chip>
                    <v-chip value="전문의" size="large">전문의</v-chip>
                    <v-chip value="주차장" size="large">주차장</v-chip>
                    <v-chip value="어린이 국가예방접종" size="large">어린이 국가예방접종</v-chip>
                    <v-chip value="예방접종" size="large">비대면</v-chip>
                    <v-chip value="신속항원" size="large">신속항원</v-chip>
                </v-chip-group>

            </v-col>

            <v-col cols="2">
            </v-col>
        </v-row>

        
        

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
        selectedTag: "전체"

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

</style>
