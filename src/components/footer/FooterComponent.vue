<template>
    <v-footer style="background-color: #ECF2FE;">
        <v-row 
            justify="center" 
            class="my-4 text-center"
            no-gutters
        >
            <v-btn
                color="#00499E"
                variant="text"
                size="x-large"
                v-for="link in links" 
                :key="link"
                :href=link.url
            >
                <strong>{{ link.name }}</strong>
            </v-btn>

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

export default{
    data: () => {
      return { links: [
        // 페이지 생기면 url 수정예정
        {
          name:'Home', url:'/'
        },
        {
          name:'HOSPITAL', url:'/all/hospital/login'
        },
        {
          name:'PADAK', url:'/all/admin/login'
        },
        {
          name:'TEAM', url:'/'
        },
        {
          name:'SERVICES', url:'/all/hospital/signin'
        },
    ] };
    },
}
</script>
<style scoped>

</style>
