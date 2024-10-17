<template>
    <v-card
      style="background-color: #FFFFFF; border-radius: 15px; padding: 20px; max-width: 1200px; width: 100%;"
      rounded="0"
      flat
    >
      <v-window v-model="onboarding" style="width: 1080px;">
        <!-- v-model="onboarding": 현재 활성화된 슬라이드의 인덱스를 바인딩 -->
        <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n">
          <v-row class="d-flex justify-center">
            <v-col
              v-for="(hospital, index) in paginatedHospital(n)"
              :key="index"
              cols="12"
              md="4"
              class="d-flex justify-center"
            >
              <v-card 
              style="width:250px; height:350px;"
              @click="() => moveToHospital(hospital.id)"
              >
                <v-img
                  class="custom-img"
                  width="250px"
                  height="250px"
                  :src="hospital.hospitalImageUrl"
                  alt="병원 썸네일"
                  cover
                />
                <v-card-title class="d-flex justify-space-between align-center">
                  <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    {{ hospital.name }}
                  </span>
                  <v-card-text color="primary" text-color="white">
                    <v-icon>mdi-star</v-icon> {{ hospital.averageRating }} ({{ hospital.reviewCount }})
                  </v-card-text>
                </v-card-title>
                <v-card-subtitle class="pt-3 mb-5 mr-5 custom-contents" style="color:#888888;">
                  <v-icon>mdi-map-marker-outline</v-icon>
                  <div>{{ hospital.address }}</div>
                </v-card-subtitle>
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
              :color="isSelected ? 'primary' : 'secondary'"
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
      }
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

  </style>
  