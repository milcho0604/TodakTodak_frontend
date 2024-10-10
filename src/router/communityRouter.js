import CommunityList from "@/views/community/communityList.vue";
import communityDetail from "@/views/community/communityDetail.vue";
import PostCreate from "@/views/community/PostCreate.vue";

export const communityRouter = [
    {
        path: '/community/list',
        name: 'CommunityList',
        component: CommunityList
    },
    {
        path: '/post/Create',
        name: 'PostCreate',
        component: PostCreate
    },
    {
        path: '/post/:id',
        name: 'communityDetail',
        component: communityDetail
    }
]