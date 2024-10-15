import ReservationImmediate from "@/views/reservation/ReservationImmediate.vue"
import ReservationScheduled from "@/views/reservation/ReservationScheduled.vue"

export const reservationRouter = [
    {
        path: '/reservation/immediate/:hospitalId',
        name: 'ReservationImmediate',
        component: ReservationImmediate
    },
    {
        path: '/reservation/scheduled/:hospitalId',
        name: 'ReservationScheduled',
        component: ReservationScheduled
    }
]
