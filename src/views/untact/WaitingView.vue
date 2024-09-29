<template>
    <div>
        <h1>Firebase에서 가져온 데이터</h1>
        <ul>
            <li v-for="item in mediData" :key="item.id">{{ item.data }}</li>
        </ul>
    </div>
</template>

<script>
import { getDatabase, ref, onValue } from 'firebase/database';
import { initializeApp } from 'firebase/app';

export default {
    data() {
        return {
            mediData: [] // Firebase에서 가져온 데이터를 저장할 배열
        };
    },
    mounted() {
        this.fetchMediData(); // 컴포넌트가 마운트되면 데이터를 가져옴
    },
    methods: {
        fetchMediData() {
            // Firebase 앱 초기화 (필요한 경우)
            const firebaseConfig = {
                apiKey: "AIzaSyBSH8wJ7aoblNAj8Kj7iNTfsJhlEL4KEcE",
                authDomain: "padak-todak.firebaseapp.com",
                projectId: "padak-todak",
                storageBucket: "padak-todak.appspot.com",
                messagingSenderId: "22351664979",
                appId: "1:22351664979:web:f8a3cc4b2f5e249d88b3a6",
                databaseURL: "https://padak-todak-default-rtdb.asia-southeast1.firebasedatabase.app"

            };
            const app = initializeApp(firebaseConfig);
            const db = getDatabase(app); // Firebase 데이터베이스 인스턴스 생성
            const mediRef = ref(db, 'medi'); // 'medi'라는 데이터 경로에 대한 참조 생성

            onValue(mediRef, (snapshot) => {
                const data = snapshot.val();
                console.log(data);
                if (data) {
                    // 빈 값이 아닌 항목만 필터링하여 value 값만 추출
                    this.mediData = Object.keys(data)
                        .filter(key => data[key] && data[key].data) // null 값 필터링 및 data가 존재하는지 확인
                        .map(key => data[key]); // data 값 배열에 저장
                }
            });
        }
    }
}
</script>

<style scoped>
</style>