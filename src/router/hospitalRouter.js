import HospitalList from "@/views/hospital/HospitalList.vue"
import HospitalList2 from "@/views/hospital/HospitalList2.vue"
import HospitalDetail from "@/views/hospital/HospitalDetail.vue"

export const hospitalRouter = [
    {
        path: '/hospital/list',
        name: 'HospitalList',
        component: HospitalList
    },
    {
        path: '/hospital/list2',
        name: 'HospitalList2',
        component: HospitalList2
    },
    {
        // /hospital/:id 로 수정예정
        path: '/hospital/detail',
        name: 'HospitalDetail',
        component: HospitalDetail
    },
]