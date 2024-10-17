import HospitalList from "@/views/hospital/HospitalList.vue"
import HospitalList22 from "@/views/hospital/HospitalList22.vue"
import HospitalDetail from "@/views/hospital/HospitalDetail.vue"
import HospitalIntro from "@/views/hospital/HospitalIntro.vue"
import HospitalMedicalInfo from "@/views/hospital/HospitalMedicalInfo.vue"
import HospitalReviews from "@/views/hospital/HospitalReviews.vue"
import DoctorRegister from "@/views/hospital/DoctorRegister.vue"
import DoctorDetail from "@/views/hospital/DoctorDetail.vue"

export const hospitalRouter = [
    {
        path: '/hospital/list',
        name: 'HospitalList',
        component: HospitalList
    },
    {
        path: '/hospital/list2',
        name: 'HospitalList22',
        component: HospitalList22
    },
    {
        path: '/hospital/detail/:hospitalId',
        name: 'HospitalDetail',
        component: HospitalDetail
    },
    { 
        path: '/hospital/hospital-intro/:hospitalId',
        name: 'HospitalIntro',
        component: HospitalIntro 
    },
    { 
        path: '/hospital/medical-info/:hospitalId', 
        name: 'HospitalMedicalInfo',
        component: HospitalMedicalInfo 
    },
    { 
        path: '/hospital/reviews/:hospitalId', 
        name: 'HospitalReviews',
        component: HospitalReviews 
    },
    {
        path: '/hospital/doctor/register',
        name: 'DoctorRegister',
        component: DoctorRegister
    },
    {
        path: '/hospital/doctor/detail',
        name: 'DoctorDetail',
        component: DoctorDetail
    }
]