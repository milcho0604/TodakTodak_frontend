<template>
    <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    permanent
    style="background-color: #3C3C3C;"
    @click="rail = false"
    >
    <v-list-item
        :prepend-avatar="profileImgUrl"
        :title="name"
        nav
        class="todak-sidebar"
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
        :prepend-avatar="statics"
        title="대시보드"
        value="dashboard"
        class="todak-sidebar"
        @click="toDashBoard"
        ></v-list-item>
        
        <v-list-item
        :prepend-avatar="member"
        title="회원리스트"
        value="memberList"
        class="todak-sidebar"
        @click="toMemberList"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="cs"
        title="고객상담채팅"
        value="csChat"
        class="todak-sidebar"
        @click="toCsChat"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="reservation"
        title="상담리스트"
        value="csList"
        class="todak-sidebar"
        @click="toCsList"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="siren"
        title="신고리스트"
        value="reportList"
        class="todak-sidebar"
        @click="toReportList"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="pay"
        title="결제리스트"
        value="payList"
        class="todak-sidebar"
        @click="toPaymentList"
        ></v-list-item>

        <v-list-item
        :prepend-avatar="hospital"
        title="병원리스트"
        value="hospitalList"
        class="todak-sidebar"
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
            pay: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/pay-removebg-preview.png',
            member: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/default_user_image.png',
            siren: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/siren-image.png',
            statics: 'https://todak-file.s3.ap-northeast-2.amazonaws.com/default-images/statics-image.png',
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
        toCsChat() {
            this.$router.push('/admin/cs/center');
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
.todak-sidebar {
    color: #ffffff;
}
  
</style>
