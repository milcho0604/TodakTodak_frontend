<template>
  <v-footer style="width: 1200px; margin: 0 auto;">
    <v-row justify="center" class="my-4 text-center" no-gutters style="width: 1000px;">
      <v-btn color="#00499E" variant="text" size="x-large" v-for="link in links" :key="link" :href=link.url>
        <strong>{{ link.name }}</strong>
      </v-btn>

      <v-col class="mt-4" cols="12">
        <div style="text-align:start; width: 700px; color: #737373; font-size: 13px;">
          상호명:(주)파닥즈 · 대표이사:정슬기 · 개인정보책임관리자:최무리 · 주소:서울특별시 동작구 보라매로 87, SFC 빌딩 4층<br>
          사업자등록번호:01-99-00980405 · 통신판매업신고증:제 2024-서울동작-0405 호 · 직업정보제공사업<br>
          고객센터:1599-0619 · 이메일:support@padak.com
        </div>
      
      </v-col>
      <v-col class="text-center mt-4" cols="12">
        <strong>
          <span style="color: #767676;">
            &copy; 2024 Padaks
          </span>
        </strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>

export default {
  data: () => {
    return {
      links: [
        // 페이지 생기면 url 수정예정
        {
          name: 'Home', url: '/'
        },
        {
          // name:'HOSPITAL', url:'/all/hospital/login'
          name: 'HOSPITAL', url: '/all/login'
        },
        {
          name: 'PADAK', url: '/all/admin/login'
        },
        {
          name: 'TEAM', url: '/all/test/login'
        },
        {
          name: 'SERVICES', url: '/all/hospital/signin'
        },
      ]
    };
  },
}
</script>
<style scoped></style>
