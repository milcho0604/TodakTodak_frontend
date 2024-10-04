import RtcTest from '@/views/untact/RtcTest.vue';
import UntactChatRoom from '@/views/untact/UntactChatRoom.vue';
import UntactTreatList from '@/views/untact/UntactTreatList.vue';
import UntactForm from '@/views/untact/UntactForm.vue';


export const untactRouter = [
    {
        path: '/untact/list',
        name: 'UntactTreatList',
        component: UntactTreatList
    },
    {
        path: '/untact/:doctorId/form',
        name: 'UntactForm',
        component: UntactForm,
        props:true
    },
    {
        path: '/rooms',
        name: 'RtcTest',
        component: RtcTest
    },
    {
        path: '/room/:sid',
        name: 'UntactChatRoom',
        component: UntactChatRoom,
        props: true  // 이 설정을 통해 경로 매개변수를 컴포넌트에 전달
    }
]
