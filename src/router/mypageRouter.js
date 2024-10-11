import MyPage from "@/views/mypage/MyPage.vue";
import MyReservation from "@/views/mypage/MyReservation.vue";

export const mypageRouter = [
    {
        path: '/member/mypage',
        name: 'MyPage',
        component: MyPage  
    },
    {
        path: '/member/mypage/reservation',
        name: 'MyReservation',
        component: MyReservation
    }
]