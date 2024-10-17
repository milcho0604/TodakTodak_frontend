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
        path: '/post/create',
        name: 'PostCreate',
        component: PostCreate
    },
    {
        path: '/post/:id',
        name: 'communityDetail',
        component: communityDetail
    },
    {
        path: '/update/:postId',
        name: 'PostUpdate',
        component: PostUpdate
    }
]