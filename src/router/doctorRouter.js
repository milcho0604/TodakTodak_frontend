import DoctorUntactReservation from "@/views/doctor/DoctorUntactReservation.vue";
import DoctorReservation from "@/views/doctor/DoctorReservation.vue";
export const doctorRouter = [
    {
        path: '/doctor/untact/reservation',
        name: 'DoctorUntactReservation',
        component: DoctorUntactReservation
    },
    {
        path: '/member/doctor/reservation',
        name: 'DoctorReservation',
        component: DoctorReservation
    },
]