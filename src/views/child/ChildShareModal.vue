<template>
    <!-- 자녀 공유 모달 -->
    <v-dialog v-model="childDeleteDialog" max-width="450px">
        <v-card class="child-modal">
            <v-row class="mt-3" justify="center">
                <div class="headline inter-bold">자녀정보 공유</div>
            </v-row>
            <v-card-text class="mt-5">
                <div class="weak inter-light">
                    이메일로 공유할 회원을 찾아보세요
                </div>
                <div class="search">
                    <input type="text" v-model="searchQuery" class="search-input" placeholder="검색..." @keyup.enter="searchMember">
                    <span>🔍</span>
                </div>
                <div v-for="m in members.slice(0, 3)" :key="m.id" class="member" @click="selectMember(m.id)" :class="{ 'selected-member': m.id === selectedMemberId }" >
                    <v-row>
                        <v-col cols="3" class="d-flex justify-center">
                            <v-avatar size="40">
                                <v-img :src="m.profileImgUrl" alt="profile image" class="profile-img" />
                            </v-avatar>
                        </v-col>
                        <v-col class="info">
                            <v-row class="inter-bold">
                                {{ maskName(m.name)  }}
                            </v-row>
                            <v-row class="inter-light" style="color:grey;">
                                {{ m.memberEmail }}
                            </v-row>
                        </v-col>
                    </v-row>
                </div>
            </v-card-text>
            <v-card-actions style="display: flex; justify-content: center; align-items: center; gap: 5px;">
                <div class="round-grey inter-bold mr-3" @click="closeModal()">최소</div>
                <div style="border-left: 1px solid #ccc; height: 20px;"></div>
                <div class="round inter-bold ml-3" @click="shareChild()">공유</div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios';

export default {
    props: ['childId'],
    data() {
        return {
            members: [], // 초기값을 빈 배열로 설정
            searchQuery: '', // 검색어
            selectedMemberId: null // 선택된 멤버 ID를 저장할 변수
        };
    },
    methods: {
        closeModal() {
            this.members = [];
            this.searchQuery = '';
            this.selectedMemberId = null;
            this.$emit('update:dialog', false);
        },
        async searchMember() {
            if (this.searchQuery.length === 0) {
                this.members = []; // 검색어가 비어있으면 멤버 리스트 초기화
                return;
            }
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/search/${this.searchQuery}`);
                this.members = response.data.result; // 멤버 리스트 업데이트
            } catch (error) {
                console.error("Failed to get member:", error);
            }
        },
        selectMember(memberId) {
            if(this.selectedMemberId != memberId) {
                this.selectedMemberId = memberId;
            }else {
                this.selectedMemberId = null;
            }
            
        },
        async shareChild() {
            if (!this.selectedMemberId) {
                alert('공유할 멤버를 선택해주세요.');
                return;
            }
            try {
                const response = await axios.post(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/share`, {
                    childId: this.childId,
                    sharedId: this.selectedMemberId
                });
                console.log('Share response:', response.data);
                alert('자녀 공유 성공');
                this.closeModal(); // 공유 후 모달 닫기
            } catch (error) {
                if(error.response.data.status_code == 400) {
                    alert(error.response.data.status_message);
                } else {
                    alert("자녀 공유에 실패하였습니다.");
                }
                
                console.error("Failed to share child:", error.response.data.status_message);
            }
        },
        maskName(name) {
            if(name.length>2) {
                return name.slice(0,1)+ "*"+name.slice(2,3);
            }else {
                return name.slice(0,1)+ "*";
            }
        }
    }
};
</script>

<style scoped>
.child-modal {
    padding: 20px;
    border-radius: 40px;
}
.headline {
    text-align: center;
    color: #00499E;
    font-size: 25px;
    margin-top: 10px;
    margin: auto;
}
.weak {
    color: #5B5B5B;
    text-align: center;
    font-size: 15px;
}
.round {
    background-color: #C2D7FF;
    border-radius: 40px;
    padding: 4px 18px;
    font-size: 14px;
    display: inline-block;
    text-align: center;
    color: #00499E;
    cursor: pointer;
}
.round-grey {
    background-color: #D9D9D9;
    border-radius: 40px;
    padding: 4px 18px;
    font-size: 14px;
    display: inline-block;
    text-align: center;
    color: #7F7D7D;
    cursor: pointer;
}
.search {
    border-radius: 10px;
    background-color: #EEEEEE;
    width: 100%;
    padding: 8px 5px;
}
.search-input {
    width: 90%;
}
.search-input:focus {
    outline: none;
}
.member {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px 10px;
    margin: 5px 0;
}
.member:hover {
    background-color: #f2f3f4;
}
.selected-member {
    border: 2px solid #0B99FF;
}
.info {
    margin: 10px 0px;
}
</style>