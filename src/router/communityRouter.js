import CommunityList from "@/views/community/communityList.vue";
import communityDetail from "@/views/community/communityDetail.vue";
import PostCreate from "@/views/community/PostCreate.vue";
import PostUpdate from "@/views/community/PostUpdate.vue";

export const communityRouter = [
    {
        path: '/community/list',
        name: 'CommunityList',
        component: CommunityList
    },
    {
        path: '/community/create',
        name: 'PostCreate',
        component: PostCreate
    },
    {
        path: '/community/:id',
        name: 'communityDetail',
        component: communityDetail
    },
    {
        path: '/community/update/:postId',
        name: 'PostUpdate',
        component: PostUpdate
    }
]