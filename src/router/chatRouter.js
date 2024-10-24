import CsChat from "@/views/chat/CsChat.vue"
import MyChatRoom from "@/views/chat/MyChatRoom.vue"
import ChatListComponent from "@/views/chat/ChatListComponent.vue"

export const chatRouter = [
    {
        // 채팅방
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
        // 회원입장에서 보이는 내 채팅리스트
        path: '/chat/my-chat/list',
        name: 'ChatListComponent',
        component: ChatListComponent
    }
]
