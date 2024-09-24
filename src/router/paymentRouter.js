import PayProcess from "@/views/payment/PayProcess.vue";
import SubPayment from "@/views/payment/SubPayment.vue"


export const paymentRouter = [
    {
        path: '/payment/process',
        name: 'PayProcess',
        component: PayProcess
    },
    {
        path: '/payment/sub',
        name: 'SubPayment',
        component: SubPayment
    },



]
