<template>
    <v-container class="custom-container">
        <v-row justify="center" class="inter-bold title">
            자녀 설정
        </v-row>
        <v-row justify="center" class="divider-row">
            <hr class="divider">
        </v-row>

        <!-- 자녀 목록을 반복하여 렌더링 -->
        <v-row justify="center" v-for="(child, id) in children" :key="id">
            <div class="child">
                <v-row>
                    <v-col cols="3" class="d-flex justify-center">
                        <v-avatar size="55">
                            <v-img :src="child.imageUrl" alt="child image" />
                        </v-avatar>
                    </v-col>
                    <v-col cols="9" class="info">
                        <v-row class="inter-bold">
                            {{ child.name }}
                            <v-icon class="edit-icon" @click="openUpdateModal(child)">mdi-pencil-outline</v-icon>
                            <v-spacer></v-spacer>
                            <v-icon class="share-icon" @click="openShareModal(child.id)">mdi-share</v-icon>
                            <v-icon class="delete-icon"
                                @click="openDeleteModal(child.id)">mdi-trash-can-outline</v-icon>

                        </v-row>
                        <v-row class="small-font inter-normal">
                            {{ maskSSN(child.ssn) }}
                        </v-row>
                    </v-col>
                </v-row>
            </div>
        </v-row>

        <v-row justify="center" class="mt-8">
            <div class="round inter-normal dark-blue" @click="createModal = true">자녀정보 추가</div>
        </v-row>

        <!-- 자녀 추가 모달 -->
        <ChildCreateModal v-model="createModal" @update:dialog="createModal = $event; this.fetchChild()"
            @child-exists="openChildExistsDialog"></ChildCreateModal>

        <!-- 자녀 공유 모달 -->
        <ChildShareModal v-model="shareModal" :childId="selectedChildId" @update:dialog="shareModal = $event;">
        </ChildShareModal>

        <!-- 자녀 삭제 모달 -->
        <ChildDeleteModal v-model="deleteModal" :childId="selectedChildId"
            @update:childDeleteDialog="deleteModal = $event; this.fetchChild()"></ChildDeleteModal>

        <!-- 자녀 수정 모달 -->
        <ChildUpdateModal v-model="updateModal" @update:dialog="updateModal = $event; this.fetchChild()"
            :childId="selectedChild.id" :initialName="selectedChild.name" :initialSSN="selectedChild.ssn"
            :initialImage="selectedChild.imageUrl">
        </ChildUpdateModal>

        <!-- 자녀 이미 등록 모달 -->
        <v-dialog v-model="childExistsDialog" max-width="450px">
            <v-card class="child-modal">
                <v-row class="mt-3" justify="center">
                    <div class="headline inter-bold">자녀정보 등록 실패</div>
                </v-row>
                <v-card-text class="mt-5">
                    <div class="strong inter-bold">
                        {{ formattedChildExistsMessage }} 님께 이미 등록된 자녀입니다.
                    </div>
                    <div class="weak inter-light">
                        해당 주민번호의 자녀는 다른 계정에 등록되어 있습니다.<br>
                        먼저 등록한 보호자에게 자녀 정보를 공유받아주세요.
                    </div>
                </v-card-text>
                <v-card-actions>
                    <div class="round inter-bold" @click="childExistsDialog = false">확인</div>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
    <MyPageSideBar />
</template>

<script>
import axios from 'axios';
import ChildCreateModal from './ChildCreateModal.vue';
import ChildDeleteModal from './ChildDeleteModal.vue';
import ChildUpdateModal from './ChildUpdateModal.vue';
import ChildShareModal from './ChildShareModal.vue';
import MyPageSideBar from "@/components/sidebar/MyPageSideBar.vue";
export default {
    components: {
        ChildCreateModal,
        ChildUpdateModal,
        ChildDeleteModal,
        ChildShareModal,
        MyPageSideBar,
    },
    data() {
        return {
            updateModal: false,
            createModal: false,
            deleteModal: false,
            shareModal: false,
            childExistsDialog: false,
            children: [
            ],
            selectedChild: {
                id: null,
                name: '',
                ssn: '',
                imageUrl: ''
            },
            selectedChildId: null, // 삭제할 자녀의 ID
            childExistsMessage: [], // 메시지를 저장할 데이터
        }
    },
    created() {
        this.fetchChild();
    },
    computed: {
        // childExistsMessage 배열을 쉼표로 구분된 문자열로 변환
        formattedChildExistsMessage() {
            return this.childExistsMessage.join(', ');
        }
    },
    methods: {
        async fetchChild() {
            const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/member-service/child/`);
            this.children = response.data.result;
        },
        openUpdateModal(child) {
            console.log(child);
            this.selectedChild = { ...child };  // 선택된 자녀 정보 저장
            console.log(this.selectedChild);
            this.updateModal = true;  // 수정 모달 열기
        },
        openDeleteModal(childId) {
            this.selectedChildId = childId; // 삭제할 자녀 ID 저장
            this.deleteModal = true; // 삭제 모달 열기
        },
        openChildExistsDialog(message) {
            this.childExistsDialog = true; // 자녀 등록되어 있음 모달 열기
            this.childExistsMessage = message; // 메시지 저장
        },
        openShareModal(childId) {
            this.selectedChildId = childId; // 삭제할 자녀 ID 저장
            this.shareModal = true; // 삭제 모달 열기
        },
        maskSSN(ssn) {
            if (!ssn) return ssn; // 잘못된 형식 처리
            return ssn.slice(0, 8) + "*******"; // 앞 8자리만 남기고 뒤는 마스킹
        }
    }
}
</script>

<style scoped>
.child-modal {
    padding: 20px;
    border-radius: 40px;
}

.hover-btn {
    position: absolute;
    top: 10px;
    right: 10px;
}

.headline {
    text-align: center;
    color: #00499E;
    font-size: 25px;
    margin-top: 10px;
}

.close-icon {
    color: #676767;
}

.title {
    margin-top: 50px;
    font-size: 25px;
    color: #00499E;
}

.divider-row {
    width: 100%;
    justify-content: center;
}

.divider {
    width: 70%;
    border: 0;
    border-top: 1px solid #ccc;
    margin: 20px 0;
}

.child {
    border: 1px solid #ccc;
    width: 35%;
    border-radius: 10px;
    padding: 19px 10px;
    margin: 10px 0;
}

.small-font {
    font-size: 13px;
    color: #888888;
}

.edit-icon {
    margin-left: 4px;
    margin-top: 2px;
    color: #888888;
    font-size: 20px;
}

.delete-icon {
    color: #888888;
    font-size: 20px;
    margin-right: 20px;
}

.share-icon {
    color: #888888;
    font-size: 19px;
    margin-right: 2px;
}

.round {
    background-color: #C2D7FF;
    border-radius: 40px;
    padding: 4px 18px;
    font-size: 14px;
    display: inline-block;
    text-align: center;
    color: #00499E;
    margin: auto;
    cursor: pointer;
}

.strong {
    text-align: center;
}

.weak {
    color: #5B5B5B;
    text-align: center;
    font-size: 15px;
}

.info {
    margin: 10px 0px;
}
</style>