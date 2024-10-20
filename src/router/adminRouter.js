import MemberList from "@/views/admin/MemberList.vue";
import HospitalAdminList from "@/views/admin/HospitalAdminList.vue";
import HospitalAdminDetail from "@/views/admin/HospitalAdminDetail.vue";

export const adminRouter = [
    {
        path: '/admin/member/list',
        name: 'MemberList',
        component: MemberList
    },
    {
        path: '/admin/hospital/list',
        name: 'HospitalAdminList',
        component: HospitalAdminList
    },
    {
        path: '/admin/hospital/detail/:id',
        name: 'HospitalAdminDetail',
        component: HospitalAdminDetail
    },
]
