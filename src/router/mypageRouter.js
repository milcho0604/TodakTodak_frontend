import MyPage from "@/views/mypage/MyPage.vue";
import MyReservation from "@/views/mypage/MyReservation.vue";
import MyChild from "@/views/child/MyChild.vue";
import FullCal from "@/views/member/FullCal.vue";
import MyReviewList from "@/views/member/MyReviewList.vue";
import FullCal2 from "@/views/member/FullCal2.vue";

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
    },
    {
        path: '/member/myReviewList',
        name: 'MyReviewList',
        component: MyReviewList  
    },
    {
        path: '/member/child',
        name: 'MyChild',
        component: MyChild  
    },
    {
        path: '/member/fullcal',
        name: 'FullCal',
        component: FullCal  
    },
    {
        path: '/member/fullcal2',
        name: 'FullCal2',
        component: FullCal2  
    },
]