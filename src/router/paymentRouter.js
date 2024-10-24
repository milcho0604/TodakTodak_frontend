import PayProcess from "@/views/payment/PayProcess.vue";
import SubPayment from "@/views/payment/SubPayment.vue"


export const paymentRouter = [
    {
        path: '/all/payment/process',
        name: 'PayProcess',
        component: PayProcess
    },
    {
        path: '/all/payment/sub',
        name: 'SubPayment',
        component: SubPayment
    },



]
