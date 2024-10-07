import {createRouter, createWebHistory} from 'vue-router';
// @는 src(루트폴더경로)를 의미
// 파일 내부에 export default있는 경우에는 {}가 필요없고, 그렇지 않으면 {}필요
// import 하는 요소가 여러개 있을 때에도 {}를 붙인다.
// import TestComponent from '@/components/TestComponent.vue';
import HomePage from '@/views/HomePage.vue';
import { memberRouter } from './memberRouter';
import { paymentRouter } from './paymentRouter';
import { untactRouter } from './untactRouter';
import { chatRouter } from './chatRouter';
import { hospitalRouter } from './hospitalRoutr';

const routes = [
    {
        path: '/',
        name: 'HOME',
        component: HomePage
    },
    ...memberRouter,
    ...paymentRouter,
    ...untactRouter,
    ...chatRouter,
    ...hospitalRouter
]


const router = createRouter({
    // vue router는 내부적으로 두가지 방식의 히스토리 관리를 제공
    // 1) createWebHistory : /home , 2) createHashHistory: /#/home
    // 대부분 WebHistory 사용
    history: createWebHistory(),
    routes
})

export default router;