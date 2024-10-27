
import {createRouter, createWebHistory} from 'vue-router';
// @는 src(루트폴더경로)를 의미
// 파일 내부에 export default있는 경우에는 {}가 필요없고, 그렇지 않으면 {}필요
// import 하는 요소가 여러개 있을 때에도 {}를 붙인다.
// import TestComponent from '@/components/TestComponent.vue';
import HomePage from '@/views/MainPage.vue';
import {jwtDecode} from 'jwt-decode';  // jwt-decode 라이브러리 import
import { memberRouter } from './memberRouter';
import { paymentRouter } from './paymentRouter';
import { untactRouter } from './untactRouter';
import { chatRouter } from './chatRouter';
import { hospitalRouter } from './hospitalRouter';
import { reservationRouter } from './reservationRouter';
import { communityRouter } from './communityRouter';
import { mypageRouter } from './mypageRouter';
import { todakRouter } from './todakRouter';
import { doctorRouter } from './doctorRouter';
import { adminRouter } from './adminRouter';
import { hospitalAdmin } from './hospitalAdmin';

const routes = [
  {
    path: '/',
    name: 'HOME',
    component: HomePage,
  },
  ...memberRouter,
  ...paymentRouter,
  ...untactRouter,
  ...chatRouter,
  ...hospitalRouter,
  ...reservationRouter,
  ...communityRouter,
  ...mypageRouter,
  ...todakRouter,
  ...doctorRouter,
  ...adminRouter,
  ...hospitalAdmin,
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 네비게이션 가드 추가 (사용자가 페이지 이동할 때마다 실행)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');

  // 토큰이 존재하면 파싱하여 role 확인
  if (token) {
    try {
      const decodedToken = jwtDecode(token); // JWT 토큰 파싱
      const userRole = decodedToken.role; // 토큰에서 role 정보 추출

      // role이 NonUser라면 결제 페이지로 리다이렉트
      if (userRole === 'NONUSER' && to.path !== '/all/payment/sub') {
        next('/all/payment/sub'); // 결제 페이지로 리다이렉트
        return;
      }
    } catch (error) {
      console.error('토큰 파싱 오류:', error);
      // 토큰 파싱 오류 시, 로그아웃 처리할 수 있음 또는 오류 처리
      localStorage.removeItem('token');
      next('/');
      return;
    }
  }

  next(); // 그 외의 경우에는 계속 이동
});

export default router;
