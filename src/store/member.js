function initState(){
    return {
        token: "",
        role: "", 
        memberId: "",
        email: "", 
    };
}

const member = {
    state: initState(),
    mutations: {
        setMemberAllInfo(state) {
            state.token = localStorage.getItem('token');
            state.role = localStorage.getItem('role');
            state.memberId = localStorage.getItem('memberId');
            state.email = localStorage.getItem('email');
            console.log('member ID set in Vuex:', state.memberId);
            console.log('member Email set in Vuex:', state.email);
        }
    },
    actions: {
        setMemberAllInfoActions({ commit }) {
            commit('setMemberAllInfo');
        }
    },
    getters: {
        getMemberObj: state => state,
        getMemberToken: state => state.token,
        getMemberRole: state => state.role,
        getMemberId: state => state.memberId,
        getMemberEmail: state => state.email,
    }
}

export default member;
