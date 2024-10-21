import MemberList from "@/views/admin/MemberList.vue";
import HospitalAdminList from "@/views/admin/HospitalAdminList.vue";
import HospitalAdminDetail from "@/views/admin/HospitalAdminDetail.vue";
import PaymentList from "@/views/admin/PaymentList.vue";
import CsList from "@/views/admin/CsList.vue";

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
    {
        path: '/admin/payment/list',
        name: 'PaymentList',
        component: PaymentList
    },
    {
        path: '/admin/cs/list',
        name: 'CsList',
        component: CsList
    },
]
