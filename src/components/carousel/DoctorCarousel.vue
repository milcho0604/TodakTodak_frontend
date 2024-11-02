<template>
    <v-card
      style="border-radius: 15px; padding: 20px; max-width: 1200px; width: 100%;"
      rounded="0"
      flat
    >
      <v-window v-model="onboarding" style="width: 100%;">
        <v-window-item v-for="n in windowCount" :key="`window-${n}`" :value="n">
          <v-row class="d-flex justify-center">
            <v-col
              v-for="(doctor, index) in paginatedDoctor(n)"
              :key="index"
              cols="12"
              md="3"
              class="d-flex justify-center"
            >
            <!-- 각각 의사 프로필 v-card -->
              <v-card
              class="rounded-xl fixed-card d-flex flex-column align-center justify-center"
              style="background-color: #F5F5F5;"
              variant="flat"
              @click="() => moveToDoctorDetail(doctor.memberEmail)"
              >
              <!-- 의사 프로필 사진 -->
                <v-card-item class="mt-3">
                  <v-avatar class="mx-auto" size="120">
                    <v-img
                    class="circle-img"
                    :src="doctor.profileImg ? doctor.profileImg : defaultImageUrl"
                    />
                  </v-avatar>
                </v-card-item>
                <!-- 의사 이름 -->
                <v-card-item>
                  <v-card-title class="d-flex justify-center align-center" style="font-weight: bold;">
                    <span>{{ doctor.doctorName }}</span>
                  </v-card-title>
                  <!-- 의사 평균평점  + 리뷰개수 -->
                  <v-card-text style="color:#0075FF; font-weight: bold;" class="d-flex justify-center align-center">
                    <v-icon>mdi-star</v-icon> {{ doctor.reviewPoint }} ({{ doctor.reviewCount }})
                  </v-card-text>
                  <v-card-subtitle class="d-flex justify-center align-center mt-n2 mb-3" style="font-size: 15px;">
                    <div>{{ doctor.hospitalName }}</div>
                  </v-card-subtitle>
                </v-card-item>
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
        default: 2
      },
      doctorList: {
        type: Array,
        default: () => []
      },
      defaultImageUrl : {
        type: String,
        default : "https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-3d-image.png"
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
      paginatedDoctor(page) {
        const doctorsPerPage = 4; // 한 페이지에 3개의 sidecard 표시
        const start = (page - 1) * doctorsPerPage;
        const end = start + doctorsPerPage;
        return this.doctorList.slice(start, end);
      },
      moveToDoctorDetail(email){
        console.log("bbemail");
        // 비대면 진료 의사디테일 페이지 (TODO: path 수정)
        this.$router.push('/all/untact/detail/'+email).then(() => {
          // 페이지 이동 후 스크롤을 최상단으로 이동
          window.scrollTo(0, 0);
        });
      }
    }
  };
  </script>
  
  <style scoped>
  .fixed-card {
    width: 280px;
    /* 고정 너비 */

  }
  .circle-img {
    /* width: 150px;*/
    /* height: 150px; */
    border-radius: 50%;
    object-fit: cover; /* 이미지가 컨테이너를 완전히 덮도록 설정 */
    object-position: center;
    margin: 0 auto;
    display: block;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 음영 추가 */

  }
  .small-btn {
    font-size: 12px;
    padding: 4px 8px;
    min-width: 40px;
    height: 24px;
  }
  </style>
  
