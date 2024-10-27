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
        :prepend-avatar="calendar"
        title="대시보드"
        value="calendar"
        @click="toDashBoard"
        ></v-list-item>
        
        <v-list-item
        :prepend-avatar="myPage"
        title="회원리스트"
        value="myPage"
        @click="toMemberList"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="child"
        title="상담리스트"
        value="childConfig"
        @click="toCsList"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="child"
        title="신고리스트"
        value="childConfig"
        @click="toReportList"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="hospital"
        title="결제리스트"
        value="reservation"
        @click="toPaymentList"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="review"
        title="병원리스트"
        value="review"
        @click="toHospitalList"
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
        }
    },
    created(){
        this.name = localStorage.getItem("name");
        this.profileImgUrl = localStorage.getItem("profileImgUrl");
    },
    methods:{
        toMemberList() {
            this.$router.push('/admin/member/list');
        },
        toCsList(){
            this.$router.push('/admin/cs/list')
        },
        toReportList() {
            this.$router.push('/admin/todak/report');
        },
        toPaymentList() {
            this.$router.push('/admin/payment/list');
        },
        toHospitalList() {
            this.$router.push('/admin/hospital/list');
        },
        toDashBoard() {
            this.$router.push('/admin/todak/statistics');
        },
    }
}
</script>
<style scoped>
  
</style>
