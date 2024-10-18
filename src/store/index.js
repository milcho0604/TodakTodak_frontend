import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
    state: {
        doctorEmail: '',
        doctorDetails: JSON.parse(localStorage.getItem('doctorDetails')) || null,
    },
    mutations: {
        setDoctorEmail(state, email) {
            state.doctorEmail = email;
            state.doctorDetails = null; // 이메일이 변경될 때 의사 정보 초기화
        },
        setDoctorDetails(state, details) {
            state.doctorDetails = details;
            localStorage.setItem('doctorDetails', JSON.stringify(details));
        },
    },
    getters: {
        getDoctorEmail(state) {
            return state.doctorEmail;
        },
        getDoctorDetails(state) {
            return state.doctorDetails;
        },
    },
    actions: {
        async fetchDoctorDetails({ commit }, email) {
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/doctor/detail/${email}`);
                commit('setDoctorDetails', response.data.result);
            } catch (error) {
                console.error('Failed to fetch doctor details:', error);
            }
        },
    },
});
