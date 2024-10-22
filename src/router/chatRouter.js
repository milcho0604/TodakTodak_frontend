import CsChat from "@/views/chat/CsChat.vue"
import ComponentExample from "@/views/chat/ComponentExample.vue"
import MyChatRoom from "@/views/chat/MyChatRoom.vue"
export const chatRouter = [
    {
        path: '/chat/:chatRoomId',
        name: 'Chat',
        component: CsChat
    },
    {
        path: '/my-chat',
        name: 'MyChatRoom',
        component: MyChatRoom
    },
    {
        path: '/component',
        name: 'ComponentExample',
        component: ComponentExample
    },
]
