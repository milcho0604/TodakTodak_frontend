<template>
    <v-container class="signin-container" fluid>
        <div class="banner">
            <!-- 배너 carousel -->
            <v-carousel class="custom-carousel" show-arrows="hover" cycle hide-delimiter-background>
                <v-carousel-item v-for="(slide, i) in slides" :key="i">
                    <v-img :src="slide" class="carousel-image" cover></v-img>
                    <span class="inner-text inter-bold">스마트한 병원의 선택, 토닥</span>
                </v-carousel-item>
            </v-carousel>
            <div class="carousel-button" color="primary" @click="$router.push('/hospital/admin/create')">
                <span class="inter-bold">도입 신청하기</span>
            </div>
        </div>
        <v-spacer :style="{ height: '70px' }"></v-spacer>
        <v-row style="width: 80%; margin: 0 auto;">
            <v-col>
                <div class="white-box">
                    <div class="big-font inter-bold">환자의 병원 이용 경험이<br> 완전히 달라집니다</div>
                    <span class="small-font inter-light">토닥 환자는 물론, 현장 접수 환자에게도 대기순번을 알릴 수 있어<br>
                        환자가 분산되고 대기실 혼잡도를 줄일 수 있습니다.</span>

                </div>
            </v-col>
            <v-col>
                <div class="white-box">
                    <div class="big-font inter-bold">대기실을 쾌적하게,<br>
                        효율적으로 관리합니다</div>
                    <span class="small-font inter-light">병원의 대기현황을 미리 알고, 병원에서 기다리는 시간 부담이<br>
                        줄어들면 환자들의 병원 방문이 더 쉽고 편해집니다.</span>
                </div>
            </v-col>
        </v-row>
        <v-spacer :style="{ height: '70px' }"></v-spacer>
        <v-row class="blue-box">
            <v-col col="7" style="padding-top: 30px; padding-left: 30px">
                <div class="todak-chip">
                    토닥 접수
                </div>
                <div class="big-font inter-bold" style="color: white;">
                    데스크에서 관리하던<br>
                    불편한 접수 노트가 자동화됩니다
                </div>
                <div style="color: #e5e8eb;" class="inter-light mt-2">
                    은행에서 순번표를 발급하는 것처럼 모바일 앱으로 대기순번을 알려주는 기능입니다.<br> 환자가 진료 당일 접수하면 접수실 차트 진료 대기열에 자동 등록됩니다.
                </div>
            </v-col>
            <v-col cols="5">
                <v-avatar class="ma-5" style="height: auto; width:380px; border-radius: 10px; object-fit:cover;">
                    <v-img
                        src="https://todak-file.s3.amazonaws.com/85ae4e94-3fc4-41cf-9ea1-36bf1308be60_스크린샷 2024-10-22 오전 10.01.04.png"
                        alt="병원사진" />
                </v-avatar>
            </v-col>
        </v-row>
        <v-spacer :style="{ height: '70px' }"></v-spacer>
        <v-row class="blue-box">
            <v-col cols="5">
                <v-avatar class="ma-5" style="height: auto; width:390px; border-radius: 10px; object-fit:cover;">
                    <v-img
                        src="https://todak-file.s3.amazonaws.com/c46077cd-89db-420c-8109-7cf8dffb8a48_스크린샷 2024-10-22 오전 11.12.28.png"
                        alt="병원사진" />
                </v-avatar>
            </v-col>
            <v-col col="7" style="padding-top: 30px; padding-left: 30px">
                <div class="todak-chip2">
                    토닥 예약
                </div>
                <div class="big-font inter-bold" style="color: white;">
                    바쁜 진료현장,<br> 걸려오는 예약문의 전화를 없애드리겠습니다
                </div>
                <div style="color: #e5e8eb;" class="inter-light mt-2">
                    환자가 병원 방문 날짜와 시간, 진료항목을 선택해 예약하는 기능입니다.
                    단순 진료 예약부터<br>검진, 접종 등 원하는 특정 진료항목에 대해 예약을 받을 수 있습니다.
                </div>
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
                <div class="doib-button" color="primary" @click="$router.push('/hospital/admin/create')">
                    <span class="inter-bold">도입 신청하기</span>
                </div>
            </v-col>
        </v-row>
        <v-spacer :style="{ height: '70px' }"></v-spacer>
    </v-container>
</template>
<script>
export default {
    data() {
        return {
            slides: [
                'https://todak-file.s3.amazonaws.com/162a0f6a-24ee-41e2-9435-29b4b3941daf_adult-taking-care-baby-weight.jpg',
                'https://todak-file.s3.amazonaws.com/17db471c-500e-46c1-a74c-948174883ac0_doctor-performing-routine-medical-checkup.jpg',
                'https://todak-file.s3.amazonaws.com/ebdf224e-6e83-4dfa-8e18-8d540066aa8e_little-baby-being-health-clinic-vaccination.jpg'
            ]
        }
    }
}
</script>
<style scoped>
.custom-carousel {
    width: 100%;
}
.carousel-image {
    width: 100%;
    filter: brightness(0.7);
    /* 이미지의 밝기를 50%로 줄임 */
}

.carousel-button {
    background-color: #0B99FF;
    text-align: center;
    border-radius: 10px;
    position: absolute;
    bottom: 50%;
    right: 45%;
    width: 150px;
    height: auto;
    padding: 10px 10px;
    color: white;
    cursor: pointer;
}

.banner {
    position: relative;
    width: 100%;
}

.inner-text {
    position: absolute;
    bottom: 60%;
    right: 33%;
    color: white;
    font-size: 45px;
}

.white-box {
    background-color: white;
    border-radius: 10px;
    width: 100%;
    margin: 0 auto;
    padding: 40px;
}

.signin-container {
    width: 100%;
    background-color: #f6f7f9;
}

.big-font {
    font-size: 30px;
}

.small-font {
    margin-top: 10px;
    font-size: 15px;
    color: #959ba1
}

.blue-box {
    width: 79%;
    height: 350px;
    margin: 0 auto;
    padding: 10px;
    border-radius: 10px;
    background-color: #2c3744;
}

.todak-chip {
    border-radius: 40px;
    border: 1px solid #d5e2ff;
    color: #d5e2ff;
    padding: 10px;
    width: 120px;
    text-align: center;
    margin-bottom: 10px;
}

.todak-chip2 {
    border-radius: 40px;
    border: 1px solid #fff9e3;
    color: #fff9e3;
    padding: 10px;
    width: 120px;
    text-align: center;
    margin-bottom: 10px;
}

.doib-box {
    background: linear-gradient(to left, rgba(254, 254, 254, 0.125), rgba(158, 158, 158, 0.5)), 
    url('/src/assets/doctor-image.png') no-repeat center center;
background-size: cover;
    width: 79%;
    height: 250px;
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