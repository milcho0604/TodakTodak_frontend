import { requestFcmToken } from "@/firebase"; // FCM 토큰 요청 함수 임포트
import axios from 'axios';
import UpdateMember from "@/views/member/UpdateMember.vue";
import LoginPage from "@/views/member/LoginPage.vue";
import Authentication from "@/views/member/EmailAuthentication.vue"
import FindEmailPage from "@/views/member/FindEmailPage.vue";
import FindPasswordPage from "@/views/member/FindPasswordPage.vue";
import ResetPasswordPage from "@/views/member/ResetPasswordPage.vue";
import MyNotification from "@/views/member/MyNotification.vue";
import AdminLoginPage from "@/views/member/AdminLoginPage.vue";
import HospitalAdminLogin from "@/views/member/HospitalAdminLogin.vue";
import TestLogin from "@/views/member/TestLogin.vue";
import { jwtDecode } from "jwt-decode";


// 비동기 서비스 워커 준비 및 지연 함수
// async function checkServiceWorkerReady() {
//     if ('serviceWorker' in navigator) {
//       await navigator.serviceWorker.ready;
//       console.log("Service Worker is ready for FCM token request.");
//       setTimeout(() => console.log("2-second delay completed"), 2000);
//     }
//   }

export const memberRouter = [
    {
        path: '/member/update',
        name: 'UpdateMember',
        component: UpdateMember
    },
    {
        path: '/all/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/all/admin/login',
        name: 'AdminLoginPage',
        component: AdminLoginPage
    },
    {
        path: '/all/authentication',
        name: 'Authentication',
        component: Authentication  
    },
    {
        path: '/all/member/find/email',
        name: 'FindEmailPage',
        component: FindEmailPage  
    },    
    {
        path: '/all/member/find/password',
        name: 'FindPasswordPage',
        component: FindPasswordPage  
    },
    {
        path: '/all/member/reset/password',
        name: 'ResetPasswordPage',
        component: ResetPasswordPage  
    },
    
    {
        path: '/member/notification/list',
        name: 'MyNotification',
        component: MyNotification
    },
    {
        path: '/all/hospital/login',
        name: 'HospitalAdminLogin',
        component: HospitalAdminLogin
    },
    {
        path: '/all/test/login',
        name: 'TestLogin',
        component: TestLogin
    },
    {
        path: '/all/loginSuccess',
        component: LoginPage,
        // 비동기 함수로 설정
        beforeEnter: async (to, from, next) => {
            const accessToken = to.query.token;
            const refreshToken = to.query.refreshToken;

        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                localStorage.setItem("token", accessToken);
                if (refreshToken) {
                    localStorage.setItem("refreshToken", refreshToken);
                }
                localStorage.setItem("memberId", decoded.memberId);
                localStorage.setItem("email", decoded.sub); 
                localStorage.setItem("role", decoded.role);


                // checkServiceWorkerReady();
                // // FCM 토큰 발급 시도 (최대 3회 재시도)
                let fcmToken;
                for (let attempt = 0; attempt < 5; attempt++) {
                    fcmToken = await requestFcmToken();
                    if (fcmToken) break;
                    console.log(`Retrying FCM token request (${attempt + 1}/5)`);
                }

                if (fcmToken) {

                    await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/token`, 
                        { fcmToken },  // Request body로 fcmToken 전송
                        { 
                            headers: { 
                                Authorization: `Bearer ${accessToken}` // Authorization 헤더만 전송
                            } 
                        }
                    );
                }
                next('/'); // next 호출로 라우트 진행
                window.location.href = "/";
            } catch (error) {
                console.error("Invalid token or FCM request failed:", error);
                next('/'); 
            }
        } else {
            next('/');
        }
        }
    },
    {
        path: '/all/updateSuccess',
        component: LoginPage,
        beforeEnter: async (to, from, next) => {
            const accessToken = to.query.token;
            const refreshToken = to.query.refreshToken;

        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                localStorage.setItem("token", accessToken);
                if (refreshToken) {
                    localStorage.setItem("refreshToken", refreshToken);
                }
                localStorage.setItem("memberId", decoded.memberId);
                localStorage.setItem("email", decoded.sub); 
                localStorage.setItem("role", decoded.role);

                // FCM 토큰 발급 요청
                let fcmToken;
                for (let attempt = 0; attempt < 5; attempt++) {
                    fcmToken = await requestFcmToken();
                    if (fcmToken) break;
                    console.log(`Retrying FCM token request (${attempt + 1}/5)`);
                }

                if (fcmToken) {
                    await axios.post(
                        `${process.env.VUE_APP_API_BASE_URL}/member-service/fcm/token`, 
                        { fcmToken },  // Request body로 fcmToken 전송
                        { 
                            headers: { 
                                Authorization: `Bearer ${accessToken}` // Authorization 헤더만 전송
                            } 
                        }
                    );
                }
                next('/'); // next 호출로 라우트 진행
                window.location.href = "/member/update";
            } catch (error) {
                console.error("Invalid token or FCM request failed:", error);
                next('/'); 
            }
        } else {
            next('/');
        }
        }
    }

]