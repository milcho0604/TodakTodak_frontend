<template>
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent style="background-color: #3C3C3C;" @click="rail = false">
        <v-list-item nav>
            <template v-slot:prepend>
                <v-avatar size="40" style="background-color: white;">
                    <v-img :src="profileImgUrl" alt="Profile image"></v-img>
                </v-avatar>
            </template>

            <v-list-item-title class="custom-avatar">{{ name }}</v-list-item-title>

            <template v-slot:append>
                <v-btn icon="mdi-chevron-left" variant="text" @click.stop="rail = !rail"></v-btn>
            </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav>
            <v-list-item :prepend-avatar="calendar" title="대시보드" value="calendar" @click="toDashBoard"
                class="custom-avatar">
            </v-list-item>

            <v-list-item :prepend-avatar="myPage" title="회원 목록" value="myPage" @click="toMemberList"
                class="custom-avatar">

            </v-list-item>

            <v-list-item :prepend-avatar="child" title="상담 목록" value="childConfig" @click="toCsList"
                class="custom-avatar">

            </v-list-item>

            <v-list-item :prepend-avatar="child" title="신고 목록" value="childConfig" @click="toReportList"
                class="custom-avatar">

            </v-list-item>

            <v-list-item :prepend-avatar="hospital" title="결제 목록" value="reservation" @click="toPaymentList"
                class="custom-avatar">
            </v-list-item>

            <v-list-item :prepend-avatar="review" title="병원" value="review" @click="toHospitalList"
                class="custom-avatar"></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-main style="height: 250px"></v-main>
</template>
<script>

export default {
    data() {
        return {
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
    created() {
        this.name = localStorage.getItem("name");
        this.profileImgUrl = localStorage.getItem("profileImgUrl");
    },
    methods: {
        toMemberList() {
            this.$router.push('/admin/member/list');
        },
        toCsList() {
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
.custom-avatar .v-list-item__prepend {
    background-color: white !important;
    /* 흰색으로 변경 */
}

.custom-avatar {
    color: white;
}
</style>
