<template>
  <v-app>
    <v-container class="text-center">
      <v-row justify="center">
        <v-col cols="12" sm="8">
          <v-card>
            <v-card-title class="text-h5">안녕하세요, 테스트 서비스입니다</v-card-title>
            <v-card-text>
              이 페이지는 간단한 Vue.js 테스트 홈페이지입니다.
              로그인을 해주세요
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

.v-application {
  background-color: #f5f5f5;
}
</style>
