import ReportList from "@/views/todak/ReportList.vue"
import AdminStatistics from "@/views/todak/AdminStatistics.vue"

export const todakRouter = [
    {
        path: '/todak/statistics',
        name: 'AdminStatistics',
        component: AdminStatistics
    },
    {
        path: '/todak/report',
        name: 'ReportList',
        component: ReportList
    },
]