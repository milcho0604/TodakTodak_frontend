import RtcTest from '@/views/untact/RtcTest.vue';
import UntactChatRoom from '@/views/untact/UntactChatRoom.vue';


export const untactRouter = [
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
