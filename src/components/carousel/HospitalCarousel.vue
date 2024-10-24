<template>
    <!-- 병원 Carousel 담는 회색 v-card -->
    <v-card
      style="border-radius: 15px; padding: 20px; max-width: 1200px; width: 100%;"
      rounded="0"
      flat
    >
      <v-window v-model="onboarding" style="width: 100%;" class="d-flex justify-center">
        <!-- v-model="onboarding": 현재 활성화된 슬라이드의 인덱스를 바인딩 -->
        <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n">
          <v-row class="d-flex justify-center">
            <v-col
              v-for="(hospital, index) in paginatedHospital(n)"
              :key="index"
              cols="12"
              md="4"
              class="d-flex justify-center mx-auto"
            >
            <!-- 병원 정보 담는 v-card -->
              <v-card 
                style="min-width:340px; min-height:390px !important; border-radius: 10px;"
                @click="() => moveToHospital(hospital.id)"
                variant="flat"
              >
                <!-- 병원사진 -->
                <v-row class="d-flex justify-center mt-4">
                  <v-avatar 
                    class="hospital-avatar"
                  >
                    <v-img
                      :src="hospital.hospitalImageUrl"
                      alt="병원사진"
                      cover
                    />
                  </v-avatar>
                </v-row>

                <!-- 병원이름 -->
                <v-card-title class="d-flex justify-space-between align-center ml-2">
                  <span class="hospital-name" style="overflow: hidden; white-space: nowrap; font-weight:bold;">
                    {{ hospital.name }}
                  </span>
                  <!-- 병원 별점, 리뷰개수 -->
                  <v-card-text class="hospital-rating">
                    <v-icon>mdi-star</v-icon> {{ hospital.averageRating }} ({{ hospital.reviewCount }})
                  </v-card-text>
                </v-card-title>  

                <!-- 병원주소 -->
                <v-card-subtitle class="hospital-address d-flex align-center mt-n7" style="color:#6A6A6A;">
                    <v-icon>mdi-map-marker-outline</v-icon>
                    <v-card-text class="hospital-address-text ml-n3">
                      {{ hospital.address ? hospital.address.slice(0, 25) : '' }}
                    </v-card-text>
                </v-card-subtitle>

                <!-- 병원키워드 -->
                <v-row class="ml-5">
                  <v-chip
                  v-for="(keyword, index) in hospital.keywordList"
                  :key="index"
                  color="#0075FF"
                  size="default"
                  class="mr-2"
                  >
                  {{ keyword }} 
              </v-chip>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
  
      <v-card-actions class="justify-space-between">
        <v-btn icon="mdi-chevron-left" variant="plain" @click="prev"></v-btn>
        <v-item-group v-model="onboarding" class="text-center" mandatory>
          <v-item
            v-for="n in windowCount"
            :key="`btn-${n}`"
            v-slot="{ isSelected, toggle }"
            :value="n"
          >
            <v-btn
              :color="isSelected ? '#0075FF' : '#ABABAB'"
              icon="mdi-circle-small"
              @click="toggle"
            ></v-btn>
          </v-item>
        </v-item-group>
        <v-btn icon="mdi-chevron-right" variant="plain" @click="next"></v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  export default {
    props: {
      windowCount: {
        type: Number,
        default: 1
      },
      hospitalList: {
        type: Array,
        default: () => []
      },
    },
    data() {
      return {
        onboarding: 1
      };
    },
    methods: {
      next() {
        this.onboarding =
          this.onboarding + 1 > this.windowCount ? 1 : this.onboarding + 1;
      },
      prev() {
        this.onboarding =
          this.onboarding - 1 <= 0 ? this.windowCount : this.onboarding - 1;
      },
      paginatedHospital(page) {
        // 페이지에 따라 프로젝트를 반환하도록 수정
        const hospitalPerPage = 3; // 한 페이지에 3개의 병원 표시
        const start = (page - 1) * hospitalPerPage;
        const end = start + hospitalPerPage;
        return this.hospitalList.slice(start, end);
      },
      moveToHospital(id){
        this.$router.push('/hospital/detail/' + id).then(() => {
          // 페이지 이동 후 스크롤을 최상단으로 이동
          window.scrollTo(0, 0);
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .hospital-avatar{
    width: 290px !important;
    height: 250px !important;
    border-radius: 10px;
    object-fit: contain; /* 콘텐츠를 컨테이너 안에 맞추되 비율을 유지함. */
  }
  .hospital-address {
    display: flex;
    align-items: center;
  }
  
  .hospital-address v-card-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 280px; /* 병원 이미지의 너비에 맞춰서 제한 */
  }
  
  .hospital-rating {
    text-align: right; /* 병원 평점 부분을 오른쪽 정렬 */
    white-space: nowrap; /* 텍스트가 한 줄로 나오도록 */
    font-weight: bold;
    color: #0075FF;
  }
  

  </style>
  