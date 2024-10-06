import CommunityList from "@/views/community/communityList.vue";
import communityDetail from "@/views/community/communityDetail.vue";

export const communityRouter = [
    {
        path: '/community/list',
        name: 'CommunityList',
        component: CommunityList
    },
    {
        path: '/post/:id',
        name: 'communityDetail',
        component: communityDetail
    }
]