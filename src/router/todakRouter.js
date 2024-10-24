import ReportList from "@/views/todak/ReportList.vue"
import AdminStatistics from "@/views/todak/AdminStatistics.vue"

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
]