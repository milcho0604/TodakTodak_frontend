import MemberList from "@/views/admin/MemberList.vue";
import HospitalAdminList from "@/views/admin/HospitalAdminList.vue";
import HospitalAdminDetail from "@/views/admin/HospitalAdminDetail.vue";
import PaymentList from "@/views/admin/PaymentList.vue";
import CsList from "@/views/admin/CsList.vue";
import AdminCsChat from "@/views/todak/AdminCsChat.vue";

export const adminRouter = [
    {
        // 회원리스트
        path: '/admin/member/list',
        name: 'MemberList',
        component: MemberList
    },
    {
        // 병원리스트
        path: '/admin/hospital/list',
        name: 'HospitalAdminList',
        component: HospitalAdminList
    },
    {
        // 병원승인
        path: '/admin/hospital/detail/:id',
        name: 'HospitalAdminDetail',
        component: HospitalAdminDetail
    },
    {
        // 결제내역 리스트
        path: '/admin/payment/list',
        name: 'PaymentList',
        component: PaymentList
    },
    {
        // 상담내역 CS 리스트
        path: '/admin/cs/list',
        name: 'CsList',
        component: CsList
    },
    {
        path: '/admin/cschat/',
        name: 'AdminCsChat',
        component: AdminCsChat,
    },
]
