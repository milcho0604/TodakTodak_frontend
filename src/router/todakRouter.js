import ReportList from "@/views/todak/ReportList.vue"
import AdminStatistics from "@/views/todak/AdminStatistics.vue"
import MemberList from "@/views/admin/MemberList.vue";
import HospitalAdminList from "@/views/admin/HospitalAdminList.vue";
import HospitalAdminDetail from "@/views/admin/HospitalAdminDetail.vue";
import PaymentList from "@/views/admin/PaymentList.vue";
import CsList from "@/views/admin/CsList.vue";
import AdminChatListComponent from "@/views/todak/AdminChatListComponent.vue";
import AdminCsCenter from "@/views/todak/AdminCsCenter.vue";
import AdminCsChatting from "@/views/todak/AdminCsChatting.vue";

export const todakRouter = [
    {
        path: '/admin/todak/statistics',
        name: 'AdminStatistics',
        component: AdminStatistics
    },
    {
        path: '/admin/todak/report',
        name: 'ReportList',
        component: ReportList
    },
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
        // admin 고객센터 dashboard
        path: '/admin/cs/center',
        name: 'AdminCsCenter',
        component: AdminCsCenter,
    },
    {
        // admin 입장에서 보이는 채팅리스트 (모든 채팅리스트)
        path: '/admin/cschat/list',
        name: 'AdminChatListComponent',
        component: AdminChatListComponent,
    },
    {
        // admin 입장채팅방
        path: '/admin/cs/chatroom/:chatRoomId',
        name: 'AdminCsChatting',
        component: AdminCsChatting,
    },
]