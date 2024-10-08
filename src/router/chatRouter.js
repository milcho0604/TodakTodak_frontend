import CsChat from "@/views/chat/CsChat.vue"
import ComponentExample from "@/views/chat/ComponentExample.vue"
export const chatRouter = [
    {
        path: '/chat',
        name: 'Chat',
        component: CsChat
    },
    {
        path: '/component',
        name: 'ComponentExample',
        component: ComponentExample
    }
]
