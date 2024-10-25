import DoctorUntactReservation from "@/views/doctor/DoctorUntactReservation.vue";
import DoctorReservation from "@/views/doctor/DoctorReservation.vue";
export const doctorRouter = [
    {
        path: '/doctor/untact/reservation',
        name: 'DoctorUntactReservation',
        component: DoctorUntactReservation
    },
    {
        path: '/memebr/doctor/reservation',
        name: 'DoctorReservation',
        component: DoctorReservation
    },
]