<template>
  <v-app>
    <v-container style="width: 100%;" fluid>
      <div class="banner">
        <!-- 배너 carousel -->
        <v-carousel class="custom-carousel" show-arrows="hover" cycle hide-delimiter-background>
          <v-carousel-item v-for="(slide, i) in slides" :key="i">
            <v-img :src="slide" class="carousel-image" cover></v-img>
            <span class="inner-text inter-bold">스마트한 병원의 선택, 토닥</span>
          </v-carousel-item>
        </v-carousel>
      </div>
    </v-container>
    <v-container class="custom-container">
      <v-spacer :style="{ height: '50px' }"></v-spacer>

      <!-- 배너 carousel -->
      <!-- <v-carousel class="custom-carousel" show-arrows="hover" cycle hide-delimiter-background>
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-img :src="slide"></v-img>
        </v-carousel-item>
      </v-carousel> -->
      
      <v-spacer :style="{ height: '60px' }"></v-spacer>

      <!-- 우리동네 인기 소아과 타이틀 -->
      <v-row justify="center" align="center" @click="navigateToHospitalList" style="cursor: pointer;">
        <h2 style="font-weight: bold;">우리동네 인기 소아과</h2>
      </v-row>

      <!-- 우리동네 인기 소아과 서브타이틀 -->
      <v-row justify="center" align="center" class="mt-3" @click="navigateToHospitalList" style="cursor: pointer;">
        <h5 style="text-align: center; color: #828282;">
          평점으로 검증된 우리동네 소아과
        </h5>
      </v-row>

      <v-container style=" max-width: 1200px;">
        <!-- 위치 gps -->
        <v-row class="mt-2 ml-2">
          <v-btn variant="flat" size="large" @click="openAddressSearch">
            <h5 style="font-weight:bold;">
              📍 {{ dong }}
              <v-icon class="custom-width ml-n1"> mdi-chevron-down</v-icon>
            </h5>
          </v-btn>
        </v-row>
        <!-- 인기소아과 carousel 컴포넌트-->
        <v-row justify="center" class="mt-n2">
          <HospitalCarousel :windowCount="2" :hospitalList="hospitalList" />
        </v-row>
      </v-container>

      <v-spacer :style="{ height: '80px' }"></v-spacer>

      <!-- 자녀 공유 광고 -->
      <v-row justify="center">
        <v-col>
          <v-img style="border-radius: 10px;"
            src="https://todak-file.s3.amazonaws.com/fd99c541-0a5f-4a36-88b9-cdcbd49ed553_Group 989012.png"></v-img>
        </v-col>
      </v-row>

      <v-spacer :style="{ height: '80px' }"></v-spacer>

      <!-- 비대면진료 title -->
      <v-row justify="center" align="center" @click="navigateToUntactList" style="cursor: pointer;">
        <h2 style="font-weight: bold;">비대면 진료</h2>
      </v-row>

      <!-- 비대면진료 sub-title -->
      <v-row justify="center" align="center" @click="navigateToUntactList" style="cursor: pointer;">
        <h5 style="text-align: center; color: #828282;">
          집에서도 편하게 비대면진료 받으세요!
        </h5>
      </v-row>

      <v-spacer :style="{ height: '80px' }"></v-spacer>

      <!-- 비대면 의사 인기리스트 carousel -->
      <v-container>
        <v-row>
          <DoctorCarousel :windowCount="2" :doctorList="doctorList" />
        </v-row>
      </v-container>

      <!-- 기능 자랑 carousel -->
      <v-spacer :style="{ height: '80px' }"></v-spacer>
      <v-row>
        <v-col cols="4">
          <v-spacer :style="{ height: '60px' }"></v-spacer>
          <div class="inter-bold" style="font-size: 40px">토닥 서비스<br> 이용이 처음이신가요?</div>
          <v-spacer :style="{ height: '10px' }"></v-spacer>
          <div class="inter-normal" style="font-size: 30px; color: #737373">토닥의 다양한 서비스를<br> 이용해보세요</div>
        </v-col>
        <!-- carousel -->
        <v-col cols="8">
          <v-carousel class="feat-carousel" show-arrows="hover" cycle hide-delimiter-background>
            <v-carousel-item v-for="(feat, i) in features" :key="i">
              <v-img :src="feat"></v-img>
            </v-carousel-item>
          </v-carousel>
        </v-col>
      </v-row>

      <!-- 의사 QA -->
      <v-spacer :style="{ height: '80px' }"></v-spacer>
      <v-row>
        <v-col cols="4">
          <!-- 의사Q&A title -->
          <v-spacer :style="{ height: '60px' }"></v-spacer>
          <v-row justify="start" align="end" @click="navigateToCommunityList" style="cursor: pointer;">
            <h1 style="font-weight: bold;">의사 QnA</h1>
          </v-row>
          <v-spacer :style="{ height: '30px' }"></v-spacer>
          <!-- 의사 Q&A sub-title -->
          <v-row justify="start" align="center" @click="navigateToCommunityList" style="cursor: pointer;">
            <div class="inter-normal" style="font-size: 30px; color: #737373">
              우리 아이 건강, 전문가와<br> 직접 소통하세요
            </div>
          </v-row>
          <v-spacer :style="{ height: '30px' }"></v-spacer>
          <v-row>
            <div class="more-button inter-normal" @click="navigateToCommunityList">
              자세히 보기
            </div>
          </v-row>
        </v-col>
        <v-col cols="8">
          <v-spacer :style="{ height: '30px' }"></v-spacer>
          <v-row>
            <v-col cols="12" v-for="post in communityList" :key="post.id">
              <div class="post-card justify-center mb-8" @click="navigateToPostDetail(post.id)"
                style="cursor: pointer;">
                <div class="d-flex flex-no-wrap justify-space-between">
                  <div class="ml-3">
                    <!-- 게시글 제목 -->
                    <div style="font-weight:bold; font-size:20px;">
                      {{ post.title }}
                    </div>

                    <!-- 게시글 내용 -->
                    <div class="post-content mb-n2" style="font-size: 20px;">
                      {{ post.content ? post.content.slice(0, 53) : '' }}
                    </div>

                    <!-- 좋아요, 댓글수, 조회수, 작성일시 -->
                    <div style="font-size: 18px; color:#6A6A6A; margin-top:15px;">
                      <v-icon style="color:#0075FF; font-size: 20px;" class="mt-n1">mdi-heart</v-icon>
                      {{ post.likeCount }} · 댓글 {{ post.comments }} · 조회수 {{ post.viewCount }} · {{
                        post.createdTimeAt.slice(0, 10) }}
                    </div>
                  </div>

                  <v-avatar style="height:90px; width:100px; border-radius: 10px; object-fit:cover;"
                    v-if="post.postImgUrl">
                    <!-- 게시글 사진 -->
                    <v-img :src="post.postImgUrl" />
                  </v-avatar>
                </div>
              </div>
              <hr>
              <!-- <v-divider></v-divider> -->
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-spacer :style="{ height: '70px' }"></v-spacer>
      <v-row class="doib-box" justify="center">
          <v-col cols="12">
              <div class="inter-bold doib-text">
                  병원을 쉽고 편리하게 운영하고 싶다면<br>
                  토닥 도입 상담을 신청하세요
              </div>
          </v-col>
          <v-col cols="12" class="text-center">
              <div class="doib-button" color="primary" @click="$router.push('/all/hospital/admin/create')">
                  <span class="inter-bold">도입 신청하기</span>
              </div>
          </v-col>
      </v-row>
      <v-spacer :style="{ height: '70px' }"></v-spacer>

      <!-- 데이터 로딩 중일때 띄워줄 모달 -->
      <v-dialog v-model="loading" max-width="500px">
        <v-card class="loading-modal">
          <!-- 로딩 진행 표시 (v-progress-linear) -->
          <v-progress-linear color="#0075FF" height="4" indeterminate></v-progress-linear>

          <v-card-title class="loading-title">
            데이터 로딩중
          </v-card-title>
          <v-card-text class="loading-text">
            회원님의 현재 위치 정보를 기반으로 <br>병원 리스트를 불러오고 있습니다.
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import HospitalCarousel from '@/components/carousel/HospitalCarousel.vue';
import DoctorCarousel from '@/components/carousel/DoctorCarousel.vue';
import axios from 'axios';

// 카카오맵 rest api 호출 axios 커스텀
const apiClient = axios.create({
  baseURL: 'https://dapi.kakao.com/v2/local',
  headers: {
    Authorization: `KakaoAK ${process.env.VUE_APP_KAKAO_API_KEY}`
  }
});

export default {
  components: {
    HospitalCarousel,
    DoctorCarousel,
  },
  name: "App",
  data() {
    return {
      slides: [
        'https://todak-file.s3.amazonaws.com/162a0f6a-24ee-41e2-9435-29b4b3941daf_adult-taking-care-baby-weight.jpg',
        'https://todak-file.s3.amazonaws.com/17db471c-500e-46c1-a74c-948174883ac0_doctor-performing-routine-medical-checkup.jpg',
        'https://todak-file.s3.amazonaws.com/ebdf224e-6e83-4dfa-8e18-8d540066aa8e_little-baby-being-health-clinic-vaccination.jpg'
      ],
      features: [
        'https://todak-file.s3.amazonaws.com/fa78cd60-2533-4806-9d3f-494d19f75278_Group 989010.png',
        'https://todak-file.s3.amazonaws.com/e0f8b98d-cdb9-4623-8ae3-f4fcc2d4c318_Group 989010-2.png',
        'https://todak-file.s3.amazonaws.com/41392fb5-aaca-4a6c-b37a-3c322fa783c6_Group 989011.png',
      ],
      dong: '신대방동',
      latitude: '37.497203', // 사용자 현재 위도
      longitude: '126.927625', // 사용자 현재 경도
      locationModal: false, // 데이터 로딩 모달 활성화 변수
      loading: false, // 로딩상태변수 추가
      // 인기소아과 데이터 
      keywordList: [],
      hospitalList: [],
      doctorList: [],
      communityList: [],
      today: '',
    };
  },
  async mounted() {
    await this.getCurrentLocation(); // 위치 정보를 가져온 후 병원리스트 axios 요청
    this.loadCommunityList(); // 커뮤니티 인기 게시글 리스트 조회
    this.loadDoctorList(); // 인기 비대면 의사 리스트 조회
  },
  watch: {
    // dong 값이 변경될 때마다 병원 리스트를 새로 로드
    dong(newDong) {
      if (newDong) {
        this.loadHospitalList();
      }
    },
  },
  methods: {
    openAddressSearch() {
      this.locationModal = false; // 위치 모달 먼저 닫음
      new window.daum.Postcode({
        oncomplete: (data) => {
          // bname에서 동 이름을 추출하여 dong에 할당
          this.dong = data.bname || "주소 선택 안됨";
        }
      }).open();
    },
    // 현재위치 조회
    async getCurrentLocation() {
      this.loading = true; // 로딩 시작

      // 로컬스토리지에서 위도와 경도 값을 확인
      const storedLatitude = localStorage.getItem('latitude');
      const storedLongitude = localStorage.getItem('longitude');

      // 로컬스토리지에서 '동' 값 확인
      const storedDong = localStorage.getItem('dong');
      if (storedDong) {
        this.dong = storedDong;
      }

      // 로컬스토리지에 위도, 경도 값이 이미 있으면 해당 값을 사용
      if (storedLatitude && storedLongitude) {
        this.latitude = storedLatitude;
        this.longitude = storedLongitude;
        console.log("로컬스토리지에서 가져온 위도", this.latitude);
        console.log("로컬스토리지에서 가져온 경도", this.longitude);

        // 위도, 경도가 로컬스토리지에 있는 경우 병원 리스트를 바로 로드
        await this.loadHospitalList();
        this.loading = false; // 로딩 종료
        return; // 메소드 종료
      }

      // 로컬스토리지에 값이 없으면, 새로 위치 정보를 가져옴
      return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async position => {
              this.latitude = position.coords.latitude;
              this.longitude = position.coords.longitude;
              console.log("사용자 위도", this.latitude);
              console.log("사용자 경도", this.longitude);

              // 로컬스토리지에 사용자 현재위치 위도,경도 저장
              localStorage.setItem('latitude', this.latitude);
              localStorage.setItem('longitude', this.longitude);

              // 위치 정보를 가져온 후, 동 정보를 업데이트
              await this.getDongFromCoordinates(this.latitude, this.longitude);

              this.loading = false; // 로딩 종료
              resolve(); // 성공 시 resolve 호출
            },
            error => {
              console.log("위치 정보를 가져오지 못했습니다.", error);
              this.loading = false; // 로딩 종료

              this.loadHospitalList(); // 초기값으로 병원 리스트 로드
              reject(error); // 실패 시 reject 호출
            }
          );
        } else {
          console.log("Geolocation을 지원하지 않는 브라우저입니다.");
          this.loading = false; // 로딩 종료
          reject(new Error("Geolocation을 지원하지 않는 브라우저입니다."));
        }
      });
    },
    // 위도와 경도를 이용해 '동' 정보를 가져오는 메소드
    async getDongFromCoordinates(latitude, longitude) {
      try {

        const response = await apiClient.get(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json`, {
          params: {
            x: longitude, // 경도
            y: latitude,  // 위도
          }
        });

        // '동' 단위 행정구역 이름 찾기
        const regionInfo = response.data.documents;
        if (regionInfo.length > 0) {
          const dongInfo = regionInfo.find(region => region.region_type === "B");
          if (dongInfo) {
            this.dong = dongInfo.region_3depth_name; // '동' 이름 저장
            console.log("사용자의 동:", this.dong);

            // 로컬스토리지에 '~~동'저장
            localStorage.setItem('dong', this.dong);
            // 동 정보 업데이트 후 병원 리스트 로드
            await this.loadHospitalList(); // 동 정보로 병원 리스트 로드
          } else {
            console.log("동 정보를 찾을 수 없습니다.");
          }
        }
      } catch (error) {
        if (error.response) {
          console.log("Error Status:", error.response.status);
          console.log("Error Data:", error.response.data);
        } else {
          console.log("주소 정보를 가져오는 데 실패했습니다.", error);
        }
      }
    },
    async loadHospitalList() {
      try {
        // this.dong에서 띄어쓰기 제거
        const formattedDong = this.dong.replace(/\s+/g, '');

        let params = {
          dong: formattedDong, // 띄어쓰기 제거된 동 이름
          latitude: this.latitude,
          longitude: this.longitude
        };

        console.log("요청 파라미터:", params); // 요청 파라미터 로그

        //http://localhost:8080/reservation-service/hospital/good/list?dong=성수동2가&latitude=37.536368&longitude=127.050759
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/reservation-service/hospital/good/list`, { params }
        );
        this.hospitalList = response.data.result.map(hospital => {
          return {
            ...hospital,
            keywordList: hospital.keywords ? hospital.keywords.split(",") : []
          };
        });
      } catch (error) {
        console.log(error);
      }
    },

    // 커뮤니티 인기 게시글 조회
    async loadCommunityList() {
      try {
        // http://localhost:8080/community-service/post/good/list
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/community-service/post/good/list`);
        console.log(response.data);

        this.communityList = response.data.result;
      } catch (error) {
        console.log(error);
      }
    },
    // 비대면 의사 리스트 조회
    async loadDoctorList() {
      try {
        // 현재 날짜의 요일을 가져오기
        const today = new Date();
        const options = { weekday: 'long' }; // 요일을 긴 형식으로 가져오기 (예: Monday)
        const dayOfWeek = today.toLocaleDateString('en-US', options); // 영어로 요일 가져오기 

        //http://localhost:8080/member-service/member/untact/good/list/Monday
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/untact/good/list/${dayOfWeek}`);
        this.doctorList = response.data.result;

      } catch (error) {
        console.log(error);
      }
    },
    navigateToUntactList() {
      this.$router.push({ path: '/all/untact/list' });
      window.scrollTo(0, 0);
    },
    navigateToCommunityList() {
      this.$router.push({ path: '/community/list' });
      window.scrollTo(0, 0);
    },
    navigateToHospitalList() {
      this.$router.push({ path: '/all/hospital/list' });
      window.scrollTo(0, 0);
    },
    navigateToPostDetail(postId) {
      this.$router.push({ path: `/community/${postId}` });
      window.scrollTo(0, 0);
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
  margin: 0;
}


.custom-carousel {
  width: 100%;
  height: auto;
}

.post-card {
  margin: 0 auto;
  max-width: 1000px;
}

.post-content {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #6A6A6A;
}

.loading-title {
  font-weight: bold;
  /* 글씨 굵게 */
  font-size: 30px;
  /* 원하는 폰트 크기 설정 */
  color: #00499E;
  text-align: center;
  margin-top: 20px;
}

.loading-text {
  font-size: 15px;
  text-align: center;
}

.ad-box {
  background-color: #e9f7f4;
  border-radius: 10px;
  width: 100%;
  margin: 0 auto;
  padding: 40px;
}

.more-button {
  background-color: #FAFAFA;
  border-radius: 10px;
  font-size: 18px;
  padding: 10px 20px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  /* 서서히 색상 변경 효과 추가 */
}

.more-button:hover {
  background-color: #0c6dcd;
  color: white;
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
}

.post-col:hover {
  background-color: #FAFAFA;
}

.feat-carousel {
  width: 100%;
  height: auto;
}

.banner {
  position: relative;
  width: 100%;
}

.carousel-image {
  width: 100%;
  filter: brightness(0.7);
  /* 이미지의 밝기를 50%로 줄임 */
}

.inner-text {
  position: absolute;
  bottom: 50%;
  right: 33%;
  color: white;
  font-size: 45px;
}
.doib-box {
  background: linear-gradient(to left, rgba(254, 254, 254, 0.125), rgba(158, 158, 158, 0.5)), 
  url('/src/assets/doctor-image.png') no-repeat center center;
background-size: cover;
  width: 100%;
  height: auto;
  margin: 0 auto;
  padding: 30px;
  border-radius: 10px;
  background-color: #ebecf1;
}

.doib-text {
  font-size: 35px;
}

.doib-button {
  background-color: #0B99FF;
  text-align: center;
  border-radius: 10px;
  width: 150px;
  height: 50px;
  padding: 10px 10px;
  font-size: 19px;
  color: white;
  cursor: pointer;
}
</style>
