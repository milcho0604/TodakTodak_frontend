import RtcView from '@/views/untact/RtcView.vue';
import ChatRoom from '@/views/untact/ChatRoom.vue';
import WaitingView from '@/views/untact/WaitingView.vue';


export const untactRouter = [
    {
        path: '/welcome',
        name: 'RtcView',
        component: RtcView
    },
    {
        path: '/room/:sid',
        name: 'ChatRoom',
        component: ChatRoom,
        props: true  // 이 설정을 통해 경로 매개변수를 컴포넌트에 전달
    },
    {
        path: '/wait',
        name: 'WaitingView',
        component: WaitingView
    }
]
