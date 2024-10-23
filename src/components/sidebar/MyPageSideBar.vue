<template>
    <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    style="background-color: #ECF2FE;"
    @click="rail = false"
    >
    <v-list-item
        :prepend-avatar="profileImgUrl"
        :title="name"
        nav
    >
        <template v-slot:append>
        <v-btn
            icon="mdi-chevron-left"
            variant="text"
            @click.stop="rail = !rail"
        ></v-btn>
        </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav>
        <v-list-item
        :prepend-avatar="myPage"
        title="마이페이지"
        value="myPage"
        @click="toMyPage"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="child"
        title="자녀관리"
        value="childConfig"
        @click="toMyChild"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="hospital"
        title="예약내역"
        value="reservation"
        @click="toMyReservation"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="review"
        title="리뷰내역"
        value="review"
        @click="toMyReview"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="calendar"
        title="우리아이 캘린더"
        value="calendar"
        @click="toCalendar"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="doctorQnA"
        title="의사 Q&A"
        value="doctorQnA"
        @click="toMyQnA"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="cs"
        title="고객센터"
        value="cs"
        @click="toChat"
        ></v-list-item>

        <v-list-item
        v-if="isDoctorAdmin"
        :prepend-avatar="doctors"
        title="의사관리"
        value="toDoctors"
        @click="toDoctors"
        ></v-list-item>

    </v-list>
    </v-navigation-drawer>
    <v-main style="height: 250px"></v-main>
</template>
<script>

export default{
    data(){
        return{
            drawer: true,
            rail: true,
            name: '',
            profileImgUrl: '',
            calendar: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/calendar-icon.png',
            child: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/child-icon.png',
            cs: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/cs_center_image.png',
            doctorQnA: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/doctor-qna-icon.png',
            myPage: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/mypage-icon.png',
            reservation: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/reservation-icon.png',
            review: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/review-icon.png',
            hospital: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/hospital-icon.png',
            doctors: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/214ff1d2-bd49-4766-9925-d6dea16d1139_doctor.png'
        }
    },
    created(){
        this.name = localStorage.getItem("name");
        this.profileImgUrl = localStorage.getItem("profileImgUrl");
        const role = localStorage.getItem("role");
        this.isDoctorAdmin = role === 'HospitalAdmin' || role === 'TodakAdmin';
    },
    methods:{
        toMyPage() {
            this.$router.push('/member/mypage');
        },
        toMyReservation() {
            this.$router.push('/member/mypage/reservation');
        },
        toMyChild() {
            this.$router.push('/member/child');
        },
        toCalendar() {
            this.$router.push('/member/mychild-cal');
        },
        toMyQnA() {
            // 아직 페이지 없어서 마이페이지로 라우팅
            this.$router.push('/member/mypage');
        },
        toMyReview() {
            this.$router.push('/member/myReviewList');
        },
        toChat() {
            this.$router.push('/chat');
        },
        toDoctors() {
            this.$router.push('/hospital/doctor');
        },

    }
}
</script>
<style scoped>
  
</style>
