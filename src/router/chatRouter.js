import CsChat from "@/views/chat/CsChat.vue"
import MyChatRoom from "@/views/chat/MyChatRoom.vue"
import ChatListComponent from "@/views/chat/ChatListComponent.vue"

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
        path: '/chat/my-chat/list',
        name: 'ChatListComponent',
        component: ChatListComponent
    }
]
