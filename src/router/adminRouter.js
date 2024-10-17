import MemberList from "@/views/admin/MemberList.vue";
import HospitalAdminList from "@/views/admin/HospitalAdminList.vue";

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
    }
]
