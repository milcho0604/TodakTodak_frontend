import HospitalList from "@/views/hospital/HospitalList.vue"
import HospitalList2 from "@/views/hospital/HospitalList2.vue"

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
]