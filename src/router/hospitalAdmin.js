import HospitalDetail from "@/views/hospitalAdmin/HospitalDetail.vue"
import HospitalTimeDetail from "@/views/hospitalAdmin/HospitalTimeDetail.vue"

export const hospitalAdmin = [
    {
        path: '/hospital/admin/detail',
        name: 'HospitalDetail',
        component: HospitalDetail
    },
    {
        path: '/hospital/admin/time',
        name: 'HospitalTimeDetail',
        component: HospitalTimeDetail
    },
]
