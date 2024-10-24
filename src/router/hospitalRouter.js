import HospitalList from "@/views/hospital/HospitalList.vue"
import HospitalDetail from "@/views/hospital/HospitalDetail.vue"
import HospitalIntro from "@/views/hospital/HospitalIntro.vue"
import HospitalMedicalInfo from "@/views/hospital/HospitalMedicalInfo.vue"
import HospitalReviews from "@/views/hospital/HospitalReviews.vue"
import DoctorRegister from "@/views/hospital/DoctorRegister.vue"
import HospitalAdminCreate from "@/views/hospital/HospitalAdminCreate.vue"
import DoctorEdit from "@/views/hospital/DoctorEdit.vue"
import HospitalSignIn from "@/views/hospital/HospitalSignIn.vue"

export const hospitalRouter = [
    {
        // 병원리스트
        path: '/all/hospital/list',
        name: 'HospitalList',
        component: HospitalList
    },
    {
        // 병원디테일 페이지
        path: 'all/hospital/detail/:hospitalId',
        name: 'HospitalDetail',
        component: HospitalDetail
    },
    { 
        // 병원디테일 페이지 - 병원소개 탭
        path: '/all/hospital/hospital-intro/:hospitalId',
        name: 'HospitalIntro',
        component: HospitalIntro 
    },
    { 
        // 병원디테일 페이지 - 진료정보 탭
        path: '/all/hospital/medical-info/:hospitalId', 
        name: 'HospitalMedicalInfo',
        component: HospitalMedicalInfo 
    },
    { 
        // 병원디테일 페이지 - 리뷰 탭
        path: '/all/hospital/reviews/:hospitalId', 
        name: 'HospitalReviews',
        component: HospitalReviews 
    },
    {
        path: '/hospital/doctor/register',
        name: 'DoctorRegister',
        component: DoctorRegister
    },
    {
        // 병원 + 병원admin 가입페이지
        path: '/all/hospital/admin/create',
        name: 'HospitalAdminCreate',
        component: HospitalAdminCreate
    },
    {
        // 의사 수정페이지
        path: '/doctor/edit',
        name: 'DoctorEdit',
        component: DoctorEdit
    },
    {
        path: '/all/hospital/signin',
        name: 'HospitalSignIn',
        component: HospitalSignIn
    },
]
