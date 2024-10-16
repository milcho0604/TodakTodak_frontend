import MyPage from "@/views/mypage/MyPage.vue";
import MyReservation from "@/views/mypage/MyReservation.vue";
import MyPost from "@/views/mypage/MyPost.vue";
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
        name: 'MyPosts',
        component: MyPost
    }
]