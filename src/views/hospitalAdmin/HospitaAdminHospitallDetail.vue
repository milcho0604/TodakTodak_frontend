<template>
    <v-container class="d-flex justify-center align-center hospital-container">
      <v-card width="800px" elevation="0">
        <v-row justify="center">
            <v-col cols="12" sm="9" md="8" lg="7">
                <!-- 프로필 섹션 -->
                <v-row class="profile-section" no-gutters>
                    <v-col cols="3">
                    </v-col>
                    <v-col cols="9">
                        <div class="reservation-text"><img src="@/assets/myreserve.png" alt="TodakTodak Logo"
                                class="logo-image" />병원 정보 관리</div>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-spacer :style="{ height: '50px' }"></v-spacer>
  
      <v-img hospitalImagePreview
          :src="hospital.hospitalImagePreview || hospital.hospitalImageUrl" 
          alt="Hospital Image"
          class="hospital-image"
          @click="triggerFileInput"
          style="cursor: pointer;"
        />
      <v-file-input
        v-model="hospital.hospitalImage"
        label="병원 이미지를 선택해주세요."
        accept="image/*"
        ref="fileInput"
        style="display: none;" 
        @change="onImageChange"
      />
  
        <v-spacer :style="{ height: '50px' }"></v-spacer>
  
        <v-form ref="form" v-model="formValid">
          <h5 class="text-left">기본 정보</h5>
  
          <h6 class="text-left">대표자(원장님)</h6>
          <span>{{ hospital.representativeName || '정보 없음' }}</span>
          <v-spacer :style="{ height: '10px' }"></v-spacer>

  
          <h6 class="text-left">전화번호</h6>
          <span>{{ hospital.representativePhoneNumber || '정보 없음' }}</span>
          <v-spacer :style="{ height: '10px' }"></v-spacer>

  
          <h5 class="text-left">병원 정보</h5>
  
          <h6 class="text-left">병원 이름</h6>
          <v-text-field
            v-model="hospital.name"
            variant="underlined"
            label="병원명을 입력해주세요.(ex.연세소아과)"
            :rules="[rules.required]"
            :readonly="!isEditing"
          />
  
          <h6 class="text-left">주소</h6>
          <v-text-field
            v-model="combinedAddress"
            variant="underlined"
            label="주소를 검색하여 입력해주세요."
            :rules="[rules.required]"
            readonly
          >
            <template #append>
              <v-btn @click="openPostcode" small>주소 검색</v-btn>
            </template>
          </v-text-field>
  
          <h6 class="text-left">병원 번호</h6>
          <v-text-field
            v-model="hospital.phoneNumber"
            variant="underlined"
            label="병원 전화번호를 입력해주세요."
            :rules="[rules.required]"
            :readonly="!isEditing"
          />
  
          <h6 class="text-left">비대면 진료비</h6>
          <v-text-field
            v-model="hospital.untactFee"
            variant="underlined"
            label="비대면 진료비"
            :rules="[rules.required]"
            :readonly="!isEditing"
          />
  
          <!-- <h6 class="text-left">키워드</h6>
          <v-chip-group
          v-model="selectedKeywords"
          multiple
          :readonly="!isEditing"
          column
        >
          <v-chip
            v-for="keyword in availableKeywords"
            :key="keyword"
            :value="keyword"
            :selected="selectedKeywords.includes(keyword)"
            class="ma-2"
            color="primary"
            outlined
          >
            {{ keyword }}
          </v-chip>
        </v-chip-group> -->
        <h6 class="text-left">키워드</h6>
        <template v-if="isEditing">
          <v-chip-group
            v-model="selectedKeywords"
            multiple
            :readonly="!isEditing"
            column
          >
            <v-chip
              v-for="keyword in availableKeywords"
              :key="keyword"
              :value="keyword"
              :selected="selectedKeywords.includes(keyword)"
              class="ma-2"
              color="primary"
              outlined
            >
              {{ keyword }}
            </v-chip>
          </v-chip-group>
        </template>
        <template v-else>
          <v-chip-group>
            <v-chip
              v-for="keyword in selectedKeywords"
              :key="keyword"
              class="ma-2 custom-chip"
            >
              {{ keyword }}
            </v-chip>
            <span v-if="selectedKeywords.length === 0" class="text-grey">정보 없음</span>
          </v-chip-group>
        </template>

  
          <h6 class="text-left">병원소개</h6>
          <v-textarea
          v-model="hospital.description"
          label="병원 소개를 입력해주세요."
          class="hospital-card"
          :readonly="!isEditing"
          :rules="[rules.required]"
        ></v-textarea>
  
          <br>

          <h6 class="text-left">병원공지</h6>

          <v-textarea
          v-model="hospital.notice"
          label="병원 소개를 입력해주세요."
          class="hospital-card"
          :readonly="!isEditing"
          :rules="[rules.required]"
        ></v-textarea>
        <span v-if="!hospital.notice" class="text-grey">정보 없음</span>

          <v-spacer :style="{ height: '50px' }"></v-spacer>
  
          <v-row justify="center" class="button-row">
            <v-btn class="res-btn" @click="toggleKeyEdit">{{ isEditing ? '수정 완료' : '수정' }}</v-btn>
          </v-row>
        </v-form>
      </v-card>
    </v-container>
    <HospitalAdminSideBar/>
  </template>
  
  <script>
  import axios from 'axios';
  import HospitalAdminSideBar from '@/components/sidebar/HospitalAdminSideBar.vue';
  /* global kakao, daum */
  export default {
    components:{
      HospitalAdminSideBar,
    },
    data() {
      return {
        hospital: {
          name: '',
          address: '',
          phoneNumber: '',
          hospitalImageUrl: '',
          representativeName: '',
          representativePhoneNumber: '',
          hospitalImagePreview: '',
          description: '',
          notice: '',
          keywords: '',
          untactFee: '',
          latitude: '',
          longitude: '',
          hospitalImage: '', // 이미지 추가
        },
        availableKeywords: ['예방접종', '영유아검진', '주차장', '전문의', '로타백신접종'], // 제공할 키워드 목록
        selectedKeywords: [], // 사용자가 선택한 키워드를 저장할 배열
        formValid: false,
        rules: {
          required: (value) => !!value || '필수 입력 항목입니다.',
        },
        isEditing: false,
      };
    },
    computed: {
      combinedAddress() {
        return `${this.hospital.address} ${this.hospital.dong || ''}`;
      },
    },
    mounted() {
      this.fetchHospitalDetails();
    },
    methods: {
        triggerFileInput() {
      this.$refs.fileInput.click();  // 파일 선택 창 열기
    },
    onImageChange(event) {
    const file = event.target.files[0];  // 선택된 파일 가져오기
    if (file) {
        const reader = new FileReader();  // 파일을 읽어서 미리보기를 갱신
        reader.onload = (e) => {
            this.hospital.hospitalImagePreview = e.target.result;  // Base64 데이터로 미리보기 갱신
            this.hospital.hospitalImage = file; // hospitalImage에 파일 저장

            // Base64 데이터 출력
            console.log('hospital.hospitalImagePreview (Base64):', this.hospital.hospitalImagePreview);
        };
        reader.readAsDataURL(file);  // 이미지 파일을 Base64로 읽음
      }
    },

      async fetchHospitalDetails() {
        try {
          const response = await axios.get('http://localhost:8080/reservation-service/hospital/admin/detail');
          const data = response.data.result;
          console.log('응답 데이터:', data); // 여기에서 데이터를 출력해서 확인
          this.hospital = {
            ...this.hospital,
            id: data.id,
            name: data.name,
            address: data.address,
            phoneNumber: data.phoneNumber,
            hospitalImageUrl: data.hospitalImageUrl,
            representativeName: data.representativeName,
            representativePhoneNumber: data.representativePhoneNumber,
            description: data.description,
            notice: data.notice,
            keywords: data.keywords,
            untactFee: data.untactFee,
            latitude: data.latitude, // 기존 데이터에서 위도 저장
            longitude: data.longitude, // 기존 데이터에서 경도 저장
          };
          this.selectedKeywords = data.keywords ? data.keywords.split(',') : [];
        } catch (error) {
          console.error('병원 정보를 가져오는 중 오류 발생:', error);
        }
      },
      toggleKeyEdit() {
        if (this.isEditing) {
        this.hospital.keywords = this.selectedKeywords.join(',');  // 키워드를 콤마로 구분된 문자열로 변환
        this.submitForm(); // 수정 완료 시 API 요청
        }
        this.isEditing = !this.isEditing; // 수정 모드 토글
    },
      async submitForm() {
        if (this.$refs.form.validate()) {
          const formData = new FormData();
          formData.append('name', this.hospital.name);
          formData.append('address', this.hospital.address);
          formData.append('dong', this.hospital.dong || '');
          formData.append('phoneNumber', this.hospital.phoneNumber);
          formData.append('description', this.hospital.description);
          formData.append('notice', this.hospital.notice);
          formData.append('keywords', this.hospital.keywords);
          formData.append('latitude', this.hospital.latitude);
          formData.append('longitude', this.hospital.longitude);
          formData.append('untactFee', this.hospital.untactFee);
          console.log('위도경도: ' + this.hospital.latitude)
          console.log('위도경도: ' + this.hospital.longitude)
              // 이미지가 선택된 경우에만 추가, 선택되지 않았으면 기존 이미지를 전송
            if (this.hospital.hospitalImage) {
            formData.append('hospitalImage', this.hospital.hospitalImage);
            } else {
            formData.append('hospitalImageUrl', this.hospital.hospitalImageUrl); // 기존 이미지 URL 추가
            }
  
          try {
            await axios.post('http://localhost:8080/reservation-service/hospital/update', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            alert('수정 완료');
            this.isEditing = false; // 수정 모드 종료
          } catch (error) {
            console.error('수정 오류:', error);
            alert('수정 중 오류가 발생했습니다.');
          }
        } else {
          alert('입력된 정보를 확인하세요.');
        }
      },
      toggleEdit() {
        if (this.isEditing) {
          this.submitForm(); // 수정 완료 시 API 요청
        }
        this.isEditing = !this.isEditing; // 수정 모드 토글
      },
      openPostcode() {
        const { geocoder } = this;
  
        new daum.Postcode({
          oncomplete: (data) => {
            this.hospital.address = data.roadAddress;
            this.hospital.dong = data.bname || '';
            if (geocoder) {
              geocoder.addressSearch(data.roadAddress, (results, status) => {
                if (status === kakao.maps.services.Status.OK) {
                    console.log('위도/경도 결과:', results); // 결과 출력
                  this.hospital.latitude = results[0].y; // 위도 저장
                  this.hospital.longitude = results[0].x; // 경도 저장
                } else {
                  console.error('주소 검색 실패: ', status);
                }
              });
            }
          },
        }).open();
      },
      
    },
    watch: {
    'hospital.hospitalImage'(newImage) {
        if (newImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('미리보기 이미지를 갱신합니다:', e.target.result);  // 미리보기 이미지 확인
            this.hospital.hospitalImagePreview = e.target.result; // 미리보기 업데이트
        };
        reader.readAsDataURL(newImage); // 이미지 파일을 Base64로 읽음
    }
  },
},

  };
  </script>
  
  
  <style scoped>
  .hospital-container {
    max-width: 700px;
    margin: 0 auto;
  }
  .hospital-name {
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    margin-left: 8px;
    font-weight: 400;
    color: #000;
  }
  .hospital-strong {
    width: 100px; 
    color: #000000;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 30px;
  }
  .hospital-title {
    display: flex;
    align-items: center;
    margin-left: 8px; 
  }
  .hospital-image {
    border-radius: 10px;
    max-width: 700px;
    width: 100%;
    height: auto;
    object-fit: cover;
    justify-content: center;
  }
  .hospital-card {
    border-radius: 20px;
  }
  .button-row {
    margin-top: 20px;
  }
  .res-btn {
    background-color: #C2D7FF !important;
    color: #00499e;
    border-radius: 20px;
    width: 130px;
    height: 44px;
    margin-bottom: 40px;
    margin-top: 10px;
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 15px;
    line-height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .custom-chip {
    background-color: #C2D7FF !important; /* 초록색 배경 */
    color: blue; /* 텍스트 색상을 흰색으로 */
  }

.reservation-text {
    font-weight: 700;
    font-size: 30px;
    margin-left: -35px;
    color: #00499E;
}
.profile-section {
    display: flex;
    margin-bottom: 20px;
}
  </style>
  