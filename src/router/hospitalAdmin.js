import HospitalTimeDetail from "@/views/hospitalAdmin/HospitalTimeDetail.vue"
import HospitaAdminHospitallDetail from "@/views/hospitalAdmin/HospitaAdminHospitallDetail.vue"


export const hospitalAdmin = [
    {
        path: '/hospital/admin/detail',
        name: 'HospitaAdminHospitallDetail',
        component: HospitaAdminHospitallDetail
    },
    {
        path: '/hospital/admin/time',
        name: 'HospitalTimeDetail',
        component: HospitalTimeDetail
    },
]
