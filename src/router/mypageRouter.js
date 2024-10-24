import MyPage from "@/views/mypage/MyPage.vue";
import MyReservation from "@/views/mypage/MyReservation.vue";
import MyPost from "@/views/mypage/MyPost.vue";
import MyChild from "@/views/child/MyChild.vue";
import MyReviewList from "@/views/member/MyReviewList.vue";
import FullCal3 from "@/views/member/FullCal3.vue";



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

        path: '/member/mypage/myPost',
        name: 'MyPost',
        component: MyPost
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
        path: '/member/mychild-cal',
        name: 'FullCal3',
        component: FullCal3  
    },
]