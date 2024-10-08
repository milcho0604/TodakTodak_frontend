<template>
    <!-- 자녀 공유 모달 -->
    <v-dialog v-model="childDeleteDialog" max-width="450px">
        <v-card class="modal">
            <v-row class="mt-3" justify="center">
                <div class="headline inter-bold">자녀정보 공유</div>
            </v-row>
            <v-card-text class="mt-5">
                <div class="weak inter-light">
                    이름, 이메일로 공유할 회원을 찾아보세요
                </div>
                <div class="search">
                    <input type="text" v-model="searchQuery" class="search-input" placeholder="검색...">
                    <span>
                        🔍
                    </span>
                </div>
                <div v-for="m in members" :key="m.id">
                    {{ m.name }}
                </div>
            </v-card-text>
            <v-card-actions style="display: flex; justify-content: center; align-items: center; gap: 5px;">
                <div class="round-grey inter-bold mr-3" @click="closeModal()">최소</div>

                <div style="border-left: 1px solid #ccc; height: 20px; "></div>

                <div class="round inter-bold ml-3" @click="deleteChild()">확인</div>
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
            searchQuery: '',
        }
    },
    watch: {
        searchQuery(newQuery) {
            this.searchMember(newQuery);
        }
    },
    methods: {
        closeModal() {
            this.$emit('update:dialog', false);
        },
        async searchMember(keyword) {
            if (keyword.length === 0) {
                this.members = []; // 검색어가 비어있으면 멤버 리스트 초기화
                return;
            }
            try {
                const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/member/search/${keyword}`);
                console.log(response.data.result);
                this.members = response.data.result; // 멤버 리스트 업데이트
            } catch (error) {
                console.error("Failed to get member:", error);
            }
        }
    }
}
</script>
<style>
.modal {
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
    /* 글자 수에 맞춰 버튼 길이 조정 */
    text-align: center;
    color: #00499E;
}

.round-grey {
    background-color: #D9D9D9;
    border-radius: 40px;
    padding: 4px 18px;
    font-size: 14px;
    display: inline-block;
    /* 글자 수에 맞춰 버튼 길이 조정 */
    text-align: center;
    color: #7F7D7D;
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
</style>