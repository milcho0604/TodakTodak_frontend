import UpdateMember from "@/views/member/UpdateMember.vue";
import LoginPage from "@/views/member/LoginPage.vue";
import Authentication from "@/views/member/EmailAuthentication.vue"
import FindEmailPage from "@/views/member/FindEmailPage.vue";
import FindPasswordPage from "@/views/member/FindPasswordPage.vue";
import ResetPasswordPage from "@/views/member/ResetPasswordPage.vue";
import MyPage from "@/views/member/MyPage.vue"
import MyReviewList from "@/views/member/MyReviewList.vue";
import AdminLoginPage from "@/views/member/AdminLoginPage.vue";
import MyChild from "@/views/child/MyChild.vue";
import FullCal from "@/views/member/FullCal.vue";

import { jwtDecode } from "jwt-decode";
export const memberRouter = [
    {
        path: '/member/update',
        name: 'UpdateMember',
        component: UpdateMember
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/admin/login',
        name: 'AdminLoginPage',
        component: AdminLoginPage
    },
    {
        path: '/authentication',
        name: 'Authentication',
        component: Authentication  
    },
    {
        path: '/member/find/email',
        name: 'FindEmailPage',
        component: FindEmailPage  
    },    
    {
        path: '/member/find/password',
        name: 'FindPasswordPage',
        component: FindPasswordPage  
    },
    {
        path: '/member/reset/password',
        name: 'ResetPasswordPage',
        component: ResetPasswordPage  
    },
    {
        path: '/member/mypage',
        name: 'MyPage',
        component: MyPage  
    },
    {
        path: '/member/myReviewList',
        name: 'MyReviewList',
        component: MyReviewList  
    },
    {
        path: '/member/child',
        name: 'MyChild',
        component: MyChild  
    },
    {
        path: '/member/fullcal',
        name: 'FullCal',
        component: FullCal  
    },
    {
        path: '/loginSuccess',
        component: LoginPage,
        beforeEnter: (to, from, next) => {
            const accessToken = to.query.token; // 쿼리 파라미터에서 토큰을 가져옴
            // 쿼리 파라미터에서 리프레시 토큰도 가져오려면 아래와 같이 사용합니다.
            const refreshToken = to.query.refreshToken;
    
            if (accessToken) {
                try {
                    // JWT 토큰을 디코딩하여 사용자 정보를 추출합니다.
                    const decoded = jwtDecode(accessToken);
                    // 로컬 스토리지에 토큰과 사용자 정보를 저장합니다.
                    localStorage.setItem("token", accessToken);
                    if (refreshToken) {
                        localStorage.setItem("refreshToken", refreshToken);
                    }
                    localStorage.setItem("memberId", decoded.memberId)
                    localStorage.setItem("email", decoded.sub); // 이메일은 JWT에서 'sub' 클레임으로 보통 저장됩니다.
                    localStorage.setItem("role", decoded.role);
    
                    // 홈 페이지로 리다이렉트합니다.
                    window.location.href = "/";
                } catch (error) {
                    console.error("Invalid token", error);
                    next('/login'); // 토큰이 유효하지 않은 경우 로그인 페이지로 리다이렉트
                }
            } else {
                next('/login'); // 토큰이 없다면 로그인 페이지로 리다이렉트
            }
        }
    },
    {
        path: '/updateSuccess',
        component: LoginPage,
        beforeEnter: (to, from, next) => {
            const accessToken = to.query.token; // 쿼리 파라미터에서 토큰을 가져옴
            // 쿼리 파라미터에서 리프레시 토큰도 가져오려면 아래와 같이 사용합니다.
            const refreshToken = to.query.refreshToken;
    
            if (accessToken) {
                try {
                    // JWT 토큰을 디코딩하여 사용자 정보를 추출합니다.
                    const decoded = jwtDecode(accessToken);
                    // 로컬 스토리지에 토큰과 사용자 정보를 저장합니다.
                    localStorage.setItem("token", accessToken);
                    if (refreshToken) {
                        localStorage.setItem("refreshToken", refreshToken);
                    }
                    localStorage.setItem("decoded", decoded)
                    localStorage.setItem("memberId", decoded.memberId)
                    localStorage.setItem("email", decoded.sub); // 이메일은 JWT에서 'sub' 클레임으로 보통 저장됩니다.
                    localStorage.setItem("role", decoded.role);
    
                    // 홈 페이지로 리다이렉트합니다.
                    window.location.href = "/member/update";
                } catch (error) {
                    console.error("Invalid token", error);
                    next('/login'); // 토큰이 유효하지 않은 경우 로그인 페이지로 리다이렉트
                }
            } else {
                next('/login'); // 토큰이 없다면 로그인 페이지로 리다이렉트
            }
        }
    }

]
